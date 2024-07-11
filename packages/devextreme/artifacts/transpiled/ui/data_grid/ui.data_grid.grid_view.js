"use strict";

var _grid_view = require("../../__internal/grids/data_grid/module_not_extended/grid_view");
Object.keys(_grid_view).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _grid_view[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _grid_view[key];
    }
  });
});