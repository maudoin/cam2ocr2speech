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
}