import { CatmullRomSpline } from "./CatmullRomSpline.js";

export class ImageProcessing
{
    // import opencv asynchronously
    static asyncImport()
    {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = ImageProcessing.OPENCV_SRC_PATH;
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
    }

    // Read the image from the canvas and perform skewed sheet detection
    static detectContourPoints(imgMat)
    {
        let gray = new cv.Mat();
        let blur = new cv.Mat();
        let threshold = new cv.Mat();

        cv.cvtColor(imgMat, gray, cv.COLOR_RGBA2GRAY, 0);
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
                    // console.log(cnt.rows + " --filtered-> " + points.length);
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
        documentContour.delete();

        return contourPoints;
    }

    static sortedPointClockwiseFromTopLeft(w, h)
    {
        return [{x:0, y:0},
             {x:w - 1, y:0},
             {x:w - 1, y:h - 1},
             {x:0, y:h - 1}];
    }

    static sortPointClockwiseFromTopLeft(points)
    {
        if (points && points.length === 0)
        {
            return points;
        }
        // Compute squared distance to (0, 0)
        const getSquaredDistanceToOrigin = p => p.x * p.x + p.y * p.y;
        // Find the top-left point : closest to (0, 0)
        const topLeft = points.reduce((acc, p) =>
            getSquaredDistanceToOrigin(p) < getSquaredDistanceToOrigin(acc) ? p : acc);

        const barycenter = points.reduce(
            (acc, p) => ({
                x: acc.x + p.x / points.length,
                y: acc.y + p.y / points.length
            }),
            { x: 0, y: 0 });

        // Add Clockwise Angle from barycenter of each point
        // Compute angle from middle left location (180°)
        // Subtract tan restult because we want clockwise
        const pointsWithAndgle = points.map(p => ({
            ...p,
            angle: 180 - 180*Math.atan2(p.y - barycenter.y, p.x - barycenter.x)/Math.PI
        }));
        // Sort by Angle
        const sortedPoints = pointsWithAndgle.sort((a, b) => b.angle - a.angle);

        const topLeftIndex = sortedPoints.findIndex(
            p => p.x === topLeft.x && p.y === topLeft.y
        );

        // Spread to combine points from topLeftIndex to the point right before topLeftIndex
        const pointsFromTopLeft = [
            // Take all points from topLeftIndex to the end of the array.
            ...sortedPoints.slice(topLeftIndex),
            // Take all points from the start of the array up to (but not including) topLeftIndex
            ...sortedPoints.slice(0, topLeftIndex)
        ];
        return pointsFromTopLeft;
    }


    /**
     * Crop imgMat to the axis-aligned rectangle defined by any two corner points.
     * @param {cv.Mat} imgMat                Source image
     * @param {[{x:number,y:number},{x:number,y:number}]} pts
     *        Two points (top-left and bottom-right in any order)
     * @returns {cv.Mat}                     A new Mat containing the cropped region
     */
    static cropFromTwoPoints(imgMat, pts) {
      if (!Array.isArray(pts) || pts.length !== 2) {
        throw new Error("cropFromTwoPoints requires an array of exactly two points");
      }

      // 1) Compute min/max
      const x0 = Math.min(pts[0].x, pts[1].x);
      const y0 = Math.min(pts[0].y, pts[1].y);
      const x1 = Math.max(pts[0].x, pts[1].x);
      const y1 = Math.max(pts[0].y, pts[1].y);

      // 2) Round to int and clamp inside image bounds
      const x = Math.max(0, Math.floor(x0));
      const y = Math.max(0, Math.floor(y0));
      const w = Math.min(imgMat.cols  - x, Math.ceil(x1) - x);
      const h = Math.min(imgMat.rows  - y, Math.ceil(y1) - y);

      if (w <= 0 || h <= 0) {
        throw new Error("Invalid crop rectangle: zero or negative area");
      }

      // 3) Extract ROI and clone to a new Mat
      const roiRect = new cv.Rect(x, y, w, h);
      const roiMat  = imgMat.roi(roiRect);
      const cropped = roiMat.clone();

      // 4) Cleanup and return
      roiMat.delete();
      return cropped;
    }

