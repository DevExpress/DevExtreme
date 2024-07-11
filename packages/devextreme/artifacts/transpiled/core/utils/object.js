"use strict";

exports.orderEach = exports.deepExtendArraySafe = exports.clone = void 0;
var _type = require("./type");
var _variable_wrapper = _interopRequireDefault(require("./variable_wrapper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const clone = exports.clone = function () {
  function Clone() {}
  return function (obj) {
    Clone.prototype = obj;
    return new Clone();
  };
}();
const orderEach = function (map, func) {
  const keys = [];
  let key;
  let i;
  for (key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      keys.push(key);
    }
  }
  keys.sort(function (x, y) {
    const isNumberX = (0, _type.isNumeric)(x);
    const isNumberY = (0, _type.isNumeric)(y);
    if (isNumberX && isNumberY) return x - y;
    if (isNumberX && !isNumberY) return -1;
    if (!isNumberX && isNumberY) return 1;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  });
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    func(key, map[key]);
  }
};
exports.orderEach = orderEach;
const assignValueToProperty = function (target, property, value, assignByReference) {
  if (!assignByReference && _variable_wrapper.default.isWrapped(target[property])) {
    _variable_wrapper.default.assign(target[property], value);
  } else {
    target[property] = value;
  }
};

// B239679, http://bugs.jquery.com/ticket/9477
const deepExtendArraySafe = function (target, changes, extendComplexObject, assignByReference) {
  let prevValue;
  let newValue;
  for (const name in changes) {
    prevValue = target[name];
    newValue = changes[name];
    if (name === '__proto__' || name === 'constructor' || target === newValue) {
      continue;
    }
    if ((0, _type.isPlainObject)(newValue)) {
      const goDeeper = extendComplexObject ? (0, _type.isObject)(prevValue) : (0, _type.isPlainObject)(prevValue);
      newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference);
    }
    if (newValue !== undefined && prevValue !== newValue) {
      assignValueToProperty(target, name, newValue, assignByReference);
    }
  }
  return target;
};
exports.deepExtendArraySafe = deepExtendArraySafe;