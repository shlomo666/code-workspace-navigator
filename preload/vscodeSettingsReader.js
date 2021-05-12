const fs = require('fs');

const vscodeSettingsFilePath = `${process.env.HOME}/Library/Application Support/Code/storage.json`;

exports.getListOfOpenedProjects = (excludeMinimized) => {
  const settings = JSON.parse(fs.readFileSync(vscodeSettingsFilePath).toString());

  /** @type {{ folder?: string; uiState: { mode: number; x: number; y: number }; minimized: boolean; }[]} */
  let openedWindowsList = settings.windowsState.openedWindows.map((item) => ({
    ...item,
    minimized: false // item.uiState.mode === 1 && item.uiState.x === 0
  }));

  if (excludeMinimized) {
    openedWindowsList = openedWindowsList.filter((p) => (excludeMinimized ? !p.minimized : true));
  }

  const listOfOpenedProjects = openedWindowsList
    .filter((p) => p.folder)
    .map((p) => ({
      path: decodeURI(p.folder.slice(7)),
      minimized: p.minimized
    }));

  const order = settings.openedPathsList.entries.filter((p) => p.folderUri).map((p) => decodeURI(p.folderUri.slice(7)));
  listOfOpenedProjects.sort((a, b) => order.indexOf(a.path) - order.indexOf(b.path));

  return listOfOpenedProjects;
};

exports.onSettingChanged = (cb) => {
  fs.watchFile(vscodeSettingsFilePath, () => {
    cb();
  });
};
