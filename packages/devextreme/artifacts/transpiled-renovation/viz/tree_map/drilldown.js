"use strict";

var _tree_map = _interopRequireDefault(require("./tree_map.base"));
var _helpers = require("../core/helpers");
require("./api");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const proto = _tree_map.default.prototype;
proto._eventsMap.onDrill = {
  name: 'drill'
};
(0, _helpers.expand)(proto, '_extendProxyType', function (proto) {
  const that = this;
  proto.drillDown = function () {
    that._drillToNode(this._id);
  };
});
(0, _helpers.expand)(proto, '_onNodesCreated', function () {
  this._drilldownIndex = -1;
});
proto._drillToNode = function (index) {
  const that = this;
  let node;
  if (that._drilldownIndex !== index) {
    node = that._nodes[index] || that._root;
    if (node.nodes) {
      that._drilldownIndex = index;
      that._topNode = node;
      that._context.suspend();
      that._context.change(['MAX_DEPTH', 'NODES_RESET']);
      that._context.resume();
      that._eventTrigger('drill', {
        node: node.proxy
      });
    }
  }
};
proto.resetDrillDown = function () {
  this._drillToNode(-1);
  return this;
};
proto.drillUp = function () {
  this._drillToNode(this._topNode.parent._id || -1);
  return this;
};
proto.getCurrentNode = function () {
  return this._topNode.proxy;
};