    // apply detected skewed sheet to the original image to get a straightened image
    // canvas: input canvas element with the image to be straightened
    // points: array of 4 cv.Points in order [top-left, top-right, bottom-right, bottom-left]
    // sortInput: true for sort points before processing
    // return opencv image Mat instance of the straightened image
    static fourPointTransform(imgMat, points, sortInput = true)
    {
        const pts = sortInput ? ImageProcessing.sortPointClockwiseFromTopLeft(points) : points;

        // Compute width and height of the new image
        const widthA = Math.hypot(pts[2].x - pts[3].x, pts[2].y - pts[3].y);
        const widthB = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const maxWidth = Math.max(widthA, widthB);

        const heightA = Math.hypot(pts[1].x - pts[2].x, pts[1].y - pts[2].y);
        const heightB = Math.hypot(pts[0].x - pts[3].x, pts[0].y - pts[3].y);
        const maxHeight = Math.max(heightA, heightB);

        // Destination points for warped image (clockwise from top left)
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
        // Apply warp
        const dst = new cv.Mat();
        cv.warpPerspective(imgMat, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

        // Cleanup
        M.delete();
        return dst;
    }

    /**
     * Given pts[0…m−1], returns linear interp at t∈[0,1].
     */
    static lerpAlong(pts, t) {
        const m = pts.length;
        if (t <= 0) return pts[0];
        if (t >= 1) return pts[m-1];
        const idx = Math.floor(t * (m - 1));
        const u   = (t * (m - 1)) - idx;
        const p0  = pts[idx], p1 = pts[idx + 1];
        return {
            x: p0.x + (p1.x - p0.x) * u,
            y: p0.y + (p1.y - p0.y) * u
        };
    }

    // Helper: polyline length
    // @param {{x:number,y:number}[]} pts
    static polylineLength(pts) {
        let len = 0;
        for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        len += Math.hypot(dx, dy);
        }
        return len;
    }

    // Distance between corresponding points
    static dist(p, q) {
        return Math.hypot(p.x - q.x, p.y - q.y);
    }

