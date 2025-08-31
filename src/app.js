import { Utils } from "./Utils.js";
import { ImageProcessing } from "./ImageProcessing.js";
import { TextToSpeech } from "./TextToSpeech.js";
import { OpticalCharacterRecognition } from "./OpticalCharacterRecognition.js";
import { PdfView } from "./PdfView.js";
import { Webcam } from "./Webcam.js";
import { ScalableVectorGraphics } from "./ScalableVectorGraphics.js";
import { Localize } from "./Localize.js";

Localize.setTitlesFromIds();

Utils.fetchUrlOverride((urlStr)=> PdfView.fetchOverride(urlStr) || TextToSpeech.fetchOverride(urlStr));

// import image processing functions & enable actions ony when ready
let stitcher = null;
let stitchingAdjustmentParams = null;
ImageProcessing.asyncImport().then(() => enableActions());
let arucoFirstStepScanMarkers = null;
let previousContourPoints = null;
let previousContourPointsStableCount = 0;
let skipNextAutoScanFramingTests = false;
const STABLE_CONTOUR_SUCCESSIVE_FRAMES_THRESHOLD = 3;
function stabilityIndicator(){
  return previousContourPointsStableCount + "/" + STABLE_CONTOUR_SUCCESSIVE_FRAMES_THRESHOLD;
}
function resetStabilityIndicator(){
  previousContourPointsStableCount = 0;
}
function isStable(canvasWidth, contourPoints){
  if (skipNextAutoScanFramingTests)
  {
    return true;
  }
  const STABLE_AVG_SQ_DISTANCE_PCT_WIDTH = (0.004); // allow only 0.4% of the canvas width
  const STABLE_AVG_SQ_DISTANCE = (canvasWidth) => (STABLE_AVG_SQ_DISTANCE_PCT_WIDTH*canvasWidth)**2; // allow only 5 pixels
  if (!previousContourPoints)
  {
    // first time
    previousContourPoints = contourPoints;
    previousContourPointsStableCount = 0;
  }
  else
  { const squareDist = ImageProcessing.averageSquaredDistance(contourPoints, previousContourPoints);
    // ScalableVectorGraphics.drawText(svgOverlay, {x:canvasWidth/2, y:50}, Math.trunc(Math.sqrt(squareDist))+" vs "+(STABLE_AVG_SQ_DISTANCE_PCT_WIDTH*canvasWidth),
    //     50, squareDist < STABLE_AVG_SQ_DISTANCE(canvasWidth)?"black":"red");
    if ( squareDist < STABLE_AVG_SQ_DISTANCE(canvasWidth))
    {
      // increment
      previousContourPointsStableCount++;
    }
    else
    {
      // unstable, reset with current
      previousContourPoints = contourPoints;
      previousContourPointsStableCount = 0;
    }
  }
  return previousContourPointsStableCount >= STABLE_CONTOUR_SUCCESSIVE_FRAMES_THRESHOLD;
};

const FOCUS_VALUE_WHEN_ENTERING_ARUCO_MODE = 10;

// webcam control elements
const webcamSelect = document.getElementById("webcamSelect");
const webcamFocus = document.getElementById("webcamFocus");
const webcamAutoScan = document.getElementById("webcamAutoScan");
const webcamAutoScanPartSelect = document.getElementById("webcamAutoScanPartSelect");
const imagePreview = document.getElementById("imagePreview");
const webcamPreview = document.getElementById("webcamPreview");
const webcam2Img = document.getElementById("webcam2Img");
const stitchWebcamCapture = document.getElementById("stitchWebcamCapture");
const webcam2Pdf = document.getElementById("webcam2Pdf");

// image control elements
const openImage = document.getElementById("openImage");
const deskewImageBtn = document.getElementById("deskewImageBtn");
const cropImageBtn = document.getElementById("cropImageBtn");
const applyImageBtn = document.getElementById("applyImageBtn");
const rotateImgClockwise = document.getElementById("rotateImgClockwise");
const rotateImgCounterClockwise = document.getElementById("rotateImgCounterClockwise");
const img2PdfBtn = document.getElementById("img2PdfBtn");
const imageOcrLangInput = document.getElementById("imageOcrLangInput");
const imgSaveBtn = document.getElementById("imgSaveBtn");

