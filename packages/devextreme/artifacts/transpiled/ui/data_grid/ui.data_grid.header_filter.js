"use strict";

var _header_filter = require("../../__internal/grids/data_grid/module_not_extended/header_filter");
Object.keys(_header_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _header_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _header_filter[key];
    }
  });
});