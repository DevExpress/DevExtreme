"use strict";

exports.permissibleWheelDirection = permissibleWheelDirection;
var _consts = require("../common/consts");
function permissibleWheelDirection(direction, isShiftKey) {
  switch (direction) {
    case _consts.DIRECTION_HORIZONTAL:
      return _consts.DIRECTION_HORIZONTAL;
    case _consts.DIRECTION_VERTICAL:
      return _consts.DIRECTION_VERTICAL;
    default:
      return isShiftKey ? _consts.DIRECTION_HORIZONTAL : _consts.DIRECTION_VERTICAL;
  }
}