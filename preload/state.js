const { getListOfOpenedProjects } = require('./vscodeSettingsReader');

const { execSync } = require('child_process');
const { markedStyle, normalStyle } = require('./styles');

module.exports = {
  idx: 0,
  /** @type {{ path: string; minimized: boolean; }[]} */
  listOfOpenedProjects: [],

  setListOfOpenedProjects(excludeMinimized) {
    this.listOfOpenedProjects = getListOfOpenedProjects(excludeMinimized);
  },

  getHTML() {
    return this.listOfOpenedProjects
      .map(
        (project, i) =>
          `<div onmouseover="setIdx(${i});" onmouseup="selectAndFinish()" style="${
            i === this.idx
              ? markedStyle(project.minimized)
              : normalStyle(project.minimized)
          }">${getProjectProperDisplayName(project.path)}</div>`
      )
      .join('\n');
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
    return this.listOfOpenedProjects[this.idx].path;
  }
};

/** @param {string} s */
function getProjectProperDisplayName(s) {
  return s
    .split('/')
    .pop()
    .split('home-is-')
    .pop()
    .replace(/\-/g, ' ')
    .replace(/[a-z]+/g, (p) => p[0].toUpperCase() + p.slice(1).toLowerCase());
}
