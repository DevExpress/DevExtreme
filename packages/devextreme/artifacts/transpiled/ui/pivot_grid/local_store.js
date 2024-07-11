"use strict";

var _m_local_store = require("../../__internal/grids/pivot_grid/local_store/m_local_store");
Object.keys(_m_local_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_local_store[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_local_store[key];
    }
  });
});