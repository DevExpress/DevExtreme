"use strict";

var _m_pager = require("../../__internal/grids/grid_core/pager/m_pager");
Object.keys(_m_pager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_pager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_pager[key];
    }
  });
});