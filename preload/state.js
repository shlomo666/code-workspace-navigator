const { execSync } = require('child_process');
const { getListOfOpenedProjects } = require('./vscodeSettingsReader');
const { markedStyle, normalStyle } = require('./styles');

module.exports = {
  idx: 0,
  /** @type {{ path: string; minimized: boolean; }[]} */
  listOfOpenedProjects: [],
  lastExcludeMinimizedValue: false,

  setListOfOpenedProjects(excludeMinimized) {
    this.lastExcludeMinimizedValue = excludeMinimized;
    this.listOfOpenedProjects = getListOfOpenedProjects(excludeMinimized);
  },

  getHTML() {
    return this.listOfOpenedProjects
      .map(
        (project, i) =>
          `<div onmouseover="setIdx(${i});" onmouseup="finishAndSelectCurrentProject()" style="${
            i === this.idx ? markedStyle(project.minimized) : normalStyle(project.minimized)
          }"><span>${getProjectProperDisplayName(project.path)}</span></div>`
      )
      .join('\n');
  },

  nextId() {
    this.idx = (this.idx + 1) % this.listOfOpenedProjects.length;
  },

  prevId() {
    this.idx = (this.listOfOpenedProjects.length + this.idx - 1) % this.listOfOpenedProjects.length;
  },

  getCurrentProject() {
    return (this.listOfOpenedProjects[this.idx] || {}).path;
  }
};

/** @param {string} s */
function getProjectProperDisplayName(s) {
  return s
    .split('/')
    .pop()
    .replace(/\-|\./g, ' ')
    .replace(/[a-z]+/g, (p) => p[0].toUpperCase() + p.slice(1).toLowerCase());
}
