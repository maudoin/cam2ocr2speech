
// import viewer
const { PDFViewerApplication } = await import("../third-parties/pdf.js/v5.3.93/web/viewer.mjs");

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "../third-parties/pdf.js/v5.3.93/web/viewer.css"; // Replace with your CSS file path
document.head.appendChild(link);

export class PdfView
{
    /// Checks if the URL matches a pdfjs-web resource and sets overridePath accordingly.
    /// Fixes pdfjs-web loading issues in electron (avoid copying folders to root)
    /// and force local loading of model instead of remote loading
    /// Returns null or  { overridePath: string|null, url: string }
    static fetchOverride(urlStr)
    {
        if (
            urlStr.startsWith("/build/") ||
            urlStr.startsWith("/web/")
        ) {
            // piper-tts-web request
            return {
                overridePath: PdfView.PDFJS_LOCAL_CODE_PATH,
                url: urlStr
            };
        }
        return null;
    }

    static async openUrl(url)
    {
      PDFViewerApplication.open({ url: url });
    };
}

// Assign static property and static method at the end
PdfView.PDFJS_LOCAL_CODE_PATH = "./third-parties/pdf.js/v5.3.93";
