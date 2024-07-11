"use strict";

var _m_focus = require("../../__internal/grids/data_grid/focus/m_focus");
Object.keys(_m_focus).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_focus[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_focus[key];
    }
  });
});