    /**
     * Unwarps a curved page by straightening top/bottom polylines
     * into horizontal lines using per-point target X coordinates.
     * It builds a pixel-wise mapping from the distorted image to a rectified one.
     *
     * @param {cv.Mat} src - The input image (e.g., a scanned curved page).
     * @param {{x,y}[]} topPts - Array of points along the top edge of the page (from getTopAndBottomLinesFromArucoMarkers).
     * @param {{x,y}[]} botPts - Array of points along the bottom edge of the page (from getTopAndBottomLinesFromArucoMarkers).
     * @param {number[]} xTargets - Desired horizontal positions for each edge point (from getTopAndBottomLinesFromArucoMarkers).
     * @param {int} [inter=cv.INTER_LINEAR] - Interpolation method for remapping.
     * @param {int} [bMode=cv.BORDER_CONSTANT] - Border mode for remapping.
     * @returns {cv.Mat} - The output image with straightened content.
     */
    static unwarpWithPerPixelMap(
        src,
        topPts,
        botPts,
        xTargets,
        inter = cv.INTER_LINEAR,
        bMode = cv.BORDER_CONSTANT
        )
    {
        const N = topPts.length;

        // Validate input: all arrays must be of equal length and contain at least 2 points
        if (
            N < 2 ||
            botPts.length !== N ||
            xTargets.length !== N
        ) {
            throw new Error(
            'Need equal-length ≥2 arrays: topPts, botPts, xTargets'
            );
        }

        // Determine the width of the output image based on the last target X coordinate
        const dstW = Math.ceil(xTargets[N - 1]);

        // Estimate the output image height using the vertical distance between
        // the top and bottom edge points at the start and end of the page
        const h0 = ImageProcessing.dist(topPts[0], botPts[0]);       // height at left edge
        const h1 = ImageProcessing.dist(topPts[N - 1], botPts[N - 1]); // height at right edge
        const dstH = Math.ceil(Math.max(h0, h1)); // use the larger of the two for uniform height

        // Create two maps to store the source coordinates for each pixel in the output image
        const mapX = new cv.Mat(dstH, dstW, cv.CV_32FC1); // stores X coordinates
        const mapY = new cv.Mat(dstH, dstW, cv.CV_32FC1); // stores Y coordinates

        // Helper function to interpolate between two points
        function lerpPt(p0, p1, t) {
            return {
                x: p0.x + (p1.x - p0.x) * t,
                y: p0.y + (p1.y - p0.y) * t
            };
        }

        // build an array of all segment‐lengths
        const segCount   = N - 1;
        const lenTopsAll = new Array(segCount);
        const lenBotsAll = new Array(segCount);
        for (let idx = 0; idx < segCount; idx++) {
            lenTopsAll[idx] = ImageProcessing.dist(topPts[idx],    topPts[idx + 1]);
            lenBotsAll[idx] = ImageProcessing.dist(botPts[idx],    botPts[idx + 1]);
        }

        // First & last lengths
        const lenTopFirst = lenTopsAll[0];
        const lenTopLast  = lenTopsAll[segCount - 1];
        const lenBotFirst = lenBotsAll[0];
        const lenBotLast  = lenBotsAll[segCount - 1];

        // Full horizontal span (often xTargets[0]==0, but we generalize)
        const xMin = xTargets[0];
        const xMax = xTargets[N - 1];

        // Loop over each column in the output image
        for (let i = 0; i < dstW; i++) {
            // 1. Find the segment index k such that xTargets[k] ≤ i < xTargets[k+1]
            let k = 0;
            while ( k + 1 < N && xTargets[k + 1] < i ) {
                k++;
            }

            // 2. Compute interpolation factor α between xTargets[k] and xTargets[k+1]
            const t0 = xTargets[k];
            const t1 = xTargets[k + 1];
            const alpha = (i - t0) / (t1 - t0); // normalized position between two edge points

            // 3. Interpolate top and bottom edge points at column i
            const top = lerpPt(topPts[k], topPts[k + 1], alpha); // top edge point at column i
            const bot = lerpPt(botPts[k], botPts[k + 1], alpha); // bottom edge point at column i

            // lengths of the two horizontal segments in the source image
            // 4. Inside your `for (let i …)` loop, before the `for (let j…)`:
            const tGlobal = xMax > xMin
            ? (i - xMin) / (xMax - xMin)
            : 0;                // clamp to [0,1] if needed
            // interpolate top/bottom lengths for column i
            const lenTop_i = lenTopFirst + (lenTopLast  - lenTopFirst) * tGlobal;
            const lenBot_i = lenBotFirst + (lenBotLast  - lenBotFirst) * tGlobal;

            // 5. For each row in this column, interpolate between top and bottom edge
            for (let j = 0; j < dstH; j++) {

                // normalized vertical pos
                const s = dstH > 1 ? j/(dstH-1) : 0;

                // compute 1/length weights
                const wTop = (1 - s) / lenTop_i;
                const wBot =        s   / lenBot_i;
                const W    = wTop + wBot;

                // source‐pixel coordinates
                const srcX = (top.x * wTop + bot.x * wBot) / W;
                const srcY = (top.y * wTop + bot.y * wBot) / W;

                mapX.floatPtr(j, i)[0] = srcX;
                mapY.floatPtr(j, i)[0] = srcY;
            }
        }

        // Create an empty matrix to hold the output image
        const dstMat = new cv.Mat();

        // Apply the remap using the computed source coordinates
        cv.remap(
            src,        // input image
            dstMat,     // output image
            mapX,       // map of X coordinates
            mapY,       // map of Y coordinates
            inter,      // interpolation method
            bMode,      // border mode
            new cv.Scalar() // fill value for borders (default: black)
        );

        // Free memory used by remap matrices
        mapX.delete();
        mapY.delete();

        // Return the rectified image
        return dstMat;

    }


    static rotate(canvas, clockwise)
    {
        // Temp canvas with swapped dimensions
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;

        // Apply rotation inside temp canvas
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.save();
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((clockwise ? 1 : -1) * Math.PI / 2);
        tempCtx.translate(-tempCanvas.height / 2, -tempCanvas.width / 2);
        tempCtx.drawImage(canvas, 0, 0);
        tempCtx.restore();

        // Resize original canvas and copy back
        canvas.width = tempCanvas.width;
        canvas.height = tempCanvas.height;
        const ctx = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.drawImage(tempCanvas, 0, 0);
    }

    static prepareStitch(targetCanvas)
    {

      const orb = new cv.ORB(1000, 2, 8);
      //im1 is the reference image we are trying to align
      const im = cv.imread(targetCanvas, cv.IMREAD_GRAYSCALE);

      // Variables to store keypoints and descriptors
      let refKeypoints = new cv.KeyPointVector();
      let refDescriptors = new cv.Mat();

      // Detect ORB features and compute descriptors.
      const mask = new cv.Mat();
      orb.detectAndCompute(im, mask, refKeypoints, refDescriptors);
      mask.delete();
      im.delete();

      return {orb:orb, refKeypoints:refKeypoints, refDescriptors: refDescriptors};
    }

