"use strict";

exports.getScrollLeftMax = getScrollLeftMax;
function getScrollLeftMax(element) {
  return element.scrollWidth - element.clientWidth;
}