"use strict";

var _m_selection = require("../../__internal/grids/grid_core/selection/m_selection");
Object.keys(_m_selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_selection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_selection[key];
    }
  });
});