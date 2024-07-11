"use strict";

exports.splitPair = exports.pairToObject = exports.normalizeKey = exports.noop = exports.grep = exports.getKeyHash = exports.findBestMatches = exports.executeAsync = exports.escapeRegExp = exports.equalByValue = exports.ensureDefined = exports.denormalizeKey = exports.deferUpdater = exports.deferUpdate = exports.deferRenderer = exports.deferRender = exports.asyncNoop = exports.applyServerDecimalSeparator = void 0;
var _config = _interopRequireDefault(require("../config"));
var _guid = _interopRequireDefault(require("../guid"));
var _deferred = require("../utils/deferred");
var _data = require("./data");
var _iterator = require("./iterator");
var _type = require("./type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ensureDefined = function (value, defaultValue) {
  return (0, _type.isDefined)(value) ? value : defaultValue;
};
exports.ensureDefined = ensureDefined;
const executeAsync = function (action, context /* , internal */) {
  const deferred = new _deferred.Deferred();
  const normalizedContext = context || this;
  const task = {
    promise: deferred.promise(),
    abort: function () {
      clearTimeout(timerId);
      deferred.rejectWith(normalizedContext);
    }
  };
  const callback = function () {
    const result = action.call(normalizedContext);
    if (result && result.done && (0, _type.isFunction)(result.done)) {
      result.done(function () {
        deferred.resolveWith(normalizedContext);
      });
    } else {
      deferred.resolveWith(normalizedContext);
    }
  };
  const timerId = (arguments[2] || setTimeout)(callback, typeof context === 'number' ? context : 0);
  return task;
};
exports.executeAsync = executeAsync;
const delayedFuncs = [];
const delayedNames = [];
const delayedDeferreds = [];
let executingName;
const deferExecute = function (name, func, deferred) {
  if (executingName && executingName !== name) {
    delayedFuncs.push(func);
    delayedNames.push(name);
    deferred = deferred || new _deferred.Deferred();
    delayedDeferreds.push(deferred);
    return deferred;
  } else {
    const oldExecutingName = executingName;
    const currentDelayedCount = delayedDeferreds.length;
    executingName = name;
    let result = func();
    if (!result) {
      if (delayedDeferreds.length > currentDelayedCount) {
        result = _deferred.when.apply(this, delayedDeferreds.slice(currentDelayedCount));
      } else if (deferred) {
        deferred.resolve();
      }
    }
    executingName = oldExecutingName;
    if (deferred && result && result.done) {
      result.done(deferred.resolve).fail(deferred.reject);
    }
    if (!executingName && delayedFuncs.length) {
      (delayedNames.shift() === 'render' ? deferRender : deferUpdate)(delayedFuncs.shift(), delayedDeferreds.shift());
    }
    return result || (0, _deferred.when)();
  }
};
const deferRender = function (func, deferred) {
  return deferExecute('render', func, deferred);
};
exports.deferRender = deferRender;
const deferUpdate = function (func, deferred) {
  return deferExecute('update', func, deferred);
};
exports.deferUpdate = deferUpdate;
const deferRenderer = function (func) {
  return function () {
    const that = this;
    return deferExecute('render', function () {
      return func.call(that);
    });
  };
};
exports.deferRenderer = deferRenderer;
const deferUpdater = function (func) {
  return function () {
    const that = this;
    return deferExecute('update', function () {
      return func.call(that);
    });
  };
};
exports.deferUpdater = deferUpdater;
const findBestMatches = function (targetFilter, items, mapFn) {
  const bestMatches = [];
  let maxMatchCount = 0;
  (0, _iterator.each)(items, (index, itemSrc) => {
    let matchCount = 0;
    const item = mapFn ? mapFn(itemSrc) : itemSrc;
    (0, _iterator.each)(targetFilter, (paramName, targetValue) => {
      const value = item[paramName];
      if (value === undefined) {
        return;
      }
      if (match(value, targetValue)) {
        matchCount++;
        return;
      }
      matchCount = -1;
      return false;
    });
    if (matchCount < maxMatchCount) {
      return;
    }
    if (matchCount > maxMatchCount) {
      bestMatches.length = 0;
      maxMatchCount = matchCount;
    }
    bestMatches.push(itemSrc);
  });
  return bestMatches;
};
exports.findBestMatches = findBestMatches;
const match = function (value, targetValue) {
  if (Array.isArray(value) && Array.isArray(targetValue)) {
    let mismatch = false;
    (0, _iterator.each)(value, (index, valueItem) => {
      if (valueItem !== targetValue[index]) {
        mismatch = true;
        return false;
      }
    });
    if (mismatch) {
      return false;
    }
    return true;
  }
  if (value === targetValue) {
    return true;
  }
  return false;
};
const splitPair = function (raw) {
  switch ((0, _type.type)(raw)) {
    case 'string':
      return raw.split(/\s+/, 2);
    case 'object':
      return [raw.x ?? raw.h, raw.y ?? raw.v];
    case 'number':
      return [raw];
    case 'array':
      return raw;
    default:
      return null;
  }
};
exports.splitPair = splitPair;
const normalizeKey = function (id) {
  let key = (0, _type.isString)(id) ? id : id.toString();
  const arr = key.match(/[^a-zA-Z0-9_]/g);
  arr && (0, _iterator.each)(arr, (_, sign) => {
    key = key.replace(sign, '__' + sign.charCodeAt() + '__');
  });
  return key;
};
exports.normalizeKey = normalizeKey;
const denormalizeKey = function (key) {
  const arr = key.match(/__\d+__/g);
  arr && arr.forEach(char => {
    const charCode = parseInt(char.replace('__', ''));
    key = key.replace(char, String.fromCharCode(charCode));
  });
  return key;
};
exports.denormalizeKey = denormalizeKey;
const pairToObject = function (raw, preventRound) {
  const pair = splitPair(raw);
  let h = preventRound ? parseFloat(pair && pair[0]) : parseInt(pair && pair[0], 10);
  let v = preventRound ? parseFloat(pair && pair[1]) : parseInt(pair && pair[1], 10);
  if (!isFinite(h)) {
    h = 0;
  }
  if (!isFinite(v)) {
    v = h;
  }
  return {
    h,
    v
  };
};
exports.pairToObject = pairToObject;
const getKeyHash = function (key) {
  if (key instanceof _guid.default) {
    return key.toString();
  } else if ((0, _type.isObject)(key) || Array.isArray(key)) {
    try {
      const keyHash = JSON.stringify(key);
      return keyHash === '{}' ? key : keyHash;
    } catch (e) {
      return key;
    }
  }
  return key;
};
exports.getKeyHash = getKeyHash;
const escapeRegExp = function (string) {
  return string.replace(/[[\]{}\-()*+?.\\^$|\s]/g, '\\$&');
};
exports.escapeRegExp = escapeRegExp;
const applyServerDecimalSeparator = function (value) {
  const separator = (0, _config.default)().serverDecimalSeparator;
  if ((0, _type.isDefined)(value)) {
    value = value.toString().replace('.', separator);
  }
  return value;
};
exports.applyServerDecimalSeparator = applyServerDecimalSeparator;
const noop = function () {};
exports.noop = noop;
const asyncNoop = function () {
  return new _deferred.Deferred().resolve().promise();
};
exports.asyncNoop = asyncNoop;
const grep = function (elements, checkFunction, invert) {
  const result = [];
  let check;
  const expectedCheck = !invert;
  for (let i = 0; i < elements.length; i++) {
    check = !!checkFunction(elements[i], i);
    if (check === expectedCheck) {
      result.push(elements[i]);
    }
  }
  return result;
};
exports.grep = grep;
const compareArrays = (array1, array2, depth, options) => {
  if (array1.length !== array2.length) {
    return false;
  }
  return !array1.some((item, idx) => !compareByValue(item, array2[idx], depth + 1, _extends({}, options, {
    strict: true
  })));
};
const compareObjects = (object1, object2, depth, options) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  const keys2Set = new Set(keys2);
  return !keys1.some(key => !keys2Set.has(key) || !compareByValue(object1[key], object2[key], depth + 1, options));
};
const DEFAULT_EQUAL_BY_VALUE_OPTS = {
  maxDepth: 3,
  strict: true
};
const compareByValue = (value1, value2, depth, options) => {
  const {
    strict,
    maxDepth
  } = options;
  const comparable1 = (0, _data.toComparable)(value1, true);
  const comparable2 = (0, _data.toComparable)(value2, true);
  const comparisonResult = strict ? comparable1 === comparable2
  // eslint-disable-next-line eqeqeq
  : comparable1 == comparable2;
  switch (true) {
    case comparisonResult:
    case depth >= maxDepth:
      return true;
    case (0, _type.isObject)(comparable1) && (0, _type.isObject)(comparable2):
      return compareObjects(comparable1, comparable2, depth, options);
    case Array.isArray(comparable1) && Array.isArray(comparable2):
      return compareArrays(comparable1, comparable2, depth, options);
    default:
      return false;
  }
};
const equalByValue = function (value1, value2) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_EQUAL_BY_VALUE_OPTS;
  const compareOptions = _extends({}, DEFAULT_EQUAL_BY_VALUE_OPTS, options);
  return compareByValue(value1, value2, 0, compareOptions);
};
exports.equalByValue = equalByValue;