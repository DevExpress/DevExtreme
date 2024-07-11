"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEachGroup = exports.default = void 0;
const forEachGroup = function (data, callback, level) {
  data = data || [];
  level = level || 0;
  for (let i = 0; i < data.length; i += 1) {
    const group = data[i];
    callback(group, level);
    if (group && group.items && group.items.length) {
      forEachGroup(group.items, callback, level + 1);
    }
  }
};
exports.forEachGroup = forEachGroup;
var _default = exports.default = {
  forEachGroup
};