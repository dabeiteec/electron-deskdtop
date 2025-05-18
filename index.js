const { app, BrowserWindow } = require('electron');
const path = require('path');
const registerIpcAuthHandlers = require('./src/core/ipcHandler/auth.handler');
const registerIpcUserHandlers = require('./src/core/ipcHandler/user.handler');
const registerIpcCompanyHandlers = require('./src/core/ipcHandler/company.handler');

let mainWindow; 

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });
  registerIpcCompanyHandlers();
  registerIpcAuthHandlers();
  registerIpcUserHandlers(); 
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  mainWindow.setMenuBarVisibility(false); 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
