"use strict";

var _toMilliseconds = require("./toMilliseconds");
Object.keys(_toMilliseconds).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toMilliseconds[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _toMilliseconds[key];
    }
  });
});