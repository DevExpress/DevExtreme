"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverseSortOrder = void 0;
var _const = require("./const");
const reverseSortOrder = sortOrder => sortOrder === _const.SORT_ORDER.descending ? _const.SORT_ORDER.ascending : _const.SORT_ORDER.descending;
exports.reverseSortOrder = reverseSortOrder;