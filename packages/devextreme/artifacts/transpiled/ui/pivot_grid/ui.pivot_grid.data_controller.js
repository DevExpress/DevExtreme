"use strict";

var _m_data_controller = require("../../__internal/grids/pivot_grid/data_controller/m_data_controller");
Object.keys(_m_data_controller).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_data_controller[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_data_controller[key];
    }
  });
});