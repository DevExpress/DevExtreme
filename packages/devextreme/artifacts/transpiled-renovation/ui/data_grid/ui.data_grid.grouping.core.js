"use strict";

var _m_grouping_core = require("../../__internal/grids/data_grid/grouping/m_grouping_core");
Object.keys(_m_grouping_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_grouping_core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_grouping_core[key];
    }
  });
});