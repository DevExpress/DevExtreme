"use strict";

exports.calculateValuesFittedWidth = calculateValuesFittedWidth;
exports.oneDigitWidth = void 0;
const oneDigitWidth = exports.oneDigitWidth = 10;
function calculateValuesFittedWidth(minWidth, values) {
  return minWidth + oneDigitWidth * Math.max(...values).toString().length;
}