"use strict";

var _column_headers = require("../../__internal/grids/data_grid/module_not_extended/column_headers");
Object.keys(_column_headers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _column_headers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _column_headers[key];
    }
  });
});