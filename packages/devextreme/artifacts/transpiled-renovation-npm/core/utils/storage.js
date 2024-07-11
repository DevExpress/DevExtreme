"use strict";

exports.sessionStorage = void 0;
var _window = require("../../core/utils/window");
const window = (0, _window.getWindow)();
const getSessionStorage = function () {
  let sessionStorage;
  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}
  return sessionStorage;
};
exports.sessionStorage = getSessionStorage;