const fs = require('fs');
const path = require('path');
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  readFile: (filePath, options) => fs.readFile(filePath, options),
  joinPath: (...args) => path.join(...args),
  dirname: () => __dirname,
});

const pdfjsLib = require('pdfjs-dist');
// pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
window.pdfjsLib = pdfjsLib;
