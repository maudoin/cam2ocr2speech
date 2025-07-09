const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');

// Menu.setApplicationMenu(null);

ipcMain.handle('show-open-dialog', async (event, { title, exts }) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: title, extensions: exts }]
  });
  return result;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // 👈 disables sandbox
    }
  });

  win.loadFile('src/index.html');
}
app.whenReady().then(createWindow);