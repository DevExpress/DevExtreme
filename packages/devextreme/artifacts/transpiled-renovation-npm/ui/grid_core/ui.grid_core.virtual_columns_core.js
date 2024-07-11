"use strict";

var _m_virtual_columns_core = require("../../__internal/grids/grid_core/virtual_columns/m_virtual_columns_core");
Object.keys(_m_virtual_columns_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_columns_core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_columns_core[key];
    }
  });
});