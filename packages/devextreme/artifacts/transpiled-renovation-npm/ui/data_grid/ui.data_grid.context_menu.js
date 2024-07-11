"use strict";

var _context_menu = require("../../__internal/grids/data_grid/module_not_extended/context_menu");
Object.keys(_context_menu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _context_menu[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _context_menu[key];
    }
  });
});