"use strict";

var _m_adaptivity = require("../../__internal/grids/grid_core/adaptivity/m_adaptivity");
Object.keys(_m_adaptivity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_adaptivity[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_adaptivity[key];
    }
  });
});