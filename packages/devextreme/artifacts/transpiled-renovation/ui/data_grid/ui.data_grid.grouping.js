"use strict";

var _m_grouping = require("../../__internal/grids/data_grid/grouping/m_grouping");
Object.keys(_m_grouping).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_grouping[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_grouping[key];
    }
  });
});