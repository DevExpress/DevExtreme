"use strict";

var TickManager,
    coreTickManager = require("./numeric_tick_manager"),
    dateTimeManager = require("./datetime_tick_manager"),
    logarithmicMethods = require("./logarithmic_tick_manager"),
    dateUtils = require("../../core/utils/date"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    formatHelper = require("../../format_helper"),
    _isDefined = typeUtils.isDefined,
    _isNumber = typeUtils.isNumeric,
    _addInterval = dateUtils.addInterval,
    utils = require("../core/utils"),
    _adjustValue = utils.adjustValue,
    _map = utils.map,

    _each = each,
    _inArray = inArray,
    _noop = require("../../core/utils/common").noop,

    DEFAULT_GRID_SPACING_FACTOR = 30,
    DEFAULT_MINOR_GRID_SPACING_FACTOR = 15,
    DEFAULT_NUMBER_MULTIPLIERS = [1, 2, 3, 5],
    TICKS_COUNT_LIMIT = 2000,
    MIN_ARRANGEMENT_TICKS_COUNT = 2;

function getUniqueValues(array) {
    var lastValue = array[0],
        currentValue,
        result = [lastValue.obj],
        length = array.length,
        i = 1;

    for(i; i < length; i++) {
        currentValue = array[i];
        if(lastValue.value !== currentValue.value) {
            result.push(currentValue.obj);
            lastValue = currentValue;
        }
    }

    return result;
}

function concatAndSort(array1, array2) {

    if(!array1.length && !array2.length) {
        return [];
    }

    var array = array1.concat(array2),
        values = [],
        length = array.length,
        hasNull = false, //for categories in polar
        i = 0;

    for(i; i < length; i++) {
        if(array[i] !== null) {
            values.push({ obj: array[i], value: array[i].valueOf() });
        } else {
            hasNull = true;
        }
    }

    values.sort(function(x, y) { return x.value - y.value; });
    values = getUniqueValues(values);
    hasNull && values.push(null);

    return values;
}

function convertTickIntervalToNumeric(interval) {
    if(!_isNumber(interval)) {
        var date = new Date();
        interval = _addInterval(date, interval) - date;
    }
    return interval;
}

function checkUserTickInterval(userTickInterval, calculatedTickInterval, forceUserTickInterval) {
    if(forceUserTickInterval && userTickInterval) {
        return userTickInterval;
    }

    if(!userTickInterval) {
        return calculatedTickInterval;
    }

    var tickInterval1 = convertTickIntervalToNumeric(userTickInterval),
        tickInterval2 = convertTickIntervalToNumeric(calculatedTickInterval);

    if(_isNumber(tickInterval1) && _isNumber(tickInterval2)) {
        if(tickInterval1 > tickInterval2) {
            return userTickInterval;
        }
    }

    return calculatedTickInterval;
}

exports.discrete = extend({}, coreTickManager.continuous, {
    _calculateMinorTicks: _noop,
    _findTickInterval: _noop,
    _createTicks: function() {
        return [];
    },
    _getMarginValue: _noop,
    _generateBounds: _noop,
    _correctMin: _noop,
    _correctMax: _noop,
    _findBusinessDelta: _noop,
    _addBoundedTicks: _noop,

    getFullTicks: function() {
        return this._customTicks;
    },

    getMinorTicks: function() {
        return [];
    },

    _findTickIntervalForCustomTicks: function() {
        return 1;
    }
});


TickManager = exports.TickManager = function(types, data, options) {
    options = options || {};
    this.update(types || {}, data || {}, options);
};

TickManager.prototype = {
    constructor: TickManager,

    dispose: function() {
        this._ticks = null;
        this._minorTicks = null;
        this._boundaryTicks = null;

        this._options = null;
    },

    update: function(types, data, options) {
        this._updateOptions(options || {});
        this._min = data.min; //for data type validation in updateTypes
        this._updateTypes(types || {});
        this._updateData(data || {});
    },

    _updateMinMax: function(data) {
        var min = data.min || 0,
            max = data.max || 0,
            newMinMax = this._applyMinMaxMargins(min, max);

        this._min = this._originalMin = newMinMax.min;
        this._max = this._originalMax = newMinMax.max;
        this._updateBusinessDelta();
    },

    _updateBusinessDelta: function() {
        this._businessDelta = this._findBusinessDelta && this._findBusinessDelta(this._min, this._max);
    },

    _updateTypes: function(types) {
        var that = this,
            axisType = that._validateAxisType(types.axisType),
            dataType = that._validateDataType(types.dataType);

        that._resetMethods();

        this._axisType = axisType;
        this._dataType = dataType;
        this._initMethods();
    },

    _updateData: function(data) {
        data = extend({}, data);
        data.min = _isDefined(data.min) ? data.min : this._originalMin;
        data.max = _isDefined(data.max) ? data.max : this._originalMax;
        this._updateMinMax(data);

        this._customTicks = data.customTicks && data.customTicks.slice();
        this._customMinorTicks = data.customMinorTicks;
        this._customBoundTicks = data.customBoundTicks;
        this._screenDelta = data.screenDelta || 0;
    },

    _updateOptions: function(options) {
        var opt;
        this._options = opt = options;

        opt.gridSpacingFactor = opt.gridSpacingFactor || DEFAULT_GRID_SPACING_FACTOR;
        opt.minorGridSpacingFactor = opt.minorGridSpacingFactor || DEFAULT_MINOR_GRID_SPACING_FACTOR;
        opt.numberMultipliers = opt.numberMultipliers || DEFAULT_NUMBER_MULTIPLIERS;
    },

    getTickBounds: function() {
        return { minVisible: this._minBound, maxVisible: this._maxBound };
    },

    getTicks: function() {
        var that = this,
            options = that._options;

        that._ticks = that._calculateMajorTicks();
        that._checkLabelFormat();

        that._generateBounds();
        if(options.showMinorTicks) {
            that._minorTicks = that._calculateMinorTicks();
        }

        that._addBoundedTicks();

        return that._ticks;
    },

    getMinorTicks: function() {
        return concatAndSort(this._minorTicks || [], []);
    },

    getFullTicks: function() {
        var that = this,
            needCalculateMinorTicks = that._ticks && !that._minorTicks,
            minorTicks = needCalculateMinorTicks ? that._calculateMinorTicks() : that._minorTicks || [];

        return concatAndSort(that._ticks || [], minorTicks.concat(that.getBoundaryTicks()));
    },

    getBoundaryTicks: function() {
        return this._boundaryTicks || [];
    },

    getTickInterval: function() {
        return this._tickInterval;
    },

    getMinorTickInterval: function() {
        return this._minorTickInterval;
    },

    getOptions: function() {
        return this._options;
    },

    _calculateMajorTicks: function() {
        var that = this,
            ticks;

        if(that._options.showCalculatedTicks || !that._customTicks) { //showCalculatedTicks DEPRECATED IN 15_2
            ticks = that._createTicks(that._options.showCalculatedTicks ? that._customTicks || [] : [], that._findTickInterval(), that._min, that._max); //showCalculatedTicks DEPRECATED IN 15_2
        } else {
            ticks = that._customTicks.slice();
            that._tickInterval = ticks.length > 1 ? that._findTickIntervalForCustomTicks() : 0;
        }

        return ticks;
    },

    _applyMargin: function(margin, min, max, isNegative) {
        var coef,
            value = min;

        if(isFinite(margin)) {
            coef = this._getMarginValue(min, max, margin);
            if(coef) {
                value = this._getNextTickValue(min, coef, isNegative, false);
            }
        }

        return value;
    },

    _applyMinMaxMargins: function(min, max) {
        var options = this._options,
            newMin = min > max ? max : min,
            newMax = max > min ? max : min;

        this._minCorrectionEnabled = this._getCorrectionEnabled(min, "min");
        this._maxCorrectionEnabled = this._getCorrectionEnabled(max, "max");

        if(options && !options.stick) {
            newMin = this._applyMargin(options.minValueMargin, min, max, true);
            newMax = this._applyMargin(options.maxValueMargin, max, min, false);
        }

        return { min: newMin, max: newMax };
    },

    _checkBoundedTickInArray: function(value, array) {
        var arrayValues = _map(array || [], function(item) { return item.valueOf(); }),
            minorTicksIndex = _inArray(value.valueOf(), arrayValues);
        if(minorTicksIndex !== -1) {
            array.splice(minorTicksIndex, 1);
        }
    },

    _checkLabelFormat: function() {
        var options = this._options;

        if(this._dataType === "datetime" && !options.hasLabelFormat && this._ticks.length) {
            options.labelFormat = options.isMarkersVisible
                ? dateUtils.getDateFormatByTickInterval(this._tickInterval)
                : formatHelper.getDateFormatByTicks(this._ticks);
        }
    },

    _generateBounds: function() {
        var that = this,
            interval = that._getBoundInterval(),
            stick = that._options.stick,
            minStickValue = that._options.minStickValue,
            maxStickValue = that._options.maxStickValue,
            minBound = that._minCorrectionEnabled && !stick ? that._getNextTickValue(that._min, interval, true) : that._originalMin,
            maxBound = that._maxCorrectionEnabled && !stick ? that._getNextTickValue(that._max, interval) : that._originalMax;

        that._minBound = minBound < minStickValue ? minStickValue : minBound;
        that._maxBound = maxBound > maxStickValue ? maxStickValue : maxBound;
    },

    _addBoundedTicks: function() {
        var that = this,
            tickValues = _map(that._ticks, function(tick) { return tick.valueOf(); }),
            customBounds = that._customBoundTicks,
            min = that._originalMin,
            max = that._originalMax,
            addMinMax = that._options.addMinMax || {};

        function processTick(tick) {
            that._boundaryTicks.push(tick);
            that._checkBoundedTickInArray(tick, that._minorTicks);
        }

        that._boundaryTicks = [];

        if(customBounds) {
            if(addMinMax.min && _isDefined(customBounds[0])) {
                processTick(customBounds[0]);
            }

            if(addMinMax.max && _isDefined(customBounds[1])) {
                processTick(customBounds[1]);
            }
        } else {
            if(addMinMax.min && _inArray(min.valueOf(), tickValues) === -1) {
                processTick(min);
            }

            if(addMinMax.max && _inArray(max.valueOf(), tickValues) === -1) {
                processTick(max);
            }
        }
    },

    _getCorrectionEnabled: function(value, marginSelector) {
        var options = this._options || {},
            hasPercentStick = options.percentStick && Math.abs(value) === 1,
            hasValueMargin = options[marginSelector + "ValueMargin"];

        return (!hasPercentStick && !hasValueMargin);
    },

    _validateAxisType: function(type) {
        var defaultType = "continuous",
            allowedTypes = { continuous: true, discrete: true, logarithmic: true };

        return allowedTypes[type] ? type : defaultType;
    },

    _validateDataType: function(type) {
        var allowedTypes = { numeric: true, datetime: true, string: true };

        if(!allowedTypes[type]) {
            type = _isDefined(this._min) ? this._getDataType(this._min) : "numeric";
        }

        return type;
    },

    _getDataType: function(value) {
        return typeUtils.isDate(value) ? "datetime" : "numeric";
    },

    _getMethods: function() {
        var methods;

        if(this._axisType === "continuous") {
            methods = this._dataType === "datetime" ? dateTimeManager.datetime : coreTickManager.continuous;
        } else {
            switch(this._axisType) {
                case "discrete":
                    methods = exports.discrete;
                    break;
                case "logarithmic":
                    methods = logarithmicMethods.logarithmic;
                    break;
                default:
                    methods = coreTickManager.continuous;
            }
        }

        return methods;
    },

    _resetMethods: function() {
        var that = this,
            methods = that._getMethods();

        _each(methods, function(name) {
            if(that[name]) {
                delete that[name];
            }
        });
    },

    _initMethods: function(methods) {
        var that = this;

        methods = methods || that._getMethods();
        _each(methods, function(name, func) {
            that[name] = func;
        });
    },

    _getDeltaCoef: function(screenDelta, businessDelta, gridSpacingFactor) {
        var count;

        gridSpacingFactor = gridSpacingFactor || this._options.gridSpacingFactor;
        screenDelta = screenDelta || this._screenDelta;
        businessDelta = businessDelta || this._businessDelta;
        count = screenDelta / gridSpacingFactor;
        count = count <= 1 ? MIN_ARRANGEMENT_TICKS_COUNT : count;

        return businessDelta / count;
    },

    _adjustNumericTickValue: function(value, interval, min) {
        return typeUtils.isExponential(value) ? _adjustValue(value) : utils.applyPrecisionByMinDelta(min, interval, value);
    },

    _isTickIntervalCorrect: function(tickInterval, tickCountLimit, businessDelta) {
        var date;

        businessDelta = businessDelta || this._businessDelta;
        if(!_isNumber(tickInterval)) {
            date = new Date();
            tickInterval = _addInterval(date, tickInterval) - date;
            if(!tickInterval) {
                return false;
            }
        }

        if(_isNumber(tickInterval)) {
            if(tickInterval > 0 && businessDelta / tickInterval > tickCountLimit) {
                if(this._options.incidentOccurred) {
                    this._options.incidentOccurred("W2003");
                }
            } else {
                return true;
            }
        }

        return false;
    },

    _correctValue: function(valueTypeSelector, tickInterval, correctionMethod) {
        var that = this,
            correctionEnabledSelector = "_" + valueTypeSelector + "CorrectionEnabled",
            spaceCorrectionSelector = valueTypeSelector + "SpaceCorrection",
            valueSelector = "_" + valueTypeSelector,
            minStickValue = that._options.minStickValue,
            maxStickValue = that._options.maxStickValue;

        if(that[correctionEnabledSelector]) {
            if(that._options[spaceCorrectionSelector]) {
                that[valueSelector] = that._getNextTickValue(that[valueSelector], tickInterval, valueTypeSelector === "min");
            }
            correctionMethod.call(this, tickInterval);
        }

        if(valueTypeSelector === "min") {
            that[valueSelector] = that[valueSelector] < minStickValue ? minStickValue : that[valueSelector];
        }
        if(valueTypeSelector === "max") {
            that[valueSelector] = that[valueSelector] > maxStickValue ? maxStickValue : that[valueSelector];
        }
    },

    _findTickInterval: function() {
        var that = this,
            options = that._options,
            tickInterval,
            calculatedTickInterval = that._getInterval(),
            userTickInterval = that._isTickIntervalValid(options.tickInterval) && that._isTickIntervalCorrect(options.tickInterval, TICKS_COUNT_LIMIT) && options.tickInterval;

        tickInterval = checkUserTickInterval(userTickInterval, calculatedTickInterval, options.forceUserTickInterval);

        if(that._isTickIntervalValid(tickInterval)) {
            that._correctValue("min", tickInterval, that._correctMin);
            that._correctValue("max", tickInterval, that._correctMax);
            that._updateBusinessDelta();
        }

        that._tickInterval = tickInterval;

        return tickInterval;
    },

    _findMinorTickInterval: function(firstTick, secondTick) {
        var that = this,
            ticks = that._ticks,
            intervals = that._options.stick ? ticks.length - 1 : ticks.length;

        if(intervals < 1) {
            intervals = 1;
        }
        that._getMinorInterval(that._screenDelta / intervals, that._findBusinessDelta(firstTick, secondTick, false));

        return that._minorTickInterval;
    },

    _createMinorTicks: function(ticks, firstTick, secondTick) {
        var that = this,
            tickInterval = that._findMinorTickInterval(firstTick, secondTick),
            isTickIntervalNegative = false,
            isTickIntervalWithPow = false,
            needCorrectTick = false,
            startTick = that._getNextTickValue(firstTick, tickInterval, isTickIntervalNegative, isTickIntervalWithPow, needCorrectTick);

        if(that._isTickIntervalValid(tickInterval)) {
            ticks = that._createCountedTicks(ticks, tickInterval, startTick, secondTick, that._minorTickCount, isTickIntervalNegative, isTickIntervalWithPow, needCorrectTick);
        }

        return ticks;
    },

    _calculateMinorTicks: function() {
        var that = this,
            options = that._options,
            minorTicks = [],
            ticks = that._ticks,
            ticksLength = ticks.length,
            hasUnitBeginningTick = that._hasUnitBeginningTickCorrection(),
            i = hasUnitBeginningTick ? 1 : 0;

        if(options.showMinorCalculatedTicks || !that._customMinorTicks) { //showMinorCalculatedTicks DEPRECATED IN 15_2
            if(ticks.length) {
                minorTicks = that._getBoundedMinorTicks(minorTicks, that._minBound, ticks[0], true);
                if(hasUnitBeginningTick) {
                    minorTicks = that._getUnitBeginningMinorTicks(minorTicks);
                }
                for(i; i < ticksLength - 1; i++) {
                    minorTicks = that._createMinorTicks(minorTicks, ticks[i], ticks[i + 1]);
                }
                minorTicks = that._getBoundedMinorTicks(minorTicks, that._maxBound, ticks[ticksLength - 1]);
            } else {
                minorTicks = that._createMinorTicks(minorTicks, that._minBound, that._maxBound);
            }
            options.showMinorCalculatedTicks && (minorTicks = minorTicks.concat(that._customMinorTicks || [])); //showMinorCalculatedTicks DEPRECATED IN 15_2
        } else {
            minorTicks = that._customMinorTicks;
        }
        return minorTicks;
    },

    _createCountedTicks: function(ticks, tickInterval, min, max, count, isTickIntervalWithPow, needMax) {
        var value = min,
            i;

        for(i = 0; i < count; i++) {
            if(!(needMax === false && value.valueOf() === max.valueOf())) {
                ticks.push(value);
            }
            value = this._getNextTickValue(value, tickInterval, false, isTickIntervalWithPow, false);
        }

        return ticks;
    },

    _createTicks: function(ticks, tickInterval, min, max, isTickIntervalNegative, isTickIntervalWithPow, withCorrection) {
        var that = this,
            value = min,
            newValue = min,
            leftBound,
            rightBound,
            boundedRule;

        if(that._isTickIntervalValid(tickInterval)) {
            boundedRule = (min - max) < 0;
            do {
                value = newValue;

                if(that._options.stick) {
                    if(value >= that._originalMin && value <= that._originalMax) {
                        ticks.push(value);
                    }
                } else {
                    ticks.push(value);
                }

                newValue = that._getNextTickValue(value, tickInterval, isTickIntervalNegative, isTickIntervalWithPow, withCorrection);
                if(value.valueOf() === newValue.valueOf()) {
                    break;
                }

                leftBound = (newValue - min) >= 0;
                rightBound = (max - newValue) >= 0;
            } while(boundedRule === leftBound && boundedRule === rightBound);
        } else {
            ticks.push(value);
        }

        return ticks;
    },

    _getBoundedMinorTicks: function(minorTicks, boundedTick, tick, isNegative) {
        var that = this,
            needCorrectTick = false,
            nextTick = that._tickInterval ? this._getNextTickValue(tick, that._tickInterval, isNegative, true, needCorrectTick) : boundedTick,
            tickInterval = that._findMinorTickInterval(tick, nextTick),
            isTickIntervalCorrect = that._isTickIntervalCorrect(tickInterval, TICKS_COUNT_LIMIT, that._findBusinessDelta(tick, boundedTick, false)),
            startTick,
            endTick,
            boundedTickValue = boundedTick.valueOf();

        if(isTickIntervalCorrect && that._isTickIntervalValid(tickInterval) && that._minorTickCount > 0) {
            if(isNegative) {
                if(tick.valueOf() <= boundedTickValue) {
                    return minorTicks;
                }
                while(nextTick.valueOf() < boundedTickValue) {
                    nextTick = this._getNextTickValue(nextTick, tickInterval, false, false, needCorrectTick);
                }

                startTick = nextTick;
                endTick = that._getNextTickValue(tick, tickInterval, true, false, false);
            } else {
                startTick = that._getNextTickValue(tick, tickInterval, false, false, false);
                endTick = boundedTick;
            }

            minorTicks = that._createTicks(minorTicks, tickInterval, startTick, endTick, false, false, needCorrectTick);
        }

        return minorTicks;
    },

    ///#DEBUG
    getTypes: function() {
        return {
            axisType: this._axisType,
            dataType: this._dataType
        };
    },

    getData: function() {
        return {
            min: this._min,
            max: this._max,
            customTicks: this._customTicks,
            customMinorTicks: this._customMinorTicks,
            screenDelta: this._screenDelta
        };
    }
    ///#ENDDEBUG

};
