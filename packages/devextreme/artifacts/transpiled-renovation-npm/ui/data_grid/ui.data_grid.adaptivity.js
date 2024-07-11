"use strict";

var _adaptivity = require("../../__internal/grids/data_grid/module_not_extended/adaptivity");
Object.keys(_adaptivity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _adaptivity[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _adaptivity[key];
    }
  });
});