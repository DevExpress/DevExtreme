"use strict";

var _m_columns_controller = require("../../__internal/grids/data_grid/m_columns_controller");
Object.keys(_m_columns_controller).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_columns_controller[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_columns_controller[key];
    }
  });
});