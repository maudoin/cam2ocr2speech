export class ScalableVectorGraphics
{
    static updatePolygonAndCircle(svgElement, points, idx)
    {
        // Update polygon
        const poly = svgElement.querySelector("polygon");
        if (poly) {
            const newPointsStr = points.map(p => `${p.x},${p.y}`).join(" ");
            poly.setAttribute("points", newPointsStr);
        }

        // Update the specific circle
        const circle = svgElement.querySelector(`circle[data-idx="${idx}"]`);
        if (circle) {
            const point = points[idx];
            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
        }
    }

    static init(svgElement, originalWidth, originalHeight)
    {
        svgElement.innerHTML = ""; // Clear previous

        svgElement.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);
        svgElement.setAttribute("preserveAspectRatio", "xMidYMin meet");
    }

    // Display points in svg overlay
    static setupEditablePoints(svgElement, points, originalWidth, originalHeight)
    {
        // Draw polygon
        const poly = document.createElementNS(ScalableVectorGraphics.NS, "polygon");
        poly.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));
        poly.setAttribute("fill", "rgba(0,255,0,0.2)");
        poly.setAttribute("stroke", "lime");
        poly.setAttribute("stroke-width", 2);
        svgElement.appendChild(poly);

        // Drag logic
        let draggingIdx = null;

        function onPointerMove(evt) {
            if (draggingIdx !== null) {
                // Calculate mouse position relative to SVG

                // 1) Create an SVGPoint in screen pixels.
                const pt = svgElement.createSVGPoint();
                pt.x = evt.clientX;
                pt.y = evt.clientY;

                // 2) Grab the current screen-to-SVG matrix
                const CTM = svgElement.getScreenCTM();

                // 3) Invert it and transform the point
                const svgP = pt.matrixTransform(CTM.inverse());

                points[draggingIdx].x = Math.max(0, Math.min(originalWidth, svgP.x));
                points[draggingIdx].y = Math.max(0, Math.min(originalHeight, svgP.y));

                // 4) apply coordinates
                ScalableVectorGraphics.updatePolygonAndCircle(svgOverlay, points, draggingIdx);
            }
        }

        function onPointerUp() {
            draggingIdx = null;
            svgElement.removeEventListener("pointermove", onPointerMove);
            svgElement.removeEventListener("pointerup", onPointerUp);
        }

        // Draw draggable points
        points.forEach((p, idx) => {
            const circle = document.createElementNS(ScalableVectorGraphics.NS, "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", 4);
            circle.setAttribute("fill", "yellow");
            circle.setAttribute("stroke", "orange");
            circle.setAttribute("stroke-width", 2);
            circle.style.cursor = "pointer";
            circle.setAttribute("data-idx", idx);
            circle.style.pointerEvents = "auto";

            // Add drag events
            circle.addEventListener("pointerdown", function(e) {
                draggingIdx = idx;
                svgElement.addEventListener("pointermove", onPointerMove);
                svgElement.addEventListener("pointerup", onPointerUp);
                e.preventDefault();
                e.stopPropagation();
            });

            svgElement.appendChild(circle);
        });
        svgElement.style.pointerEvents = "auto";
    }


    static drawArrows(svgElement, lines, headLength)
    {
        // Draw lines to corners
        lines.forEach((l, idx) =>
        {
            const a = l.start;
            const b = l.end;
            const line = document.createElementNS(ScalableVectorGraphics.NS, "line");
            line.setAttribute("x1", a.x);
            line.setAttribute("y1", a.y);
            line.setAttribute("x2", b.x);
            line.setAttribute("y2", b.y);
            line.setAttribute("stroke", "green");
            line.setAttribute("stroke-width", "10");
            svgElement.appendChild(line);

            const polyPoints = [
                { x: b.x+headLength*(1-2*(a.x<b.x)), y: b.y },
                b,
                { x: b.x, y: b.y+headLength*(1-2*(a.y<b.y)) }
            ];

            const polyline = document.createElementNS(ScalableVectorGraphics.NS, "polyline");
            const pointsAttr = polyPoints.map(p => `${p.x},${p.y}`).join(" ");

            polyline.setAttribute("points", pointsAttr);
            polyline.setAttribute("fill", "none");
            polyline.setAttribute("stroke", "green");
            polyline.setAttribute("stroke-width", "10");
            svgElement.appendChild(polyline);
        });
    }
    static drawPolylinesAndText(svgElement, textPoints, indexToText, textHeight, color, polylines)
    {
        if (textPoints)
        {
            textPoints.forEach((p, idx)=>{
                const textElem = document.createElementNS(ScalableVectorGraphics.NS, "text");
                textElem.setAttribute("x", p.x);
                textElem.setAttribute("y", p.y);
                textElem.setAttribute("font-size", textHeight);
                textElem.setAttribute("fill", color);
                textElem.setAttribute("text-anchor", "middle"); // Center horizontally
                textElem.setAttribute("dominant-baseline", "middle"); // Center vertically
                textElem.textContent = indexToText(idx);
                svgElement.appendChild(textElem);
            });
        }
        if (polylines)
        {
            polylines.forEach((points, idx)=>{

                // Draw polygon
                const poly = document.createElementNS(ScalableVectorGraphics.NS, "polygon");
                poly.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));
                poly.setAttribute("fill", "rgba(0,255,0,0.2)");
                poly.setAttribute("stroke", "lime");
                poly.setAttribute("stroke-width", 2);
                svgElement.appendChild(poly);

            });
        }
    }
}

ScalableVectorGraphics.NS = "http://www.w3.org/2000/svg";