"use strict";

exports.default = void 0;
var _tree_map = _interopRequireDefault(require("./tree_map.base"));
require("./tiling.squarified");
require("./tiling.strip");
require("./tiling.slice_and_dice");
require("./tiling.rotated_slice_and_dice");
require("./colorizing.discrete");
require("./colorizing.gradient");
require("./colorizing.range");
require("./api");
require("./hover");
require("./selection");
require("./tooltip");
require("./tracker");
require("./drilldown");
require("./plain_data_source");
var _export = require("../core/export");
var _title = require("../core/title");
var _loading_indicator = require("../core/loading_indicator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = _tree_map.default; // PLUGINS_SECTION
_tree_map.default.addPlugin(_export.plugin);
_tree_map.default.addPlugin(_title.plugin);
_tree_map.default.addPlugin(_loading_indicator.plugin);
module.exports = exports.default;
module.exports.default = exports.default;