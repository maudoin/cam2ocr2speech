
// import tts engine
const { PiperWebEngine } = await import("../third-parties/piper-tts-web/piper-tts-web.js");

export class TextToSpeech
{
    /// Checks if the URL matches a piper-tts-web resource and sets overridePath accordingly.
    /// Fixes piper-tts-web loading issues in electron (avoid copying folders to root)
    /// and force local loading of model instead of remote loading
    /// Returns null or  { overridePath: string|null, url: string }
    static fetchOverride(urlStr)
    {
        if (
            urlStr.startsWith("/piper/") ||
            urlStr.startsWith("/onnx/") ||
            urlStr.startsWith("/worker/")
        ) {
            // piper-tts-web request
            return {
                overridePath: TextToSpeech.PIPER_LOCAL_CODE_PATH,
                url: urlStr
            };
        } else if (urlStr.startsWith(TextToSpeech.PIPER_HUGGINGFACE_BASE)) {
            // piper-tts-web voice request
            // strip the base URL to get the voice file sub path only
            return {
                overridePath: TextToSpeech.PIPER_LOCAL_MODEL_PATH,
                url: urlStr.substring(TextToSpeech.PIPER_HUGGINGFACE_BASE.length)
            };
        }
        return null;
    }

    // constructor
    constructor()
    {
        // prepare tts generation
        this.piperWebEngine = new PiperWebEngine();
        // use single audio instance to avoid overlapping sounds
        this.audio = new Audio();
    }

    // TTS speech synthesis
    speak(text, voiceModel)
    {
      const speaker = 0;
      this.piperWebEngine.generate(text, voiceModel, speaker).then((res) => {
          this.audio.src = URL.createObjectURL(res.file);
          this.audio.play().catch(error => {});
      });
    }

    interrupt()
    {
        this.audio.pause();
    }

    static setupSelectFromAvailableModels(selectElement, getFolderList, getFileList)
    {
        const path0 = "../"+TextToSpeech.PIPER_LOCAL_MODEL_PATH;
        getFolderList(path0).forEach(lang => {
            const path1 = path0+"/"+lang;
            getFolderList(path1).forEach(lang_COUNTRY => {
                const path2 = path1+"/"+lang_COUNTRY;
                getFolderList(path2).forEach(name => {
                    const path3 = path2+"/"+name;
                    getFolderList(path3).forEach(quality => {
                        const path4 = path3+"/"+quality;
                        getFileList(path4).forEach(file => {
                            if (file.endsWith(TextToSpeech.PIPER_MODEL_FILE_EXT)) {
                                const model = file.slice(0, file.length - TextToSpeech.PIPER_MODEL_FILE_EXT.length);
                                const option = document.createElement("option");
                                option.value = model;
                                option.textContent = lang;
                                selectElement.appendChild(option);
                            }
                        });
                    });
                });
            });
        });

        // select system lang
        const lang = navigator.language || navigator.userLanguage; // e.g. "fr-FR", "en-US", ...

        // Extract base language code (e.g. "fr" from "fr-FR")
        const baseLang = lang.split("-")[0];

        const select = lang => {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].text === lang) {
                    selectElement.selectedIndex = i;
                    return true;
                }
            }
            return false;
        };

        select(baseLang) || select("en");
    }
}

// Assign static property and static method at the end
TextToSpeech.PIPER_HUGGINGFACE_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/";
TextToSpeech.PIPER_LOCAL_CODE_PATH = "./third-parties/piper-tts-web";
TextToSpeech.PIPER_LOCAL_MODEL_PATH = "./resources/tts_models";
TextToSpeech.PIPER_MODEL_FILE_EXT = ".onnx.json";// or .onnx

