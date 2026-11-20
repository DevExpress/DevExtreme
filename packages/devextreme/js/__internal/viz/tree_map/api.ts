/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { dxTreeMapNode } from '@js/viz/tree_map';
import { noop } from '@ts/core/utils/common';
import { extend as _extend } from '@ts/core/utils/extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { TextAppearance } from '@ts/viz/tree_map/common';
import Node from '@ts/viz/tree_map/node';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;
const nodeProto = Node.prototype;

proto._eventsMap.onNodesInitialized = { name: 'nodesInitialized' };
proto._eventsMap.onNodesRendering = { name: 'nodesRendering' };

proto._createProxyType = function (this: TreeMapBase): void {
  const that = this;
  let nodes: Node[];

  class Proxy {
    declare _id: number;

    declare level: number;

    declare index: number;

    declare data: ThemeValue;

    constructor(node: Node) {
      node.proxy = this;
      this._id = node._id;
      this.level = node.level;
      this.index = node.index;
      this.data = node.data;
    }

    getParent(): Proxy | null {
      return (nodes[this._id].parent.proxy as Proxy | undefined) || null;
    }

    getChild(index: number): Proxy | null {
      const _nodes = nodes[this._id].nodes;
      return _nodes ? _nodes[index].proxy as Proxy : null;
    }

    getChildrenCount(): number {
      const _nodes = nodes[this._id].nodes;
      return _nodes ? _nodes.length : 0;
    }

    getAllChildren(): Proxy[] {
      const _nodes: ThemeValue = nodes[this._id].nodes;
      let i;
      const ii = _nodes?.length;
      const list: Proxy[] = [];

      for (i = 0; i < ii; i += 1) {
        list.push(_nodes[i].proxy);
      }
      return list;
    }

    getAllNodes(): Proxy[] {
      const list: Proxy[] = [];

      collectNodes(nodes[this._id], list);
      return list;
    }

    isLeaf(): boolean {
      return !nodes[this._id].isNode();
    }

    isActive(): boolean {
      return nodes[this._id].isActive();
    }

    value(arg?: number): number | Proxy {
      const node = nodes[this._id];
      let result: number | Proxy;

      if (arg !== undefined) {
        updateValue(node, arg > 0 ? Number(arg) : 0);
        change(node, ['TILING']);
        result = this;
      } else {
        result = node.value;
      }
      return result;
    }

    label(arg?: string): string | Proxy | null {
      const node = nodes[this._id];
      let result: string | Proxy | null;

      if (arg !== undefined) {
        node.customLabel = arg ? String(arg) : null;
        change(node, ['LABELS']);
        result = this;
      } else {
        result = node.customLabel || node.label;
      }
      return result;
    }

    customize(settings: ThemeValue): Proxy {
      const node = nodes[this._id];

      if (settings) {
        node._custom = node._custom || {};
        _extend(true, node._custom, settings);
        node._partialState = node._partialLabelState = null;
      }
      change(node, ['TILES', 'LABELS']);
      return this;
    }

    resetCustomization(): Proxy {
      const node = nodes[this._id];

      node._custom = node._partialState = node._partialLabelState = null;
      change(node, ['TILES', 'LABELS']);
      return this;
    }
  }

  that._extendProxyType(Proxy.prototype);

  // TODO: Find a way to make the following methods exist one per module rather then one per
  // instance
  that._handlers.beginBuildNodes = function (): void {
    nodes = that._nodes;
    new Proxy(that._root);
  };
  that._handlers.buildNode = function (node): void {
    new Proxy(node);
  };
  that._handlers.endBuildNodes = function (): void {
    that._eventTrigger('nodesInitialized', { root: that._root.proxy });
  };
};

function change(node, codes): void {
  const { ctx } = node;

  ctx.suspend();
  ctx.change(codes);
  ctx.resume();
}

function collectNodes(node, list): void {
  const { nodes } = node;
  let i;
  const ii = nodes?.length;

  for (i = 0; i < ii; i += 1) {
    list.push(nodes[i].proxy);
    collectNodes(nodes[i], list);
  }
}

function updateValue(node, value): void {
  const delta = value - node.value;

  while (node) {
    node.value += delta;
    node = node.parent;
  }
}

proto._extendProxyType = noop;

const { _resetNodes } = proto;
proto._resetNodes = function (this: TreeMapBase): void {
  _resetNodes.call(this);
  this._eventTrigger('nodesRendering', { node: this._topNode.proxy });
};

const _updateStyles = nodeProto.updateStyles;
nodeProto.updateStyles = function (this: Node): void {
  const that = this;

  _updateStyles.call(that);
  if (that._custom) {
    that._partialState = (!that.ctx.forceReset && that._partialState)
      || that.ctx.calculateState(that._custom);
    _extend(true, that.state, that._partialState);
  }
};

const _updateLabelStyle = nodeProto.updateLabelStyle;
nodeProto.updateLabelStyle = function (this: Node): void {
  const that = this;
  const custom = that._custom;

  _updateLabelStyle.call(that);
  if (custom?.label) {
    that._partialLabelState = (!that.ctx.forceReset && that._partialLabelState)
      || calculatePartialLabelState(that, custom.label);
    that.labelState = _extend(true, {}, that.labelState, that._partialLabelState);
  }
};

function calculatePartialLabelState(node: Node, settings: ThemeValue): TextAppearance {
  const state: TextAppearance = node.ctx.calculateLabelState(settings);
  if ('visible' in settings) {
    state.visible = !!settings.visible;
  }
  return state;
}

proto.getRootNode = function (this: TreeMapBase): dxTreeMapNode {
  return this._root.proxy as dxTreeMapNode;
};

proto.resetNodes = function (this: TreeMapBase): TreeMapBase {
  const context = this._context;

  context.suspend();
  context.change(['NODES_CREATE']);
  context.resume();
  return this;
};
