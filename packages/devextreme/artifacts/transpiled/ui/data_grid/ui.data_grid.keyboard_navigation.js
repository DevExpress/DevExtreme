"use strict";

var _keyboard_navigation = require("../../__internal/grids/data_grid/module_not_extended/keyboard_navigation");
Object.keys(_keyboard_navigation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _keyboard_navigation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _keyboard_navigation[key];
    }
  });
});