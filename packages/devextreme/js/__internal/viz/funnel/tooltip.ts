/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { noop } from '@ts/core/utils/common';
import { plugin as pluginTooltip } from '@ts/viz/core/tooltip';

function getCoords(coords, figureCoords, renderer) {
  const offset = renderer.getRootOffset();

  return (
    coords
    || (figureCoords && [
      (figureCoords[0] + figureCoords[2]) / 2 + offset.left,
      (figureCoords[1] + figureCoords[5]) / 2 + offset.top,
    ]) || [-1000, -1000]
  );
}

export const plugin = {
  name: 'funnel-tooltip',
  init: noop,
  dispose: noop,

  extenders: {
    _buildNodes(): void {
      this.hideTooltip();
    },

    _change_TILING(): void {
      if (this._tooltipIndex >= 0) {
        this._moveTooltip(this._items[this._tooltipIndex]);
      }
    },
  },

  members: {
    hideTooltip(): void {
      if (this._tooltipIndex >= 0) {
        this._tooltipIndex = -1;
        this._tooltip.hide();
      }
    },

    _moveTooltip(item, coords): void {
      const xy = getCoords(coords, item.coords, this._renderer);
      this._tooltip.move(xy[0], xy[1], 0);
    },

    _showTooltip(index, coords): void {
      const that = this;
      const tooltip = that._tooltip;
      const item = that._items[index];

      if (that._tooltipIndex === index) {
        that._moveTooltip(item, coords);
        return;
      }

      const callback = (result): void => {
        if (result === undefined) {
          return;
        }
        if (!result) {
          tooltip.hide();
        }
        that._tooltipIndex = result ? index : -1;
      };
      const xy = getCoords(coords, item.coords, this._renderer);
      callback(tooltip.show({
        value: item.value,
        valueText: tooltip.formatValue(item.value),
        percentText: tooltip.formatValue(item.percent, 'percent'),
        percent: item.percent,
        item,
      }, { x: xy[0], y: xy[1], offset: 0 }, { item }, undefined, callback));
    },
  },
  customize(constructor): void {
    constructor.addPlugin(pluginTooltip);
  },
};
