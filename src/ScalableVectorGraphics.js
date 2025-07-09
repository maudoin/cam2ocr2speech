export class ScalableVectorGraphics
{

    // Display points in svg overlay
    static setupEditablePoints(svgElement, points)
    {
        svgElement.innerHTML = ""; // Clear previous

        // Get canvas position relative to the page
        const rect = canvasInput.getBoundingClientRect();
        // const rectMain = canvasInput.parentElement.getBoundingClientRect();
        const left = rect.left;
        const top = rect.top;

        // Set SVG size to match canvas
        svgElement.setAttribute("width", canvasInput.width);
        svgElement.setAttribute("height", canvasInput.height);
        svgElement.style.position = "absolute";
        svgElement.style.left = left + "px";
        svgElement.style.top = top + "px";
        if (points.length != 0)
        {
            svgElement.style.width = canvasInput.width + "px";
            svgElement.style.height = canvasInput.height + "px";
        }
        else
        {
            svgElement.style.width = "0px";
            svgElement.style.height = "0px";
        }

        // Draw polygon
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
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
            points[draggingIdx].x = Math.max(0, Math.min(canvasInput.width, x));
            points[draggingIdx].y = Math.max(0, Math.min(canvasInput.height, y));
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
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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