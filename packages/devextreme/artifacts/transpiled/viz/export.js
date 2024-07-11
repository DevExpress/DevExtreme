"use strict";

var _export = require("./core/export");
Object.keys(_export).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _export[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _export[key];
    }
  });
});