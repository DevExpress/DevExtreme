"use strict";

var _m_data_area = require("../../__internal/grids/pivot_grid/data_area/m_data_area");
Object.keys(_m_data_area).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_data_area[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_data_area[key];
    }
  });
});