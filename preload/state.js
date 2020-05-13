const { execSync } = require("child_process");
const fs = require("fs");
const { markedStyle, normalStyle } = require("./styles");

module.exports = {
  idx: 0,
  listOfOpenedProjects: [],

  setListOfOpenedProjects() {
    const settings = JSON.parse(
      fs
        .readFileSync(
          `${process.env.HOME}/Library/Application Support/Code/storage.json`
        )
        .toString()
    );
    const listOfOpenedProjects = settings.windowsState.openedWindows.map((p) =>
      p.folder.slice(7)
    );
    const order = settings.openedPathsList.workspaces3.map((p) => p.slice(7));
    listOfOpenedProjects.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    this.listOfOpenedProjects = listOfOpenedProjects;
  },

  getHTML() {
    return this.listOfOpenedProjects
      .map(
        (s, i) =>
          `<div style="${i === this.idx ? markedStyle : normalStyle}">${s
            .split("/")
            .pop()
            .split("home-is-")
            .pop()
            .replace(/\-/g, " ")}</div>`
      )
      .join("\n");
  },

  nextId() {
    this.idx = (this.idx + 1) % this.listOfOpenedProjects.length;
  },

  prevId() {
    this.idx =
      (this.listOfOpenedProjects.length + this.idx - 1) %
      this.listOfOpenedProjects.length;
  },

  getCurrentProject() {
    return this.listOfOpenedProjects[this.idx];
  }
};
