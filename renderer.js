// import ocr engine
const { createWorker } = Tesseract;
// import pdf controller
const { PDFViewerApplication } = await import("./web/viewer.mjs");
// import tts engine
const { PiperWebEngine } = await import("./third-parties/piper-tts-web/piper-tts-web.js");

// prepare tts generation
const piperWebEngine = new PiperWebEngine();
// use single audio instance to avoid overlapping sounds
const audio = new Audio();

// import opencv asynchronously
const loadOpenCv = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "./third-parties/docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.onload = () => {
      cv["onRuntimeInitialized"] = () => {
        console.log("OpenCV is initialized inside module");
        resolve();
      };
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
// enable scan button when OpenCV is ready
loadOpenCv().then(() => {
  enableWebcamScan();
});

// Override fetch globally to fix piper-tts-web loading issues
// or force local loading instead of remote loading
// Save original fetch as fallback for regular requests
const originalFetch = window.fetch;
const PIPER_HUGGINGFACE_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/";
const PIPER_LOCAL_CODE_PATH = "third-parties/piper-tts-web";
const PIPER_LOCAL_MODEL_PATH = "tts_models";
window.fetch = async (url) => {
  let overridePath = null;
  if (typeof url === "string")
  {
    if (url.startsWith("/piper/") || url.startsWith("/onnx/") || url.startsWith("/worker/"))
    {
      // piper-tts-web request
      overridePath = PIPER_LOCAL_CODE_PATH;
    }
    else if (url.startsWith(PIPER_HUGGINGFACE_BASE))
    {
      // piper-tts-web voice request
      overridePath = PIPER_LOCAL_MODEL_PATH;
      // strip the base URL to get the voice file sub path only
      url = url.substring(PIPER_HUGGINGFACE_BASE.length);
    }
  };
  if (overridePath !== null)
  {
    console.log(`Intercepted fetch request for: ${url}`);
    const basePath = myAPI.joinPath(myAPI.dirname(), overridePath);
    const fullPath = myAPI.joinPath(basePath, url);
    console.log(`Path resolved to: ${fullPath}`);

    return new Promise((resolve, reject) => {
      myAPI.readFile(fullPath, (err, data) => {
        if (err) {
          resolve(new Response(null, {
            status: 404,
            statusText: "File Not Found"
          }));
        }
        else
        {
          // Warning: only js, wasm and binary files support is required for piper-tts-web requests
          resolve(new Response(data, {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": url.endsWith(".js")?"application/javascript" :
                url.endsWith(".wasm")?"application/wasm":
                "application/octet-stream"
            }
          }));
        }
      });
    });
  }

  return originalFetch(url);
};

// prepare document elements access
const preview = document.getElementById("preview");
const pageContainer = document.getElementById("pageContainer");
pageContainer.style.display = "none";

const webcamSelect = document.getElementById("webcamSelect");
const video = document.getElementById("video");
const scanBtn = document.getElementById("scanBtn");
const img2PdfBtn = document.getElementById("img2PdfBtn");
const reScanBtn = document.getElementById("reScanBtn");
const showPdfBtn = document.getElementById("showPdfBtn");
const canvasInput = document.getElementById("canvasInput");
// const canvasOutput = document.getElementById("canvasOutput");
const ctxInput = canvasInput.getContext("2d");
const ctxOutput = canvasInput.getContext("2d");

// plug document elements to action callbacks
reScanBtn.onclick = showScanPreview;
showPdfBtn.onclick = showPdf;
img2PdfBtn.onclick = selectImage;

// diable buttons until OpenCV is ready
showPdfBtn.disabled = false;
img2PdfBtn.disabled = false;

function enableWebcamScan() {
  scanBtn.onclick = scanWebcam;
  scanBtn.disabled = false;
}

// retrieve webcam devices and populate the select element
async function listWebcams() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoSelect = document.getElementById("webcamSelect");

  // Clear existing options
  videoSelect.innerHTML = "";

  devices
    .filter(device => device.kind === "videoinput")
    .forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label || `Camera ${index + 1}`;
      videoSelect.appendChild(option);
    });
}

// handle webcam device selection change
webcamSelect.addEventListener("change", (event) => {
  startStream(event.target.value);
});

