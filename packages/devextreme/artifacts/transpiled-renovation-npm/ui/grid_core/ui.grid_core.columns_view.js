"use strict";

var _m_columns_view = require("../../__internal/grids/grid_core/views/m_columns_view");
Object.keys(_m_columns_view).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_columns_view[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_columns_view[key];
    }
  });
});