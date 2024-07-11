"use strict";

exports.stylePropPrefix = exports.styleProp = exports.setWidth = exports.setStyle = exports.setHeight = exports.parsePixelValue = exports.normalizeStyleProp = void 0;
var _inflector = require("./inflector");
var _call_once = _interopRequireDefault(require("./call_once"));
var _type = require("./type");
var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const jsPrefixes = ['', 'Webkit', 'Moz', 'O', 'Ms'];
const cssPrefixes = {
  '': '',
  'Webkit': '-webkit-',
  'Moz': '-moz-',
  'O': '-o-',
  'ms': '-ms-'
};
const getStyles = (0, _call_once.default)(function () {
  return _dom_adapter.default.createElement('dx').style;
});
const forEachPrefixes = function (prop, callBack) {
  prop = (0, _inflector.camelize)(prop, true);
  let result;
  for (let i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
    const jsPrefix = jsPrefixes[i];
    const prefixedProp = jsPrefix + prop;
    const lowerPrefixedProp = (0, _inflector.camelize)(prefixedProp);
    result = callBack(lowerPrefixedProp, jsPrefix);
    if (result === undefined) {
      result = callBack(prefixedProp, jsPrefix);
    }
    if (result !== undefined) {
      break;
    }
  }
  return result || '';
};
const styleProp = function (name) {
  if (name in getStyles()) {
    return name;
  }
  const originalName = name;
  name = name.charAt(0).toUpperCase() + name.substr(1);
  for (let i = 1; i < jsPrefixes.length; i++) {
    const prefixedProp = jsPrefixes[i].toLowerCase() + name;
    if (prefixedProp in getStyles()) {
      return prefixedProp;
    }
  }
  return originalName;
};
exports.styleProp = styleProp;
const stylePropPrefix = function (prop) {
  return forEachPrefixes(prop, function (specific, jsPrefix) {
    if (specific in getStyles()) {
      return cssPrefixes[jsPrefix];
    }
  });
};
exports.stylePropPrefix = stylePropPrefix;
const pxExceptions = ['fillOpacity', 'columnCount', 'flexGrow', 'flexShrink', 'fontWeight', 'lineHeight', 'opacity', 'zIndex', 'zoom'];
const parsePixelValue = function (value) {
  if ((0, _type.isNumeric)(value)) {
    return value;
  } else if ((0, _type.isString)(value)) {
    return Number(value.replace('px', ''));
  }
  return NaN;
};
exports.parsePixelValue = parsePixelValue;
const normalizeStyleProp = function (prop, value) {
  if ((0, _type.isNumeric)(value) && pxExceptions.indexOf(prop) === -1) {
    value += 'px';
  }
  return value;
};
exports.normalizeStyleProp = normalizeStyleProp;
const setDimensionProperty = function (elements, propertyName, value) {
  if (elements) {
    value = (0, _type.isNumeric)(value) ? value += 'px' : value;
    for (let i = 0; i < elements.length; ++i) {
      elements[i].style[propertyName] = value;
    }
  }
};
const setWidth = function (elements, value) {
  setDimensionProperty(elements, 'width', value);
};
exports.setWidth = setWidth;
const setHeight = function (elements, value) {
  setDimensionProperty(elements, 'height', value);
};
exports.setHeight = setHeight;
const setStyle = function (element, styleString) {
  let resetStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (resetStyle) {
    const styleList = [].slice.call(element.style);
    styleList.forEach(propertyName => {
      element.style.removeProperty(propertyName);
    });
  }
  styleString.split(';').forEach(style => {
    const parts = style.split(':').map(stylePart => stylePart.trim());
    if (parts.length === 2) {
      const [property, value] = parts;
      element.style[property] = value;
    }
  });
};
exports.setStyle = setStyle;