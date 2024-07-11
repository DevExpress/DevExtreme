"use strict";

var _m_master_detail = require("../../__internal/grids/grid_core/master_detail/m_master_detail");
Object.keys(_m_master_detail).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_master_detail[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_master_detail[key];
    }
  });
});