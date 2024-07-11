"use strict";

var _sorting = require("../../__internal/grids/data_grid/module_not_extended/sorting");
Object.keys(_sorting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sorting[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sorting[key];
    }
  });
});