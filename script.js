const uploadArea = document.getElementById("uploadArea");
const imageInput = document.getElementById("imageInput");
const previewSection = document.getElementById("previewSection");
const originalImage = document.getElementById("originalImage");
const outputCanvas = document.getElementById("outputCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const uploadNewBtn = document.getElementById("uploadNewBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const thresholdSlider = document.getElementById("thresholdSlider");
const thresholdValue = document.getElementById("thresholdValue");
const reprocessBtn = document.getElementById("reprocessBtn");

let currentThreshold = 50;

uploadArea.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload() {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        originalImage.src = e.target.result;
        originalImage.onload = () => {
            showLoader();
            setTimeout(() => {
                removeBackground(currentThreshold);
                hideLoader();
                previewSection.classList.remove("hidden");
            }, 300);
        };
    };
    reader.readAsDataURL(file);
}

function removeBackground(threshold = 50) {
    const ctx = outputCanvas.getContext("2d");

    outputCanvas.width = originalImage.naturalWidth;
    outputCanvas.height = originalImage.naturalHeight;

    ctx.drawImage(originalImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = imageData.data;

    let bgColor = { r: data[0], g: data[1], b: data[2] };

    for (let i = 0; i < data.length; i += 4) {
        const distance = Math.sqrt(
            (data[i] - bgColor.r) ** 2 +
            (data[i + 1] - bgColor.g) ** 2 +
            (data[i + 2] - bgColor.b) ** 2
        );

        const normalized = (threshold / 100) * 255;

        if (distance < normalized) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

thresholdSlider.addEventListener("input", e => {
    currentThreshold = e.target.value;
    thresholdValue.textContent = currentThreshold;
});

reprocessBtn.addEventListener("click", () => {
    showLoader();
    setTimeout(() => {
        removeBackground(currentThreshold);
        hideLoader();
    }, 200);
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = outputCanvas.toDataURL("image/png");
    link.download = "background-removed.png";
    link.click();
});

uploadNewBtn.addEventListener("click", () => {
    previewSection.classList.add("hidden");
    imageInput.value = "";
});

function showLoader() {
    uploadArea.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
}

function hideLoader() {
    loadingSpinner.classList.add("hidden");
    uploadArea.classList.remove("hidden");
}