"use strict";

var _virtual_columns = require("../../__internal/grids/data_grid/module_not_extended/virtual_columns");
Object.keys(_virtual_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _virtual_columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _virtual_columns[key];
    }
  });
});