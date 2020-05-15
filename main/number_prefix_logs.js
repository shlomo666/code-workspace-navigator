let p = 0;
const log = console.log;
console.log = (...args) => log(++p, ...args);