// pdf control elements
const showPdfBtn = document.getElementById("showPdfBtn");
const pdfOpenButton = document.getElementById("pdfOpenButton");
const openHelpPdfBtn = document.getElementById("openHelpPdfBtn");
const openPdfBtn = document.getElementById("openPdfBtn");
const pdfToWebcamPreview = document.getElementById("pdfToWebcamPreview");
const pdfToImagePreview = document.getElementById("pdfToImagePreview");
const voiceOption = document.getElementById("voiceOption");
const voiceLangInput = document.getElementById("voiceLangInput");

// parent modes
const preview = document.getElementById("preview");
const pageContainer = document.getElementById("pageContainer");

// preview sub modes
const video = document.getElementById("video");
const svgOverlay = document.getElementById("svgOverlay");
const canvasInput = document.getElementById("canvasInput");

OpticalCharacterRecognition.setupSelectFromAvailableModels(imageOcrLangInput, path => myAPI.listFiles(path));
TextToSpeech.setupSelectFromAvailableModels(voiceLangInput, path => myAPI.listFolders(path), path => myAPI.listFiles(path));
imageOcrLangInput.addEventListener("change", function () {
  // warning, we use the ".textContent" which is the system lang, not ".value" which is the ocr file extension lang
  Localize.setTitlesFromIds(this.options[this.selectedIndex].textContent);
});
webcamAutoScanPartSelect.addEventListener("change", function () {
  if ( webcamAutoScan.classList.contains("active") )
  {
    updateArucoAutoDetectionButton();
  }
});

let videoMediaStream;
let videoMediaStreamCaps;
let videoMediaStreamFrameIntervalMs;
Webcam.install(webcamSelect, (mediastream, caps)=>{
  videoMediaStream = mediastream;
  videoMediaStreamCaps = caps;
  video.srcObject = mediastream;
  Webcam.setupFocusSlider(mediastream, webcamFocus);
  videoMediaStreamFrameIntervalMs = 1000./Webcam.getFps(mediastream);
});

video.addEventListener('play', () => requestAnimationFrame(processWebcamFrame));

