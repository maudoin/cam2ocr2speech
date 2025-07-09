export class ScalableVectorGraphics
{

    // Display points in svg overlay
    static setupEditablePoints(svgElement, points, originalWidth, originalHeight)
    {
        svgElement.innerHTML = ""; // Clear previous

        svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMin meet');

        // const rect   = document.createElementNS(ScalableVectorGraphics.NS, 'rect');
        // rect.setAttribute('x',              0);
        // rect.setAttribute('y',              0);
        // rect.setAttribute('width',          originalWidth);
        // rect.setAttribute('height',         originalHeight);
        // rect.setAttribute('fill',           'rgba(255,0,0,0.2)');      // 20% red fill
        // rect.setAttribute('stroke',         'rgba(255,0,0,0.8)');      // 80% red border
        // rect.setAttribute('stroke-width',   20);
        // rect.setAttribute('vector-effect',  'non-scaling-stroke');
        // svgElement.appendChild(rect);

        // Draw polygon
        const poly = document.createElementNS(ScalableVectorGraphics.NS, "polygon");
        poly.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));
        poly.setAttribute("fill", "rgba(0,255,0,0.2)");
        poly.setAttribute("stroke", "lime");
        poly.setAttribute("stroke-width", 2);
        svgElement.appendChild(poly);

        // Drag logic
        let draggingIdx = null;

        function onPointerMove(e) {
            if (draggingIdx !== null) {
            // Calculate mouse position relative to SVG
            const svgRect = svgElement.getBoundingClientRect();
            const x = e.clientX - svgRect.left;
            const y = e.clientY - svgRect.top;
            points[draggingIdx].x = Math.max(0, Math.min(originalWidth, x));
            points[draggingIdx].y = Math.max(0, Math.min(originalHeight, y));
            ScalableVectorGraphics.setupEditablePoints(svgOverlay, points); // Redraw
            }
        }

        function onPointerUp() {
            draggingIdx = null;
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        }

        // Draw draggable points
        points.forEach((p, idx) => {
            const circle = document.createElementNS(ScalableVectorGraphics.NS, "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", 8);
            circle.setAttribute("fill", "yellow");
            circle.setAttribute("stroke", "orange");
            circle.setAttribute("stroke-width", 2);
            circle.style.cursor = "pointer";
            circle.setAttribute("data-idx", idx);
            circle.style.pointerEvents = "auto";

            // Add drag events
            circle.addEventListener("pointerdown", function(e) {
            draggingIdx = idx;
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
            e.preventDefault();
            e.stopPropagation();
            });

            svgElement.appendChild(circle);
        });
        svgElement.style.pointerEvents = "auto";
    }
}

ScalableVectorGraphics.NS = 'http://www.w3.org/2000/svg';