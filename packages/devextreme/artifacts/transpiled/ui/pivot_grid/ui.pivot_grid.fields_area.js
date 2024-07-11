"use strict";

var _m_fields_area = require("../../__internal/grids/pivot_grid/fields_area/m_fields_area");
Object.keys(_m_fields_area).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_fields_area[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_fields_area[key];
    }
  });
});