'use strict';

const mm = require('minimatch');
const picomatch = require('picomatch');

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
    const matcher = new mm.Minimatch(pattern, { ...options, matchBase: false });
    const { source, flags } = picomatch.makeRe(
      options.windowsPathsNoEscape ? pattern.split('\\').join('/') : pattern,
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
  makeRe() {
    if (this.regexp === undefined) {
      this.regexp = makeRe(this.pattern, this.options);
    }
    return this.regexp;
  }
}

function minimatch(path, pattern, options) {
  return mm.minimatch(path, pattern, options);
}

const api = {
  ...mm,
  minimatch,
  Minimatch,
  makeRe,
};

Object.assign(minimatch, api);

Object.defineProperty(exports, '__esModule', { value: true });
Object.assign(exports, api);