let currentContourPoints = [];
let cropSelectionRectangle = [];
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
openHelpPdfBtn.onclick = openHelpPdf;
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
  imgSaveBtn.onclick = imageSave;
  openImage.onclick = selectImage;
  deskewImageBtn.addEventListener("click", setupManualDeskewWithImageContour);
  cropImageBtn.addEventListener("click", setupRectangleSelection);
  applyImageBtn.addEventListener("click", applyDeskewOrStitchingAdjustment);
  voiceOption.addEventListener("click", speakSelectedText);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.key === " " || event.key === "Spacebar") {
      if (webcamPreview.classList.contains("activeMode"))
      {
        if (webcamAutoScan.classList.contains("active"))
        {
          // in auto scan mode:
          skipNextAutoScanFramingTests = true;
        }
        else if (stitchWebcamCapture.style.display != "none" || arucoFirstStepScanMarkers)
        {
          // manual stitching is available:
          stitchCapture();
        }
        else
        {
          // simple capture by default
          webcamCaptureToImage();
        }
        event.preventDefault(); // prevent scrolling
      }
    }
  });
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
  webcamAutoScanPartSelect.style.display = "block";
  webcam2Img.style.display = "block";
  stitchWebcamCapture.style.display = (stitcher || arucoFirstStepScanMarkers) ? "block" : "none";
  webcam2Pdf.style.display = "block";
  img2PdfBtn.style.display = "none";
  imgSaveBtn.style.display = "none";
  rotateImgClockwise.style.display = "none";
  rotateImgCounterClockwise.style.display = "none";
  deskewImageBtn.style.display = "none";
  cropImageBtn.style.display = "none";
  applyImageBtn.style.display = "none";
  // display update
  video.style.display = "block";
  canvasInput.style.display = "none";
  svgOverlay.style.display = "block";
  // layout update
  preview.style.display = "block";
  pageContainer.style.display = "none";

  svgOverlay.innerHTML = ""; // Clear previous
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
  webcamAutoScanPartSelect.style.display = "none";
  webcam2Img.style.display = "none";
  stitchWebcamCapture.style.display = "none";
  webcam2Pdf.style.display = "none";
  img2PdfBtn.style.display = "block";
  imgSaveBtn.style.display = "block";
  rotateImgClockwise.style.display = "block";
  rotateImgCounterClockwise.style.display = "block";
  deskewImageBtn.style.display = "block";
  cropImageBtn.style.display = "block";
  applyImageBtn.style.display = "block";
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
let lastTimestamp = 0;
// keeps track of how much time has passed.
let accumulatedTime = 0;
async function processWebcamFrame(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  accumulatedTime += timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  // process frames only when enough time has accumulated to match the desired interval.
  while (accumulatedTime >= videoMediaStreamFrameIntervalMs) {
    // leftover time is carried forward, preventing drift.
    accumulatedTime -= videoMediaStreamFrameIntervalMs;
    await maySendVideoFrameToAutoDetection();
  }
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


function updateArucoAutoDetectionButton()
{
  webcamAutoScan.textContent = "𝍌🛑";
  webcamAutoScan.textContent = webcamAutoScan.textContent + "("
    + ((arucoFirstStepScanMarkers?arucoFirstStepScanMarkers.count:0)+1)
    + "/" + webcamAutoScanPartSelect.value + ")";
}


function enableArucoAutoDetection()
{
  if (arucoFirstStepScanMarkers && arucoFirstStepScanMarkers.count >= webcamAutoScanPartSelect.value)
  {
    arucoFirstStepScanMarkers = null;
  }
  webcamAutoScan.classList.add("active");
  webcamFocus.value = FOCUS_VALUE_WHEN_ENTERING_ARUCO_MODE;
  webcamFocus.dispatchEvent(new Event('input', { bubbles: true }));
  updateArucoAutoDetectionButton();
  skipNextAutoScanFramingTests = false;
}

async function maySendVideoFrameToAutoDetection()
{
  if ( webcamAutoScan.classList.contains("active") )
  {
    // video to tmp canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

    const textHeightPercent = (pct)=>(video.videoHeight*pct)/100;

    const targetSquareSize = textHeightPercent(3);
    const targetOffset = targetSquareSize * 1.2;
    const viewCorners = ImageProcessing.sortedPointClockwiseFromTopLeft(tempCanvas.width, tempCanvas.height);
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }] = viewCorners;
    const targetCorners = [{ x: x1 + targetOffset, y: y1 + targetOffset }, { x: x2 - targetOffset, y: y2 + targetOffset },
                           { x: x3 - targetOffset, y: y3 - targetOffset }, { x: x4 + targetOffset, y: y4 - targetOffset }];
    ScalableVectorGraphics.init(svgOverlay, video.videoWidth, video.videoHeight);

    const imgMat = cv.imread(tempCanvas);
    let markers = ImageProcessing.detectAruco(imgMat);
    const currentContourPointsAndIds = markersToContourPoints(markers, arucoFirstStepScanMarkers != null);

    const drawMatchingMarkers = ()=>{
        ScalableVectorGraphics.drawTextAndPolyLine(svgOverlay, markers,()=>"✓",
          textHeightPercent(7), "black", m=>m.corners);
        ScalableVectorGraphics.drawText(svgOverlay, {x:tempCanvas.width/2, y:tempCanvas.height/2}, stabilityIndicator(),
        textHeightPercent(20), "green");
    }
    const drawIncompleteMarkers = (markersToDraw)=>ScalableVectorGraphics.drawTextAndPolyLine(svgOverlay, markersToDraw,
      i=>(i+1)+"/4",
      textHeightPercent(10), "red", m=>m.corners);
    const filterOutFirstStepTopMarkers = ()=>
      markers.filter(m => m.id !== arucoFirstStepScanMarkers.ids.topLeftId && m.id !== arucoFirstStepScanMarkers.ids.topRightId);
    const drawIncompleteBottomMarkers = ()=>
      ScalableVectorGraphics.drawTextAndPolyLine(svgOverlay, filterOutFirstStepTopMarkers(), i=>(i+1)+"/4",
        textHeightPercent(10), "red", m=>m.corners);
    const drawArrows = ()=>{
      const lines = targetCorners.map((p, idx)=>{let m=markers[idx];return {start:p, end:m};});
      ScalableVectorGraphics.drawArrows(svgOverlay, lines, targetSquareSize);
    }
    const drawTopArrowsToBottomMarkers = ()=>{
      ScalableVectorGraphics.drawArrows(svgOverlay,[
        {start:targetCorners[0], end:markers[3]},
        {start:targetCorners[1], end:markers[2]}],
        targetSquareSize);
    }
    const drawTopLeftArrowToMarker = (prevBottomLeftIndex)=>{
      ScalableVectorGraphics.drawArrows(svgOverlay,[
        {start:targetCorners[0], end:markers[prevBottomLeftIndex]}],
        targetSquareSize);
    }
    const drawTopRightArrowToMarker = (prevBottomRightIndex)=>{
      ScalableVectorGraphics.drawArrows(svgOverlay,[
        {start:targetCorners[1], end:markers[prevBottomRightIndex]}],
        targetSquareSize);
    }
    const currentTopIsPrevStepBottom = ()=>currentContourPointsAndIds.ids.topLeftId === arucoFirstStepScanMarkers.ids.bottomLeftId &&
                                           currentContourPointsAndIds.ids.topRightId === arucoFirstStepScanMarkers.ids.bottomRightId;
    const currentTopIsPrevStepTop = ()=>currentContourPointsAndIds.ids.topLeftId === arucoFirstStepScanMarkers.ids.topLeftId &&
                                        currentContourPointsAndIds.ids.topRightId === arucoFirstStepScanMarkers.ids.topRightId;
    if (currentContourPointsAndIds)
    {
      const transformedSourcePolygonArea = ImageProcessing.polygonArea(markers) ;
      const maximumArea = (tempCanvas.width * tempCanvas.height) ;
      const areaRatio = transformedSourcePolygonArea / maximumArea;
      const REQUIRED_AREA_RATIO = 0.68;// 68% of area is 82% or each side
      if (skipNextAutoScanFramingTests || areaRatio > REQUIRED_AREA_RATIO)
      {
        // are we scanning second part ?
        if (arucoFirstStepScanMarkers)
        {
          if (currentTopIsPrevStepBottom())
          {
            if (isStable(tempCanvas.width, currentContourPointsAndIds.contourPoints))
            {
              handleNextImageWithArucoMarkers(imgMat, currentContourPointsAndIds, arucoFirstStepScanMarkers);
              if (arucoFirstStepScanMarkers.count >= webcamAutoScanPartSelect.value)
              {
                disableArucoAutoDetection(true);
                switchToImagePreviewMode();

                showStitchingAdjustmentSvgSlider(imgMat, currentContourPointsAndIds.fullAreaContourPoints);

              }
              else
              {
                updateArucoAutoDetectionButton();
              }
            }
            else
            {
              // good camera placement, must wait a few frames
              drawMatchingMarkers();
            }
          }
          else if (currentTopIsPrevStepTop())
          {
            // markers detected but must move to next area
            drawTopArrowsToBottomMarkers();
          }
          else // not the expected markers!
          {
            drawIncompleteBottomMarkers();
          }
        }
        else
        {
          if (isStable(tempCanvas.width, currentContourPointsAndIds.contourPoints))
          {
            if (handleImageWithArucoMarkers(imgMat, currentContourPointsAndIds) )
            {
              if (webcamAutoScanPartSelect.value == 1)
              {
                disableArucoAutoDetection(true);
                switchToImagePreviewMode();
                imageToPdf();
              }
              else
              {
                updateArucoAutoDetectionButton();
              }
            }
            else
            {
              drawIncompleteMarkers(markers);
            }
          }
          else
          {
            // good camera placement, must wait a few frames
            drawMatchingMarkers();
          }
        }
      }
      else // too far
      {
        resetStabilityIndicator();
        if (arucoFirstStepScanMarkers)
        {
          const markersExceptFirstTop = filterOutFirstStepTopMarkers();
          if (currentTopIsPrevStepTop())
          {
            // markers detected but must move to next area
            drawTopArrowsToBottomMarkers();
          }
          else if (markersExceptFirstTop.length === 4)
          {
            // markers detected but camera must be adjusted to fit the page better
            drawArrows();
          }
          else
          {
            drawIncompleteMarkers(markersExceptFirstTop);
          }
        }
        else
        {
          // markers detected but camera must be adjusted to fit the page better
          drawArrows();
        }
      }
    }
    else if (markers)
    {
      if (arucoFirstStepScanMarkers)
      {
        resetStabilityIndicator();
        // draw top guides for bottom corners of completed part
        const prevBottomLeftIndex = markers.findIndex(m => m.id === arucoFirstStepScanMarkers.ids.bottomLeftId);
        if (prevBottomLeftIndex != -1)
        {
          drawTopLeftArrowToMarker(prevBottomLeftIndex);
        }
        const prevBottomRightIndex = markers.findIndex(m => m.id === arucoFirstStepScanMarkers.ids.bottomRightId);
        if (prevBottomRightIndex != -1)
        {
          drawTopRightArrowToMarker(prevBottomRightIndex);
        }
        drawIncompleteBottomMarkers();
      }
      else
      {
        const lines = drawImageWithArucoMarkersBook(markers);
        if ( !lines )
        {
          drawIncompleteMarkers(markers);
        }
        else if (skipNextAutoScanFramingTests)
        {
          handleImageWithArucoMarkersBook(imgMat, markers);
          switchToImagePreviewMode();
        }
      }
    }
    imgMat.delete();
    skipNextAutoScanFramingTests = false;
  }
}

