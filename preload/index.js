const state = require("./state");
const { replaceText } = require("./utils");
const styles = require("./styles");
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  setup();

  let tabIsPressed = false;

  window.onkeyup = (key) => {
    if (key.key === "Tab") {
      tabIsPressed = false;
    }
    if (key.key === "Alt" || !key.altKey) {
      selectAndFinish();
    }
  };
  window.onkeydown = (key) => {
    if (key.altKey) {
      if (key.key === "Tab") {
        tabIsPressed = true;

        key.shiftKey ? state.prevId() : state.nextId();
        setScreen();
      }
      if (key.key === "ArrowLeft") {
        state.prevId();
        setScreen();
      }
      if (key.key === "ArrowRight") {
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
  window.selectAndFinish = selectAndFinish;
});

let delegate = false;

const setup = (event, update = false, excludeMinimized = false) => {
  if (delegate) return;
  delegate = true;
  console.log("got show", JSON.stringify({ update, excludeMinimized }));

  const prevListSize = state.listOfOpenedProjects.length;
  state.setListOfOpenedProjects(excludeMinimized);
  const currListSize = state.listOfOpenedProjects.length;
  state.idx = 1;
  if (prevListSize !== currListSize || update) {
    styles.restoreOriginalSize();
    sendSizeToMain();
  } else {
    setScreen();
  }
};
ipcRenderer.on("show", setup);

ipcRenderer.on("cannot-resize-you", (event, { maxWidth }) => {
  console.log("got cannot-resize-you");

  const maxWidthPerCell = maxWidth / state.listOfOpenedProjects.length;
  styles.setWidthPerCell(maxWidthPerCell);
  console.log("new styles.widthPerCell = ", styles.widthPerCell);
  sendSizeToMain();
});
ipcRenderer.on("resized-you", () => {
  console.log("got resized-you");
  setScreen();
});

function sendSizeToMain() {
  console.log("sending resize-me-please request");
  ipcRenderer.send("resize-me-please", {
    width: styles.widthPerCell * state.listOfOpenedProjects.length,
    height: styles.heightPerCell
  });
}

function selectAndFinish() {
  delegate = false;
  ipcRenderer.send("selected", state.getCurrentProject());
}

function setScreen() {
  replaceText("root", state.getHTML());
}
