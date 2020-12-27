const { globalShortcut } = require('electron');

/** @param {Electron.BrowserWindow} mainWindow */
exports.showMainWindow = (mainWindow, updateHTML = false, excludeMinimized = false) => {
  globalShortcut.unregister('alt+tab');

  const { x, y } = require('./tray').getActiveDisplayScreen().bounds;
  mainWindow.setBounds({ x, y });
  mainWindow.center();
  mainWindow.focus();
  mainWindow.show();
  console.log('sending show');
  mainWindow.webContents.send('show', updateHTML, excludeMinimized);
};

/** @param {Electron.BrowserWindow} mainWindow */
exports.hideMainWindow = (mainWindow) => {
  let back = false;
  globalShortcut.register('alt+tab', () => {
    if (!back) {
      back = true;
      exports.showMainWindow(mainWindow, false, require('./tray').getExcludeMinimized());
    }
  });
  mainWindow.hide();
};
