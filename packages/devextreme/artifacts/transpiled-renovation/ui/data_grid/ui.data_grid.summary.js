"use strict";

var _m_summary = require("../../__internal/grids/data_grid/summary/m_summary");
Object.keys(_m_summary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_summary[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_summary[key];
    }
  });
});