"use strict";

var dateUtils = require("../../core/utils/date"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    tickManagerContinuous = require("./numeric_tick_manager").continuous,
    _isDefined = typeUtils.isDefined,
    _convertDateUnitToMilliseconds = dateUtils.convertDateUnitToMilliseconds,
    _correctDateWithUnitBeginning = dateUtils.correctDateWithUnitBeginning,
    _dateToMilliseconds = dateUtils.dateToMilliseconds,
    _convertMillisecondsToDateUnits = dateUtils.convertMillisecondsToDateUnits,

    _math = Math,
    _abs = _math.abs,
    _ceil = _math.ceil,
    _floor = _math.floor,

    MINOR_TICKS_COUNT_LIMIT = 50,
    DEFAULT_DATETIME_MULTIPLIERS = {
        millisecond: [1, 2, 5, 10, 25, 100, 250, 300, 500],
        second: [1, 2, 3, 5, 10, 15, 20, 30],
        minute: [1, 2, 3, 5, 10, 15, 20, 30],
        hour: [1, 2, 3, 4, 6, 8, 12],
        day: [1, 2, 3, 5, 7, 10, 14],
        month: [1, 2, 3, 6]
    };

function correctDate(date, tickInterval, correctionMethod) {
    var interval = _dateToMilliseconds(tickInterval),
        timezoneOffset = date.getTimezoneOffset() * 60 * 1000;

    return new Date((Math[correctionMethod](((date - 0) - timezoneOffset) / interval) * interval) + timezoneOffset);
}

exports.datetime = extend({}, tickManagerContinuous, {
    _correctMax: function(tickInterval) {
        this._max = correctDate(this._max, tickInterval, "ceil");
    },

    _correctMin: function(tickInterval) {
        this._min = correctDate(this._min, tickInterval, "floor");
        if(this._options.setTicksAtUnitBeginning) {
            this._min = _correctDateWithUnitBeginning(this._min, tickInterval);
        }
    },

    _findTickIntervalForCustomTicks: function() {
        return _convertMillisecondsToDateUnits(_abs(this._customTicks[1] - this._customTicks[0]));
    },

    _getBoundInterval: function() {
        var that = this,
            interval = that._tickInterval,
            intervalInMs = _dateToMilliseconds(interval),
            boundCoef = that._options.boundCoef,
            boundIntervalInMs = _isDefined(boundCoef) && isFinite(boundCoef) ? intervalInMs * _abs(boundCoef) : intervalInMs / 2;

        return _convertMillisecondsToDateUnits(boundIntervalInMs);
    },

    _getInterval: function(deltaCoef) {
        var interval = deltaCoef || this._getDeltaCoef(this._screenDelta, this._businessDelta, this._options.gridSpacingFactor),
            multipliers = this._options.numberMultipliers,
            result = {},
            factor,
            i,
            key,
            specificMultipliers,
            yearsCount;

        if(interval > 0 && interval < 1.0) {
            return { milliseconds: 1 };
        }
        if(interval === 0) {
            return 0;
        }

        for(key in DEFAULT_DATETIME_MULTIPLIERS) {
            if(DEFAULT_DATETIME_MULTIPLIERS.hasOwnProperty(key)) {
                specificMultipliers = DEFAULT_DATETIME_MULTIPLIERS[key];
                for(i = 0; i < specificMultipliers.length; i++) {
                    if(interval <= _convertDateUnitToMilliseconds(key, specificMultipliers[i])) {
                        result[key + 's'] = specificMultipliers[i];
                        return result;
                    }
                }
            }
        }

        for(factor = 1; ; factor *= 10) {
            for(i = 0; i < multipliers.length; i++) {
                yearsCount = factor * multipliers[i];
                if(interval <= _convertDateUnitToMilliseconds('year', yearsCount)) {
                    return { years: yearsCount };
                }
            }
        }
    },

    _getMinorInterval: function(screenDelta, businessDelta) {
        var that = this,
            options = that._options,
            interval,
            intervalInMs,
            intervalsCount,
            count;
        if(_isDefined(options.minorTickInterval) && that._isTickIntervalCorrect(options.minorTickInterval, MINOR_TICKS_COUNT_LIMIT, businessDelta)) {
            interval = options.minorTickInterval;
            intervalInMs = _dateToMilliseconds(interval);
            count = intervalInMs < businessDelta ? _ceil(businessDelta / intervalInMs) - 1 : 0;
        } else {
            intervalsCount = _isDefined(options.minorTickCount) ? options.minorTickCount + 1 : _floor(screenDelta / options.minorGridSpacingFactor);
            count = intervalsCount - 1;
            interval = count > 0 ? _convertMillisecondsToDateUnits(businessDelta / intervalsCount) : 0;
        }

        that._minorTickInterval = interval;
        that._minorTickCount = count;
    },

    _getNextTickValue: function(value, tickInterval, isTickIntervalNegative, isTickIntervalWithPow, withCorrection) {
        var newValue = dateUtils.addInterval(value, tickInterval, isTickIntervalNegative);
        if(this._options.setTicksAtUnitBeginning && withCorrection !== false) {
            newValue = _correctDateWithUnitBeginning(newValue, tickInterval, true);
            ///#DEBUG
            this._correctDateWithUnitBeginningCalled = true;
            ///#ENDDEBUG
        }

        return newValue;
    },

    _getUnitBeginningMinorTicks: function(minorTicks) {
        var that = this,
            ticks = that._ticks,
            tickInterval = that._findMinorTickInterval(ticks[1], ticks[2]),
            isTickIntervalNegative = true,
            isTickIntervalWithPow = false,
            needCorrectTick = false,
            startTick = that._getNextTickValue(ticks[1], tickInterval, isTickIntervalNegative, isTickIntervalWithPow, needCorrectTick);

        if(that._isTickIntervalValid(tickInterval)) {
            minorTicks = that._createTicks(minorTicks, tickInterval, startTick, ticks[0], isTickIntervalNegative, isTickIntervalWithPow, needCorrectTick);
        }

        return minorTicks;
    },

    _hasUnitBeginningTickCorrection: function() {
        var ticks = this._ticks;

        if(ticks.length < 3) {
            return false;
        }
        return (ticks[1] - ticks[0]) !== (ticks[2] - ticks[1]) && this._options.setTicksAtUnitBeginning && this._options.minorTickCount;
    },

    _isTickIntervalValid: function(tickInterval) {
        return _isDefined(tickInterval) && _dateToMilliseconds(tickInterval) !== 0;
    }
});
