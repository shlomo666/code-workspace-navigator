const { app, globalShortcut } = require("electron");

/** @param {Electron.BrowserWindow} mainWindow */
exports.showMainWindow = (
  mainWindow,
  updateHTML = false,
  excludeMinimized = false
) => {
  globalShortcut.unregister("alt+tab");

  app.dock.hide();
  mainWindow.showInactive();
  setTimeout(() => {
    mainWindow.focus();
    app.dock.show();
    console.log("sending show");
    mainWindow.webContents.send("show", updateHTML, excludeMinimized);
  }, 10);
};

/** @param {Electron.BrowserWindow} mainWindow */
exports.hideMainWindow = (mainWindow) => {
  let back = false;
  globalShortcut.register("alt+tab", () => {
    if (!back) {
      back = true;
      exports.showMainWindow(
        mainWindow,
        false,
        require("./tray").getExcludeMinimized()
      );
    }
  });
  mainWindow.hide();
  app.dock.hide();
};
