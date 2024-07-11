"use strict";

var _virtual_scrolling = require("../../__internal/grids/data_grid/module_not_extended/virtual_scrolling");
Object.keys(_virtual_scrolling).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _virtual_scrolling[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _virtual_scrolling[key];
    }
  });
});