"use strict";

exports.default = _default;
var _jquery = _interopRequireDefault(require("jquery"));
var _config = _interopRequireDefault(require("../../core/config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

const useJQuery = (0, _config.default)().useJQuery;
if (_jquery.default && useJQuery !== false) {
  (0, _config.default)({
    useJQuery: true
  });
}
function _default() {
  return _jquery.default && (0, _config.default)().useJQuery;
}
module.exports = exports.default;
module.exports.default = exports.default;