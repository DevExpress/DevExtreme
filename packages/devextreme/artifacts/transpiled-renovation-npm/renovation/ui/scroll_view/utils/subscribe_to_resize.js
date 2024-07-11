"use strict";

exports.subscribeToResize = subscribeToResize;
var _resize_observer = _interopRequireDefault(require("../../../../core/resize_observer"));
var _window = require("../../../../core/utils/window");
var _frame = require("../../../../animation/frame");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function subscribeToResize(element, handler) {
  if ((0, _window.hasWindow)() && element) {
    let resizeAnimationFrameID = -1;
    _resize_observer.default.observe(element, _ref => {
      let {
        target
      } = _ref;
      resizeAnimationFrameID = (0, _frame.requestAnimationFrame)(() => {
        handler(target);
      });
    });
    return () => {
      (0, _frame.cancelAnimationFrame)(resizeAnimationFrameID);
      _resize_observer.default.unobserve(element);
    };
  }
  return undefined;
}