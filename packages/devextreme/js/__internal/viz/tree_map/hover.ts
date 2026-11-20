/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */

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
  handler(this: TreeMapBase) {
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

expand(proto, '_extendProxyType', function (this: TreeMapBase, proto) {
  const that = this;

  proto.setHover = function (this: Pick<Node, '_id'>): void {
    that._hoverNode(this._id);
  };
  proto.isHovered = function (this: Pick<Node, '_id'>): boolean {
    return that._hoverIndex === this._id;
  };
});

expand(proto, '_onNodesCreated', function (this: TreeMapBase) {
  this._hoverIndex = -1;
});

expand(proto, '_changeGroupSettings', function (this: TreeMapBase) {
  const that = this;
  that._groupHoverEnabled = _parseScalar(that._getOption('group').hoverEnabled, true);
  if (!that._groupHoverEnabled) {
    that.clearHover();
  }
});

proto._applyHoverState = function (this: TreeMapBase, index, state): void {
  setNodeStateRecursive(this._nodes[index], STATE_CODE, state);
  this._eventTrigger('hoverChanged', { node: this._nodes[index].proxy });
};

function setNodeStateRecursive(node, code, state): void {
  const nodes = node.isNode() && node.nodes;
  let i;
  const ii = nodes?.length;

  node.setState(code, state);
  for (i = 0; i < ii; i += 1) {
    setNodeStateRecursive(nodes[i], code, state);
  }
}

proto._hoverNode = function (this: TreeMapBase, index): void {
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

proto.clearHover = function (this: TreeMapBase): void {
  this._hoverNode(-1);
};
