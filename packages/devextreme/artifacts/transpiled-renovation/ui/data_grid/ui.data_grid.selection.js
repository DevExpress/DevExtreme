"use strict";

var _selection = require("../../__internal/grids/data_grid/module_not_extended/selection");
Object.keys(_selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _selection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _selection[key];
    }
  });
});