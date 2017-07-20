"use strict";

var vizUtils = require("../core/utils"),
    _noop = require("../../core/utils/common").noop,
    _isDefined = require("../../core/utils/type").isDefined,
    _adjustValue = vizUtils.adjustValue,

    _math = Math,
    _abs = _math.abs,
    _ceil = _math.ceil,
    _floor = _math.floor,

    MINOR_TICKS_COUNT_LIMIT = 200,
    DEFAULT_MINOR_NUMBER_MULTIPLIERS = [2, 4, 5, 8, 10];

exports.continuous = {
    _hasUnitBeginningTickCorrection: _noop,

    _correctMax: function(tickInterval) {
        this._max = this._adjustNumericTickValue(_ceil(this._max / tickInterval) * tickInterval, tickInterval, this._min);
    },

    _correctMin: function(tickInterval) {
        this._min = this._adjustNumericTickValue(_floor(this._min / tickInterval) * tickInterval, tickInterval, this._min);
    },

    _findBusinessDelta: function(min, max) {
        return _adjustValue(_abs(min - max));
    },

    _findTickIntervalForCustomTicks: function() {
        return _abs(this._customTicks[1] - this._customTicks[0]);
    },

    _getBoundInterval: function() {
        var that = this,
            boundCoef = that._options.boundCoef;

        return _isDefined(boundCoef) && isFinite(boundCoef) ? that._tickInterval * _abs(boundCoef) : that._tickInterval / 2;
    },

    _getInterval: function(deltaCoef, numberMultipliers) {
        var interval = deltaCoef || this._getDeltaCoef(this._screenDelta, this._businessDelta, this._options.gridSpacingFactor),
            multipliers = numberMultipliers || this._options.numberMultipliers,
            factor,
            result = 0,
            newResult,
            hasResult = false,
            i;

        if(interval > 1.0) {
            for(factor = 1; !hasResult; factor *= 10) {
                for(i = 0; i < multipliers.length; i++) {
                    result = multipliers[i] * factor;
                    if(interval <= result) {
                        hasResult = true;
                        break;
                    }
                }
            }
        } else if(interval > 0) {
            result = 1;
            for(factor = 0.1; !hasResult; factor /= 10) {
                for(i = multipliers.length - 1; i >= 0; i--) {
                    newResult = multipliers[i] * factor;
                    if(interval > newResult) {
                        hasResult = true;
                        break;
                    }
                    result = newResult;
                }
            }
        }

        return _adjustValue(result);
    },

    _getDefaultMinorInterval: function(screenDelta, businessDelta) {
        var deltaCoef = this._getDeltaCoef(screenDelta, businessDelta, this._options.minorGridSpacingFactor),
            multipliers = DEFAULT_MINOR_NUMBER_MULTIPLIERS,
            i = multipliers.length - 1,
            result;

        for(i; i >= 0; i--) {
            result = businessDelta / multipliers[i];
            if(deltaCoef <= result) {
                return _adjustValue(result);
            }
        }

        return 0;
    },

    _getMinorInterval: function(screenDelta, businessDelta) {
        var that = this,
            options = that._options,
            minorTickInterval = options.minorTickInterval,
            minorTickCount = options.minorTickCount,
            interval,
            intervalsCount,
            count;

        if(isFinite(minorTickInterval) && that._isTickIntervalCorrect(minorTickInterval, MINOR_TICKS_COUNT_LIMIT, businessDelta)) {
            interval = minorTickInterval;
            count = interval < businessDelta ? _ceil(businessDelta / interval) - 1 : 0;
        } else {
            if(_isDefined(minorTickCount)) {
                intervalsCount = _isDefined(minorTickCount) ? minorTickCount + 1 : _floor(screenDelta / options.minorGridSpacingFactor);
                count = intervalsCount - 1;
                interval = count > 0 ? businessDelta / intervalsCount : 0;
            } else {
                interval = that._getDefaultMinorInterval(screenDelta, businessDelta);
                count = interval < businessDelta ? _floor(businessDelta / interval) - 1 : 0;
            }
        }

        that._minorTickInterval = interval;
        that._minorTickCount = count;
    },

    _getNextTickValue: function(value, tickInterval, isTickIntervalNegative) {
        tickInterval = _isDefined(isTickIntervalNegative) && isTickIntervalNegative ? -tickInterval : tickInterval;
        value += tickInterval;

        return this._adjustNumericTickValue(value, tickInterval, this._min);
    },

    _isTickIntervalValid: function(tickInterval) {
        return _isDefined(tickInterval) && isFinite(tickInterval) && tickInterval !== 0;
    }
};
