"use strict";

var _error_handling = require("../../__internal/grids/data_grid/module_not_extended/error_handling");
Object.keys(_error_handling).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _error_handling[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _error_handling[key];
    }
  });
});