"use strict";

exports.getDevicePixelRatio = getDevicePixelRatio;
var _window = require("../../../../core/utils/window");
function getDevicePixelRatio() {
  return (0, _window.hasWindow)() ? (0, _window.getWindow)().devicePixelRatio : 1;
}