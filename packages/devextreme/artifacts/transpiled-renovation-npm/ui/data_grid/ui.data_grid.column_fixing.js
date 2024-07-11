"use strict";

var _column_fixing = require("../../__internal/grids/data_grid/module_not_extended/column_fixing");
Object.keys(_column_fixing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _column_fixing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _column_fixing[key];
    }
  });
});