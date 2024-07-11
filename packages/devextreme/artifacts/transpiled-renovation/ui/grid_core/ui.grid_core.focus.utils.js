"use strict";

var _m_focus_utils = require("../../__internal/grids/grid_core/focus/m_focus_utils");
Object.keys(_m_focus_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_focus_utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_focus_utils[key];
    }
  });
});