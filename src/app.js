import { Utils } from "./Utils.js";
import { ImageProcessing } from "./ImageProcessing.js";
import { TextToSpeech } from "./TextToSpeech.js";
import { OpticalCharacterRecognition } from "./OpticalCharacterRecognition.js";
import { PdfView } from "./PdfView.js";
import { Webcam } from "./Webcam.js";
import { ScalableVectorGraphics } from "./ScalableVectorGraphics.js";

Utils.fetchUrlOverride((urlStr)=> PdfView.fetchOverride(urlStr) || TextToSpeech.fetchOverride(urlStr));

// import image processing functions & enable actions ony when ready
ImageProcessing.asyncImport().then(() => enableActions());


// prepare document elements access
const preview = document.getElementById("preview");
const pageContainer = document.getElementById("pageContainer");
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
const svgOverlay = document.getElementById("svgOverlay");

const voiceOption = document.getElementById("voiceOption");
const deskewImage = document.getElementById("deskewImage");
const deskewImageLabel = document.getElementById("deskewImageLabel");


Webcam.install(webcamSelect, video);
let currentContourPoints = [];
const tts = new TextToSpeech();


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

// read canvas input and update contour points
function findImageContour()
{
  currentContourPoints = (deskewImage.checked)?ImageProcessing.detectContourPoints(canvasInput):[];
  if (currentContourPoints.length != 0)
  {
    Utils.overlayElementOnAnother(svgOverlay, canvasInput);
  }
  else
  {
    // hide
    svgOverlay.style.width = "0px";
    svgOverlay.style.height = "0px";
  }
  ScalableVectorGraphics.setupEditablePoints(svgOverlay, currentContourPoints);
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

// process image with OCR and display PDF
async function imageToPdf()
{
  // prepare image by using contour points to deskey image
  let processedImg;
  if (currentContourPoints.length)
  {
    const cvImageMat = ImageProcessing.fourPointTransform(canvasInput, currentContourPoints);

    // Display the result in the output canvas
    canvasOutput.width = cvImageMat.cols;
    canvasOutput.height = cvImageMat.rows;
    cv.imshow(canvasOutput, cvImageMat);
    processedImg = canvasOutput.toDataURL("image/png");
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