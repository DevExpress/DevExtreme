"use strict";

var _m_virtual_data_loader = require("../../__internal/grids/grid_core/virtual_data_loader/m_virtual_data_loader");
Object.keys(_m_virtual_data_loader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_virtual_data_loader[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_virtual_data_loader[key];
    }
  });
});