"use strict";

exports.getScrollTopMax = getScrollTopMax;
function getScrollTopMax(element) {
  return element.scrollHeight - element.clientHeight;
}