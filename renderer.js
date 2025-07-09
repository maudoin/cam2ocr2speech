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
const webcamPreview = document.getElementById("webcamPreview");
const video = document.getElementById("video");
const webcam2Img = document.getElementById("webcam2Img");
const webcam2Pdf = document.getElementById("webcam2Pdf");
const img2PdfBtn = document.getElementById("img2PdfBtn");
const reScanBtn = document.getElementById("reScanBtn");
const openImage = document.getElementById("openImage");
const showPdfBtn = document.getElementById("showPdfBtn");
const canvasInput = document.getElementById("canvasInput");
const ctxInput = canvasInput.getContext("2d");
const canvasOutput = document.getElementById("canvasOutput");
const ctxOutput = canvasOutput.getContext("2d");

const voiceOption = document.getElementById("voiceOption");
const deskewImage = document.getElementById("deskewImage");
const deskewImageLabel = document.getElementById("deskewImageLabel");


let currentContourPoints = [];

// plug document elements to action callbacks
webcamPreview.onclick = switchToWebcamMode;
reScanBtn.onclick = switchToWebcamMode;
showPdfBtn.onclick = switchToPdfMode;
img2PdfBtn.onclick = imageToPdf;
openImage.onclick = selectImage;
deskewImage.addEventListener("click", findImageContour);
voiceOption.addEventListener("click", speakSelectedText);
document.addEventListener("mouseup", speakSelectedText);

// diable buttons until OpenCV is ready
showPdfBtn.disabled = false;
img2PdfBtn.disabled = false;
openImage.disabled = false;

function enableWebcamScan() {
  webcam2Img.onclick = webcamCaptureToImage;
  webcam2Img.disabled = false;
  webcam2Pdf.onclick = webcamCaptureToPdf;
  webcam2Pdf.disabled = false;
  switchToWebcamMode();
}
// switch to scan from video preview mode
function switchToWebcamMode()
{
  // toolbar update
  webcamPreview.style.visibility = "hidden";
  webcamSelect.style.visibility = "visible";
  webcam2Img.style.visibility = "visible";
  webcam2Pdf.style.visibility = "visible";
  img2PdfBtn.style.visibility = "hidden";
  deskewImageLabel.style.visibility = "hidden";
  // display update
  video.style.display = "block";
  canvasInput.style.display = "none";
  canvasOutput.style.display = "none";
  // layout update
  preview.style.display = "block";
  pageContainer.style.display = "none";
}

// switch to image view mode
function switchToImagePreviewMode()
{
  // toolbar update
  webcamPreview.style.visibility = "visible";
  webcamSelect.style.visibility = "hidden";
  webcam2Img.style.visibility = "hidden";
  webcam2Pdf.style.visibility = "hidden";
  img2PdfBtn.style.visibility = "visible";
  deskewImageLabel.style.visibility = "visible";
  // display update
  video.style.display = "none";
  canvasInput.style.display = "block";
  canvasOutput.style.display = "none";
  // layout update
  preview.style.display = "block";
  pageContainer.style.display = "none";
}

