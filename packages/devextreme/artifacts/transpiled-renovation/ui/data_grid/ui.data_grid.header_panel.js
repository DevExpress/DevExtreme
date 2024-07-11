"use strict";

var _header_panel = require("../../__internal/grids/data_grid/module_not_extended/header_panel");
Object.keys(_header_panel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _header_panel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _header_panel[key];
    }
  });
});