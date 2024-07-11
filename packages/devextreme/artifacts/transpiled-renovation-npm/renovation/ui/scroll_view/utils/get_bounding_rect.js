"use strict";

exports.getBoundingRect = getBoundingRect;
function getBoundingRect(el) {
  return el !== null && el !== void 0 && el.getBoundingClientRect ? el.getBoundingClientRect() : {
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  };
}