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
    static detectContourPoints(canvas)
    {
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
        src.delete(); documentContour.delete();

        return contourPoints;
    }

    static sortPointClockwiseFromTopLeft(points)
    {
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

    // apply detected skewed sheet to the original image to get a straightened image
    // canvas: input canvas element with the image to be straightened
    // pts: array of 4 cv.Points in order [top-left, top-right, bottom-right, bottom-left]
    // return opencv image Mat instance of the straightened image
    static fourPointTransform(canvas, points)
    {
        const pts = ImageProcessing.sortPointClockwiseFromTopLeft(points);

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
}
// Assign static property and static method at the end
ImageProcessing.OPENCV_SRC_PATH = "../third-parties/docs.opencv.org/4.x/opencv.js";