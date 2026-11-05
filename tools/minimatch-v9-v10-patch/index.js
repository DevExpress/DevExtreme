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
    if (!matcher.set.length) {
      return false;
    }
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
  #sourcePattern;

  constructor(pattern, options) {
    super(pattern, options);
    this.#sourcePattern = pattern;
  }

  makeRe() {
    if (this.regexp === undefined) {
      this.regexp = makeRe(this.#sourcePattern, this.options);
    }
    return this.regexp;
  }

  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
}

function minimatch(path, pattern, options) {
  return mm.minimatch(path, pattern, options);
}

const ext = (a, b = {}) => ({ ...a, ...b });

function defaults(def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;

  class DefaultsMinimatch extends orig.Minimatch {
    constructor(pattern, options = {}) {
      super(pattern, ext(def, options));
    }

    static defaults(options) {
      return orig.defaults(ext(def, options)).Minimatch;
    }
  }

  const m = (path, pattern, options = {}) => orig(path, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: DefaultsMinimatch,
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR: orig.GLOBSTAR,
  });
}

const api = {
  ...mm,
  minimatch,
  Minimatch,
  makeRe,
  defaults,
};

Object.assign(minimatch, api);

Object.defineProperty(exports, '__esModule', { value: true });
Object.assign(exports, api);
