"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _themes_callback = require("../../ui/themes_callback");
var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

if (_jquery.default && !_themes_callback.themeReadyCallback.fired()) {
  const holdReady = _jquery.default.holdReady || _jquery.default.fn.holdReady;
  holdReady(true);
  _themes_callback.themeReadyCallback.add(function () {
    _ready_callbacks.default.add(function () {
      holdReady(false);
    });
  });
}