/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@js/core/utils/common';
import { extend as _extend } from '@js/core/utils/extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import Node from '@ts/viz/tree_map/node';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;
const nodeProto = Node.prototype;

proto._eventsMap.onNodesInitialized = { name: 'nodesInitialized' };
proto._eventsMap.onNodesRendering = { name: 'nodesRendering' };

proto._createProxyType = function () {
  const that = this;
  let nodes;

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
      return nodes[this._id].parent.proxy || null;
    }

    getChild(index: number): Proxy | null {
      const _nodes = nodes[this._id].nodes;
      return _nodes ? _nodes[index].proxy : null;
    }

    getChildrenCount(): number {
      const _nodes = nodes[this._id].nodes;
      return _nodes ? _nodes.length : 0;
    }

    getAllChildren(): Proxy[] {
      const _nodes = nodes[this._id].nodes;
      let i;
      const ii = _nodes?.length;
      const list: Proxy[] = [];

      for (i = 0; i < ii; ++i) {
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
      let result;

      if (arg !== undefined) {
        updateValue(node, arg > 0 ? Number(arg) : 0);
        change(node, ['TILING']);
        result = this;
      } else {
        result = node.value;
      }
      return result;
    }

    label(arg?: string): string | Proxy {
      const node = nodes[this._id];
      let result;

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

  // TODO: Find a way to make the following methods exist one per module rather then one per instance
  that._handlers.beginBuildNodes = function () {
    nodes = that._nodes;
    new Proxy(that._root);
  };
  that._handlers.buildNode = function (node) {
    new Proxy(node);
  };
  that._handlers.endBuildNodes = function () {
    that._eventTrigger('nodesInitialized', { root: that._root.proxy });
  };
};

function change(node, codes) {
  const { ctx } = node;

  ctx.suspend();
  ctx.change(codes);
  ctx.resume();
}

function collectNodes(node, list) {
  const { nodes } = node;
  let i;
  const ii = nodes?.length;

  for (i = 0; i < ii; ++i) {
    list.push(nodes[i].proxy);
    collectNodes(nodes[i], list);
  }
}

function updateValue(node, value) {
  const delta = value - node.value;

  while (node) {
    node.value += delta;
    node = node.parent;
  }
}

proto._extendProxyType = noop;

const { _resetNodes } = proto;
proto._resetNodes = function () {
  _resetNodes.call(this);
  this._eventTrigger('nodesRendering', { node: this._topNode.proxy });
};

const _updateStyles = nodeProto.updateStyles;
nodeProto.updateStyles = function () {
  const that = this;

  _updateStyles.call(that);
  if (that._custom) {
    that._partialState = (!that.ctx.forceReset && that._partialState) || that.ctx.calculateState(that._custom);
    _extend(true, that.state, that._partialState);
  }
};

const _updateLabelStyle = nodeProto.updateLabelStyle;
nodeProto.updateLabelStyle = function () {
  const that = this;
  const custom = that._custom;

  _updateLabelStyle.call(that);
  if (custom?.label) {
    that._partialLabelState = (!that.ctx.forceReset && that._partialLabelState) || calculatePartialLabelState(that, custom.label);
    that.labelState = _extend(true, {}, that.labelState, that._partialLabelState);
  }
};

function calculatePartialLabelState(node, settings) {
  const state = node.ctx.calculateLabelState(settings);
  if ('visible' in settings) {
    state.visible = !!settings.visible;
  }
  return state;
}

proto.getRootNode = function () {
  return this._root.proxy;
};

proto.resetNodes = function () {
  const context = this._context;

  context.suspend();
  context.change(['NODES_CREATE']);
  context.resume();
  return this;
};