// start webcam stream with selected device
async function startStream(deviceId) {
  const constraints = {
    video: { deviceId: { exact: deviceId } }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
}


// setup webcam stream on page load
await listWebcams();
const defaultDeviceId = webcamSelect.value;
if (defaultDeviceId) {
  startStream(defaultDeviceId);
}

// request webcam access and show video preview
// navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     .then(stream => video.srcObject = stream);

// switch to scan from video preview mode
function showScanPreview()
{
    preview.style.display = "block";
    pageContainer.style.display = "none";
}

// switch to pdf view mode
function showPdf()
{
    preview.style.display = "none";
    pageContainer.style.display = "block";
}

// findNonZeroJS is missing from OpenCV.js, so we implement it in JavaScript
function findNonZeroJS(mat) {
    if (!(mat instanceof cv.Mat)) {
        throw new Error("Input must be an OpenCV Mat.");
    }
    const nonZeroPoints = [];

    for (let y = 0; y < mat.rows; y++) {
        for (let x = 0; x < mat.cols; x++) {
        const pixel = mat.ucharPtr(y, x)[0];
        if (pixel > 0) {
            nonZeroPoints.push(new cv.Point(x, y));
        }
        }
    }

    return nonZeroPoints;
}

// Read the image from the canvas and perform skewed sheet detection
function scanDetection() {

    let src = cv.imread(canvasInput);
    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let threshold = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0);
    cv.threshold(blur, threshold, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(threshold, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let documentContour = new cv.Mat();

    for (let i = 0; i < contours.size(); i++) {
    let cnt = contours.get(i);
    let area = cv.contourArea(cnt, false);
    if (area > 1000) {
        let peri = cv.arcLength(cnt, true);
        let approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.015 * peri, true);
        if (area > maxArea && approx.rows === 4) {
        documentContour = approx;
        maxArea = area;
        }
        approx.delete();
    }
    cnt.delete();
    }

    // Draw the detected contour
    let contoursToDraw = new cv.MatVector();
    contoursToDraw.push_back(documentContour);
    cv.drawContours(src, contoursToDraw, -1, new cv.Scalar(0, 255, 0), 3);

    cv.imshow(canvasOutput, src);

    // Cleanup
    gray.delete(); blur.delete(); threshold.delete();
    contours.delete(); hierarchy.delete();
    contoursToDraw.delete(); src.delete(); documentContour.delete();
}

// apply detected skewed sheet to the original image to get a straightened image
// pts: array of 4 cv.Points in order [top-left, top-right, bottom-right, bottom-left]
function fourPointTransform(srcMat, pts) {

    // Compute width and height of the new image
    const widthA = Math.hypot(pts[2].x - pts[3].x, pts[2].y - pts[3].y);
    const widthB = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.hypot(pts[1].x - pts[2].x, pts[1].y - pts[2].y);
    const heightB = Math.hypot(pts[0].x - pts[3].x, pts[0].y - pts[3].y);
    const maxHeight = Math.max(heightA, heightB);

    // Destination points for warped image
    const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1
    ]);

    const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
        pts[0].x, pts[0].y,
        pts[1].x, pts[1].y,
        pts[2].x, pts[2].y,
        pts[3].x, pts[3].y
    ]);

    // Get perspective transform matrix
    const M = cv.getPerspectiveTransform(srcPts, dstPts);

    // Apply warp
    const dst = new cv.Mat();
    const dsize = new cv.Size(maxWidth, maxHeight);
    cv.warpPerspective(srcMat, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Cleanup
    srcPts.delete(); dstPts.delete(); M.delete();

    return dst;
}


// Select an image file using file open dialog and create a pdf with text layer via ocr
function selectImage() {
  myAPI.showOpenDialog("Images", ["png", "jpg", "jpeg"]).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      myAPI.readFile(filePath, (err, data) => {
        if (!err)
        {
          const imgBlob = new Blob([new Uint8Array(data)], { type: "application/image" });
          const imgUrl = URL.createObjectURL(imgBlob);
          processImage(imgUrl);
        }
      });
    }
  });
}


async function scanWebcam() {

  // 1️⃣ Capture frame
  canvasInput.width = video.videoWidth;
  canvasInput.height = video.videoHeight;
  ctxInput.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);

  // 2️⃣ Deskew with OpenCV.js
  // let src = cv.imread(canvasInput);
  // let gray = new cv.Mat();
  // let binary = new cv.Mat();
  // cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  // cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  // let coords = findNonZeroJS(binary);
  // let rect = cv.minAreaRect(coords);
  // let angle = rect.angle;

  // let center = new cv.Point(src.cols / 2, src.rows / 2);
  // let rotMat = cv.getRotationMatrix2D(center, angle, 1);
  // let dst = new cv.Mat();
  // cv.warpAffine(src, dst, rotMat, src.size(), cv.INTER_CUBIC, cv.BORDER_CONSTANT, new cv.Scalar());
  // cv.imshow(canvasOutput, dst);
  ctxOutput.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);
  // src.delete(); gray.delete(); binary.delete(); dst.delete();

  // 3️⃣ OCR with Tesseract.js
  let processedImg = canvasInput.toDataURL("image/png");
  processImage(processedImg);
}


// OCR recognition
async function recognize(image, langs, options, output)
{
  const worker = await createWorker(langs, 1, options);
  return worker.recognize(image, {}, output)
    .finally(async () => {
    await worker.terminate();
    });
};

// process imoage with OCR and display PDF
async function processImage(processedImg) {
  const { data: { text, pdf, hocr } } = await recognize(processedImg, "fra", {
          workerPath: "./third-parties/tesseract.js@6.0.1/worker.min.js",
          langPath: "./tessdata",
          corePath: "./third-parties/tesseract.js@6.0.1",
          gzip : false,
          logger: m => console.log(m),
          errorHandler: err => console.error(err)
      },
      { text: true, pdf: true , hocr: true}
  );

  // 5️⃣ Display PDF
  const pdfBlob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(pdfBlob);
  PDFViewerApplication.open({ url: blobUrl });

  showPdf();

};


// TTS speech synthesis
function speakWithPiper(text) 
{
    const voice = "fr_FR-siwis-medium";
    const speaker = 0;
    piperWebEngine.generate(text, voice, speaker).then((res) => {
        audio.src = URL.createObjectURL(res.file);
        audio.play();
    });
    piperWebEngine.terminate();
}

// Add event listener for text selection and trigger speach automatically
document.addEventListener("mouseup", () => {
    const selectedText = getSelectedText();
    if (selectedText && selectedText.length > 1) {
        speakWithPiper(selectedText);
    }
});

// Retrieve selected text from the document
function getSelectedText()
{
    if (window.getSelection) {
    return window.getSelection().toString();
    }
    else if (document.selection) {
        return document.selection.createRange().text;
    }
    return "";
}