    // given a prepared stiching process, update a target canvas with a new (finer) canvas to overlay
    static stitch(stitcher, targetCanvas, sourceToAdd)
    {
        const addedKeypoints = new cv.KeyPointVector();
        const addedDescriptors = new cv.Mat();

        const mask = new cv.Mat();
        const addedIm = cv.imread(sourceToAdd, cv.IMREAD_GRAYSCALE);
        // 23.2% of total compute time
        stitcher.orb.detectAndCompute(addedIm, mask, addedKeypoints, addedDescriptors);
        mask.delete();

        // Match features.
        const bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
        const matches = new cv.DMatchVector();
        // 47.8% of total compute time
        bf.match(stitcher.refDescriptors, addedDescriptors, matches);
        bf.delete();

        // Suppose you have multiple DMatchVector objects

        // Sort matches by score
        const goodMatches = new cv.DMatchVector();
        const refPoints = [];
        const addedPoints = [];
        for (let i = 0; i < matches.size(); i++) {
            const match = matches.get(i);
            if (match.distance < 50) {
                goodMatches.push_back(match);
                refPoints.push(stitcher.refKeypoints.get(match.queryIdx).pt.x);
                refPoints.push(stitcher.refKeypoints.get(match.queryIdx).pt.y);
                addedPoints.push(addedKeypoints.get(match.trainIdx).pt.x);
                addedPoints.push(addedKeypoints.get(match.trainIdx).pt.y);
            }
        }

        let refIm = cv.imread(targetCanvas);
        const matchesIm = new cv.Mat();
        cv.drawMatches(refIm,stitcher.refKeypoints,addedIm,addedKeypoints,goodMatches, matchesIm);
        goodMatches.delete();

        // const FLANN_INDEX_KDTREE = 0
        // const index_params = {algorithm : FLANN_INDEX_KDTREE, trees : 5};
        // const search_params = {checks:50};
        // const flann = new cv.FlannBasedMatcher(index_params,search_params);
        // const matchesV = flann.knnMatch(stitcher.refDescriptors,addedDescriptors,2);
        // cv.drawMatchesKnn(refIm,stitcher.refKeypoints,addedIm,addedKeypoints,matchesV, matchesIm);

        const viewCanvas = document.createElement("canvas");
        viewCanvas.width = matchesIm.rows;
        viewCanvas.height = matchesIm.cols;
        viewCanvas.id = "stiching";
        const existingStichingCanvas = document.getElementById(viewCanvas.id);
        if (existingStichingCanvas && existingStichingCanvas.parentElement?.id === "preview") {
            existingStichingCanvas.remove();
        }
        document.getElementById("preview").appendChild(viewCanvas);
        cv.imshow(viewCanvas, matchesIm);
        matchesIm.delete();

        addedKeypoints.delete();
        addedDescriptors.delete();
        addedIm.delete();

        // Find homography
        const refMat = cv.matFromArray(refPoints.length, 2, cv.CV_32F, refPoints);
        const addedMat = cv.matFromArray(addedPoints.length, 2, cv.CV_32F, addedPoints);
        const homography = cv.findHomography(addedMat, refMat, cv.RANSAC);
        refMat.delete();
        addedMat.delete();

        const transformedSourcePolygon = ImageProcessing.transformRect(sourceToAdd.width, sourceToAdd.height, homography);
        const transformedSourcePolygonArea = ImageProcessing.polygonArea(transformedSourcePolygon) ;
        const areaRatio = transformedSourcePolygonArea / targetCanvas.width * targetCanvas.height;
        const areaThreshold = 0.1;
        // isFractional rectangle?
        if (( areaRatio <0.7/*> areaThreshold /*&& areaRatio < (1.+areaThreshold)*/) &&
            ImageProcessing.isRectLikeQuadrilateral(transformedSourcePolygon))
        {
            // we assume both the consecutively stiched images have all the same size
            // we want the added image resolution to be preseved so we have to scale the target if
            // the transformed polygone is smaller than the added image
            const requiredTargetScaling = Math.sqrt((sourceToAdd.width * sourceToAdd.height) / transformedSourcePolygonArea);
            if (requiredTargetScaling > (1+areaThreshold))
            {
                console.log("Scaling target canvas image by "+requiredTargetScaling);
            //     // Scale homography from old size to normalized
            //     let scaleDown = cv.matFromArray(3, 3, cv.CV_64F, [
            //     1 / targetCanvas.width, 0, 0,
            //     0, 1 / targetCanvas.height, 0,
            //     0, 0, 1
            //     ]);
            //     let normalizeHomography = new cv.Mat();
            //     cv.gemm(homography, scaleDown, 1, new cv.Mat(), 0, normalizeHomography);
            //     scaleDown.delete();

                // // scale the target image
                // // targetCanvas.width = targetCanvas.width*requiredTargetScaling;
                // // targetCanvas.height = targetCanvas.height*requiredTargetScaling;
                // let dst = new cv.Mat();
                // let newSize = new cv.Size(targetCanvas.width*requiredTargetScaling, targetCanvas.height*requiredTargetScaling);
                // cv.resize(refIm, dst, newSize, 0, 0, cv.INTER_LINEAR);
                // // make refIm point to dst
                // refIm.delete();
                // refIm = dst;

            //     // Scale up to new canvas
            //     let scaleUp = cv.matFromArray(3, 3, cv.CV_64F, [
            //     targetCanvas.width, 0, 0,
            //     0, targetCanvas.height, 0,
            //     0, 0, 1
            //     ]);
            //     cv.gemm(scaleUp, normalizeHomography, 1, new cv.Mat(), 0, homography);
            //     scaleUp.delete();
            }
            // Use homography to warp added image
            const warpedIm = new cv.Mat();
            const colorAddedIm = cv.imread(sourceToAdd);
            const dsize = warpedIm.size();
            cv.warpPerspective(colorAddedIm, warpedIm, homography, dsize);
            colorAddedIm.delete();

            // add to target canvas

            // Ensure overlay has 4 channels (RGBA)
            if (warpedIm.channels() !== 4) {
                cv.cvtColor(warpedIm, warpedIm, cv.COLOR_RGB2RGBA);
            }

            // Split channels to extract alpha
            let rgba = new cv.MatVector();
            cv.split(warpedIm, rgba);
            let alpha = rgba.get(3); // Alpha channel becomes the mask

            // Use copyTo with the alpha mask
            warpedIm.copyTo(refIm, alpha);
            warpedIm.delete();

            cv.imshow(targetCanvas, refIm);
        }
        // else
        {
            console.log("ignoring input image for stiching, could not find proper matches for transformation:"+
                ImageProcessing.angleBetween(transformedSourcePolygon[3], transformedSourcePolygon[0], transformedSourcePolygon[1])+","+
                ImageProcessing.angleBetween(transformedSourcePolygon[0], transformedSourcePolygon[1], transformedSourcePolygon[2])+","+
                ImageProcessing.angleBetween(transformedSourcePolygon[1], transformedSourcePolygon[2], transformedSourcePolygon[3])+","+
                ImageProcessing.angleBetween(transformedSourcePolygon[2], transformedSourcePolygon[3], transformedSourcePolygon[0])+"; "+ 
                " transformedSourcePolygonArea:"+transformedSourcePolygonArea +
                " targetArea:" + (targetCanvas.width * targetCanvas.height) +
                " areaRatio:" + areaRatio
            );
        }
        homography.delete();
    }

