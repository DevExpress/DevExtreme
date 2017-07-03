"use strict";

var isDefined = require("../../core/utils/type").isDefined,
    round = Math.round;

module.exports = {
    translate: function(bp) {
        var that = this,
            canvasOptions = that._canvasOptions,
            doubleError = canvasOptions.rangeDoubleError,
            specialValue = that.translateSpecialCase(bp);

        if(isDefined(specialValue)) {
            return specialValue;
        }

        if(isNaN(bp) || bp.valueOf() + doubleError < canvasOptions.rangeMin || bp.valueOf() - doubleError > canvasOptions.rangeMax) {
            return null;
        }
        return that._conversionValue(that._calculateProjection((bp - canvasOptions.rangeMinVisible) * canvasOptions.ratioOfCanvasRange));
    },

    untranslate: function(pos, _directionOffset, enableOutOfCanvas) {
        var canvasOptions = this._canvasOptions,
            startPoint = canvasOptions.startPoint;

        if((!enableOutOfCanvas && (pos < startPoint || pos > canvasOptions.endPoint)) || !isDefined(canvasOptions.rangeMin) || !isDefined(canvasOptions.rangeMax)) {
            return null;
        }

        return (this._calculateUnProjection((pos - startPoint) / canvasOptions.ratioOfCanvasRange));
    },

    getInterval: function() {
        return round(this._canvasOptions.ratioOfCanvasRange * (this._businessRange.interval || Math.abs(this._canvasOptions.rangeMax - this._canvasOptions.rangeMin)));
    },

    _getValue: function(val) {
        return val;
    },

    zoom: function(translate, scale) {
        var that = this,
            canvasOptions = that._canvasOptions,

            startPoint = canvasOptions.startPoint,
            endPoint = canvasOptions.endPoint,

            newStart = (startPoint + translate) / scale,
            newEnd = (endPoint + translate) / scale,

            translatedRangeMinMax = [that.translate(that._getValue(canvasOptions.rangeMin)), that.translate(that._getValue(canvasOptions.rangeMax))],

            minPoint = Math.min(translatedRangeMinMax[0], translatedRangeMinMax[1]),
            maxPoint = Math.max(translatedRangeMinMax[0], translatedRangeMinMax[1]);

        if(minPoint > newStart) {
            newEnd -= newStart - minPoint;
            newStart = minPoint;
        }

        if(maxPoint < newEnd) {
            newStart -= newEnd - maxPoint;
            newEnd = maxPoint;
        }
        if((maxPoint - minPoint) < (newEnd - newStart)) {
            newStart = minPoint;
            newEnd = maxPoint;
        }

        translate = (endPoint - startPoint) * newStart / (newEnd - newStart) - startPoint;
        scale = ((startPoint + translate) / newStart) || 1;

        return {
            min: that.untranslate(newStart, undefined, true),
            max: that.untranslate(newEnd, undefined, true),
            translate: translate,
            scale: scale
        };
    },

    getMinScale: function(zoom) {
        return zoom ? 1.1 : 0.9;
    },

    getScale: function(val1, val2) {
        var canvasOptions = this._canvasOptions;
        val1 = isDefined(val1) ? val1 : canvasOptions.rangeMin;
        val2 = isDefined(val2) ? val2 : canvasOptions.rangeMax;
        return (canvasOptions.rangeMax - canvasOptions.rangeMin) / Math.abs(val1 - val2);
    },

    // dxRangeSelector

    isValid: function(value) {
        var co = this._canvasOptions;
        return value !== null && !isNaN(value) && value.valueOf() + co.rangeDoubleError >= co.rangeMin && value.valueOf() - co.rangeDoubleError <= co.rangeMax;
    },

    parse: function(value) {
        return Number(value);
    },

    to: function(value) {
        return this._conversionValue(this._calculateProjection((value - this._canvasOptions.rangeMinVisible) * this._canvasOptions.ratioOfCanvasRange));
    },

    from: function(position) {
        return (this._calculateUnProjection((position - this._canvasOptions.startPoint) / this._canvasOptions.ratioOfCanvasRange));
    },

    _add: function(value, diff, coeff) {
        return value + diff * coeff;
    },

    isValueProlonged: false
};
