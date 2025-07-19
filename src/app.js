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
let arucoFirstStepScanMarkers = null;
let consecutiveValidCaptures = 0;


// webcam control elements
const webcamSelect = document.getElementById("webcamSelect");
const webcamFocus = document.getElementById("webcamFocus");
const webcamAutoScan = document.getElementById("webcamAutoScan");
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


Webcam.install(webcamSelect, video, webcamFocus);

video.addEventListener('play', () => requestAnimationFrame(processWebcamFrame));

let currentContourPoints = [];
const tts = new TextToSpeech();


// plug document elements to action callbacks
webcamPreview.onclick = switchToWebcamMode;
webcamAutoScan.onclick = toggleWebcamAutoScan;
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
  webcamAutoScan.style.display = "block";
  webcam2Img.style.display = "block";
  stitchWebcamCapture.style.display = (stitcher || arucoFirstStepScanMarkers) ? "block" : "none";
  webcam2Pdf.style.display = "block";
  img2PdfBtn.style.display = "none";
  deskewImageLabel.style.display = "none";
  rotateImgClockwise.style.display = "none";
  rotateImgCounterClockwise.style.display = "none";
  // display update
  video.style.display = "block";
  canvasInput.style.display = "none";
  svgOverlay.style.display = "block";
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
  webcamAutoScan.style.display = "none";
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

  disableArucoAutoDetection();
}

// switch to pdf view mode
function switchToPdfMode()
{
  // layout update
  preview.style.display = "none";
  pageContainer.style.display = "block";

  disableArucoAutoDetection();
}

// Frame processing loop
function processWebcamFrame() {
  maySendVideoFrameToAutoDetection();
  // Schedule next frame
  requestAnimationFrame(processWebcamFrame);
}

function toggleWebcamAutoScan()
{
  if (webcamAutoScan.classList.contains("active"))
  {
    disableArucoAutoDetection();
  }
  else
  {
    enableArucoAutoDetection();
  }
}


function enableArucoAutoDetection()
{
  webcamAutoScan.classList.add("active");
  webcamAutoScan.textContent = "𝍌🛑";
  if (arucoFirstStepScanMarkers)
  {
    webcamAutoScan.textContent = webcamAutoScan.textContent + "(" + arucoFirstStepScanMarkers.count + ")";
  }
  consecutiveValidCaptures = 0;
}

