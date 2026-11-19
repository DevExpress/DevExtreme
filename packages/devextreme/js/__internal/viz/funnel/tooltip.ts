/* eslint-disable @typescript-eslint/no-this-alias */

import { noop } from '@ts/core/utils/common';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { TooltipPluginMembers } from '@ts/viz/core/tooltip';
import { plugin as pluginTooltip } from '@ts/viz/core/tooltip';
import type Funnel from '@ts/viz/funnel/funnel';
import type Item from '@ts/viz/funnel/item';

type TooltipHost = Funnel & {
  _tooltip: TooltipPluginMembers['_tooltip'];
  _tooltipIndex: number;
  _moveTooltip: (item: Item, coords?: number[]) => void;
};

function getCoords(
  coords: number[] | undefined,
  figureCoords: number[],
  renderer: ThemeValue,
): number[] {
  const offset: { left: number; top: number } = renderer.getRootOffset();

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
    _buildNodes(this: TooltipHost): void {
      this.hideTooltip();
    },

    _change_TILING(this: TooltipHost): void {
      if (this._tooltipIndex >= 0) {
        this._moveTooltip(this._items[this._tooltipIndex]);
      }
    },
  },

  members: {
    hideTooltip(this: TooltipHost): void {
      if (this._tooltipIndex >= 0) {
        this._tooltipIndex = -1;
        this._tooltip.hide();
      }
    },

    _moveTooltip(this: TooltipHost, item: Item, coords?: number[]): void {
      const xy = getCoords(coords, item.coords, this._renderer);
      this._tooltip.move(xy[0], xy[1], 0);
    },

    _showTooltip(this: TooltipHost, index: number, coords?: number[]): void {
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
  customize(constructor: typeof Funnel): void {
    constructor.addPlugin(pluginTooltip);
  },
};
