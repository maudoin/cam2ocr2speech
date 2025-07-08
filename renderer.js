const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const { createWorker } = Tesseract;

const pdfjsLib = window.pdfjsLib;

const loadOpenCv = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "./third-parties/docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.onload = () => {
      cv['onRuntimeInitialized'] = () => {
        console.log("OpenCV is initialized inside module");
        resolve();
      };
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

loadOpenCv().then(() => {
  onOpenCvReady();
});
// Override fetch globally to fix piper-tts-web loading issues
// Save original fetch if needed
const originalFetch = window.fetch;
window.fetch = async (url) => {
  let overridePath = null;
  if (typeof url === 'string')
  {
    if (url.startsWith("/piper/") || url.startsWith("/onnx/") || url.startsWith("/worker/")){
        overridePath = 'third-parties/piper-tts-web';
    }
    else if (url.startsWith("https://huggingface.co/rhasspy/piper-voices/resolve/main/")){
        url = url.substring("https://huggingface.co/rhasspy/piper-voices/resolve/main/".length);
        overridePath = 'tts_models';
    }
  };
  if (overridePath !== null) {
    console.log(`Intercepted fetch request for: ${url}`);
    const basePath = myAPI.joinPath(myAPI.dirname(), overridePath); // adjust as needed
    const fullPath = myAPI.joinPath(basePath, url);
    console.log(`Path resolved to: ${fullPath}`);

    return new Promise((resolve, reject) => {
      myAPI.readFile(fullPath, (err, data) => {
        if (err) {
          resolve(new Response(null, {
            status: 404,
            statusText: 'File Not Found'
          }));
        } else {
          resolve(new Response(data, {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': url.endsWith('.js')?'application/javascript' : 
                url.endsWith('.wasm')?'application/wasm':
                'application/octet-stream'
            }
          }));
        }
      });
    });
  }

  return originalFetch(url);
};
const { PiperWebEngine } = await import('./third-parties/piper-tts-web/piper-tts-web.js');
const engine = new PiperWebEngine();

const video = document.getElementById('video');
const scanBtn = document.getElementById('scanBtn');
const reScanBtn = document.getElementById('reScanBtn');
const canvasInput = document.getElementById('canvasInput');
const canvasOutput = document.getElementById('canvasOutput');
const ctxInput = canvasInput.getContext('2d');
const ctxOutput = canvasInput.getContext('2d');
const pdfViewer = document.getElementById('pdfViewer');
const textArea = document.getElementById('textArea');
const htmlOcr = document.getElementById('htmlOcr');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

function showScan() {
    video.style.display = 'block';
    scanBtn.style.display = 'block';
    reScanBtn.style.display = 'none';
    pdfViewer.style.display = 'none';
    pdfCanvas.style.display = 'none';
    htmlOcr.style.display = 'none';
    textArea.style.display = 'none';
}
function hideScan() {
    video.style.display = 'none';
    scanBtn.style.display = 'none';
    reScanBtn.style.display = 'block';
    pdfViewer.style.display = 'block';
    pdfCanvas.style.display = 'block';
    htmlOcr.style.display = 'block';
    textArea.style.display = 'block';
}

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

const readFromBlobOrFile = (blob) => (
    new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
        resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
        reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
    })
);

const recognize = async (image, langs, options, output) => {
const worker = await createWorker(langs, 1, options);
return worker.recognize(image, {}, output)
    .finally(async () => {
    await worker.terminate();
    });
};

function onOpenCvReady() {
    document.getElementById('scanBtn').onclick = async () => {
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
    let processedImg = canvasInput.toDataURL('image/png');
    
    // const worker = await createWorker('fra', 1, {legacyCore: true, legacyLang: true}
    //   workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
    //   langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    //   corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0',
    // });{
    // const result = await worker.detect(processedImg);
    // console.log(data);
    // }

    // const worker = await createWorker('fra', 1,  {
    //         langPath: './tessdata',
    //         gzip : false,
    //         logger: m => console.log(m),
    //         errorHandler: err => console.error(err)
    //     });
    // const { data: { text, pdf } } = worker.recognize(canvasInput.toBlob(async (blob) => {
    //   data = await readFromBlobOrFile(blob);
    //   resolve();
    // }),
    //       {pdfTitle: "Example PDF"}, { text: true, pdf: true }
    //     );
    //     // .finally(async () => {await worker.terminate();});

    const { data: { text, pdf, hocr } } = await recognize(processedImg, 'fra', {
            workerPath: './third-parties/tesseract.js@6.0.1/worker.min.js',
            langPath: './tessdata',
            corePath: './third-parties/tesseract.js@6.0.1',
            gzip : false,
            logger: m => console.log(m),
            errorHandler: err => console.error(err)
        },
        { text: true, pdf: true , hocr: true}
    );
    const pdfBlob = new Blob([new Uint8Array(pdf)], { type: 'application/pdf' });
    // await worker.terminate();

    // 4️⃣ Export to PDF with jsPDF
    // const { jsPDF } = window.jspdf;
    // const doc = new jsPDF();
    // doc.text(text, 10, 10);
    // // doc.save("scanned_document.pdf");
    // const pdfBlob = doc.output("blob");
    // 🔗 Create object URL
    const blobUrl = URL.createObjectURL(pdfBlob);


    // 5️⃣ Display PDF
    pdfViewer.src = blobUrl;
    pdfViewer.style.display = 'block';
    hideScan();

    // 6️⃣ Display text
    textArea.value =hocr;
    htmlOcr.innerHTML=hocr;

    // const loadingTask = pdfjsLib.getDocument(blobUrl);
    // loadingTask.promise.then(pdf => {
    // pdf.getPage(1).then(page => {
    //     const scale = 1.5;
    //     const viewport = page.getViewport({ scale });

    //     const canvas = document.getElementById('pdfCanvas');
    //     const context = canvas.getContext('2d');

    //     canvas.height = viewport.height;
    //     canvas.width = viewport.width;

    //     page.render({ canvasContext: context, viewport });
    // });
    // });

    };
}


async function speakWithPiper(text) {
    const voice = 'fr_FR-siwis-medium';
    const speaker = 0;
    engine.generate(text, voice, speaker).then((res) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(res.file);
        audio.play();
    });
}

document.addEventListener("mouseup", () => {
    const selectedText = getSelectedText();
    if (selectedText && selectedText.length > 1) {
        speakWithPiper(selectedText);
    }
});


function getSelectedText() {
    if (window.getSelection) {
    return window.getSelection().toString();
    } 
    else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}