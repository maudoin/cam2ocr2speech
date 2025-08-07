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
    }

    // returns a promise with parameters to call mergeCanvas
    static imageComparisonSlider(
      svgElement,
      { svgWidth, svgHeight,
        imageBottomSrc, imageBottomHeight,
        imageTopSrc, imageTopHeight
      })
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
        clipRect.setAttribute("id", ScalableVectorGraphics.SvgComparisonclipRectId);
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

  static findSvgComparisonSlider(svgElement)
  {
    let clipRect = svgElement.querySelector("#"+ScalableVectorGraphics.SvgComparisonclipRectId);
    return clipRect ? parseFloat(clipRect.getAttribute("height")) : null;
  }

  static createStream(svgElement, y, speed, fontSize, color, streamLength, chars) {
    const group = document.createElementNS(ScalableVectorGraphics.NS, "g");
    group.setAttribute("transform", `translate(0, ${y})`);
    group.dataset.y = y;
    group.dataset.x = 0;
    group.dataset.speed = speed;
    group.dataset.lastUpdate = 0;
    group.dataset.fontSize = fontSize;
    svgElement.appendChild(group);

    for (let i = 0; i < streamLength; i++) {
      const text = document.createElementNS(ScalableVectorGraphics.NS, "text");
      text.setAttribute("x", i * fontSize);
      text.setAttribute("y", 0);
      text.setAttribute("class", "stream-text");
      text.setAttribute("font-size", fontSize);
      text.setAttribute("font-weight", "bold");
      text.setAttribute("font-family", "Share Tech Mono");
      text.setAttribute("fill", color);
      text.textContent = chars[Math.floor(Math.random() * chars.length)];
      text.setAttribute("opacity", ((i + 1) / streamLength).toFixed(2));
      group.appendChild(text);
    }
  }

  static updateStreams(svgElement, timestamp, color, chars, maxLength) {
    const groups = svgElement.querySelectorAll("g");

    groups.forEach(group => {
      const speed = parseFloat(group.dataset.speed);
      const lastUpdate = parseFloat(group.dataset.lastUpdate);
      const fontSize = parseFloat(group.dataset.fontSize);
      const x = parseFloat(group.dataset.x);
      const y = parseFloat(group.dataset.y);

      if (timestamp - lastUpdate > speed) {
        const newChar = document.createElementNS(ScalableVectorGraphics.NS, "text");
        newChar.setAttribute("x", group.children.length * fontSize);
        newChar.setAttribute("y", 0);
        newChar.setAttribute("class", "stream-text");
        newChar.setAttribute("font-size", fontSize);
        newChar.setAttribute("font-weight", "bold");
        newChar.setAttribute("font-family", "Share Tech Mono");
        newChar.setAttribute("fill", color);
        newChar.textContent = chars[Math.floor(Math.random() * chars.length)];
        group.appendChild(newChar);

        if (group.children.length > maxLength) {
          group.removeChild(group.firstChild);
        }

        [...group.children].forEach((char, i) => {
          char.setAttribute("x", i * fontSize);
          const opacity = ((i + 1) / group.children.length).toFixed(2);
          char.setAttribute("opacity", opacity);
        });

        const newX = x + fontSize;
        group.setAttribute("transform", `translate(${newX}, ${y})`);
        group.dataset.x = newX;

        if (newX > window.innerWidth + maxLength * fontSize) {
          group.dataset.x = -maxLength * fontSize;
          group.setAttribute("transform", `translate(${group.dataset.x}, ${y})`);
        }

        group.dataset.lastUpdate = timestamp;
      }
    });

    if (svgElement.childElementCount > 0) {
      requestAnimationFrame(ts => ScalableVectorGraphics.updateStreams(svgElement, ts, color, chars, maxLength));
    }
  }

  static startCharStreamAnimation(svgElement, userConfig = {}) {
    const defaultConfig = {
      chars: "abcdefghijklmnopqrstuvwxyz 0123456789.ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      fontSize: 18,
      color: "rgba(0, 64, 107, 1)",
      streamLength: 20,
      maxLength: 60
    };

    const config = Object.assign({}, defaultConfig, userConfig);
    svgElement.innerHTML = "";

    let height;
    const viewBox = svgElement.getAttribute("viewBox");

    if (viewBox) {
      const parts = viewBox.split(/\s+/);
      height = parseFloat(parts[3]); // viewBox = "minX minY width height"
    } else {
      height = svgElement.getBoundingClientRect().height;
    }
    const streamCount = Math.floor(height / (config.fontSize + 4));

    for (let i = 0; i < streamCount; i++) {
      const y = i * (config.fontSize + 4);
      const speed = 5 + Math.random() * 15;
      ScalableVectorGraphics.createStream(svgElement, y, speed, config.fontSize, config.color, config.streamLength, config.chars);
    }

    requestAnimationFrame(ts => ScalableVectorGraphics.updateStreams(svgElement, ts, config.color, config.chars, config.maxLength));
  }

  static stopCharStreamAnimation(svgElement) {
    svgElement.innerHTML = "";
  }

}


ScalableVectorGraphics.NS = "http://www.w3.org/2000/svg";
ScalableVectorGraphics.SvgComparisonclipRectId = "SvgComparisonclipRectId";