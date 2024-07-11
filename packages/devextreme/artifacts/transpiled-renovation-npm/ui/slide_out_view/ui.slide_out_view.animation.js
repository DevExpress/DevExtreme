"use strict";

exports.animation = void 0;
var _fx = _interopRequireDefault(require("../../animation/fx"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
const ANIMATION_DURATION = 400;
const animation = exports.animation = {
  moveTo: function ($element, position, completeAction) {
    _fx.default.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration: ANIMATION_DURATION,
      complete: completeAction
    });
  },
  complete: function ($element) {
    _fx.default.stop($element, true);
  }
};