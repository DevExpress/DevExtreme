"use strict";

var _m_keyboard_navigation = require("../../__internal/grids/grid_core/keyboard_navigation/m_keyboard_navigation");
Object.keys(_m_keyboard_navigation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_keyboard_navigation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_keyboard_navigation[key];
    }
  });
});