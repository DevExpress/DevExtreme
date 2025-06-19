function createLogger(log) {
  return function (message, ...args) {
    if (typeof message === 'string') {
      // Avoid spawning message
      // Remove if fixed
      // https://github.com/tokens-studio/sd-transforms/issues/218
      if (message.indexOf("Warning: could not resolve reference {font-weight") > -1) {
        return;
      }
    }

    log(message, ...args);
  }
}

const logError = console.error.bind(console);
const logWarn = console.warn.bind(console);
const log = console.log.bind(console);

console.error = createLogger(logError);
console.warn = createLogger(logWarn);
console.log = createLogger(log);
