"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _easing = require("../../animation/easing");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

if (_jquery.default) {
  (0, _easing.setEasing)(_jquery.default.easing);
}