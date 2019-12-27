const noop = require('../../../core/utils/common').noop;
const extend = require('../../../core/utils/extend').extend;
const barPoint = require('./bar_point');
const rangeSymbolPointMethods = require('./range_symbol_point');
const _extend = extend;

module.exports = _extend({}, barPoint, {
    deleteLabel: rangeSymbolPointMethods.deleteLabel,

    _getFormatObject: rangeSymbolPointMethods._getFormatObject,

    clearVisibility: function() {
        const graphic = this.graphic;

        if(graphic && graphic.attr('visibility')) {
            graphic.attr({ visibility: null });
        }
    },

    setInvisibility: function() {
        const graphic = this.graphic;

        if(graphic && graphic.attr('visibility') !== 'hidden') {
            graphic.attr({ visibility: 'hidden' });
        }
        this._topLabel.draw(false);
        this._bottomLabel.draw(false);
    },

    getTooltipParams: function(location) {
        const that = this;
        const edgeLocation = location === 'edge';
        let x;
        let y;

        if(that._options.rotated) {
            x = edgeLocation ? that.x + that.width : that.x + that.width / 2;
            y = that.y + that.height / 2;
        } else {
            x = that.x + that.width / 2;
            y = edgeLocation ? that.y : that.y + that.height / 2;
        }

        return { x: x, y: y, offset: 0 };
    },

    _translate: function() {
        const that = this;
        const barMethods = barPoint;
        barMethods._translate.call(that);

        if(that._options.rotated) {
            that.width = that.width || 1;
        } else {
            that.height = that.height || 1;
        }
    },

    hasCoords: rangeSymbolPointMethods.hasCoords,

    _updateData: rangeSymbolPointMethods._updateData,

    _getLabelPosition: rangeSymbolPointMethods._getLabelPosition,

    _getLabelMinFormatObject: rangeSymbolPointMethods._getLabelMinFormatObject,

    _updateLabelData: rangeSymbolPointMethods._updateLabelData,

    _updateLabelOptions: rangeSymbolPointMethods._updateLabelOptions,

    getCrosshairData: rangeSymbolPointMethods.getCrosshairData,

    _createLabel: rangeSymbolPointMethods._createLabel,

    _checkOverlay: rangeSymbolPointMethods._checkOverlay,

    _checkLabelsOverlay: rangeSymbolPointMethods._checkLabelsOverlay,

    _getOverlayCorrections: rangeSymbolPointMethods._getOverlayCorrections,

    _drawLabel: rangeSymbolPointMethods._drawLabel,

    _getLabelCoords: rangeSymbolPointMethods._getLabelCoords,

    _getGraphicBBox: function(location) {
        const isTop = location === 'top';
        const bBox = barPoint._getGraphicBBox.call(this);

        if(!this._options.rotated) {
            bBox.y = isTop ? bBox.y : bBox.y + bBox.height;
            bBox.height = 0;
        } else {
            bBox.x = isTop ? bBox.x + bBox.width : bBox.x;
            bBox.width = 0;
        }

        return bBox;
    },

    getLabel: rangeSymbolPointMethods.getLabel,

    getLabels: rangeSymbolPointMethods.getLabels,

    getBoundingRect: noop,

    getMinValue: rangeSymbolPointMethods.getMinValue,

    getMaxValue: rangeSymbolPointMethods.getMaxValue
});
