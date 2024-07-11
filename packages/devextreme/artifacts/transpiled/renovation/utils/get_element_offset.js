"use strict";

exports.getElementOffset = getElementOffset;
var _window = require("../../core/utils/window");
const window = (0, _window.getWindow)();
const DEFAULT_OFFSET = {
  top: 0,
  left: 0
};
function getElementOffset(el) {
  if (el && (0, _window.hasWindow)()) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  }
  return DEFAULT_OFFSET;
}