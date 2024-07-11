"use strict";

var _m_remote_store_utils = require("../../__internal/grids/pivot_grid/remote_store/m_remote_store_utils");
Object.keys(_m_remote_store_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_remote_store_utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_remote_store_utils[key];
    }
  });
});