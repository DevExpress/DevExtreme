"use strict";

var _master_detail = require("../../__internal/grids/data_grid/module_not_extended/master_detail");
Object.keys(_master_detail).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _master_detail[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _master_detail[key];
    }
  });
});