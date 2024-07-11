"use strict";

exports.getOffsetDistance = getOffsetDistance;
var _common = require("../../../../core/utils/common");
function getOffsetDistance(targetLocation, scrollOffset) {
  return {
    top: (0, _common.ensureDefined)(targetLocation.top, scrollOffset.top) - scrollOffset.top,
    left: (0, _common.ensureDefined)(targetLocation.left, scrollOffset.left) - scrollOffset.left
  };
}