// switch to pdf view mode
function switchToPdfMode()
{
  // layout update
  preview.style.display = "none";
  pageContainer.style.display = "block";
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


// Read the image from the canvas and perform skewed sheet detection
function detectContourPoints(canvas) {

  let src = cv.imread(canvas);
  let gray = new cv.Mat();
  let blur = new cv.Mat();
  let threshold = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0);

  // --- Gamma correction ---
  let gamma = 1.5; // You can adjust this value as needed
  let lookUpTable = new cv.Mat(1, 256, cv.CV_8U);
  for (let i = 0; i < 256; i++) {
    lookUpTable.ucharPtr(0, i)[0] = Math.min(255, Math.pow(i / 255.0, 1.0 / gamma) * 255.0);
  }
  cv.LUT(blur, lookUpTable, blur);
  lookUpTable.delete();
  // --- End gamma correction ---

  cv.threshold(blur, threshold, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  // Debug Display threshold img : cv.imshow(canvasInput, threshold);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(threshold, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

  let maxArea = 0;
  let documentContour = new cv.Mat();

  for (let i = 0; i < contours.size(); i++)
  {
    let cnt = contours.get(i);

    let area = cv.contourArea(cnt, false);
    // Remove close points from cnt
    let filteredCnt = new cv.Mat();
    if (area > 1000 && cnt.rows > 1) {
        let points = [];
        let prev = cnt.intPtr(0);
        points.push([prev[0], prev[1]]);
        for (let j = 1; j < cnt.rows; j++) {
            let curr = cnt.intPtr(j);
            let dx = curr[0] - prev[0];
            let dy = curr[1] - prev[1];
            if (Math.sqrt(dx * dx + dy * dy) > 2) { // threshold: 2 pixels
                // Colinearity check: keep only if not nearly colinear with previous two
                if (points.length >= 2) {
                    let [x1, y1] = points[points.length - 2];
                    let [x2, y2] = points[points.length - 1];
                    let [x3, y3] = [curr[0], curr[1]];
                    // Calculate area of triangle (x1,y1)-(x2,y2)-(x3,y3)
                    let area = Math.abs((x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1));
                    // If area is small, points are nearly colinear (threshold: 1.5)
                    if (area > 1.5) {
                        points.push([curr[0], curr[1]]);
                        prev = curr;
                    }
                } else {
                    points.push([curr[0], curr[1]]);
                    prev = curr;
                }
            }
        }
        // Convert filtered points back to Mat
        if (points.length > 1) {
            console.log(cnt.rows + " --filtered-> " + points.length);
            filteredCnt = cv.matFromArray(points.length, 1, cv.CV_32SC2, points.flat());
        } else {
            filteredCnt = cnt.clone();
        }
    } else {
        filteredCnt = cnt.clone();
    }

    area = cv.contourArea(cnt, false);
    if (area > 1000) {
        let peri = cv.arcLength(cnt, true);
        let approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.015 * peri, true);
        if (area > maxArea && approx.rows === 4) {
          // may delete previous
          if (documentContour) documentContour.delete();
          documentContour = approx;
          // approx does not need to be deleted, documentContour holds it
          maxArea = area;
        }
        else
        {
          // only delete here otherwise it has been assigned to documentContour
          // and documentContour would be invalid
          approx.delete();
        }
    }
    cnt.delete();
    filteredCnt.delete();
  }
  let contourPoints = [];
  if (documentContour) {
    // Get the points from documentContour
    for (let i = 0; i < documentContour.rows; i++) {
        let pt = documentContour.intPtr(i);
        contourPoints.push({ x: pt[0], y: pt[1] });
    }
  }
  // Cleanup
  gray.delete(); blur.delete(); threshold.delete();
  contours.delete(); hierarchy.delete();
  src.delete(); documentContour.delete();

  return contourPoints;
}

// Display points in svg overlay
function addContourOverlay(points)
{
  const svg = document.getElementById('svgOverlay');
  const mainContent = document.getElementById('mainContent');
  svg.innerHTML = ''; // Clear previous

  // Get canvas position relative to the page
  const rect = canvasInput.getBoundingClientRect();
  const rectMain = canvasInput.parentElement.getBoundingClientRect();
  const left = rectMain.left + rect.left;
  const top = rectMain.top + rect.top;

  // Set SVG size to match canvas
  svg.setAttribute('width', canvasInput.width);
  svg.setAttribute('height', canvasInput.height);
  svg.style.width = canvasInput.width + 'px';
  svg.style.height = canvasInput.height + 'px';
  svg.style.position = 'absolute';
  svg.style.left = left + 'px';
  svg.style.top = top + 'px';

  // Draw polygon
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  poly.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
  poly.setAttribute('fill', 'rgba(0,255,0,0.2)');
  poly.setAttribute('stroke', 'lime');
  poly.setAttribute('stroke-width', 2);
  svg.appendChild(poly);

  // Draw draggable points
  points.forEach((p, idx) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', 8);
    circle.setAttribute('fill', 'yellow');
    circle.setAttribute('stroke', 'orange');
    circle.setAttribute('stroke-width', 2);
    circle.style.cursor = 'pointer';
    circle.setAttribute('data-idx', idx);
    circle.style.pointerEvents = 'auto';
    svg.appendChild(circle);
  });
  svg.style.pointerEvents = 'auto';
}

