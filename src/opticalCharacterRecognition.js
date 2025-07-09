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
}
OpticalCharacterRecognition.TESSERACT_CORE_PATH = "../third-parties/tesseract.js@6.0.1";
OpticalCharacterRecognition.TESSERACT_WORKER_PATH = "../third-parties/tesseract.js@6.0.1/worker.min.js";
OpticalCharacterRecognition.TESSERACT_LANG_PATH = "../resources/tesseract_models";
