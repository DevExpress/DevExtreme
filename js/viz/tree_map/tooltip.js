import { expand } from '../core/helpers';
import TreeMapBase from './tree_map.base';

const proto = TreeMapBase.prototype;

import './api';

expand(proto, '_extendProxyType', function(proto) {
    const that = this;

    proto.showTooltip = function(coords) {
        that._showTooltip(this._id, coords);
    };
});

expand(proto, '_onNodesCreated', function() {
    if(this._tooltipIndex >= 0) {
        this._tooltip.hide();
    }
    this._tooltipIndex = -1;
});

expand(proto, '_onTilingPerformed', function() {
    if(this._tooltipIndex >= 0) {
        this._moveTooltip(this._nodes[this._tooltipIndex]);
    }
});

function getCoords(rect, renderer) {
    const offset = renderer.getRootOffset();
    return [(rect[0] + rect[2]) / 2 + offset.left, (rect[1] + rect[3]) / 2 + offset.top];
}

proto._showTooltip = function(index, coords) {
    const that = this;
    const tooltip = that._tooltip;
    const node = that._nodes[index];
    if(that._tooltipIndex === index) {
        that._moveTooltip(node, coords);
        return;
    }
    const callback = (result) => {
        if(result) {
            that._moveTooltip(node, coords);
        } else {
            tooltip.hide();
        }
        that._tooltipIndex = result ? index : -1;
    };
    callback(tooltip.show({
        value: node.value,
        valueText: tooltip.formatValue(node.value),
        node: node.proxy
    }, { x: 0, y: 0, offset: 0 }, { node: node.proxy }, undefined, callback));
};

proto._moveTooltip = function(node, coords) {
    const xy = coords || (node.rect && getCoords(node.rect, this._renderer)) || [-1000, -1000];

    this._tooltip.move(xy[0], xy[1], 0);
};

proto.hideTooltip = function() {
    if(this._tooltipIndex >= 0) {
        this._tooltipIndex = -1;
        this._tooltip.hide();
    }
};

// PLUGINS_SECTION\
import { plugin as tooltipPlugin } from '../core/tooltip';
TreeMapBase.addPlugin(tooltipPlugin);
