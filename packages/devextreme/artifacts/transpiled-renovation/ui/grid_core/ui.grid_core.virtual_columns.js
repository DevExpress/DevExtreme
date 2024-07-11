"use strict";

var _m_virtual_columns = require("../../__internal/grids/grid_core/virtual_columns/m_virtual_columns");
Object.keys(_m_virtual_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_columns[key];
    }
  });
});