"use strict";

var _m_data_source_adapter = require("../../__internal/grids/grid_core/data_source_adapter/m_data_source_adapter");
Object.keys(_m_data_source_adapter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_data_source_adapter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_data_source_adapter[key];
    }
  });
});