function maySendVideoFrameToAutoDetection()
{
  if ( webcamAutoScan.classList.contains("active") )
  {
    // video to tmp canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

    const viewCorners = ImageProcessing.sortedPointClockwiseFromTopLeft(tempCanvas.width, tempCanvas.height);
    ScalableVectorGraphics.init(svgOverlay, video.videoWidth, video.videoHeight);

    const imgMat = cv.imread(tempCanvas);
    const markers = ImageProcessing.detectAruco(imgMat);
    const currentContourPointsAndIds = markersToContourPoints(markers, arucoFirstStepScanMarkers != null);
    let lastConsecutiveValidCaptures = consecutiveValidCaptures;
    consecutiveValidCaptures = 0;
    if (currentContourPointsAndIds)
    {
      const transformedSourcePolygonArea = ImageProcessing.polygonArea(currentContourPointsAndIds.contourPoints) ;
      const maximumArea = (tempCanvas.width * tempCanvas.height) ;
      const areaRatio = transformedSourcePolygonArea / maximumArea;
      if (areaRatio > 0.6)
      {
        if (arucoFirstStepScanMarkers)
        {
          if (currentContourPointsAndIds.ids.topLeftId === arucoFirstStepScanMarkers.ids.bottomLeftId &&
              currentContourPointsAndIds.ids.topRightId === arucoFirstStepScanMarkers.ids.bottomRightId)
          {
            if (lastConsecutiveValidCaptures > 10)
            {
              handleSecondImageWithArucoMarkers(imgMat, currentContourPointsAndIds, arucoFirstStepScanMarkers).
              disableArucoAutoDetection();
              imageToPdf();
            }
            else
            {
              // good camera placement, must wait a few frames
              ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, markers, ()=>"🖒"+lastConsecutiveValidCaptures,
                (video.videoHeight*10)/100, "green", markers.corners);
              consecutiveValidCaptures = lastConsecutiveValidCaptures + 1;
            }
          }
          else // not the expected markers!
          {
            const filteredMarkers = markers.filter(m => m.id !== arucoFirstStepScanMarkers.ids.topLeftId && m.id !== arucoFirstStepScanMarkers.ids.topRightId);
            ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, filteredMarkers, i=>(i+1)+"/4",
              (video.videoHeight*10)/100, "red", filteredMarkers.corners);
          }
        }
        else
        {
          if (lastConsecutiveValidCaptures > 10)
          {
            if (handleImageWithArucoMarkers(imgMat, currentContourPointsAndIds) )
            {
              enableArucoAutoDetection();
              // display not ok for bottom scan part
              const filteredMarkers = markers.filter(m => m.id !== arucoFirstStepScanMarkers.ids.topLeftId && m.id !== arucoFirstStepScanMarkers.ids.topRightId);
              ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, filteredMarkers, i=>(i+1)+"/4",
                (video.videoHeight*10)/100, "red", filteredMarkers.corners);
            }
            else
            {
              ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, markers, i=>(i+1)+"/4",
                (video.videoHeight*10)/100, "red", markers.corners);
            }
          }
          else
          {
            // good camera placement, must wait a few frames
            ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, markers, ()=>"🖒"+lastConsecutiveValidCaptures,
              (video.videoHeight*10)/100, "green", markers.corners);
            consecutiveValidCaptures = lastConsecutiveValidCaptures + 1;
          }
        }
      }
      else // too far
      {
        if (arucoFirstStepScanMarkers)
        {
          const filteredMarkers = markers.filter(m => m.id !== arucoFirstStepScanMarkers.ids.topLeftId && m.id !== arucoFirstStepScanMarkers.ids.topRightId);
          if (filteredMarkers.length !== 4)
          {
            ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, filteredMarkers, i=>(i+1)+"/4",
              (video.videoHeight*10)/100, "red", filteredMarkers.corners);
          }
          else if (currentContourPointsAndIds.ids.topLeftId === arucoFirstStepScanMarkers.ids.topLeftId &&
                   currentContourPointsAndIds.ids.topRightId === arucoFirstStepScanMarkers.ids.topRightId)
          {
            // markers detected but must move to next area
            ScalableVectorGraphics.drawArrows(svgOverlay,[
              {start:viewCorners[0], end:currentContourPointsAndIds.contourPoints[3]},
              {start:viewCorners[1], end:currentContourPointsAndIds.contourPoints[2]}],
              (video.videoHeight*10)/100);
          }
          else
          {
            // markers detected but camera must be adjusted to fit the page better
            const lines = viewCorners.map((p, idx)=>{return {start:p, end:currentContourPointsAndIds.contourPoints[idx]};});
            ScalableVectorGraphics.drawArrows(svgOverlay, lines, (video.videoHeight*10)/100);
          }
        }
        else
        {
          // markers detected but camera must be adjusted to fit the page better
          const lines = viewCorners.map((p, idx)=>{return {start:p, end:currentContourPointsAndIds.contourPoints[idx]};});
          ScalableVectorGraphics.drawArrows(svgOverlay, lines, (video.videoHeight*10)/100);
        }
      }
    }
    else if (markers)
    {
      if (arucoFirstStepScanMarkers)
      {
        // draw top guides for bottom corners of completed part
        const prevBottomLeftIndex = markers.findIndex(m => m.id === arucoFirstStepScanMarkers.ids.bottomLeftId);
        if (prevBottomLeftIndex != -1)
        {
          ScalableVectorGraphics.drawArrows(svgOverlay,[{start:viewCorners[0], end:markers[prevBottomLeftIndex]}], (video.videoHeight*10)/100);
        }
        const prevBottomRightIndex = markers.findIndex(m => m.id === arucoFirstStepScanMarkers.ids.bottomRightId);
        if (prevBottomRightIndex != -1)
        {
          ScalableVectorGraphics.drawArrows(svgOverlay,[{start:viewCorners[1], end:markers[prevBottomRightIndex]}], (video.videoHeight*10)/100);
        }
      }
      // skip top markers of completed part
      const sortedMarkers = ImageProcessing.sortPointClockwiseFromTopLeft(arucoFirstStepScanMarkers?
        markers.filter(m => m.id !== arucoFirstStepScanMarkers.ids.topLeftId && m.id !== arucoFirstStepScanMarkers.ids.topRightId) :
        markers);
      ScalableVectorGraphics.drawPolylinesAndText(svgOverlay, sortedMarkers, i=>(i+1)+"/4",
        (video.videoHeight*10)/100, "red", sortedMarkers.corners);
    }
    imgMat.delete();
  }
}

function disableArucoAutoDetection()
{
  webcamAutoScan.classList.remove("active");
  webcamAutoScan.textContent = "𝍌➰";
  arucoFirstStepScanMarkers = null;
  consecutiveValidCaptures = 0;
  svgOverlay.innerHTML = ""; // Clear previous
}

