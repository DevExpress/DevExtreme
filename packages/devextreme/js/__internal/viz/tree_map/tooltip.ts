/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import '@ts/viz/tree_map/api';

import { expand } from '@ts/viz/core/helpers';
// PLUGINS_SECTION\
import { plugin as tooltipPlugin } from '@ts/viz/core/tooltip';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;

expand(proto, '_extendProxyType', function (proto) {
  const that = this;

  proto.showTooltip = function (coords) {
    that._showTooltip(this._id, coords);
  };
});

expand(proto, '_onNodesCreated', function () {
  if (this._tooltipIndex >= 0) {
    this._tooltip.hide();
  }
  this._tooltipIndex = -1;
});

expand(proto, '_onTilingPerformed', function () {
  if (this._tooltipIndex >= 0) {
    this._moveTooltip(this._nodes[this._tooltipIndex]);
  }
});

function getCoords(coords, rect, renderer) {
  const offset = renderer.getRootOffset();
  return coords || (rect && [(rect[0] + rect[2]) / 2 + offset.left, (rect[1] + rect[3]) / 2 + offset.top]) || [-1000, -1000];
}

proto._showTooltip = function (index, coords) {
  const that = this;
  const tooltip = that._tooltip;
  const node = that._nodes[index];
  if (that._tooltipIndex === index) {
    that._moveTooltip(node, coords);
    return;
  }
  const callback = (result) => {
    if (result === undefined) {
      return;
    }
    if (!result) {
      tooltip.hide();
    }
    that._tooltipIndex = result ? index : -1;
  };
  const xy = getCoords(coords, node.rect, this._renderer);
  callback(tooltip.show({
    value: node.value,
    valueText: tooltip.formatValue(node.value),
    node: node.proxy,
  }, { x: xy[0], y: xy[1], offset: 0 }, { node: node.proxy }, undefined, callback));
};

proto._moveTooltip = function (node, coords) {
  const xy = getCoords(coords, node.rect, this._renderer);

  this._tooltip.move(xy[0], xy[1], 0);
};

proto.hideTooltip = function () {
  if (this._tooltipIndex >= 0) {
    this._tooltipIndex = -1;
    this._tooltip.hide();
  }
};

TreeMapBase.addPlugin(tooltipPlugin);
