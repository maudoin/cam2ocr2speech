// import ocr engine
const { createWorker } = Tesseract;
const TESSERACT_CORE_PATH = "../third-parties/tesseract.js@6.0.1";
const TESSERACT_WORKER_PATH = "../third-parties/tesseract.js@6.0.1/worker.min.js";
const TESSERACT_LANG_PATH = "../resources/tesseract_models";

// import pdf controller
const { PDFViewerApplication } = await import("../third-parties/pdf.js/v5.3.93/web/viewer.mjs");


// Override fetch globally to fix piper-tts-web/pdf.js loading issues in electron
// or force local loading instead of remote loading
// Save original fetch as fallback for regular requests
if (typeof myAPI !== 'undefined')
{
  const originalFetch = window.fetch;
  window.fetch = async (url) => {
    let overridePath = null;
    if (typeof url === "string")
    {
      let override;
      if (url.startsWith("/build/") || url.startsWith("/web/"))
      {
        // pdf.js request
        overridePath = PDFJS_LOCAL_CODE_PATH;
      }
      else if (override = TextToSpeech.fetchOverride(url))
      {
        overridePath = override.overridePath;
        url = override.url;
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
}

// import image processing functions
import { ImageProcessing } from "./imageProcessing.js";
// enable scan button when image processing is ready
ImageProcessing.asyncImport().then(() => {
  enableActions();
});

// import TTS
import { TextToSpeech } from "./textToSpeech.js";
const tts = new TextToSpeech();

import { DocumentTools } from "./documentTools.js";

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
  const svgOverlay = document.getElementById('svgOverlay');

const voiceOption = document.getElementById("voiceOption");
const deskewImage = document.getElementById("deskewImage");
const deskewImageLabel = document.getElementById("deskewImageLabel");


let currentContourPoints = [];

// plug document elements to action callbacks
webcamPreview.onclick = switchToWebcamMode;
reScanBtn.onclick = switchToWebcamMode;
showPdfBtn.onclick = switchToPdfMode;
document.addEventListener("mouseup", speakSelectedText);

// diable buttons until OpenCV is ready
showPdfBtn.disabled = false;
img2PdfBtn.disabled = false;
openImage.disabled = false;

switchToWebcamMode();
function enableActions() {
  webcam2Img.onclick = webcamCaptureToImage;
  webcam2Img.disabled = false;
  webcam2Pdf.onclick = webcamCaptureToPdf;
  webcam2Pdf.disabled = false;

  img2PdfBtn.onclick = imageToPdf;
  openImage.onclick = selectImage;
  deskewImage.addEventListener("click", findImageContour);
  voiceOption.addEventListener("click", speakSelectedText);

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


// Display points in svg overlay
function addContourOverlay(points)
{
  svgOverlay.innerHTML = ''; // Clear previous

  // Get canvas position relative to the page
  const rect = canvasInput.getBoundingClientRect();
  // const rectMain = canvasInput.parentElement.getBoundingClientRect();
  const left = rect.left;
  const top = rect.top;

  // Set SVG size to match canvas
  svgOverlay.setAttribute('width', canvasInput.width);
  svgOverlay.setAttribute('height', canvasInput.height);
  svgOverlay.style.position = 'absolute';
  svgOverlay.style.left = left + 'px';
  svgOverlay.style.top = top + 'px';
  if (points.length != 0)
  {
    svgOverlay.style.width = canvasInput.width + 'px';
    svgOverlay.style.height = canvasInput.height + 'px';
  }
  else
  {
    svgOverlay.style.width = '0px';
    svgOverlay.style.height = '0px';
  }

  // Draw polygon
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  poly.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
  poly.setAttribute('fill', 'rgba(0,255,0,0.2)');
  poly.setAttribute('stroke', 'lime');
  poly.setAttribute('stroke-width', 2);
  svgOverlay.appendChild(poly);

  // Drag logic
  let draggingIdx = null;

  function onPointerMove(e) {
    if (draggingIdx !== null) {
      // Calculate mouse position relative to SVG
      const svgRect = svgOverlay.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      points[draggingIdx].x = Math.max(0, Math.min(canvasInput.width, x));
      points[draggingIdx].y = Math.max(0, Math.min(canvasInput.height, y));
      addContourOverlay(points); // Redraw
    }
  }

  function onPointerUp() {
    draggingIdx = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

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

    // Add drag events
    circle.addEventListener('pointerdown', function(e) {
      draggingIdx = idx;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      e.preventDefault();
      e.stopPropagation();
    });

    svgOverlay.appendChild(circle);
  });
  svgOverlay.style.pointerEvents = 'auto';
}


function findImageContour()
{
  currentContourPoints = (deskewImage.checked)?ImageProcessing.detectContourPoints(canvasInput):[];
  // add contour after transformation so the strainghtened image does not show the overlay
  addContourOverlay(currentContourPoints);

}

// prepare output canvas by using contour points to deskey image
function mayDeskewImageToOutput()
{
  if (currentContourPoints.length)
  {
    const cvImageMat = ImageProcessing.fourPointTransform(canvasInput, currentContourPoints);

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

function showOpenDialog(title = "Images", acceptFilters = ["png", "jpg", "jpeg"])
{
  if (typeof myAPI !== 'undefined')
  {

    return myAPI.showOpenDialog(title, acceptFilters);
  }
  else
  {
    DocumentTools.showOpenDialog(title, acceptFilters);
  }
}

// Select an image file using file open dialog and create a pdf with text layer via ocr
function selectImage()
{
  showOpenDialog("Images", ["png", "jpg", "jpeg"]).then(result => {
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
          workerPath: TESSERACT_WORKER_PATH,
          langPath: TESSERACT_LANG_PATH,
          corePath: TESSERACT_CORE_PATH,
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


// Add event listener for text selection and trigger speach automatically
function speakSelectedText()
{
  if (voiceOption.checked && pageContainer.style.display != "none")
  {
    const selectedText = DocumentTools.getSelectedText();
    if (selectedText && selectedText.length > 1)
    {
      tts.speak(selectedText);
    }
  }
  else
  {
    tts.interrupt();
  }
}