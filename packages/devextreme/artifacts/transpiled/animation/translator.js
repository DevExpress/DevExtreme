"use strict";

exports.resetPosition = exports.parseTranslate = exports.move = exports.locate = exports.getTranslateCss = exports.getTranslate = exports.clearCache = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _element_data = require("../core/element_data");
var _type = require("../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TRANSLATOR_DATA_KEY = 'dxTranslator';
const TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
const TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;
const locate = function ($element) {
  $element = (0, _renderer.default)($element);
  const translate = getTranslate($element);
  return {
    left: translate.x,
    top: translate.y
  };
};
exports.locate = locate;
function isPercentValue(value) {
  return (0, _type.type)(value) === 'string' && value[value.length - 1] === '%';
}
function cacheTranslate($element, translate) {
  if ($element.length) {
    (0, _element_data.data)($element.get(0), TRANSLATOR_DATA_KEY, translate);
  }
}
const clearCache = function ($element) {
  if ($element.length) {
    (0, _element_data.removeData)($element.get(0), TRANSLATOR_DATA_KEY);
  }
};
exports.clearCache = clearCache;
const getTranslateCss = function (translate) {
  translate.x = translate.x || 0;
  translate.y = translate.y || 0;
  const xValueString = isPercentValue(translate.x) ? translate.x : translate.x + 'px';
  const yValueString = isPercentValue(translate.y) ? translate.y : translate.y + 'px';
  return 'translate(' + xValueString + ', ' + yValueString + ')';
};
exports.getTranslateCss = getTranslateCss;
const getTranslate = function ($element) {
  let result = $element.length ? (0, _element_data.data)($element.get(0), TRANSLATOR_DATA_KEY) : null;
  if (!result) {
    const transformValue = $element.css('transform') || getTranslateCss({
      x: 0,
      y: 0
    });
    let matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
    const is3D = matrix && matrix[1];
    if (matrix) {
      matrix = matrix[2].split(',');
      if (is3D === '3d') {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push(0);
        matrix = matrix.slice(4, 7);
      }
    } else {
      matrix = [0, 0, 0];
    }
    result = {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
    cacheTranslate($element, result);
  }
  return result;
};
exports.getTranslate = getTranslate;
const move = function ($element, position) {
  $element = (0, _renderer.default)($element);
  const left = position.left;
  const top = position.top;
  let translate;
  if (left === undefined) {
    translate = getTranslate($element);
    translate.y = top || 0;
  } else if (top === undefined) {
    translate = getTranslate($element);
    translate.x = left || 0;
  } else {
    translate = {
      x: left || 0,
      y: top || 0,
      z: 0
    };
    cacheTranslate($element, translate);
  }
  $element.css({
    transform: getTranslateCss(translate)
  });
  if (isPercentValue(left) || isPercentValue(top)) {
    clearCache($element);
  }
};
exports.move = move;
const resetPosition = function ($element, finishTransition) {
  $element = (0, _renderer.default)($element);
  let originalTransition;
  const stylesConfig = {
    left: 0,
    top: 0,
    transform: 'none'
  };
  if (finishTransition) {
    originalTransition = $element.css('transition');
    stylesConfig.transition = 'none';
  }
  $element.css(stylesConfig);
  clearCache($element);
  if (finishTransition) {
    $element.get(0).offsetHeight;
    $element.css('transition', originalTransition);
  }
};
exports.resetPosition = resetPosition;
const parseTranslate = function (translateString) {
  let result = translateString.match(TRANSLATE_REGEX);
  if (!result || !result[1]) {
    return;
  }
  result = result[1].split(',');
  result = {
    x: parseFloat(result[0]),
    y: parseFloat(result[1]),
    z: parseFloat(result[2])
  };
  return result;
};
exports.parseTranslate = parseTranslate;