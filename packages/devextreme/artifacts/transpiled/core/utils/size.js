"use strict";

exports.setWidth = exports.setOuterWidth = exports.setOuterHeight = exports.setInnerWidth = exports.setInnerHeight = exports.setHeight = exports.parseHeight = exports.implementationsMap = exports.getWindowByElement = exports.getWidth = exports.getVisibleHeight = exports.getVerticalOffsets = exports.getSize = exports.getOuterWidth = exports.getOuterHeight = exports.getOffset = exports.getInnerWidth = exports.getInnerHeight = exports.getHeight = exports.getElementBoxParams = exports.addOffsetToMinHeight = exports.addOffsetToMaxHeight = void 0;
var _window = require("../../core/utils/window");
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _type = require("../utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const SPECIAL_HEIGHT_VALUES = ['auto', 'none', 'inherit', 'initial'];
const getSizeByStyles = function (elementStyles, styles) {
  let result = 0;
  styles.forEach(function (style) {
    result += parseFloat(elementStyles[style]) || 0;
  });
  return result;
};
const getElementBoxParams = function (name, elementStyles) {
  const beforeName = name === 'width' ? 'Left' : 'Top';
  const afterName = name === 'width' ? 'Right' : 'Bottom';
  return {
    padding: getSizeByStyles(elementStyles, ['padding' + beforeName, 'padding' + afterName]),
    border: getSizeByStyles(elementStyles, ['border' + beforeName + 'Width', 'border' + afterName + 'Width']),
    margin: getSizeByStyles(elementStyles, ['margin' + beforeName, 'margin' + afterName])
  };
};
exports.getElementBoxParams = getElementBoxParams;
const getElementComputedStyle = function (element) {
  var _element$ownerDocumen;
  const view = (element === null || element === void 0 || (_element$ownerDocumen = element.ownerDocument) === null || _element$ownerDocumen === void 0 ? void 0 : _element$ownerDocumen.defaultView) || window;
  return view.getComputedStyle && view.getComputedStyle(element);
};
const getCSSProperty = function (element, styles, name, defaultValue) {
  var _element$style;
  return (styles === null || styles === void 0 ? void 0 : styles[name]) || ((_element$style = element.style) === null || _element$style === void 0 ? void 0 : _element$style[name]) || defaultValue;
};
const boxIndices = {
  content: 0,
  padding: 1,
  border: 2,
  margin: 3,
  'content-box': 0,
  'border-box': 2
};
const dimensionComponents = {
  width: ['left', 'right'],
  height: ['top', 'bottom']
};
function getComponentThickness(elem, dimension, component, styles) {
  const get = (elem, styles, field) => parseFloat(getCSSProperty(elem, styles, field, '0')) || 0;
  const suffix = component === 'border' ? '-width' : '';
  return get(elem, styles, `${component}-${dimensionComponents[dimension][0]}${suffix}`) + get(elem, styles, `${component}-${dimensionComponents[dimension][1]}${suffix}`);
}
const getSize = function (element, dimension, box) {
  const offsetFieldName = dimension === 'width' ? 'offsetWidth' : 'offsetHeight';
  const styles = getElementComputedStyle(element);
  let result = getCSSProperty(element, styles, dimension);
  if (result === '' || result === 'auto') {
    result = element[offsetFieldName];
  }
  result = parseFloat(result) || 0;
  const currentBox = getCSSProperty(element, styles, 'boxSizing', 'content-box');
  const targetBox = box || currentBox;
  let targetBoxIndex = boxIndices[targetBox];
  let currentBoxIndex = boxIndices[currentBox];
  if (targetBoxIndex === undefined || currentBoxIndex === undefined) {
    throw new Error();
  }
  if (currentBoxIndex === targetBoxIndex) {
    return result;
  }
  const coeff = Math.sign(targetBoxIndex - currentBoxIndex);
  let padding = false;
  let border = false;
  let margin = false;
  let scrollThickness = false;
  if (coeff === 1) {
    targetBoxIndex += 1;
    currentBoxIndex += 1;
  }
  for (let boxPart = currentBoxIndex; boxPart !== targetBoxIndex; boxPart += coeff) {
    switch (boxPart) {
      case boxIndices.content:
        break;
      case boxIndices.padding:
        padding = coeff * getComponentThickness(element, dimension, 'padding', styles);
        break;
      case boxIndices.border:
        border = coeff * getComponentThickness(element, dimension, 'border', styles);
        break;
      case boxIndices.margin:
        margin = coeff * getComponentThickness(element, dimension, 'margin', styles);
        break;
    }
  }
  if (padding || border) {
    const paddingAndBorder = (padding === false ? coeff * getComponentThickness(element, dimension, 'padding', styles) : padding) + (border === false ? coeff * getComponentThickness(element, dimension, 'border', styles) : border);
    scrollThickness = coeff * Math.max(0, Math.floor(element[offsetFieldName] - result - coeff * paddingAndBorder)) || 0;
  }
  return result + margin + padding + border + scrollThickness;
};
exports.getSize = getSize;
const getContainerHeight = function (container) {
  return (0, _type.isWindow)(container) ? container.innerHeight : container.offsetHeight;
};
const parseHeight = function (value, container, element) {
  if (value.indexOf('px') > 0) {
    value = parseInt(value.replace('px', ''));
  } else if (value.indexOf('%') > 0) {
    value = parseInt(value.replace('%', '')) * getContainerHeight(container) / 100;
  } else if (!isNaN(value)) {
    value = parseInt(value);
  } else if (value.indexOf('vh') > 0) {
    value = window.innerHeight / 100 * parseInt(value.replace('vh', ''));
  } else if (element && value.indexOf('em') > 0) {
    value = parseFloat(value.replace('em', '')) * parseFloat(window.getComputedStyle(element).fontSize);
  }
  return value;
};
exports.parseHeight = parseHeight;
const getHeightWithOffset = function (value, offset, container) {
  if (!value) {
    return null;
  }
  if (SPECIAL_HEIGHT_VALUES.indexOf(value) > -1) {
    return offset ? null : value;
  }
  if ((0, _type.isString)(value)) {
    value = parseHeight(value, container);
  }
  if ((0, _type.isNumeric)(value)) {
    return Math.max(0, value + offset);
  }
  const operationString = offset < 0 ? ' - ' : ' ';
  return 'calc(' + value + operationString + Math.abs(offset) + 'px)';
};
const addOffsetToMaxHeight = function (value, offset, container) {
  const maxHeight = getHeightWithOffset(value, offset, container);
  return maxHeight !== null ? maxHeight : 'none';
};
exports.addOffsetToMaxHeight = addOffsetToMaxHeight;
const addOffsetToMinHeight = function (value, offset, container) {
  const minHeight = getHeightWithOffset(value, offset, container);
  return minHeight !== null ? minHeight : 0;
};
exports.addOffsetToMinHeight = addOffsetToMinHeight;
const getVerticalOffsets = function (element, withMargins) {
  if (!element) {
    return 0;
  }
  const boxParams = getElementBoxParams('height', window.getComputedStyle(element));
  return boxParams.padding + boxParams.border + (withMargins ? boxParams.margin : 0);
};
exports.getVerticalOffsets = getVerticalOffsets;
const getVisibleHeight = function (element) {
  if (element) {
    const boundingClientRect = element.getBoundingClientRect();
    if (boundingClientRect.height) {
      return boundingClientRect.height;
    }
  }
  return 0;
};

// TODO: remove when we'll start mocking named exports
exports.getVisibleHeight = getVisibleHeight;
const implementationsMap = exports.implementationsMap = {
  getWidth: function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return elementSizeHelper('width', ...args);
  },
  setWidth: function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return elementSizeHelper('width', ...args);
  },
  getHeight: function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return elementSizeHelper('height', ...args);
  },
  setHeight: function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return elementSizeHelper('height', ...args);
  },
  getOuterWidth: function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    return elementSizeHelper('outerWidth', ...args);
  },
  setOuterWidth: function () {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }
    return elementSizeHelper('outerWidth', ...args);
  },
  getOuterHeight: function () {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }
    return elementSizeHelper('outerHeight', ...args);
  },
  setOuterHeight: function () {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }
    return elementSizeHelper('outerHeight', ...args);
  },
  getInnerWidth: function () {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }
    return elementSizeHelper('innerWidth', ...args);
  },
  setInnerWidth: function () {
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }
    return elementSizeHelper('innerWidth', ...args);
  },
  getInnerHeight: function () {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }
    return elementSizeHelper('innerHeight', ...args);
  },
  setInnerHeight: function () {
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }
    return elementSizeHelper('innerHeight', ...args);
  }
};
function elementSizeHelper(sizeProperty, el, value) {
  return arguments.length === 2 ? elementSize(el, sizeProperty) : elementSize(el, sizeProperty, value);
}
const getWidth = el => implementationsMap.getWidth(el);
exports.getWidth = getWidth;
const setWidth = (el, value) => implementationsMap.setWidth(el, value);
exports.setWidth = setWidth;
const getHeight = el => implementationsMap.getHeight(el);
exports.getHeight = getHeight;
const setHeight = (el, value) => implementationsMap.setHeight(el, value);
exports.setHeight = setHeight;
const getOuterWidth = (el, includeMargin) => implementationsMap.getOuterWidth(el, includeMargin || false);
exports.getOuterWidth = getOuterWidth;
const setOuterWidth = (el, value) => implementationsMap.setOuterWidth(el, value);
exports.setOuterWidth = setOuterWidth;
const getOuterHeight = (el, includeMargin) => implementationsMap.getOuterHeight(el, includeMargin || false);
exports.getOuterHeight = getOuterHeight;
const setOuterHeight = (el, value) => implementationsMap.setOuterHeight(el, value);
exports.setOuterHeight = setOuterHeight;
const getInnerWidth = el => implementationsMap.getInnerWidth(el);
exports.getInnerWidth = getInnerWidth;
const setInnerWidth = (el, value) => implementationsMap.setInnerWidth(el, value);
exports.setInnerWidth = setInnerWidth;
const getInnerHeight = el => implementationsMap.getInnerHeight(el);
exports.getInnerHeight = getInnerHeight;
const setInnerHeight = (el, value) => implementationsMap.setInnerHeight(el, value);
exports.setInnerHeight = setInnerHeight;
const elementSize = function (el, sizeProperty, value) {
  const partialName = sizeProperty.toLowerCase().indexOf('width') >= 0 ? 'Width' : 'Height';
  const propName = partialName.toLowerCase();
  const isOuter = sizeProperty.indexOf('outer') === 0;
  const isInner = sizeProperty.indexOf('inner') === 0;
  const isGetter = arguments.length === 2 || typeof value === 'boolean';
  if ((0, _type.isRenderer)(el)) {
    if (el.length > 1 && !isGetter) {
      for (let i = 0; i < el.length; i++) {
        elementSize(el[i], sizeProperty, value);
      }
      return;
    }
    el = el[0];
  }
  if (!el) return;
  if ((0, _type.isWindow)(el)) {
    return isOuter ? el['inner' + partialName] : _dom_adapter.default.getDocumentElement()['client' + partialName];
  }
  if (_dom_adapter.default.isDocument(el)) {
    const documentElement = _dom_adapter.default.getDocumentElement();
    const body = _dom_adapter.default.getBody();
    return Math.max(body['scroll' + partialName], body['offset' + partialName], documentElement['scroll' + partialName], documentElement['offset' + partialName], documentElement['client' + partialName]);
  }
  if (isGetter) {
    let box = 'content';
    if (isOuter) {
      box = value ? 'margin' : 'border';
    }
    if (isInner) {
      box = 'padding';
    }
    return getSize(el, propName, box);
  }
  if ((0, _type.isNumeric)(value)) {
    const elementStyles = getElementComputedStyle(el);
    const sizeAdjustment = getElementBoxParams(propName, elementStyles);
    const isBorderBox = elementStyles.boxSizing === 'border-box';
    value = Number(value);
    if (isOuter) {
      value -= isBorderBox ? 0 : sizeAdjustment.border + sizeAdjustment.padding;
    } else if (isInner) {
      value += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding;
    } else if (isBorderBox) {
      value += sizeAdjustment.border + sizeAdjustment.padding;
    }
  }
  value += (0, _type.isNumeric)(value) ? 'px' : '';
  _dom_adapter.default.setStyle(el, propName, value);
  return null;
};
const getWindowByElement = el => {
  return (0, _type.isWindow)(el) ? el : el.defaultView;
};
exports.getWindowByElement = getWindowByElement;
const getOffset = el => {
  if (!el.getClientRects().length) {
    return {
      top: 0,
      left: 0
    };
  }
  const rect = el.getBoundingClientRect();
  const win = getWindowByElement(el.ownerDocument);
  const docElem = el.ownerDocument.documentElement;
  return {
    top: rect.top + win.pageYOffset - docElem.clientTop,
    left: rect.left + win.pageXOffset - docElem.clientLeft
  };
};
exports.getOffset = getOffset;