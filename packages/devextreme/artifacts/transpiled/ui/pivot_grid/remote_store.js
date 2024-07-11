"use strict";

var _m_remote_store = require("../../__internal/grids/pivot_grid/remote_store/m_remote_store");
Object.keys(_m_remote_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_remote_store[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_remote_store[key];
    }
  });
});