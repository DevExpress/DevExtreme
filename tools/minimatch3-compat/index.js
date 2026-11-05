'use strict';

const mm = require('minimatch');

const Matcher = new mm.Minimatch('*').set[0][0].constructor;
if (!Object.prototype.hasOwnProperty.call(Matcher.prototype, '_glob')) {
  Object.defineProperties(Matcher.prototype, {
    _glob: {
      get() {
        return String(this.pattern);
      },
    },
    [Symbol.match]: {
      value(s) {
        return this.test(s) ? [s] : null;
      },
    },
  });
}

const legacyOptions = (options) => (process.platform === 'win32'
  ? { windowsPathsNoEscape: true, ...options }
  : options);

function makeRe(pattern, options) {
  const m = new mm.Minimatch(pattern, legacyOptions(options));
  return {
    source: pattern,
    test: (s) => m.match(s),
    [Symbol.match]: (s) => (m.match(s) ? [s] : null),
  };
}

class Minimatch extends mm.Minimatch {
  constructor(pattern, options) {
    super(pattern, legacyOptions(options));
  }

  makeRe() {
    return makeRe(this.pattern, this.options);
  }
}

function minimatch(path, pattern, options) {
  return mm.minimatch(path, pattern, legacyOptions(options));
}

Object.assign(minimatch, mm, {
  Minimatch,
  makeRe,
  minimatch,
  default: minimatch,
  filter: (pattern, options) => mm.filter(pattern, legacyOptions(options)),
  match: (list, pattern, options) => mm.match(list, pattern, legacyOptions(options)),
});

module.exports = minimatch;