    // use shoelace formula to compute a polygon area given it's points
    static polygonArea(points) {
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].x * points[j].y - points[j].x * points[i].y;
        }
        return Math.abs(area / 2);
    }

    static maxXDistance(points) {
        if (points.length < 2) return 0;

        let maxDistance = 0;

        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length]; // wraps around to first

            const distance = Math.abs(next.x - current.x);
            if (distance > maxDistance) {
            maxDistance = distance;
            }
        }
        return maxDistance;
    }

    static averageSquaredDistance(pointsA, pointsB) {
        if (!pointsA || ! pointsB || pointsA.length !== pointsB.length) {
            return Number.MAX_SAFE_INTEGER;
        }
        let totalSquaredDistance = 0;
        for (let i = 0; i < pointsA.length; i++) {
            const {x:x1, y:y1} = pointsA[i];
            const {x:x2, y:y2} = pointsB[i];

            const dx = x2 - x1;
            const dy = y2 - y1;

            totalSquaredDistance += dx * dx + dy * dy;
        }
        return totalSquaredDistance / pointsA.length;
    }

    // compute angle between two polygon edges defines by 3 points (2nd is common vertex)
    static angleBetween(p1, p2, p3) {
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x**2 + v1.y**2);
        const mag2 = Math.sqrt(v2.x**2 + v2.y**2);
        const cosTheta = dot / (mag1 * mag2);
        const angle = Math.acos(cosTheta) * (180 / Math.PI);
        return angle;
    }

    // compute polygon points of a given rect transformed by an homography
    static transformRect(w, h, homography)
    {
        const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            w - 1, 0,
            w - 1, h - 1,
            0, h - 1
        ]);
        let dstPoints = new cv.Mat();
        cv.perspectiveTransform(srcPoints, dstPoints, homography);
        let transformed = [];
        for (let i = 0; i < 4; i++) {
            transformed.push({
                x: dstPoints.data32F[i * 2],
                y: dstPoints.data32F[i * 2 + 1]
            });
        }
        srcPoints.delete();
        dstPoints.delete();

        return transformed;
    }

    // tell if the input quadrilateral points are defining a rectangle
    static isRectLikeQuadrilateral(quadrilateral, anglesThreshold = 10)
    {
        const angles = [
            ImageProcessing.angleBetween(quadrilateral[3], quadrilateral[0], quadrilateral[1]),
            ImageProcessing.angleBetween(quadrilateral[0], quadrilateral[1], quadrilateral[2]),
            ImageProcessing.angleBetween(quadrilateral[1], quadrilateral[2], quadrilateral[3]),
            ImageProcessing.angleBetween(quadrilateral[2], quadrilateral[3], quadrilateral[0])
        ];
        return angles.every(a => Math.abs(a - 90) < anglesThreshold);
    }


    // points = array of {x, y}, e.g. [{x: 1, y: 2}, {x: 4, y: 5}, ...]
    static computeBoundingBox(points)
    {
        let minX = Math.min(...points.map(p => p.x));
        let maxX = Math.max(...points.map(p => p.x));
        let minY = Math.min(...points.map(p => p.y));
        let maxY = Math.max(...points.map(p => p.y));

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    // Return found markers in instance like:
    // [
    //   { id: 17, corners: [ {x, y}, {x, y}, {x, y}, {x, y} ] },
    //   ...
    // ]
    // points are sorted clockwise from top left
    static detectAruco(image)
    {
        let dictionary = cv.getPredefinedDictionary(cv.DICT_5X5_100);
        let detectorParams = new cv.aruco_DetectorParameters();
        let refineParams = new cv.aruco_RefineParameters(10, 3, true);
        let detector = new cv.aruco_ArucoDetector(dictionary, detectorParams, refineParams);

        let corners = new cv.MatVector();
        let ids = new cv.Mat();
        detector.detectMarkers(image, corners, ids);

        let markers = [];
        for (let i = 0; i < corners.size(); i++) {
            let corner = corners.get(i);
            let id = ids.intPtr(i)[0];

            let markerCorners = [];
            for (let j = 0; j < 4; j++) {
                let x = corner.data32F[j * 2];
                let y = corner.data32F[j * 2 + 1];
                markerCorners.push({x:x, y:y});
            }

            // const bbox = ImageProcessing.computeBoundingBox(markerCorners);
            // let roi = image.roi(new cv.Rect(bbox.x, bbox.y, bbox.width, bbox.height));
            // let laplacian = new cv.Mat();
            // cv.Laplacian(roi, laplacian, cv.CV_64F);

            // let mean = new cv.Mat();
            // let stddev = new cv.Mat();
            // cv.meanStdDev(laplacian, mean, stddev);

            // let variance = stddev.doubleAt(0, 0) ** 2;
            // laplacian.delete();
            // mean.delete();
            // stddev.delete();
            // roi.delete();  // If you created a region of interest Mat

            let centerX = (corner.data32F[0] + corner.data32F[2] + corner.data32F[4] + corner.data32F[6]) / 4;
            let centerY = (corner.data32F[1] + corner.data32F[3] + corner.data32F[5] + corner.data32F[7]) / 4;
            markers.push({ id: id, corners: markerCorners, x:centerX, y:centerY/*, variance*/ });

        }
        corners.delete(); ids.delete();
        return  ImageProcessing.sortPointClockwiseFromTopLeft(markers);
    }

    static drawArucoToImageMat(imageMat, markers)
    {
        // Draw each marker manually
        for (let i = 0; i < markers.length; i++) {
            const m = markers[i];
            const corners = m.corners;
            for (let j = 0; j < corners.length; j++) {
                // Draw marker border
                let pt1 = new cv.Point(corners[j].x, corners[j].y);
                const other = ((j + 1) % corners.length);
                let pt2 = new cv.Point(corners[other].x, corners[other].y);
                cv.line(imageMat, pt1, pt2, new cv.Scalar(0, 0, 255), 2);
            }
            // Draw marker ID
            cv.putText(imageMat, i + ":" + m.id.toString(), new cv.Point(m.x, m.y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(0, 0, 255), 2);
        }
    }

    /**  @returns {polygonTop, polygonBottom, polygonX} usable with unwarpWithPerPixelMap */
    static getTopAndBottomLinesFromArucoMarkers(markers)
    {
        if (markers && markers.length >= 6)
        {
            let polygonTop = [];
            let polygonBottom = [];
            let markersSortedCorners = markers.map((m)=>ImageProcessing.sortPointClockwiseFromTopLeft(m.corners));
            const n = markers.length %2 === 0 ? markers.length/2 : (markers.length-1)/2;
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

    /**
     * Appends newImageMat to the canvas, either below or to the right.
     * Optionally preserves canvas size in the stacking direction.
     *
     * @param {cv.Mat} newImageMat
     * @param {HTMLCanvasElement} canvas
     * @param {"bottom"|"right"} [position="bottom"]
     * @param {boolean} [preserveCanvasSize=false]
     */
    static addCvMatToCanvas(newImageMat, canvas, position = "bottom", preserveCanvasSize = false) {
        const ctx = canvas.getContext("2d");

        // 1) Get canvas content as cv.Mat
        const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const canvasMat = cv.matFromImageData(canvasImageData);

        const resizedCanvas = new cv.Mat();
        const resizedNew    = new cv.Mat();

        let finalWidth, finalHeight;

        if (position === "bottom") {
            const targetWidth = preserveCanvasSize ? canvas.width : Math.max(canvas.width, newImageMat.cols);

            // Resize canvas to target width
            const canvasScale = targetWidth / canvas.width;
            const newScale    = targetWidth / newImageMat.cols;

            cv.resize(canvasMat, resizedCanvas,
                new cv.Size(targetWidth, Math.round(canvas.height * canvasScale)));

            cv.resize(newImageMat, resizedNew,
                new cv.Size(targetWidth, Math.round(newImageMat.rows * newScale)));

            finalWidth  = targetWidth;
            finalHeight = resizedCanvas.rows + resizedNew.rows;

        } else if (position === "right") {
            const targetHeight = preserveCanvasSize ? canvas.height : Math.max(canvas.height, newImageMat.rows);

            // Resize canvas to target height
            const canvasScale = targetHeight / canvas.height;
            const newScale    = targetHeight / newImageMat.rows;

            cv.resize(canvasMat, resizedCanvas,
                new cv.Size(Math.round(canvas.width * canvasScale), targetHeight));

            cv.resize(newImageMat, resizedNew,
                new cv.Size(Math.round(newImageMat.cols * newScale), targetHeight));

            finalWidth  = resizedCanvas.cols + resizedNew.cols;
            finalHeight = targetHeight;

        } else {
            throw new Error(`Unsupported position "${position}". Use "bottom" or "right".`);
        }

        // 2) Create final Mat and copy both parts
        const finalMat = new cv.Mat();
        finalMat.create(finalHeight, finalWidth, cv.CV_8UC4);

        const roiCanvas = finalMat.roi(new cv.Rect(0, 0, resizedCanvas.cols, resizedCanvas.rows));
        resizedCanvas.copyTo(roiCanvas);
        roiCanvas.delete();

        const xOffset = position === "right" ? resizedCanvas.cols : 0;
        const yOffset = position === "bottom" ? resizedCanvas.rows : 0;
        const roiNew = finalMat.roi(new cv.Rect(xOffset, yOffset, resizedNew.cols, resizedNew.rows));
        resizedNew.copyTo(roiNew);
        roiNew.delete();

        // 3) Resize canvas and display
        canvas.width  = finalWidth;
        canvas.height = finalHeight;
        cv.imshow(canvas, finalMat);

        // 4) Cleanup
        canvasMat.delete();
        resizedCanvas.delete();
        resizedNew.delete();
        finalMat.delete();
    }


}
// Assign static property and static method at the end
ImageProcessing.OPENCV_SRC_PATH = "../third-parties/docs.opencv.org/4.x/opencv.js";