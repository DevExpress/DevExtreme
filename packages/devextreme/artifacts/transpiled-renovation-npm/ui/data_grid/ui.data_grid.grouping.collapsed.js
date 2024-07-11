"use strict";

var _m_grouping_collapsed = require("../../__internal/grids/data_grid/grouping/m_grouping_collapsed");
Object.keys(_m_grouping_collapsed).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_grouping_collapsed[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_grouping_collapsed[key];
    }
  });
});