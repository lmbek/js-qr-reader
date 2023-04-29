try {
    if(jsQR){
        //console.log("jsQR.js exists, it should work now")
    } else {
        console.warn("jsQR.js could not be found");
    }
} catch(error) {
    console.error("we need jsQR.js for our app.js to function (dependency)");
}

const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resultContainer = document.getElementById("result");

function startScanner() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
    });
}

function stopScanner() {
    if (video) {
        video.pause();
        video.srcObject.getTracks()[0].stop();
        scanning = false;
    }
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            resultContainer.innerHTML = code.data;
        }
    }
    requestAnimationFrame(tick);
}

startButton.addEventListener("click", startScanner);
stopButton.addEventListener("click", stopScanner);
