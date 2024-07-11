"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animation = exports._translator = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _translator2 = require("../../../animation/translator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line @typescript-eslint/naming-convention
const _translator = exports._translator = {
  move($element, position) {
    (0, _translator2.move)($element, {
      left: position
    });
  }
};
const animation = exports.animation = {
  moveTo($element, position, duration, completeAction) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    _fx.default.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration,
      complete: completeAction
    });
  },
  complete($element) {
    // @ts-expect-error
    _fx.default.stop($element, true);
  }
};