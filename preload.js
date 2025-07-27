const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  listFiles: (folderPath) => {
    try {
      folderPath = "src/"+folderPath;
      return fs.readdirSync(folderPath).filter(file => fs.statSync(path.join(folderPath, file)).isFile());
    } catch (err) {
      console.error('Error reading files:', err);
      return [];
    }
  },
  readFile: (filePath, options) => fs.readFile(filePath, options),
  joinPath: (...args) => path.join(...args),
  dirname: () => __dirname,
  showOpenDialog: (title, exts) =>
    ipcRenderer.invoke('show-open-dialog', { title, exts })
});