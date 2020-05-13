const state = require("./state");
const { replaceText } = require("./utils");
const { widthPerCell, heightPerCell } = require("./styles");
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  state.setListOfOpenedProjects();
  setScreen();

  window.onkeyup = (key) => {
    if (key.key === "Alt" || !key.altKey) {
      ipcRenderer.send("selected", state.getCurrentProject());
    }
  };
  window.onkeydown = (key) => {
    if (key.altKey) {
      if (key.key === "Tab") {
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
  window.onfocus = () => {
    state.setListOfOpenedProjects();
    state.idx = 1;
    setScreen();

    ipcRenderer.send("resize-me-please", {
      width: widthPerCell * state.listOfOpenedProjects.length,
      height: heightPerCell
    });
  };
});

function setScreen() {
  replaceText("root", state.getHTML());
}
