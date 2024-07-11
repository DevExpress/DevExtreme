"use strict";

exports.default = void 0;
var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));
var _dependency_injector = _interopRequireDefault(require("./dependency_injector"));
var _window = require("./window");
var _call_once = _interopRequireDefault(require("./call_once"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let callbacks = [];
const subscribeReady = (0, _call_once.default)(() => {
  const removeListener = _dom_adapter.default.listen(_dom_adapter.default.getDocument(), 'DOMContentLoaded', () => {
    readyCallbacks.fire();
    removeListener();
  });
});
const readyCallbacks = {
  add: callback => {
    const windowExists = (0, _window.hasWindow)();
    if (windowExists && _dom_adapter.default.getReadyState() !== 'loading') {
      callback();
    } else {
      callbacks.push(callback);
      windowExists && subscribeReady();
    }
  },
  fire: () => {
    callbacks.forEach(callback => callback());
    callbacks = [];
  }
};
var _default = exports.default = (0, _dependency_injector.default)(readyCallbacks);
module.exports = exports.default;
module.exports.default = exports.default;