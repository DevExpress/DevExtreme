"use strict";

exports.default = void 0;
var _console = require("./console");
var _dependency_injector = _interopRequireDefault(require("./dependency_injector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = (0, _dependency_injector.default)({
  isWrapped: function () {
    return false;
  },
  isWritableWrapped: function () {
    return false;
  },
  wrap: function (value) {
    return value;
  },
  unwrap: function (value) {
    return value;
  },
  assign: function () {
    _console.logger.error('Method \'assign\' should not be used for not wrapped variables. Use \'isWrapped\' method for ensuring.');
  }
});
module.exports = exports.default;
module.exports.default = exports.default;