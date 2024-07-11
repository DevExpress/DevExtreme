"use strict";

var _filter_sync = require("../../__internal/grids/data_grid/module_not_extended/filter_sync");
Object.keys(_filter_sync).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _filter_sync[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _filter_sync[key];
    }
  });
});