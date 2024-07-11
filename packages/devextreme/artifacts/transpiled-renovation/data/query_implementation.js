"use strict";

exports.queryImpl = void 0;
var _array_query = _interopRequireDefault(require("./array_query"));
var _remote_query = _interopRequireDefault(require("./remote_query"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const queryImpl = exports.queryImpl = {
  array: _array_query.default,
  remote: _remote_query.default
};