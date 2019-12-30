const extend = require('../../../core/utils/extend').extend;
const symbolPoint = require('./symbol_point');
const _extend = extend;
const MIN_BUBBLE_HEIGHT = 20;

module.exports = _extend({}, symbolPoint, {
    correctCoordinates: function(diameter) {
        this.bubbleSize = diameter / 2;
    },

    _drawMarker: function(renderer, group, animationEnabled) {
        const that = this;
        const attr = _extend({ translateX: that.x, translateY: that.y }, that._getStyle());

        that.graphic = renderer.circle(0, 0, animationEnabled ? 0 : that.bubbleSize)
            .smartAttr(attr)
            .data({ 'chart-data-point': that })
            .append(group);
    },

    getTooltipParams: function(location) {
        const that = this;
        const graphic = that.graphic;
        let height;

        if(!graphic) {
            return;
        }

        height = graphic.getBBox().height;
        return {
            x: that.x,
            y: that.y,
            offset: (height < MIN_BUBBLE_HEIGHT) || (location === 'edge') ? height / 2 : 0
        };
    },

    _getLabelFormatObject: function() {
        const formatObject = symbolPoint._getLabelFormatObject.call(this);

        formatObject.size = this.initialSize;

        return formatObject;
    },

    _updateData: function(data) {
        symbolPoint._updateData.call(this, data);
        this.size = this.initialSize = data.size;
    },

    _getGraphicBBox: function() {
        const that = this;
        return that._getSymbolBBox(that.x, that.y, that.bubbleSize);
    },

    _updateMarker: function(animationEnabled, style) {
        const that = this;
        if(!animationEnabled) {
            style = _extend({ r: that.bubbleSize, translateX: that.x, translateY: that.y }, style);
        }
        that.graphic.smartAttr(style);
    },

    _getFormatObject: function(tooltip) {
        const formatObject = symbolPoint._getFormatObject.call(this, tooltip);

        formatObject.sizeText = tooltip.formatValue(this.initialSize);

        return formatObject;
    },

    _storeTrackerR: function() {
        return this.bubbleSize;
    },

    _getLabelCoords: function(label) {
        let coords;

        if(label.getLayoutOptions().position === 'inside') {
            coords = this._getLabelCoordOfPosition(label, 'inside');
        } else {
            coords = symbolPoint._getLabelCoords.call(this, label);
        }

        return coords;
    }
});
