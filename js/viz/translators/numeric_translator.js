var isDefined = require("../../core/utils/type").isDefined,
    round = Math.round;

module.exports = {
    translate: function(bp, direction) {
        var that = this,
            specialValue = that.translateSpecialCase(bp);

        if(isDefined(specialValue)) {
            return specialValue;
        }

        if(isNaN(bp)) {
            return null;
        }
        return that.to(bp, direction);
    },

    untranslate: function(pos, _, enableOutOfCanvas, direction) {
        var that = this,
            canvasOptions = that._canvasOptions,
            startPoint = canvasOptions.startPoint;

        if((!enableOutOfCanvas && (pos < startPoint || pos > canvasOptions.endPoint)) || !isDefined(canvasOptions.rangeMin) || !isDefined(canvasOptions.rangeMax)) {
            return null;
        }
        return that.from(pos, direction);
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
            min: that.untranslate(newStart, undefined, true, 1),
            max: that.untranslate(newEnd, undefined, true, -1),
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
        var that = this,
            co = that._canvasOptions;

        return value !== null &&
            !isNaN(value) &&
            value.valueOf() + co.rangeDoubleError >= co.rangeMin &&
            value.valueOf() - co.rangeDoubleError <= co.rangeMax;
    },

    getCorrectValue: function(value, direction) {
        var that = this,
            breaks = that._breaks,
            prop;

        value = that._parse(value);

        if(that._breaks) {
            prop = that._checkValueAboutBreaks(breaks, value, "trFrom", "trTo", that._checkingMethodsAboutBreaks[0]);
            if(prop.inBreak === true) {
                return direction > 0 ? prop.break.trTo : prop.break.trFrom;
            }
        }

        return value;
    },

    _parse: function(value) {
        return Number(value);
    },

    to: function(bp, direction) {
        var that = this,
            canvasOptions = that._canvasOptions,
            breaks = that._breaks,
            prop = { length: 0 },
            commonBreakSize = 0;

        if(breaks !== undefined) {
            prop = that._checkValueAboutBreaks(breaks, bp, "trFrom", "trTo", that._checkingMethodsAboutBreaks[0]);
            commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
        }
        if(prop.inBreak === true) {
            if(direction > 0) {
                return prop.break.start;
            } else if(direction < 0) {
                return prop.break.end;
            } else {
                return null;
            }
        }
        return that._conversionValue(that._calculateProjection((bp - canvasOptions.rangeMinVisible - prop.length) *
            canvasOptions.ratioOfCanvasRange + commonBreakSize));
    },

    from: function(pos, direction) {
        var that = this,
            breaks = that._breaks,
            prop = { length: 0 },
            canvasOptions = that._canvasOptions,
            startPoint = canvasOptions.startPoint,
            commonBreakSize = 0;

        if(breaks !== undefined) {
            prop = that._checkValueAboutBreaks(breaks, pos, "start", "end", that._checkingMethodsAboutBreaks[1]);
            commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
        }

        if(prop.inBreak === true) {
            if(direction > 0) {
                return prop.break.trTo;
            } else if(direction < 0) {
                return prop.break.trFrom;
            } else {
                return null;
            }
        }

        return this._calculateUnProjection((pos - startPoint - commonBreakSize) / canvasOptions.ratioOfCanvasRange + prop.length);
    },

    _add: function(value, diff, coeff) {
        return value + diff * coeff;
    },

    isValueProlonged: false
};
