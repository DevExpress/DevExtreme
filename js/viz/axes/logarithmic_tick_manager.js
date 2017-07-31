"use strict";

var vizUtils = require("../core/utils"),
    dateUtils = require("../../core/utils/date"),
    extend = require("../../core/utils/extend").extend,
    typeUtils = require("../../core/utils/type"),
    _isDefined = typeUtils.isDefined,
    _addInterval = dateUtils.addInterval,
    _adjustValue = vizUtils.adjustValue,
    tickManagerContinuous = require("./numeric_tick_manager").continuous,
    _getLog = vizUtils.getLog,
    _raiseTo = vizUtils.raiseTo,

    _math = Math,
    _abs = _math.abs,
    _ceil = _math.ceil,
    _floor = _math.floor,
    _round = _math.round;

exports.logarithmic = extend({}, tickManagerContinuous, {

    _correctMax: function() {
        var base = this._options.base;

        this._max = _adjustValue(_raiseTo(_ceil(_adjustValue(_getLog(this._max, base))), base));
    },

    _correctMin: function() {
        var base = this._options.base;

        this._min = _adjustValue(_raiseTo(_floor(_adjustValue(_getLog(this._min, base))), base));
    },

    _findBusinessDelta: function(min, max, isTickIntervalWithPow) {
        var delta;

        if(min <= 0 || max <= 0) {
            return 0;
        }

        if(isTickIntervalWithPow === false) {
            delta = tickManagerContinuous._findBusinessDelta(min, max);
        } else {
            delta = _round(_abs(_getLog(min, this._options.base) - _getLog(max, this._options.base)));
        }

        return delta;
    },

    _findTickIntervalForCustomTicks: function() {
        return _adjustValue(_getLog(this._customTicks[1] / this._customTicks[0], this._options.base));
    },

    _getInterval: function(deltaCoef) {
        var interval = deltaCoef || this._getDeltaCoef(this._screenDelta, this._businessDelta, this._options.gridSpacingFactor),
            multipliers = this._options.numberMultipliers,
            factor,
            result = 0,
            hasResult = false,
            i;

        if(interval !== 0) {
            for(factor = 1; !hasResult; factor *= 10) {
                for(i = 0; i < multipliers.length; i++) {
                    result = multipliers[i] * factor;
                    if(interval <= result) {
                        hasResult = true;
                        break;
                    }
                }
            }
        }

        return _adjustValue(result);
    },


    _getMinorInterval: function(screenDelta, businessDelta) {
        var that = this,
            options = that._options,
            minorTickCount = options.minorTickCount,
            intervalsCount = _isDefined(minorTickCount) ? minorTickCount + 1 : _floor(screenDelta / options.minorGridSpacingFactor),
            count = intervalsCount - 1,
            interval = count > 0 ? businessDelta / intervalsCount : 0;

        that._minorTickInterval = interval;
        that._minorTickCount = count;
    },

    _getNextTickValue: function(value, tickInterval, isTickIntervalNegative, isTickIntervalWithPow) {
        var that = this,
            pow,
            nextTickValue;

        tickInterval = _isDefined(isTickIntervalNegative) && isTickIntervalNegative ? -tickInterval : tickInterval;

        if(isTickIntervalWithPow === false) {
            nextTickValue = value + tickInterval;
        } else {
            pow = _addInterval(_getLog(value, that._options.base), tickInterval, that._min > that._max);
            nextTickValue = _adjustValue((_raiseTo(pow, that._options.base)));
        }

        return nextTickValue;
    }
});
