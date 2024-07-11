"use strict";

var _m_column_fixing = require("../../__internal/grids/grid_core/column_fixing/m_column_fixing");
Object.keys(_m_column_fixing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_column_fixing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_column_fixing[key];
    }
  });
});