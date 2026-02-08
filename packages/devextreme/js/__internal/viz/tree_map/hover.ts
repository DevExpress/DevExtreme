/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import '@ts/viz/tree_map/api';
import '@ts/viz/tree_map/states';

import { expand } from '@ts/viz/core/helpers';
import { parseScalar as _parseScalar } from '@ts/viz/core/utils';
import { buildRectAppearance } from '@ts/viz/tree_map/common';
import Node from '@ts/viz/tree_map/node';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;
const nodeProto = Node.prototype;

const STATE_CODE = 1;

proto._eventsMap.onHoverChanged = { name: 'hoverChanged' };

expand(proto._handlers, 'calculateAdditionalStates', (states, options) => {
  states[1] = options.hoverStyle ? buildRectAppearance(options.hoverStyle) : {};
});

TreeMapBase.addChange({
  code: 'HOVER_ENABLED',
  handler() {
    const hoverEnabled = _parseScalar(this._getOption('hoverEnabled', true), true);
    if (!hoverEnabled) {
      this.clearHover();
    }
    this._hoverEnabled = hoverEnabled;
  },
  isThemeDependent: true,
  isOptionChange: true,
  option: 'hoverEnabled',
});

nodeProto.statesMap[1] = 1;
nodeProto.additionalStates.push(1);

expand(proto, '_extendProxyType', function (proto) {
  const that = this;

  proto.setHover = function () {
    that._hoverNode(this._id);
  };
  proto.isHovered = function () {
    return that._hoverIndex === this._id;
  };
});

expand(proto, '_onNodesCreated', function () {
  this._hoverIndex = -1;
});

expand(proto, '_changeGroupSettings', function () {
  const that = this;
  that._groupHoverEnabled = _parseScalar(that._getOption('group').hoverEnabled, true);
  if (!that._groupHoverEnabled) {
    that.clearHover();
  }
});

proto._applyHoverState = function (index, state) {
  setNodeStateRecursive(this._nodes[index], STATE_CODE, state);
  this._eventTrigger('hoverChanged', { node: this._nodes[index].proxy });
};

function setNodeStateRecursive(node, code, state) {
  const nodes = node.isNode() && node.nodes;
  let i;
  const ii = nodes?.length;

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
