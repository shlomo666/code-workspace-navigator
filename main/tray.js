const { Tray, screen } = require('electron');
const path = require('path');
const { getContextMenu } = require('./getContextMenu');
const { showMainWindow } = require('./util');

const appDir = path.dirname(require.main.filename);
const package = require(appDir + '/package.json');

/** @type {Electron.BrowserWindow} */
let mainWindow;

/** @type {Electron.Tray} */
let tray;
exports.setTray = (mainWindowPointer) => {
  mainWindow = mainWindowPointer;
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  activeDisplayScreenId = primaryDisplayId;

  if (!tray) {
    screen.on('display-added', () => exports.setTray(mainWindow));
    screen.on('display-removed', () => exports.setTray(mainWindow));

    tray = new Tray(appDir + '/menu_bar_icon.png');
  }
  const contextMenu = getContextMenu({
    primaryDisplayId,
    setExcludeMinimized,
    setDisplayScreen
  });
  tray.setToolTip(package.productName);
  tray.setContextMenu(contextMenu);
};

function setExcludeMinimized(exclude) {
  excludeMinimized = exclude;
  console.log('excludeMinimized ->', excludeMinimized);
}
function setDisplayScreen(id) {
  console.log('setDisplayScreen -> id', id);
  activeDisplayScreenId = id;
  const display = exports.getActiveDisplayScreen();

  if (display) {
    showMainWindow(mainWindow, true, excludeMinimized);
    mainWindow.setBounds(display.workArea);
  } else {
    exports.setTray(mainWindow);
  }
}

let excludeMinimized = false;
let activeDisplayScreenId;

exports.getExcludeMinimized = () => excludeMinimized;
exports.getActiveDisplayScreen = () =>
  screen.getAllDisplays().find((d) => d.id === activeDisplayScreenId) ||
  screen.getPrimaryDisplay();
