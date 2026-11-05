'use strict';

const mm = require('minimatch');
const picomatch = require('picomatch');

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

class MinimatchRegExp extends RegExp {
  #matcher;

  static get [Symbol.species]() {
    return RegExp;
  }

  constructor(matcher, source, flags) {
    super(source, flags);
    this.#matcher = matcher;
  }

  exec(input) {
    const str = String(input);
    if (!this.#matcher.match(str)) {
      return null;
    }
    return Object.assign([str], { index: 0, input: str, groups: undefined });
  }
}

function makeRe(pattern, options = {}) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required');
  }
  try {
    const matcher = new mm.Minimatch(pattern, legacyOptions({ ...options, matchBase: false }));
    const { source, flags } = picomatch.makeRe(
      process.platform === 'win32' ? pattern.split('\\').join('/') : pattern,
      {
        dot: options.dot,
        nocase: options.nocase,
        nonegate: options.nonegate,
        nobrace: options.nobrace,
        noglobstar: options.noglobstar,
        noextglob: options.noext,
      },
    );
    return new MinimatchRegExp(matcher, source, flags);
  } catch {
    return false;
  }
}

class Minimatch extends mm.Minimatch {
  constructor(pattern, options) {
    super(pattern, legacyOptions(options));
  }

  makeRe() {
    if (this.regexp === undefined) {
      this.regexp = makeRe(this.pattern, this.options);
    }
    return this.regexp;
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
