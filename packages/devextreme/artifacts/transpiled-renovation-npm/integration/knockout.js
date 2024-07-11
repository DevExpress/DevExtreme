"use strict";

var _knockout = _interopRequireDefault(require("knockout"));
var _errors = _interopRequireDefault(require("../core/errors"));
var _version = require("../core/utils/version");
require("./knockout/component_registrator");
require("./knockout/event_registrator");
require("./knockout/components");
require("./knockout/validation");
require("./knockout/variable_wrapper_utils");
require("./knockout/clean_node");
require("./knockout/clean_node_old");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

// Check availability in global environment
if (_knockout.default) {
  if ((0, _version.compare)(_knockout.default.version, [2, 3]) < 0) {
    throw _errors.default.Error('E0013');
  }
}