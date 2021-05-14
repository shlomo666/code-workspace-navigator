const { ipcRenderer } = require('electron');
const state = require('./state');
const { replaceText } = require('./utils');
const styles = require('./styles');
const { onSettingChanged, changeOrderOfProjectsManually } = require('./vscodeSettingsReader');

window.addEventListener('DOMContentLoaded', () => {
  setup();

  let tabIsPressed = false;

  window.onkeyup = (event) => {
    const { key, altKey } = event;

    if (key === 'Tab') {
      tabIsPressed = false;
    }
    if (key === 'Alt' || !altKey) {
      finishAndSelectCurrentProject();
    }
    if (key === 'Escape') {
      finishWithNoSelect();
    }
  };
  window.onkeydown = (key) => {
    if (key.altKey) {
      if (key.key === 'Tab') {
        tabIsPressed = true;

        key.shiftKey ? state.prevId() : state.nextId();
        setScreen();
      }
      if (key.key === 'ArrowLeft') {
        state.prevId();
        setScreen();
      }
      if (key.key === 'ArrowRight') {
        state.nextId();
        setScreen();
      }
    }
  };

  window.setIdx = (i) => {
    if (!tabIsPressed) {
      state.idx = i;
      setScreen();
    }
  };
  window.finishAndSelectCurrentProject = finishAndSelectCurrentProject;
});

let delegate = false;

const setup = (event, update = false, excludeMinimized = false) => {
  if (delegate) return;
  delegate = true;
  console.log('got show', JSON.stringify({ update, excludeMinimized }));

  const prevListSize = state.listOfOpenedProjects.length;
  state.setListOfOpenedProjects(excludeMinimized);
  const currListSize = state.listOfOpenedProjects.length;
  state.idx = currListSize === 1 ? 0 : 1; // if only one window don't target the next window
  if (prevListSize !== currListSize || update) {
    styles.restoreOriginalSize();
    sendSizeToMain();
  } else {
    setScreen();
  }
};
ipcRenderer.on('show', setup);

onSettingChanged(() => () => setup(null, true, state.lastExcludeMinimizedValue));

ipcRenderer.on('cannot-resize-you', (event, { maxWidth }) => {
  console.log('got cannot-resize-you');

  const maxWidthPerCell = maxWidth / state.listOfOpenedProjects.length;
  styles.setWidthPerCell(maxWidthPerCell);
  console.log('new styles.widthPerCell = ', styles.widthPerCell);
  sendSizeToMain();
});
ipcRenderer.on('resized-you', () => {
  console.log('got resized-you');
  setScreen();
});

function sendSizeToMain() {
  console.log('sending resize-me-please request');
  ipcRenderer.send('resize-me-please', {
    width: styles.widthPerCell * state.listOfOpenedProjects.length,
    height: styles.heightPerCell
  });
}

function selectAndFinish(path) {
  delegate = false;
  ipcRenderer.send('selected', path);
}
function finishWithNoSelect() {
  selectAndFinish(null);
}
function finishAndSelectCurrentProject() {
  selectAndFinish(state.getCurrentProject());
  changeOrderOfProjectsManually(state.listOfOpenedProjects, state.getCurrentProject());
  setScreen();
}

function setScreen() {
  replaceText('root', state.getHTML());
}
