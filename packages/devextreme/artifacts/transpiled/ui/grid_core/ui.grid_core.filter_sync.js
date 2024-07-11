"use strict";

var _m_filter_sync = require("../../__internal/grids/grid_core/filter/m_filter_sync");
Object.keys(_m_filter_sync).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_filter_sync[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_filter_sync[key];
    }
  });
});