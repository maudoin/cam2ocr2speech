import { Utils } from "./Utils.js";
import { ImageProcessing } from "./ImageProcessing.js";
import { TextToSpeech } from "./TextToSpeech.js";
import { OpticalCharacterRecognition } from "./OpticalCharacterRecognition.js";
import { PdfView } from "./PdfView.js";
import { Webcam } from "./Webcam.js";
import { ScalableVectorGraphics } from "./ScalableVectorGraphics.js";

Utils.fetchUrlOverride((urlStr)=> PdfView.fetchOverride(urlStr) || TextToSpeech.fetchOverride(urlStr));

// import image processing functions & enable actions ony when ready
let stitcher = null;
ImageProcessing.asyncImport().then(() => enableActions());


// webcam control elements
const webcamSelect = document.getElementById("webcamSelect");
const webcamFocus = document.getElementById("webcamFocus");
const imagePreview = document.getElementById("imagePreview");
const webcamPreview = document.getElementById("webcamPreview");
const webcam2Img = document.getElementById("webcam2Img");
const stitchWebcamCapture = document.getElementById("stitchWebcamCapture");
const webcam2Pdf = document.getElementById("webcam2Pdf");

// image control elements
const openImage = document.getElementById("openImage");
const deskewImage = document.getElementById("deskewImage");
const deskewImageLabel = document.getElementById("deskewImageLabel");
const rotateImgClockwise = document.getElementById("rotateImgClockwise");
const rotateImgCounterClockwise = document.getElementById("rotateImgCounterClockwise");
const img2PdfBtn = document.getElementById("img2PdfBtn");

// pdf control elements
const showPdfBtn = document.getElementById("showPdfBtn");
const pdfOpenButton = document.getElementById("pdfOpenButton");
const openPdfBtn = document.getElementById("openPdfBtn");
const pdfToWebcamPreview = document.getElementById("pdfToWebcamPreview");
const pdfToImagePreview = document.getElementById("pdfToImagePreview");
const voiceOption = document.getElementById("voiceOption");

// parent modes
const preview = document.getElementById("preview");
const pageContainer = document.getElementById("pageContainer");

// preview sub modes
const video = document.getElementById("video");
const svgOverlay = document.getElementById("svgOverlay");
const canvasInput = document.getElementById("canvasInput");
const ctxInput = canvasInput.getContext("2d");


Webcam.install(webcamSelect, video, webcamFocus);
let currentContourPoints = [];
const tts = new TextToSpeech();


// plug document elements to action callbacks
webcamPreview.onclick = switchToWebcamMode;
imagePreview.onclick = switchToImagePreviewMode;
pdfToWebcamPreview.onclick = switchToWebcamMode;
pdfToImagePreview.onclick = switchToImagePreviewMode;
showPdfBtn.onclick = switchToPdfMode;
openPdfBtn.onclick = selectPdf;
pdfOpenButton.onclick = selectPdf;
stitchWebcamCapture.onclick = stitchCapture;
rotateImgClockwise.onclick = rotateClockwise;
rotateImgCounterClockwise.onclick = rotateCounterClockwise;
document.addEventListener("mouseup", speakSelectedText);

// diable buttons until OpenCV is ready
showPdfBtn.disabled = false;
img2PdfBtn.disabled = false;
openImage.disabled = false;

switchToWebcamMode();

// see ImageProcessing.asyncImport
function enableActions()
{
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
  imagePreview.classList.remove("activeMode");
  webcamPreview.classList.add("activeMode");
  webcamSelect.style.display = "block";
  webcamFocus.style.display = "block";
  webcam2Img.style.display = "block";
  stitchWebcamCapture.style.display = stitcher ? "block" : "none";
  webcam2Pdf.style.display = "block";
  img2PdfBtn.style.display = "none";
  deskewImageLabel.style.display = "none";
  rotateImgClockwise.style.display = "none";
  rotateImgCounterClockwise.style.display = "none";
  // display update
  video.style.display = "block";
  canvasInput.style.display = "none";
  svgOverlay.style.display = "none";
  // layout update
  preview.style.display = "block";
  pageContainer.style.display = "none";
}

// switch to image view mode
function switchToImagePreviewMode()
{
  // toolbar update
  imagePreview.classList.add("activeMode");
  webcamPreview.classList.remove("activeMode");
  webcamSelect.style.display = "none";
  webcamFocus.style.display = "none";
  webcam2Img.style.display = "none";
  stitchWebcamCapture.style.display = "none";
  webcam2Pdf.style.display = "none";
  img2PdfBtn.style.display = "block";
  deskewImageLabel.style.display = "block";
  rotateImgClockwise.style.display = "block";
  rotateImgCounterClockwise.style.display = "block";
  // display update
  video.style.display = "none";
  canvasInput.style.display = "block";
  svgOverlay.style.display = "block";
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

// read canvas input and update contour points
function findImageContour()
{
  currentContourPoints = (deskewImage.checked)?ImageProcessing.detectContourPoints(canvasInput):[];
  ScalableVectorGraphics.setupEditablePoints(svgOverlay, currentContourPoints, canvasInput.width, canvasInput.height);

  stitcher = ImageProcessing.prepareStitch(canvasInput);
}

// use Node.js or Brwoser dialog
function showOpenDialog(title = "Images", acceptFilters = ["png", "jpg", "jpeg"])
{
  if (typeof myAPI !== "undefined")
  {

    return myAPI.showOpenDialog(title, acceptFilters);
  }
  else
  {
    return Utils.showOpenDialog(title, acceptFilters);
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


// Select an image file using file open dialog and create a pdf with text layer via ocr
function selectPdf()
{
  showOpenDialog("PDF", ["pdf"]).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      PdfView.openUrl(filePath);
      switchToPdfMode();
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

// webcam to canevas capture
async function webcamCaptureToPdf()
{
  canvasInput.width = video.videoWidth;
  canvasInput.height = video.videoHeight;
  ctxInput.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);

  findImageContour();
  imageToPdf();
}

function stitchCapture()
{
  // video to tmp canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(video, 0, 0, canvasInput.width, canvasInput.height);

  ImageProcessing.stitch(stitcher, canvasInput, tempCanvas);

  switchToImagePreviewMode();
}

function rotateClockwise()
{
  ImageProcessing.rotate(canvasInput, true);
  findImageContour();
}

function rotateCounterClockwise()
{
  ImageProcessing.rotate(canvasInput, false);
  findImageContour();
}

// process image with OCR and display PDF
async function imageToPdf()
{
  // prepare image by using contour points to deskey image
  let processedImg;
  let tempCanvas = document.createElement("canvas");
  if (currentContourPoints.length)
  {
    const cvImageMat = ImageProcessing.fourPointTransform(canvasInput, currentContourPoints);
    // Display the result in a temp canvas
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = cvImageMat.cols;
    tempCanvas.height = cvImageMat.rows;
    cv.imshow(tempCanvas, cvImageMat);
    processedImg = tempCanvas.toDataURL("image/png");
  }
  else
  {
    processedImg = canvasInput.toDataURL("image/png");
  }
  const { data: { pdf } } = await OpticalCharacterRecognition.recognize(processedImg, "fra");

  // Display PDF
  const pdfBlob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(pdfBlob);
  PdfView.openUrl(blobUrl);

  switchToPdfMode();
}

// Add event listener for text selection and trigger speach automatically
function speakSelectedText()
{
  if (voiceOption.checked && pageContainer.style.display != "none")
  {
    const selectedText = Utils.getSelectedText();
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