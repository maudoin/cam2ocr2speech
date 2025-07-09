
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
    speak(text)
    {
      const speaker = 0;
      this.piperWebEngine.generate(text, TextToSpeech.PIPER_VOICE, speaker).then((res) => {
          this.audio.src = URL.createObjectURL(res.file);
          this.audio.play().catch(error => {});
      });
    }

    interrupt()
    {
        this.audio.pause();
    }
}

// Assign static property and static method at the end
TextToSpeech.PIPER_HUGGINGFACE_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/";
TextToSpeech.PIPER_LOCAL_CODE_PATH = "./third-parties/piper-tts-web";
TextToSpeech.PIPER_LOCAL_MODEL_PATH = "./resources/tts_models";
TextToSpeech.PIPER_VOICE = "fr_FR-siwis-medium";

