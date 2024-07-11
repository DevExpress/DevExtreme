"use strict";

var _m_column_headers = require("../../__internal/grids/grid_core/column_headers/m_column_headers");
Object.keys(_m_column_headers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_column_headers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_column_headers[key];
    }
  });
});