import { noop } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import barPoint from './bar_point';
import rangeSymbolPointMethods from './range_symbol_point';
const _extend = extend;

export default _extend({}, barPoint, {
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

    getLabel: rangeSymbolPointMethods.getLabel,

    getLabels: rangeSymbolPointMethods.getLabels,

    getBoundingRect: noop,

    getMinValue: rangeSymbolPointMethods.getMinValue,

    getMaxValue: rangeSymbolPointMethods.getMaxValue
});
