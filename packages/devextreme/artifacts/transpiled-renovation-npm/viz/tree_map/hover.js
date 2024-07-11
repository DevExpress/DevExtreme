"use strict";

var _tree_map = _interopRequireDefault(require("./tree_map.base"));
var _node = _interopRequireDefault(require("./node"));
var _helpers = require("../core/helpers");
var _common = require("./common");
var _utils = require("../core/utils");
require("./api");
require("./states");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const proto = _tree_map.default.prototype;
const nodeProto = _node.default.prototype;
const STATE_CODE = 1;
proto._eventsMap.onHoverChanged = {
  name: 'hoverChanged'
};
(0, _helpers.expand)(proto._handlers, 'calculateAdditionalStates', function (states, options) {
  states[1] = options.hoverStyle ? (0, _common.buildRectAppearance)(options.hoverStyle) : {};
});
_tree_map.default.addChange({
  code: 'HOVER_ENABLED',
  handler: function () {
    const hoverEnabled = (0, _utils.parseScalar)(this._getOption('hoverEnabled', true), true);
    if (!hoverEnabled) {
      this.clearHover();
    }
    this._hoverEnabled = hoverEnabled;
  },
  isThemeDependent: true,
  isOptionChange: true,
  option: 'hoverEnabled'
});
nodeProto.statesMap[1] = 1;
nodeProto.additionalStates.push(1);
(0, _helpers.expand)(proto, '_extendProxyType', function (proto) {
  const that = this;
  proto.setHover = function () {
    that._hoverNode(this._id);
  };
  proto.isHovered = function () {
    return that._hoverIndex === this._id;
  };
});
(0, _helpers.expand)(proto, '_onNodesCreated', function () {
  this._hoverIndex = -1;
});
(0, _helpers.expand)(proto, '_changeGroupSettings', function () {
  const that = this;
  that._groupHoverEnabled = (0, _utils.parseScalar)(that._getOption('group').hoverEnabled, true);
  if (!that._groupHoverEnabled) {
    that.clearHover();
  }
});
proto._applyHoverState = function (index, state) {
  setNodeStateRecursive(this._nodes[index], STATE_CODE, state);
  this._eventTrigger('hoverChanged', {
    node: this._nodes[index].proxy
  });
};
function setNodeStateRecursive(node, code, state) {
  const nodes = node.isNode() && node.nodes;
  let i;
  const ii = nodes && nodes.length;
  node.setState(code, state);
  for (i = 0; i < ii; ++i) {
    setNodeStateRecursive(nodes[i], code, state);
  }
}
proto._hoverNode = function (index) {
  const that = this;
  const currentIndex = that._hoverIndex;
  if (that._hoverEnabled && currentIndex !== index) {
    if (!that._groupHoverEnabled && index >= 0 && that._nodes[index].isNode()) {
      that.clearHover();
      return;
    }
    that._context.suspend();
    that._hoverIndex = -1;
    if (currentIndex >= 0) {
      that._applyHoverState(currentIndex, false);
    }
    that._hoverIndex = index;
    if (index >= 0) {
      that._applyHoverState(index, true);
    }
    that._context.resume();
  }
};
proto.clearHover = function () {
  this._hoverNode(-1);
};