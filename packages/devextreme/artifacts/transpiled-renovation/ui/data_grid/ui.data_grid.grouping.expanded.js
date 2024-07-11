"use strict";

var _m_grouping_expanded = require("../../__internal/grids/data_grid/grouping/m_grouping_expanded");
Object.keys(_m_grouping_expanded).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_grouping_expanded[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_grouping_expanded[key];
    }
  });
});