"use strict";

var _m_virtual_scrolling_core = require("../../__internal/grids/grid_core/virtual_scrolling/m_virtual_scrolling_core");
Object.keys(_m_virtual_scrolling_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_scrolling_core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_scrolling_core[key];
    }
  });
});