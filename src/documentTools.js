export class DocumentTools
{
    // Retrieve selected text from the window/document
    static getSelectedText()
    {
        if (window.getSelection) {
        return window.getSelection().toString();
        }
        else if (document.selection) {
            return document.selection.createRange().text;
        }
        return "";
    }

    static showOpenDialog(title, acceptFilters)
    {
        // transform acceptFilters to a string
        const acceptStr = acceptFilters.map(ext => `.${ext}`).join(",");
        return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = acceptStr;
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', () => {
            resolve({filePaths:[URL.createObjectURL(input.files[0])], canceled: false});
            document.body.removeChild(input); // Cleanup after use
        });

        input.click();
        });
    }

    // Override fetch globally to workaround root file loading issues in electron
    // or force local loading instead of remote loading
    static fetchUrlOverride(handler)
    {
      if (typeof myAPI !== 'undefined')
      {
        const originalFetch = window.fetch;
        window.fetch = async (url) => {
          let overridePath = null;
          if (typeof url === "string")
          {
            const override = handler(url);
            if (override)
            {
              overridePath = override.overridePath;
              url = override.url;
            }
          };
          if (overridePath !== null)
          {
            console.log(`Intercepted fetch request for: ${url}`);
            const basePath = myAPI.joinPath(myAPI.dirname(), overridePath);
            const fullPath = myAPI.joinPath(basePath, url);
            console.log(`Path resolved to: ${fullPath}`);

            return new Promise((resolve, reject) => {
              myAPI.readFile(fullPath, (err, data) => {
                if (err) {
                  resolve(new Response(null, {
                    status: 404,
                    statusText: "File Not Found"
                  }));
                }
                else
                {
                  // Warning: only js, wasm and binary files support is required for piper-tts-web requests
                  resolve(new Response(data, {
                    status: 200,
                    statusText: "OK",
                    headers: { "Content-Type": url.endsWith(".js")?"application/javascript" :
                        url.endsWith(".wasm")?"application/wasm":
                        "application/octet-stream"
                    }
                  }));
                }
              });
            });
          }
          return originalFetch(url);
        };
      }
    }
}