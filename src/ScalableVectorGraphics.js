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
        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
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
                { x: a.x - headLength, y: a.y - headLength }, // top-left
                { x: a.x + headLength, y: a.y - headLength }, // top-right
                { x: a.x + headLength, y: a.y + headLength }, // bottom-right
                { x: a.x - headLength, y: a.y + headLength }, // bottom-left
                { x: a.x - headLength, y: a.y - headLength }  // top-left
            ];
            // const polyPoints = [
            //     { x: b.x+headLength*(1-2*(a.x<b.x)), y: b.y },
            //     b,
            //     { x: b.x, y: b.y+headLength*(1-2*(a.y<b.y)) }
            // ];

            const polyline = document.createElementNS(ScalableVectorGraphics.NS, "polyline");
            const pointsAttr = polyPoints.map(p => `${p.x},${p.y}`).join(" ");

            polyline.setAttribute("points", pointsAttr);
            polyline.setAttribute("fill", "none");
            polyline.setAttribute("stroke", "green");
            polyline.setAttribute("stroke-width", "10");
            svgElement.appendChild(polyline);
        });
    }
    static drawText(svgElement, p, txt, textHeight, color)
    {
      const textElem = document.createElementNS(ScalableVectorGraphics.NS, "text");
      textElem.setAttribute("x", p.x);
      textElem.setAttribute("y", p.y);
      textElem.setAttribute("font-size", textHeight);
      textElem.setAttribute("fill", color);
      textElem.setAttribute("text-anchor", "middle"); // Center horizontally
      textElem.setAttribute("dominant-baseline", "middle"); // Center vertically
      textElem.textContent = txt;
      svgElement.appendChild(textElem);
    }
    static drawPolyLine(svgElement, points, color = "rgba(0, 255, 0, 0.5)")
    {
      if (points)
      {
        const poly = document.createElementNS(ScalableVectorGraphics.NS, "polygon");
        poly.setAttribute("points", points.map(p => `${p.x},${p.y}`).join(" "));
        poly.setAttribute("fill", color);
        poly.setAttribute("stroke", "none");
        svgElement.appendChild(poly);
      }
    }
    static drawTextAndPolyLine(svgElement, locations, indexToText, textHeight, color, getPolyline)
    {
        if (locations)
        {
            locations.forEach((loc, idx)=>{
                ScalableVectorGraphics.drawPolyLine(svgElement, getPolyline(loc), "rgba(0, 255, 0, 0.5)");
            });

            locations.forEach((p, idx)=>ScalableVectorGraphics.drawText(svgElement, p, indexToText(idx), textHeight, color));
        }
    }


    static async createMergedCanvas(canvas, {
      imageTopSrc,
      imageTopHeight,
      imageBottomSrc,
      imageBottomHeight,
      svgWidth,
      svgHeight,
      clipHeight
    }) {
      const loadImage = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.src = src;
        });

      const [topImg, bottomImg] = await Promise.all([
        loadImage(imageTopSrc),
        loadImage(imageBottomSrc),
      ]);

      canvas.width = svgWidth;
      canvas.height = svgHeight;
      const ctx = canvas.getContext("2d");

      const topClipHeight = Math.min(clipHeight, imageTopHeight);
      ctx.drawImage(
        topImg,
        0, 0, svgWidth, topClipHeight,
        0, 0, svgWidth, topClipHeight
      );

      const visibleBottomHeight = svgHeight - clipHeight;
      const overlap = Math.min(visibleBottomHeight, imageBottomHeight);
      const sourceY = imageBottomHeight - overlap;
      ctx.drawImage(
        bottomImg,
        0, sourceY, svgWidth, overlap,
        0, clipHeight, svgWidth, overlap
      );

      return canvas;
    }

    // returns a promise with parameters to call mergeCanvas
    static imageComparisonSlider(
      svgElement, svgWidth, svgHeight,
      imageBottomSrc, imageBottomHeight,
      imageTopSrc, imageTopHeight)
    {
      return new Promise((resolve) => {
        const imageBottom = document.createElementNS(ScalableVectorGraphics.NS, "image");
        imageBottom.setAttribute("href", imageBottomSrc);
        imageBottom.setAttribute("width", svgWidth);
        imageBottom.setAttribute("height", imageBottomHeight);
        imageBottom.setAttribute("y", svgHeight - imageBottomHeight);
        svgElement.appendChild(imageBottom);

        const clipPath = document.createElementNS(ScalableVectorGraphics.NS, "clipPath");
        clipPath.setAttribute("id", "clip");

        const clipRect = document.createElementNS(ScalableVectorGraphics.NS, "rect");
        clipRect.setAttribute("x", 0);
        clipRect.setAttribute("y", 0);
        clipRect.setAttribute("width", svgWidth);
        clipRect.setAttribute("height", svgHeight-imageBottomHeight);
        clipPath.appendChild(clipRect);
        svgElement.appendChild(clipPath);

        const imageTop = document.createElementNS(ScalableVectorGraphics.NS, "image");
        imageTop.setAttribute("href", imageTopSrc);
        imageTop.setAttribute("width", svgWidth);
        imageTop.setAttribute("height", imageTopHeight);
        imageTop.setAttribute("y", 0);
        imageTop.setAttribute("clip-path", "url(#clip)");
        svgElement.appendChild(imageTop);

        const sliderBar = document.createElementNS(ScalableVectorGraphics.NS, "rect");
        sliderBar.setAttribute("x", 0);
        sliderBar.setAttribute("y", svgHeight-imageBottomHeight);
        sliderBar.setAttribute("width", svgWidth);
        sliderBar.setAttribute("height", 5);
        sliderBar.setAttribute("fill", "white");
        sliderBar.setAttribute("opacity", "0.7");
        sliderBar.setAttribute("cursor", "ns-resize");
        sliderBar.style.cursor = "row-resize";
        sliderBar.style.pointerEvents = "auto";
        svgElement.appendChild(sliderBar);
        svgElement.style.pointerEvents = "auto";

        function onPointerMove(e) {
          const pt = svgElement.createSVGPoint();
          pt.x = 0;
          pt.y = e.clientY;
          const CTM = svgElement.getScreenCTM();
          const svgP = pt.matrixTransform(CTM.inverse());

          const y = Math.max(svgHeight-imageBottomHeight, Math.min(svgP.y, imageTopHeight));

          clipRect.setAttribute("height", y);
          sliderBar.setAttribute("y", y);
        }

        function onPointerUp() {
            svgElement.removeEventListener("pointermove", onPointerMove);
            svgElement.removeEventListener("pointerup", onPointerUp);
        }
        sliderBar.addEventListener("pointerdown", function(e) {
            svgElement.addEventListener("pointermove", onPointerMove);
            svgElement.addEventListener("pointerup", onPointerUp);
            e.preventDefault();
            e.stopPropagation();
        });

        sliderBar.addEventListener("contextmenu", (e) => {
          e.preventDefault();

          const clipHeight = parseFloat(clipRect.getAttribute("height"));

          resolve({
            svgElement,
            imageTopSrc,
            imageTopHeight,
            imageBottomSrc,
            imageBottomHeight,
            svgWidth,
            svgHeight,
            clipHeight
          });
        });
      });
  }
}


ScalableVectorGraphics.NS = "http://www.w3.org/2000/svg";