/// {contourPoints : [{x,y},{x,y},{x,y},{x,y}], bottomLeftId:number, bottomRightId:number}
/// topMarkerFromBottom: if true, contour points the top markers will be taken from the marker's bottom, marker's top otherwise
function markersToContourPoints(markers, topMarkerFromBottom=false)
{
  if (markers && markers.length === 4)
  {
    const sortedMarkers = ImageProcessing.sortPointClockwiseFromTopLeft(markers);
    const TOP_LEFT = 0;
    const TOP_RIGHT = 1;
    const BOTTOM_RIGHT = 2;
    const BOTTOM_LEFT = 3;
    // markers are on the left and right side of the sheet 
    return {contourPoints : [
      ImageProcessing.sortPointClockwiseFromTopLeft(sortedMarkers[TOP_LEFT].corners)[topMarkerFromBottom?BOTTOM_RIGHT:TOP_RIGHT],
      ImageProcessing.sortPointClockwiseFromTopLeft(sortedMarkers[TOP_RIGHT].corners)[topMarkerFromBottom?BOTTOM_LEFT:TOP_LEFT],
      ImageProcessing.sortPointClockwiseFromTopLeft(sortedMarkers[BOTTOM_RIGHT].corners)[BOTTOM_LEFT],
      ImageProcessing.sortPointClockwiseFromTopLeft(sortedMarkers[BOTTOM_LEFT].corners)[BOTTOM_RIGHT]],
      ids : {
        topLeftId : sortedMarkers[TOP_LEFT].id,
        topRightId : sortedMarkers[TOP_RIGHT].id,
        bottomLeftId : sortedMarkers[BOTTOM_LEFT].id,
        bottomRightId : sortedMarkers[BOTTOM_RIGHT].id
      }
    };
  }
  return null;
}

function handleImageWithArucoMarkers(imgMat, currentContourPointsAndIds)
{
  if (currentContourPointsAndIds)
  {
    // when aruco markers are detected, we transform it immediately
    const cvImageMat = ImageProcessing.fourPointTransform(imgMat, currentContourPointsAndIds.contourPoints);
    canvasInput.width = cvImageMat.cols;
    canvasInput.height = cvImageMat.rows;
    cv.imshow(canvasInput, cvImageMat);
    cvImageMat.delete();

    currentContourPoints = [];
    stitcher = null;
    arucoFirstStepScanMarkers = {ids:currentContourPointsAndIds.ids, count:1};
    return true;
  }
  return false;
}

// read canvas input and update contour points
function findImageContour()
{
  let imgMat = cv.imread(canvasInput);
  const markers = ImageProcessing.detectAruco(imgMat);
  const currentContourPointsAndIds = markersToContourPoints(markers);
  if (!handleImageWithArucoMarkers(imgMat, currentContourPointsAndIds))
  {
    // no aruco markers, use generic image contouring detection
    currentContourPoints = (deskewImage.checked)?ImageProcessing.detectContourPoints(imgMat):[];
    ScalableVectorGraphics.init(svgOverlay, canvasInput.width, canvasInput.height);
    ScalableVectorGraphics.setupEditablePoints(svgOverlay, currentContourPoints, canvasInput.width, canvasInput.height);
    // generic pattern based stiching, better for images than text...
    stitcher = ImageProcessing.prepareStitch(imgMat);
    arucoFirstStepScanMarkers = null;
  }
  imgMat.delete();
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
        const ctxInput = canvasInput.getContext("2d");
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
  Webcam.captureToCanevas(video, canvasInput);

  findImageContour();
  switchToImagePreviewMode();
}

// webcam to canevas capture
async function webcamCaptureToPdf()
{
  Webcam.captureToCanevas(video, canvasInput);

  findImageContour();
  imageToPdf();
}


// firstStepMarkers is non null and has been tested
function handleSecondImageWithArucoMarkers(imgMat, currentContourPointsAndIds, firstStepMarkers)
{
  if (currentContourPointsAndIds &&
      currentContourPointsAndIds.ids.topLeftId === firstStepMarkers.ids.bottomLeftId &&
      currentContourPointsAndIds.ids.topRightId === firstStepMarkers.ids.bottomRightId )
  {
    // match found: stich at marker location
    const cvImageMat = ImageProcessing.fourPointTransform(imgMat, currentContourPointsAndIds.contourPoints);
    ImageProcessing.addCvMatToCanvas(cvImageMat, canvasInput);
    cvImageMat.delete();

    arucoFirstStepScanMarkers = {ids:currentContourPointsAndIds.ids, count:firstStepMarkers.count+1};
    switchToImagePreviewMode();

    return true;
  }
  return false;
}

function stitchCapture()
{
  // video to tmp canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

  let imgMat = cv.imread(tempCanvas);
  if (arucoFirstStepScanMarkers)
  {
    const markers = ImageProcessing.detectAruco(imgMat);
    const currentContourPointsAndIds = markersToContourPoints(markers, true);
    handleSecondImageWithArucoMarkers(imgMat, currentContourPointsAndIds, arucoFirstStepScanMarkers);
  }
  else if (stitcher)
  {
    // generic pattern based stiching, better for images than text...
    ImageProcessing.stitch(stitcher, canvasInput, tempCanvas);
    switchToImagePreviewMode();
  }
  imgMat.delete();

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
    let imgMat = cv.imread(canvasInput);
    const cvImageMat = ImageProcessing.fourPointTransform(imgMat, currentContourPoints);
    imgMat.delete();
    // Display the result in a temp canvas
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = cvImageMat.cols;
    tempCanvas.height = cvImageMat.rows;
    cv.imshow(tempCanvas, cvImageMat);
    cvImageMat.delete();
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