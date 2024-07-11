"use strict";

var _m_columns_resizing_reordering = require("../../__internal/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering");
Object.keys(_m_columns_resizing_reordering).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_columns_resizing_reordering[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_columns_resizing_reordering[key];
    }
  });
});