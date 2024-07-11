"use strict";

exports.clampIntoRange = clampIntoRange;
function clampIntoRange(value, max, min) {
  return Math.max(Math.min(value, max), min);
}