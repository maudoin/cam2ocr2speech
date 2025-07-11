const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');

Menu.setApplicationMenu(null);

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

  win.loadFile('src/app.html');
  
  win.webContents.on('before-input-event', (_, input) => {
  if (
    input.type === 'keyDown' &&
    input.key === 'F12' &&
    input.control &&
    input.shift
  ) {
    win.webContents.toggleDevTools();
  }
});
}

app.whenReady().then(createWindow);