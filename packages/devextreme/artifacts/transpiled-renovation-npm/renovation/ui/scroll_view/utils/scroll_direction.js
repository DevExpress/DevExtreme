"use strict";

exports.ScrollDirection = void 0;
var _consts = require("../common/consts");
class ScrollDirection {
  constructor(direction) {
    this.DIRECTION_HORIZONTAL = 'horizontal';
    this.DIRECTION_VERTICAL = 'vertical';
    this.DIRECTION_BOTH = 'both';
    this.direction = direction ?? _consts.DIRECTION_VERTICAL;
  }
  get isHorizontal() {
    return this.direction === _consts.DIRECTION_HORIZONTAL || this.direction === _consts.DIRECTION_BOTH;
  }
  get isVertical() {
    return this.direction === _consts.DIRECTION_VERTICAL || this.direction === _consts.DIRECTION_BOTH;
  }
  get isBoth() {
    return this.direction === _consts.DIRECTION_BOTH;
  }
}
exports.ScrollDirection = ScrollDirection;