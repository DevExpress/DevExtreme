"use strict";

var _editing_form_based = require("../../__internal/grids/data_grid/module_not_extended/editing_form_based");
Object.keys(_editing_form_based).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _editing_form_based[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _editing_form_based[key];
    }
  });
});