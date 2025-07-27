
export class OpticalCharacterRecognition
{
    // Retrieve selected text from the window/document
    static async recognize(image, langs)
    {
        const options = {
          workerPath: OpticalCharacterRecognition.TESSERACT_WORKER_PATH,
          langPath: OpticalCharacterRecognition.TESSERACT_LANG_PATH,
          corePath: OpticalCharacterRecognition.TESSERACT_CORE_PATH,
          gzip : false,
          logger: m => console.log(m),
          errorHandler: err => console.error(err)
      };
      const output = { pdf: true };

      // OCR with Tesseract.js
      const worker = await Tesseract.createWorker(langs, 1, options);
      return worker.recognize(image, {}, output)
        .finally(async () => {
        await worker.terminate();
        });
    }
    static setupSelectFromAvailableModels(selectElement, getFileList)
    {
        getFileList(OpticalCharacterRecognition.TESSERACT_LANG_PATH).forEach(file => {
            if (file.endsWith(OpticalCharacterRecognition.TESSERACT_CORE_EXTENSION)) {
                const lang = file.slice(0, file.length - OpticalCharacterRecognition.TESSERACT_CORE_EXTENSION.length);
                const option = document.createElement("option");
                option.value = lang;
                option.textContent = lang;
                selectElement.appendChild(option);
            }
        });

        // select system lang
        const lang = navigator.language || navigator.userLanguage; // e.g. "fr-FR", "en-US", ...

        // Map system language to your select values
        const langMap = {
            "de": "deu",
            "en": "eng",
            "es": "spa",
            "fr": "fra",
            "it": "ita"
        };
        // Extract base language code (e.g. "fr" from "fr-FR")
        const baseLang = lang.split("-")[0];

        // Find matching value in select
        const selectValue = langMap[baseLang];

        selectElement.value = (selectValue && [...selectElement.options].some(opt => opt.value === selectValue))
            ? selectValue : "eng";
    }
}
OpticalCharacterRecognition.TESSERACT_CORE_PATH = "../third-parties/tesseract.js@6.0.1";
OpticalCharacterRecognition.TESSERACT_WORKER_PATH = "../third-parties/tesseract.js@6.0.1/worker.min.js";
OpticalCharacterRecognition.TESSERACT_LANG_PATH = "../resources/tesseract_models";
OpticalCharacterRecognition.TESSERACT_CORE_EXTENSION = ".traineddata";
