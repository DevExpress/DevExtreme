"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizeValue = exports.getElementWidth = void 0;
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
const getElementWidth = function ($element) {
  if ((0, _window.hasWindow)()) {
    return (0, _size.getOuterWidth)($element);
  }
};
exports.getElementWidth = getElementWidth;
const getSizeValue = function (size) {
  if (size === null) {
    size = undefined;
  }
  if (typeof size === 'function') {
    size = size();
  }
  return size;
};
exports.getSizeValue = getSizeValue;