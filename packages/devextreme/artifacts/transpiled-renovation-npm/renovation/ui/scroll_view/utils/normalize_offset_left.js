"use strict";

exports.normalizeOffsetLeft = normalizeOffsetLeft;
function normalizeOffsetLeft(scrollLeft, maxLeftOffset, rtlEnabled) {
  if (rtlEnabled) {
    return maxLeftOffset + scrollLeft;
  }
  return scrollLeft;
}