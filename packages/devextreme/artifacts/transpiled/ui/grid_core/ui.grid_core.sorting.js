"use strict";

var _m_sorting = require("../../__internal/grids/grid_core/sorting/m_sorting");
Object.keys(_m_sorting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_sorting[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_sorting[key];
    }
  });
});