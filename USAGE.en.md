## Book Page Capture

1. Print the book page detection sheet twice at the bottom of this document and cut a notch at the top or bottom as shown in ![image](doc/aruco_book_usage_1.png) and ![image](doc/aruco_book_usage_2.png).
2. Place the sheet behind the page:
   - cut 1: top of the left page or bottom of the right page
   - cut 2: bottom of the left page or top of the right page
   ![image](doc/arucoBook_1.jpg)
3. Make sure Webcam mode is enabled (first button “📷 Webcam” in the toolbar).
4. Select the external camera from the dropdown menu.
5. Activate marker detection mode using the “𝍌▶️” button.
   - The button changes color and shows the step “𝍌🛑 (1/2)” depending on the number of selected parts (2 by default).
6. To cancel the capture, press the stop button “𝍌🛑 (1/2)” at any time.
7. Frame the ArUco markers to highlight the area to capture: ![image](doc/arucoBook_2.jpg)
8. When the area is large enough and the image is sharp, press the spacebar or the “➦🖼️ Image” button to create the image: ![image](doc/arucoBook_3.jpg)

## A4 Sheet Capture in Two Steps

1. Print the marker sheet ![image](doc/aruco_usage.png) at the bottom of this document, cut the bottom part and carefully notch the corners with a cutter to guide the sheets.
2. Slide the sheet to be scanned into the 4 corners and the two side notches to align it with the markers during capture.
   ![image](doc/arucoMode_1.jpg)
   Note: the two parts can be glued into a folder to simplify sheet placement and storage.
3. Make sure Webcam mode is enabled (first button “📷 Webcam” in the toolbar).
4. Select the external camera from the dropdown menu.
5. Activate marker detection mode using the “𝍌▶️” button.
   - The button changes color and shows the step “𝍌🛑 (1/2)” depending on the number of selected parts (2 by default).
6. To cancel the capture, press the stop button “𝍌🛑 (1/2)” at any time.
7. Follow the on-screen instructions to ensure the scanned area covers the maximum space.
   ![image](doc/arucoMode_2.jpg)
8. Stabilize the image by holding the optimal framing for a few seconds to proceed to the next part.
   **Note:** press the spacebar to use the current capture and move to the next part without optimizing framing or stability.
9. Instructions will indicate that the bottom markers should now be at the top to proceed.
   ![image](doc/arucoMode_4.jpg)
10. Repeat steps 7 to 9 to capture the next part(s).
11. Once capture is complete, “🖼️ Image” mode is activated and you can adjust the image stitching using a slider to avoid cutting text in the middle of characters.
    ![image](doc/arucoMode_7.jpg)
12. Stitching can be validated in several ways:
    - automatically by triggering PDF capture with the “➦📑 PDF” icon
    - with the “✓” icon
    - by saving the image with the “⬇️” icon
    - by right-clicking on the stitching bar

## PDF Mode and Voice Reading

Selected text with the mouse is automatically read aloud in the chosen language when PDF mode is active:
- either because an image or capture was converted to PDF with the “➦📑 PDF” icon
- or because a PDF file was opened with the “📂…” icon
![image](doc/pdfMode.jpg)

**Notes:**
1. Text is not read aloud if the “💬 Voice” icon is not checked.
2. The language selected behind the “💬 Voice” icon is used for voice reading. It is advised to use the same language for PDF generation as aloud voice reading for better results.