// apply detected skewed sheet to the original image to get a straightened image
// canvas: input canvas element with the image to be straightened
// pts: array of 4 cv.Points in order [top-left, top-right, bottom-right, bottom-left]
// return opencv image Mat instance of the straightened image
function fourPointTransform(canvas, pts) {

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

    // Cleanup
    srcPts.delete(); dstPts.delete();

    // Return the matrix and the computed dimensions
    let dsize = new cv.Size(Math.round(maxWidth), Math.round(maxHeight));
    let src = cv.imread(canvas);
    // Apply warp
    const dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Cleanup
    M.delete();
    src.delete();
    return dst;
}

function findImageContour()
{
  currentContourPoints = (deskewImage.checked)?detectContourPoints(canvasInput):[];
  // add contour after transformation so the strainghtened image does not show the overlay
  addContourOverlay(currentContourPoints);

}

// prepare output canvas by using contour points to deskey image
function mayDeskewImageToOutput()
{
  if (currentContourPoints.length)
  {
    const cvImageMat = fourPointTransform(canvasInput, currentContourPoints);

    // Display the result in the output canvas
    canvasOutput.width = cvImageMat.cols;
    canvasOutput.height = cvImageMat.rows;
    cv.imshow(canvasOutput, cvImageMat);
  }
  else
  {
    // copy input canvas to output canvas
    canvasOutput.width = canvasInput.width;
    canvasOutput.height = canvasInput.height;
    ctxOutput.drawImage(canvasInput, 0, 0, canvasInput.width, canvasInput.height);
  }

}

// Select an image file using file open dialog and create a pdf with text layer via ocr
function selectImage()
{
  myAPI.showOpenDialog("Images", ["png", "jpg", "jpeg"]).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      // Create an Image object
      const img = new Image();
      img.onload = function() {
        canvasInput.width = img.naturalWidth;
        canvasInput.height = img.naturalHeight;
        // Draw the image to fill the entire canvas
        ctxInput.drawImage(img, 0, 0, canvasInput.width, canvasInput.height);

        findImageContour();
        switchToImagePreviewMode();
      };
      // Set the image source (can be a URL, data URL, or blob URL)
      img.src = filePath;
    }
  });
}


// webcam to canevas capture
async function webcamCaptureToImage()
{
  canvasInput.width = video.videoWidth;
  canvasInput.height = video.videoHeight;
  ctxInput.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);

  findImageContour();
  switchToImagePreviewMode();
}

async function webcamCaptureToPdf()
{
  canvasInput.width = video.videoWidth;
  canvasInput.height = video.videoHeight;
  ctxInput.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);

  findImageContour();
  imageToPdf();
}


// OCR recognition
async function recognize(image, langs, options, output)
{
  // OCR with Tesseract.js
  const worker = await createWorker(langs, 1, options);
  return worker.recognize(image, {}, output)
    .finally(async () => {
    await worker.terminate();
    });
};

// process imoage with OCR and display PDF
async function imageToPdf() {
  mayDeskewImageToOutput();
  let processedImg = canvasOutput.toDataURL("image/png");
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

  switchToPdfMode();

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
function speakSelectedText()
{
  if (voiceOption.checked && pageContainer.style.display != "none")
  {
    const selectedText = getSelectedText();
    if (selectedText && selectedText.length > 1) {
        speakWithPiper(selectedText);
    }
  }
  else
  {
    audio.pause();
  }
}

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