function disableArucoAutoDetection(clearFirstStepMarkers = false)
{
  webcamAutoScan.classList.remove("active");
  webcamAutoScan.textContent = "𝍌▶️";
  svgOverlay.innerHTML = ""; // Clear previous
  if (clearFirstStepMarkers)
  {
    arucoFirstStepScanMarkers = null;
  }
}

/// {contourPoints : [{x,y},{x,y},{x,y},{x,y}], bottomLeftId:number, bottomRightId:number}
/// topMarkerFromBottom: if true, contour points the top markers will be taken from the marker's bottom, marker's top otherwise
function markersToContourPoints(markersClockwiseFromTopLeft, topMarkerFromBottom=false)
{
  if (markersClockwiseFromTopLeft && markersClockwiseFromTopLeft.length === 4)
  {
    const TOP_LEFT = 0;
    const TOP_RIGHT = 1;
    const BOTTOM_RIGHT = 2;
    const BOTTOM_LEFT = 3;
    let topLeftMarkerCorners = ImageProcessing.sortPointClockwiseFromTopLeft(markersClockwiseFromTopLeft[TOP_LEFT].corners);
    let topRightMarkerCorners = ImageProcessing.sortPointClockwiseFromTopLeft(markersClockwiseFromTopLeft[TOP_RIGHT].corners);
    let bottomRightMarkerCorners = ImageProcessing.sortPointClockwiseFromTopLeft(markersClockwiseFromTopLeft[BOTTOM_RIGHT].corners);
    let bottomLeftMarkerCorners = ImageProcessing.sortPointClockwiseFromTopLeft(markersClockwiseFromTopLeft[BOTTOM_LEFT].corners);
    // markers are on the left and right side of the sheet
    return {contourPoints : [
        topLeftMarkerCorners[topMarkerFromBottom?BOTTOM_RIGHT:TOP_RIGHT],
        topRightMarkerCorners[topMarkerFromBottom?BOTTOM_LEFT:TOP_LEFT],
        bottomRightMarkerCorners[BOTTOM_LEFT],
        bottomLeftMarkerCorners[BOTTOM_RIGHT]
      ],
      fullAreaContourPoints : [
        topLeftMarkerCorners[TOP_RIGHT],
        topRightMarkerCorners[TOP_LEFT],
        bottomRightMarkerCorners[BOTTOM_LEFT],
        bottomLeftMarkerCorners[BOTTOM_RIGHT]
      ],
      ids : {
        topLeftId :     markersClockwiseFromTopLeft[TOP_LEFT].id,
        topRightId :    markersClockwiseFromTopLeft[TOP_RIGHT].id,
        bottomLeftId :  markersClockwiseFromTopLeft[BOTTOM_LEFT].id,
        bottomRightId : markersClockwiseFromTopLeft[BOTTOM_RIGHT].id
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
    // stitching is now available
    stitchWebcamCapture.style.display = "block";
    return true;
  }
  return false;
}

function getTopAndBottomLinesFromMarkers(markers)
{
  if (markers && markers.length > 4 && markers.length % 2 === 0)
  {
    let polygonTop = [];
    let polygonBottom = [];
    let markersSortedCorners = markers.map((m)=>ImageProcessing.sortPointClockwiseFromTopLeft(m.corners));
    const n = markers.length/2;
    const TOP_LEFT = 0;
    const TOP_RIGHT = 1;
    const BOTTOM_RIGHT = 2;
    const BOTTOM_LEFT = 3;
    let maxMarkerWidth = 0;
    let maxMarkerSpacing = 0;
    for (let i = 0; i < n; ++i) {
      let top = markersSortedCorners[i];
      let bottom = markersSortedCorners[markers.length-1-i];
      maxMarkerWidth = Math.max(maxMarkerWidth,
        Math.max(
          ImageProcessing.dist(top[BOTTOM_LEFT], top[BOTTOM_RIGHT]),
          ImageProcessing.dist(bottom[TOP_LEFT], bottom[TOP_RIGHT])));
      if (i>0)
      {
        let prevTop = markersSortedCorners[i-1];
        let prevBottom = markersSortedCorners[markers.length-i];
        maxMarkerSpacing = Math.max(maxMarkerSpacing,
          Math.max(
            ImageProcessing.dist(prevTop[BOTTOM_RIGHT], top[BOTTOM_LEFT]),
            ImageProcessing.dist(prevBottom[TOP_RIGHT], bottom[TOP_LEFT])));
      }
    }
    let polygonX = [];
    let x = 0;
    for (let i = 0; i < n; ++i) {
      let top = markersSortedCorners[i];
      let bottom = markersSortedCorners[markers.length-1-i];
      if (i>0)
      {
        let prevTop = markersSortedCorners[i-1];
        let prevBottom = markersSortedCorners[markers.length-i];
        const INTERMEDIATE_COUNT = 4;
        const topPoints = CatmullRomSpline.chordalDistanceSplinePoints(prevTop[BOTTOM_LEFT], prevTop[BOTTOM_RIGHT], top[BOTTOM_LEFT], top[BOTTOM_RIGHT], INTERMEDIATE_COUNT);
        const bottomPoints = CatmullRomSpline.chordalDistanceSplinePoints(prevBottom[TOP_LEFT], prevBottom[TOP_RIGHT], bottom[TOP_LEFT], bottom[TOP_RIGHT], INTERMEDIATE_COUNT);

        const xStart = x;
        for (let j = 0; j < topPoints.length; ++j) {
            x += maxMarkerSpacing/INTERMEDIATE_COUNT;
            polygonX.push(x);
            polygonTop.push(topPoints[j]);
            polygonBottom.push(bottomPoints[j]);
        }
        // avoid rounding errors
        x = xStart + maxMarkerSpacing;
      }

      polygonX.push(x);
      x += maxMarkerWidth;
      polygonX.push(x);

      polygonTop.push(top[BOTTOM_LEFT]);
      polygonTop.push(top[BOTTOM_RIGHT]);
      polygonBottom.push(bottom[TOP_LEFT]);
      polygonBottom.push(bottom[TOP_RIGHT]);
    }
    return {polygonTop, polygonBottom, polygonX};
  }
  return null;
}

function drawImageWithArucoMarkersBook(markers)
{
  const lines = ImageProcessing.getTopAndBottomLinesFromArucoMarkers(markers);
  if (lines)
  {
    const polygon = lines.polygonTop.concat(lines.polygonBottom.reverse());
    ScalableVectorGraphics.drawPolyLine(svgOverlay, polygon, "rgba(0, 255, 0, 0.5)");
  }
  return lines;
}

function handleImageWithArucoMarkersBook(imgMat, markers, linesOverride = null)
{
  const lines = linesOverride || ImageProcessing.getTopAndBottomLinesFromArucoMarkers(markers);
  if (lines)
  {
    try
    {
      const cvImageMat = ImageProcessing.unwarpWithPerPixelMap(imgMat, lines.polygonTop, lines.polygonBottom, lines.polygonX);
      canvasInput.width = cvImageMat.cols;
      canvasInput.height = cvImageMat.rows;
      cv.imshow(canvasInput, cvImageMat);
      cvImageMat.delete();
      return true;
    }
    catch(e)
    {}
  }
  return false;
}

// read canvas input and update contour points
function setupManualDeskewWithImageContour()
{
  let imgMat = cv.imread(canvasInput);
  currentContourPoints = ImageProcessing.detectContourPoints(imgMat);
  if ( (!currentContourPoints) || (currentContourPoints.length !== 4) )
  {
    currentContourPoints = ImageProcessing.sortedPointClockwiseFromTopLeft(imgMat.cols, imgMat.rows);
  }
  ScalableVectorGraphics.init(svgOverlay, canvasInput.width, canvasInput.height);
  ScalableVectorGraphics.setupEditablePoints(svgOverlay, currentContourPoints, canvasInput.width, canvasInput.height);
  imgMat.delete();
}

// apply currentContourPoints to image
function mayApplyManualDeskewAdjustment()
{
  if (currentContourPoints && currentContourPoints.length ===4 )
  {
    let imgMat = cv.imread(canvasInput);
    const cvImageMat = ImageProcessing.fourPointTransform(imgMat, currentContourPoints);
    imgMat.delete();
    canvasInput.width = cvImageMat.cols;
    canvasInput.height = cvImageMat.rows;
    cv.imshow(canvasInput, cvImageMat);
    cvImageMat.delete();
    svgOverlay.innerHTML = "";
    currentContourPoints = null;
  }
}

// read canvas input and update contour points
function setupRectangleSelection()
{
  let imgMat = cv.imread(canvasInput);
  if ( (!cropSelectionRectangle) || (cropSelectionRectangle.length !== 2) )
  {
    cropSelectionRectangle = [{x:imgMat.cols/4, y:imgMat.rows/4}, {x:imgMat.cols*3/4, y:imgMat.rows*3/4}];
  }
  ScalableVectorGraphics.init(svgOverlay, canvasInput.width, canvasInput.height);
  ScalableVectorGraphics.setupEditableRect(svgOverlay, cropSelectionRectangle, canvasInput.width, canvasInput.height);
  imgMat.delete();
}

// apply rectangleSelection to image
function mayApplyCropRectangleAdjustment()
{
  if (svgOverlay.innerHTML !== "" && cropSelectionRectangle && cropSelectionRectangle.length ===2 )
  {
    let imgMat = cv.imread(canvasInput);
    const cvImageMat = ImageProcessing.cropFromTwoPoints(imgMat, cropSelectionRectangle);
    imgMat.delete();
    canvasInput.width = cvImageMat.cols;
    canvasInput.height = cvImageMat.rows;
    cv.imshow(canvasInput, cvImageMat);
    cvImageMat.delete();
    svgOverlay.innerHTML = "";
    cropSelectionRectangle = null;
  }
}

// apply currentContourPoints or stitching to image
function applyDeskewOrStitchingAdjustment()
{
  mayValidateStitchingAdjustment();
  mayApplyManualDeskewAdjustment();
  mayApplyCropRectangleAdjustment();
  currentContourPoints = [];
  cropSelectionRectangle = null;
}

// read canvas input and update contour points
function mayDeskewWithArucoAndPrepareStitching()
{
  let imgMat = cv.imread(canvasInput);
  const markers = ImageProcessing.detectAruco(imgMat);
  const currentContourPointsAndIds = markersToContourPoints(markers);
  if (!handleImageWithArucoMarkers(imgMat, currentContourPointsAndIds) &&
      !handleImageWithArucoMarkersBook(imgMat, markers))
  {
    // generic pattern based stiching, better for images than text...
    stitcher = ImageProcessing.prepareStitch(canvasInput);
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

        mayDeskewWithArucoAndPrepareStitching();
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

function openHelpPdf()
{
  const langToFile = (lang)=>lang?"../manual/USAGE."+lang+".pdf":null;
  // warning, we use the ".textContent" which is the system lang, not ".value" which is the ocr file extension lang
  PdfView.openUrl(imageOcrLangInput.value?langToFile(imageOcrLangInput.options[imageOcrLangInput.selectedIndex].textContent):langToFile("fr"));
  switchToPdfMode();
}

// webcam to canevas capture
async function webcamCaptureToImage()
{
  Webcam.captureToCanevas(video, canvasInput);

  mayDeskewWithArucoAndPrepareStitching();
  switchToImagePreviewMode();
}

// webcam to canevas capture
async function webcamCaptureToPdf()
{
  Webcam.captureToCanevas(video, canvasInput);

  mayDeskewWithArucoAndPrepareStitching();
  imageToPdf();
}


// firstStepMarkers is non null and has been tested
function handleNextImageWithArucoMarkers(imgMat, currentContourPointsAndIds, firstStepMarkers)
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

    return true;
  }
  return false;
}

function showStitchingAdjustmentSvgSlider(imgMat, contourPoints)
{
  const cvImageMat = ImageProcessing.fourPointTransform(imgMat, contourPoints);
  let scaleNewImage = canvasInput.width / cvImageMat.cols;
  let resizedNewImage = new cv.Mat();
  cv.resize(cvImageMat, resizedNewImage, new cv.Size(canvasInput.width, Math.round(cvImageMat.rows * scaleNewImage)));
  cvImageMat.delete();

  // get bottom image from resized transformed capture
  const bottomCanvas = document.createElement("canvas");
  bottomCanvas.width = resizedNewImage.cols;
  bottomCanvas.height = resizedNewImage.rows;
  cv.imshow(bottomCanvas, resizedNewImage);
  resizedNewImage.delete();

  stitchingAdjustmentParams = {
    svgWidth:canvasInput.width,
    svgHeight:canvasInput.height,
    imageBottomSrc:bottomCanvas.toDataURL(),
    imageBottomHeight:bottomCanvas.height,
    // top image comes from canvasInput
    imageTopSrc:canvasInput.toDataURL(),
    imageTopHeight:canvasInput.height
  };
  ScalableVectorGraphics.init(svgOverlay, canvasInput.width, canvasInput.height);
  ScalableVectorGraphics.imageComparisonSlider(svgOverlay, stitchingAdjustmentParams).
    then(async (params) => {
      await ScalableVectorGraphics.createMergedCanvas(canvasInput, params);
      svgOverlay.innerHTML = "";
      stitchingAdjustmentParams = null;
    });
}

async function mayValidateStitchingAdjustment()
{
  const clipHeight = ScalableVectorGraphics.findSvgComparisonSlider(svgOverlay);
  if (clipHeight)
  {
    await ScalableVectorGraphics.createMergedCanvas(canvasInput, { ...stitchingAdjustmentParams, clipHeight});
    svgOverlay.innerHTML = "";
    stitchingAdjustmentParams = null;
  }
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
    handleNextImageWithArucoMarkers(imgMat, currentContourPointsAndIds, arucoFirstStepScanMarkers);
    switchToImagePreviewMode();

    showStitchingAdjustmentSvgSlider(imgMat, currentContourPointsAndIds.fullAreaContourPoints);
  }
  else if (stitcher)
  {
    // generic pattern based stiching, better for images than text...
    ImageProcessing.stitch(stitcher, canvasInput, tempCanvas);
    switchToImagePreviewMode();
  }
  imgMat.delete();

}

async function rotateClockwise()
{
  await mayValidateStitchingAdjustment();

  ImageProcessing.rotate(canvasInput, true);
  mayDeskewWithArucoAndPrepareStitching();
}

async function rotateCounterClockwise()
{
  await mayValidateStitchingAdjustment();

  ImageProcessing.rotate(canvasInput, false);
  mayDeskewWithArucoAndPrepareStitching();
}

// process image with OCR and display PDF
async function imageToPdf()
{
  await mayValidateStitchingAdjustment();
  // prepare image by using contour points to deskey image
  let processedImg;
  if (currentContourPoints.length)
  {
    let imgMat = cv.imread(canvasInput);
    const cvImageMat = ImageProcessing.fourPointTransform(imgMat, currentContourPoints);
    imgMat.delete();
    // Display the result
    canvasInput.width = cvImageMat.cols;
    canvasInput.height = cvImageMat.rows;
    cv.imshow(canvasInput, cvImageMat);
    cvImageMat.delete();
  }
  processedImg = canvasInput.toDataURL("image/png");
  ScalableVectorGraphics.init(svgOverlay, canvasInput.width, canvasInput.height);
  ScalableVectorGraphics.startCharStreamAnimation(svgOverlay);
  const { data: { pdf } } = await OpticalCharacterRecognition.recognize(processedImg, imageOcrLangInput.value);
  ScalableVectorGraphics.stopCharStreamAnimation(svgOverlay);

  // Display PDF
  const pdfBlob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(pdfBlob);
  PdfView.openUrl(blobUrl);

  switchToPdfMode();
}

async function imageSave()
{
  await mayValidateStitchingAdjustment();

  canvasInput.toBlob(function(blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "capture.png";
    link.click();
  }, "image/png");
}

// Add event listener for text selection and trigger speach automatically
function speakSelectedText()
{
  if (voiceOption.checked && pageContainer.style.display != "none")
  {
    const selectedText = Utils.getSelectedText();
    if (selectedText && selectedText.length > 1)
    {
      tts.speak(selectedText, voiceLangInput.value);
    }
  }
  else
  {
    tts.interrupt();
  }
}