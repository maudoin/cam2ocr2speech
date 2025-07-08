const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer   } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  readFile: (filePath, options) => fs.readFile(filePath, options),
  joinPath: (...args) => path.join(...args),
  dirname: () => __dirname,
  showOpenDialog: (title, exts) => 
    ipcRenderer.invoke('show-open-dialog', { title, exts })
});