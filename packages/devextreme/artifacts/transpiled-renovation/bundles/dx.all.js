"use strict";

exports.default = void 0;
require("./modules/parts/widgets-web");
require("./modules/parts/viz");
var _core = _interopRequireDefault(require("./modules/core"));
var _events_strategy = require("../core/events_strategy");
var _index = require("../core/options/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_core.default.integration = {};
_core.default.integration.EventsStrategy = _events_strategy.EventsStrategy;
_core.default.integration.Options = _index.Options;
var _default = exports.default = _core.default;
module.exports = exports.default;
module.exports.default = exports.default;