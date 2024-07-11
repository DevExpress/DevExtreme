"use strict";

var _m_virtual_scrolling = require("../../__internal/grids/grid_core/virtual_scrolling/m_virtual_scrolling");
Object.keys(_m_virtual_scrolling).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_scrolling[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_scrolling[key];
    }
  });
});