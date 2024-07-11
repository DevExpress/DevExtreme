"use strict";

var _pager = require("../../__internal/grids/data_grid/module_not_extended/pager");
Object.keys(_pager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _pager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pager[key];
    }
  });
});