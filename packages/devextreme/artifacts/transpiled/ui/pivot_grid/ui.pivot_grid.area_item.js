"use strict";

var _m_area_item = require("../../__internal/grids/pivot_grid/area_item/m_area_item");
Object.keys(_m_area_item).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_area_item[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_area_item[key];
    }
  });
});