"use strict";

var _m_headers_area = require("../../__internal/grids/pivot_grid/headers_area/m_headers_area");
Object.keys(_m_headers_area).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_headers_area[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_headers_area[key];
    }
  });
});