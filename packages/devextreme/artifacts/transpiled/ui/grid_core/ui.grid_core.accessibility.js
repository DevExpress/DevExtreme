"use strict";

var _m_accessibility = require("../../__internal/grids/grid_core/m_accessibility");
Object.keys(_m_accessibility).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_accessibility[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_accessibility[key];
    }
  });
});