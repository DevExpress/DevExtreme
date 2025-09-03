/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import '@ts/viz/tree_map/api';
import '@ts/viz/tree_map/states';

import { expand } from '@ts/viz/core/helpers';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import { buildRectAppearance } from '@ts/viz/tree_map/common';
import Node from '@ts/viz/tree_map/node';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;
const nodeProto = Node.prototype;

const MODE_NONE = 0;
const MODE_SINGLE = 1;
const MODE_MULTIPLE = 2;

const STATE_CODE = 2;

proto._eventsMap.onSelectionChanged = { name: 'selectionChanged' };

expand(proto._handlers, 'calculateAdditionalStates', (states, options) => {
  states[2] = options.selectionStyle ? buildRectAppearance(options.selectionStyle) : {};
});

nodeProto.statesMap[2] = nodeProto.statesMap[3] = STATE_CODE;
nodeProto.additionalStates.push(2);

expand(proto, '_onNodesCreated', function () {
  this._selectionList.length = 0;
});

expand(proto, '_extendProxyType', function (proto) {
  const that = this;

  proto.select = function (state) {
    that._selectNode(this._id, !!state);
  };
  proto.isSelected = function () {
    return that._selectionList.includes(this._id);
  };
  that._selectionList = [];
});

TreeMapBase.addChange({
  code: 'SELECTION_MODE',
  handler() {
    const that = this;
    const option = _normalizeEnum(that._getOption('selectionMode', true));
    const selectionList = that._selectionList;
    let tmp;

    const mode = option === 'none' ? MODE_NONE : option === 'multiple' ? MODE_MULTIPLE : MODE_SINGLE;
    if (mode === MODE_SINGLE && selectionList.length > 1) {
      tmp = selectionList.pop();
      that.clearSelection();
      selectionList.push(tmp);
    } else if (mode === MODE_NONE) {
      that.clearSelection();
    }
    that._selectionMode = mode;
  },
  isThemeDependent: true,
  isOptionChange: true,
  option: 'selectionMode',
});

expand(proto, '_applyTilesAppearance', function () {
  if (this._selectionList.length) {
    bringSelectedTilesToForeground(this._nodes, this._selectionList);
  }
});

const tileToFront = [leafToFront, groupToFront];

function bringSelectedTilesToForeground(nodes, selectionList) {
  let i;
  const ii = selectionList.length;
  let node;

  for (i = 0; i < ii; ++i) {
    node = nodes[selectionList[i]];
    tileToFront[Number(node.isNode())](node.tile);
  }
}

function leafToFront(content) {
  content.toForeground();
}

function groupToFront(content) {
  content.outer.toForeground();
  content.inner.toForeground();
}

proto._applySelectionState = function (index, state) {
  const node = this._nodes[index];

  node.setState(STATE_CODE, state);
  this._eventTrigger('selectionChanged', { node: node.proxy });
};

proto._selectNode = function (index, state) {
  const that = this;
  let selectionList;
  let k;
  let tmp;

  if (that._selectionMode !== MODE_NONE) {
    that._context.suspend();
    selectionList = that._selectionList;
    k = selectionList.indexOf(index);
    if (state && k === -1) {
      if (that._selectionMode === MODE_SINGLE) {
        if (selectionList.length) {
          tmp = selectionList.pop();
          that._applySelectionState(tmp, false);
        }
      }
      selectionList.push(index);
      that._applySelectionState(index, true);
    } else if (!state && k >= 0) {
      selectionList.splice(k, 1);
      that._applySelectionState(index, false);
    }
    that._context.resume();
  }
};

proto.clearSelection = function () {
  const that = this;
  const selectionList = that._selectionList;
  let i;
  const ii = selectionList.length;

  if (that._selectionMode !== MODE_NONE) {
    that._context.suspend();
    for (i = 0; i < ii; ++i) {
      that._applySelectionState(selectionList[i], false);
    }
    selectionList.length = 0;
    that._context.resume();
  }
};
