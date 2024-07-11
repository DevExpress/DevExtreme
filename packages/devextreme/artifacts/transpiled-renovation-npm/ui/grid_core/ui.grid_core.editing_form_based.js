"use strict";

var _m_editing_form_based = require("../../__internal/grids/grid_core/editing/m_editing_form_based");
Object.keys(_m_editing_form_based).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_editing_form_based[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_editing_form_based[key];
    }
  });
});