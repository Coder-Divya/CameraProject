const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const saveBtn = document.getElementById('save');
const switchCameraBtn = document.getElementById('switchCamera');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const invertBtn = document.getElementById('invert');
const flashToggleBtn = document.getElementById('flashToggle');

let stream = null;
let currentCamera = 'environment';
let zoomLevel = 1;
let isInverted = false;
let flashOn = false;

// Start Camera
async function startCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentCamera }
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Switch Camera
switchCameraBtn.addEventListener('click', () => {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    startCamera();
});

// Capture Image
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.filter = isInverted ? 'invert(1)' : 'none';
    context.scale(zoomLevel, zoomLevel);
    context.drawImage(video, 0, 0, canvas.width / zoomLevel, canvas.height / zoomLevel);
    canvas.style.display = 'block';
});

// Save Image
saveBtn.addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'captured_image.png';
    link.click();
});

// Zoom In
zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < 3) {
        zoomLevel += 0.1;
        video.style.transform = scale(${zoomLevel});
    }
});

// Zoom Out
zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > 1) {
        zoomLevel -= 0.1;
        video.style.transform = scale(${zoomLevel});
    }
});

// Invert Colors
invertBtn.addEventListener('click', () => {
    isInverted = !isInverted;
    video.style.filter = isInverted ? 'invert(1)' : 'none';
});

// Toggle Flash
flashToggleBtn.addEventListener('click', () => {
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if (capabilities.torch) {
        flashOn = !flashOn;
        track.applyConstraints({ advanced: [{ torch: flashOn }] });
    } else {
        alert('Flashlight is not supported on this device.');
    }
});

// Start Camera on Load
startCamera();
