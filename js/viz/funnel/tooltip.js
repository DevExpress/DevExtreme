import { noop } from '../../core/utils/common';
import { plugin as pluginTooltip } from '../core/tooltip';

function getCoords(figureCoords, renderer) {
    const offset = renderer.getRootOffset();

    return [(figureCoords[0] + figureCoords[2]) / 2 + offset.left, (figureCoords[1] + figureCoords[5]) / 2 + offset.top];
}

export const plugin = {
    name: 'funnel-tooltip',
    init: noop,
    dispose: noop,

    extenders: {
        _buildNodes: function() {
            this.hideTooltip();
        },

        _change_TILING: function() {
            if(this._tooltipIndex >= 0) {
                this._moveTooltip(this._items[this._tooltipIndex]);
            }
        }
    },

    members: {
        hideTooltip: function() {
            if(this._tooltipIndex >= 0) {
                this._tooltipIndex = -1;
                this._tooltip.hide();
            }
        },

        _moveTooltip: function(item, coords) {
            const xy = coords || (item.coords && getCoords(item.coords, this._renderer)) || [-1000, -1000];

            this._tooltip.move(xy[0], xy[1], 0);
        },

        _showTooltip: function(index, coords) {
            const that = this;
            const tooltip = that._tooltip;
            const item = that._items[index];

            if(that._tooltipIndex === index) {
                that._moveTooltip(item, coords);
                return;
            }

            const callback = (result) => {
                if(result) {
                    that._moveTooltip(item, coords);
                } else {
                    tooltip.hide();
                }
                that._tooltipIndex = result ? index : -1;
            };

            callback(tooltip.show({
                value: item.value,
                valueText: tooltip.formatValue(item.value),
                percentText: tooltip.formatValue(item.percent, 'percent'),
                percent: item.percent,
                item: item
            }, { x: 0, y: 0, offset: 0 }, { item: item }, undefined, callback));
        }
    },
    customize: function(constructor) {
        constructor.addPlugin(pluginTooltip);
    }
};

