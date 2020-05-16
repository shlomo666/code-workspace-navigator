// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen
} = require('electron');

const path = require('path');
const { execSync } = require('child_process');
require('./number_prefix_logs');
const { showMainWindow, hideMainWindow } = require('./util');
const tray = require('./tray');

app.allowRendererProcessReuse = true;
const appDir = path.dirname(require.main.filename);

function createWindow() {
  console.log('app.whenReady');
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 250,
    center: true,
    transparent: true,
    frame: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(appDir, 'preload.js')
    }
  });

  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);

  setTimeout(() => {
    showMainWindow(mainWindow);
  }, 1000);
  tray.setTray(mainWindow);

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('web:', message);
  });

  ipcMain.on('resize-me-please', (event, { width, height }) => {
    console.log('got resize-me-please request');

    const maxWidth = tray.getActiveDisplayScreen().size.width;
    console.log(`${maxWidth} < ${width} = ${maxWidth < width}`);
    if (maxWidth < width) {
      console.log('sending cannot-resize-you');
      event.sender.send('cannot-resize-you', { maxWidth });
    } else {
      mainWindow.setSize(Math.floor(width), Math.floor(height));
      mainWindow.center();
      console.log('sending resized-you');
      event.sender.send('resized-you');
    }
  });
  ipcMain.on('selected', (event, choice) => {
    hideMainWindow(mainWindow);

    execSync(`/usr/local/bin/code ${choice}`);
  });

  mainWindow.loadFile(appDir + '/index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});
