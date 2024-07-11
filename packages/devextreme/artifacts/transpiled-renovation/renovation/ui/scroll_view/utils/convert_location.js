"use strict";

exports.convertToLocation = convertToLocation;
var _type = require("../../../../core/utils/type");
var _common = require("../../../../core/utils/common");
var _scroll_direction = require("./scroll_direction");
function convertToLocation(location, direction) {
  if ((0, _type.isPlainObject)(location)) {
    const left = (0, _common.ensureDefined)(location.left, location.x);
    const top = (0, _common.ensureDefined)(location.top, location.y);
    return {
      left: (0, _type.isDefined)(left) ? left : undefined,
      top: (0, _type.isDefined)(top) ? top : undefined
    };
  }
  const {
    isHorizontal,
    isVertical
  } = new _scroll_direction.ScrollDirection(direction);
  return {
    left: isHorizontal && (0, _type.isDefined)(location) ? location : undefined,
    top: isVertical && (0, _type.isDefined)(location) ? location : undefined
  };
}