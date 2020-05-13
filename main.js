// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
app.allowRendererProcessReuse = true;

const path = require("path");
const { execSync } = require("child_process");

// Enable live reload for all the files inside your project directory
// require("electron-reload")(__dirname, {
//   electron: require(`${__dirname}/node_modules/electron`)
// });
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 250,
    center: true,
    transparent: true,
    frame: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.setVisibleOnAllWorkspaces(true);
  app.dock.show();

  // Then you need to show it whenever you need it
  if (!mainWindow.isVisible()) {
    app.dock.hide();
    mainWindow.showInactive();

    // And also hide it after a while
    setTimeout(() => {
      mainWindow.focus();
      app.dock.show();
    }, 100);
  }

  // mainWindow.webContents.on("console-message", (event, level, message) => {
  // console.log("createWindow -> console-message -> event, level, message", event, level, message);
  // });

  ipcMain.on("resize-me-please", (event, { width, height }) => {
    mainWindow.setSize(width, height);
    mainWindow.center();
  });
  ipcMain.on("selected", (event, choice) => {
    globalShortcut.register(
      "alt+tab",
      () => {
        mainWindow.show();
        mainWindow.setFocusable(true);
        mainWindow.focus();
        app.dock.hide();
        globalShortcut.unregister("alt+tab");
      },
      10
    );
    mainWindow.hide();
    app.dock.hide();
    mainWindow.setFocusable(false);

    execSync(`code ${choice}`);
  });

  mainWindow.loadFile("index.html");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
