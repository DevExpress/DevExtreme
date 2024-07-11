"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PRECISION = void 0;
exports.compareNumbersWithPrecision = compareNumbersWithPrecision;
var _utils = require("../../../../localization/utils");
const PRECISION = exports.PRECISION = 10;
function compareNumbersWithPrecision(actual, expected) {
  let precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PRECISION;
  const delta = parseFloat((0, _utils.toFixed)(actual, precision)) - parseFloat((0, _utils.toFixed)(expected, precision));
  if (delta === 0) {
    return 0;
  }
  return delta > 0 ? 1 : -1;
}