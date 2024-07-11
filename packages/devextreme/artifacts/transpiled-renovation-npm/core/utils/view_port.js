"use strict";

exports.changeCallback = void 0;
exports.originalViewPort = originalViewPort;
exports.value = void 0;
var _renderer = _interopRequireDefault(require("../renderer"));
var _ready_callbacks = _interopRequireDefault(require("./ready_callbacks"));
var _callbacks = _interopRequireDefault(require("./callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ready = _ready_callbacks.default.add;
const changeCallback = exports.changeCallback = (0, _callbacks.default)();
let $originalViewPort = (0, _renderer.default)();
const value = exports.value = function () {
  let $current;
  return function (element) {
    if (!arguments.length) {
      return $current;
    }
    const $element = (0, _renderer.default)(element);
    $originalViewPort = $element;
    const isNewViewportFound = !!$element.length;
    const prevViewPort = value();
    $current = isNewViewportFound ? $element : (0, _renderer.default)('body');
    changeCallback.fire(isNewViewportFound ? value() : (0, _renderer.default)(), prevViewPort);
  };
}();
ready(function () {
  value('.dx-viewport');
});
function originalViewPort() {
  return $originalViewPort;
}