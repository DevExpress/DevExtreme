"use strict";

exports.default = void 0;
var _window = require("./utils/window");
var _dependency_injector = _interopRequireDefault(require("./utils/dependency_injector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const nativeXMLHttpRequest = {
  getXhr: function () {
    return new window.XMLHttpRequest();
  }
};
var _default = exports.default = (0, _dependency_injector.default)(nativeXMLHttpRequest);
module.exports = exports.default;
module.exports.default = exports.default;