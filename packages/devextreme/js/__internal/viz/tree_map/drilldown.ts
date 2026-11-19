/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */

import '@ts/viz/tree_map/api';

import type { dxTreeMapNode } from '@js/viz/tree_map';
import { expand } from '@ts/viz/core/helpers';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;

proto._eventsMap.onDrill = { name: 'drill' };

expand(proto, '_extendProxyType', function (proto) {
  const that = this;

  proto.drillDown = function (): void {
    that._drillToNode(this._id);
  };
});

expand(proto, '_onNodesCreated', function () {
  this._drilldownIndex = -1;
});

proto._drillToNode = function (index): void {
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
      that._eventTrigger('drill', { node: node.proxy });
    }
  }
};

proto.resetDrillDown = function (this: TreeMapBase): TreeMapBase {
  this._drillToNode(-1);
  return this;
};

proto.drillUp = function (this: TreeMapBase): TreeMapBase {
  this._drillToNode(this._topNode.parent._id || -1);
  return this;
};

proto.getCurrentNode = function (this: TreeMapBase): dxTreeMapNode {
  return this._topNode.proxy as dxTreeMapNode;
};
