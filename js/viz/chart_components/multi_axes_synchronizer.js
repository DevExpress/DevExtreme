"use strict";

var $ = require("../../core/renderer"),
    debug = require("../../core/utils/console").debug,
    Range = require("../translators/range").Range,
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    vizUtils = require("../core/utils"),
    _adjustValue = vizUtils.adjustValue,
    _applyPrecisionByMinDelta = vizUtils.applyPrecisionByMinDelta,
    _isDefined = commonUtils.isDefined,

    _math = Math,
    _floor = _math.floor,
    _max = _math.max,
    _abs = _math.abs,

    _each = $.each,
    _map = require("../core/utils").map,

    MIN_RANGE_FOR_ADJUST_BOUNDS = 0.1; //B254389

var getValueAxesPerPanes = function(valueAxes) {
    var result = {};

    _each(valueAxes, function(_, axis) {
        var pane = axis.pane;
        if(!result[pane]) {
            result[pane] = [];
        }
        result[pane].push(axis);
    });

    return result;
};

var restoreOriginalBusinessRange = function(axis) {
    var businessRange,
        translator = axis.getTranslator();

    if(!translator._originalBusinessRange) {
        translator._originalBusinessRange = new Range(translator.getBusinessRange());
    } else {
        businessRange = new Range(translator._originalBusinessRange);
        translator.updateBusinessRange(businessRange);
    }
};

var linearConverter = {
    transform: function(v, b) {
        return vizUtils.getLog(v, b);
    },

    addInterval: function(v, i) {
        return v + i;
    },

    getInterval: function(base, tickInterval) {
        return tickInterval;
    },

    adjustValue: _floor
};

var logConverter = {
    transform: function(v, b) {
        return vizUtils.raiseTo(v, b);
    },

    addInterval: function(v, i) {
        return v * i;
    },

    getInterval: function(base, tickInterval) {
        return _math.pow(base, tickInterval);
    },

    adjustValue: _adjustValue
};

var convertAxisInfo = function(axisInfo, converter) {
    if(!axisInfo.isLogarithmic) {
        return;
    }
    var base = axisInfo.logarithmicBase,
        tickValues = axisInfo.tickValues,
        tick,
        ticks = [],
        interval,
        i;

    axisInfo.minValue = converter.transform(axisInfo.minValue, base);
    axisInfo.oldMinValue = converter.transform(axisInfo.oldMinValue, base);
    axisInfo.maxValue = converter.transform(axisInfo.maxValue, base);
    axisInfo.oldMaxValue = converter.transform(axisInfo.oldMaxValue, base);
    axisInfo.tickInterval = _math.round(axisInfo.tickInterval);

    if(axisInfo.tickInterval < 1) {
        axisInfo.tickInterval = 1;
    }

    interval = converter.getInterval(base, axisInfo.tickInterval);

    tick = converter.transform(tickValues[0], base);
    for(i = 0; i < tickValues.length; i++) {
        ticks.push(converter.adjustValue(tick));
        tick = converter.addInterval(tick, interval);
    }

    ticks.tickInterval = axisInfo.tickInterval;
    axisInfo.tickValues = ticks;
};

var populateAxesInfo = function(axes) {
    return _map(axes, function(axis) {
        restoreOriginalBusinessRange(axis);
        var ticksValues = axis.getTicksValues(),
            majorTicks = ticksValues.majorTicksValues,
            options = axis.getOptions(),
            minValue,
            maxValue,
            axisInfo = null,
            businessRange,
            tickInterval,
            synchronizedValue;

        if(majorTicks && majorTicks.length > 0 && typeUtils.isNumeric(majorTicks[0]) && options.type !== "discrete") {
            businessRange = axis.getTranslator().getBusinessRange();
            tickInterval = axis._tickManager.getTickInterval();
            minValue = businessRange.minVisible;
            maxValue = businessRange.maxVisible;
            synchronizedValue = options.synchronizedValue;

            if(minValue === maxValue && _isDefined(synchronizedValue)) {
                tickInterval = _abs(majorTicks[0] - synchronizedValue) || 1;
                minValue = majorTicks[0] - tickInterval;
                maxValue = majorTicks[0] + tickInterval;
            }

            axisInfo = {
                axis: axis,
                isLogarithmic: options.type === "logarithmic",
                logarithmicBase: businessRange.base,
                tickValues: majorTicks,
                minorValues: ticksValues.minorTicksValues,
                minValue: minValue,
                oldMinValue: minValue,
                maxValue: maxValue,
                oldMaxValue: maxValue,
                inverted: businessRange.invert,
                tickInterval: tickInterval,
                synchronizedValue: synchronizedValue
            };

            if(businessRange.stubData) {
                axisInfo.stubData = true;
                axisInfo.tickInterval = axisInfo.tickInterval || options.tickInterval;
                axisInfo.isLogarithmic = false;
            }

            convertAxisInfo(axisInfo, linearConverter);

            ///#DEBUG
            debug.assert(axisInfo.tickInterval !== undefined && axisInfo.tickInterval !== null, "tickInterval was not provided");
            ///#ENDDEBUG
        }
        return axisInfo;
    });
};

var updateTickValues = function(axesInfo) {
    var maxTicksCount = 0;

    _each(axesInfo, function(_, axisInfo) {
        maxTicksCount = _max(maxTicksCount, axisInfo.tickValues.length);
    });

    _each(axesInfo, function(_, axisInfo) {
        var ticksMultiplier,
            ticksCount,
            additionalStartTicksCount = 0,
            synchronizedValue = axisInfo.synchronizedValue,
            tickValues = axisInfo.tickValues,
            tickInterval = axisInfo.tickInterval;

        if(_isDefined(synchronizedValue)) {
            axisInfo.baseTickValue = axisInfo.invertedBaseTickValue = synchronizedValue;
            axisInfo.tickValues = [axisInfo.baseTickValue];
        } else {
            if(tickValues.length > 1 && tickInterval) {
                ticksMultiplier = _floor((maxTicksCount + 1) / tickValues.length);
                ticksCount = ticksMultiplier > 1 ? _floor((maxTicksCount + 1) / ticksMultiplier) : maxTicksCount;
                additionalStartTicksCount = _floor((ticksCount - tickValues.length) / 2);

                while(additionalStartTicksCount > 0 && (tickValues[0] !== 0)) {
                    tickValues.unshift(_applyPrecisionByMinDelta(tickValues[0], tickInterval, tickValues[0] - tickInterval));
                    additionalStartTicksCount--;
                }
                while(tickValues.length < ticksCount) {
                    tickValues.push(_applyPrecisionByMinDelta(tickValues[0], tickInterval, tickValues[tickValues.length - 1] + tickInterval));
                }
                axisInfo.tickInterval = tickInterval / ticksMultiplier;
            }
            axisInfo.baseTickValue = tickValues[0];
            axisInfo.invertedBaseTickValue = tickValues[tickValues.length - 1];
        }
    });
};

var getAxisRange = function(axisInfo) {
    return (axisInfo.maxValue - axisInfo.minValue) || 1; //T153054
};

var getMainAxisInfo = function(axesInfo) {
    for(var i = 0; i < axesInfo.length; i++) {
        if(!axesInfo[i].stubData) {
            return axesInfo[i];
        }
    }
    return null;
};

var correctMinMaxValues = function(axesInfo) {
    var mainAxisInfo = getMainAxisInfo(axesInfo),
        mainAxisInfoTickInterval = mainAxisInfo.tickInterval;

    _each(axesInfo, function(_, axisInfo) {
        var scale,
            move,
            mainAxisBaseValueOffset,
            valueFromAxisInfo;

        if(axisInfo !== mainAxisInfo) {
            if(mainAxisInfoTickInterval && axisInfo.tickInterval) {
                if(axisInfo.stubData && _isDefined(axisInfo.synchronizedValue)) {
                    axisInfo.oldMinValue = axisInfo.minValue = axisInfo.baseTickValue - (mainAxisInfo.baseTickValue - mainAxisInfo.minValue) / mainAxisInfoTickInterval * axisInfo.tickInterval;
                    axisInfo.oldMaxValue = axisInfo.maxValue = axisInfo.baseTickValue - (mainAxisInfo.baseTickValue - mainAxisInfo.maxValue) / mainAxisInfoTickInterval * axisInfo.tickInterval;
                }
                scale = mainAxisInfoTickInterval / getAxisRange(mainAxisInfo) / axisInfo.tickInterval * getAxisRange(axisInfo);
                axisInfo.maxValue = axisInfo.minValue + getAxisRange(axisInfo) / scale;
            }
            if((mainAxisInfo.inverted && !axisInfo.inverted) || (!mainAxisInfo.inverted && axisInfo.inverted)) {
                mainAxisBaseValueOffset = mainAxisInfo.maxValue - mainAxisInfo.invertedBaseTickValue;
            } else {
                mainAxisBaseValueOffset = mainAxisInfo.baseTickValue - mainAxisInfo.minValue;
            }
            valueFromAxisInfo = getAxisRange(axisInfo);
            move = (mainAxisBaseValueOffset / getAxisRange(mainAxisInfo) - (axisInfo.baseTickValue - axisInfo.minValue) / valueFromAxisInfo) * valueFromAxisInfo;
            axisInfo.minValue -= move;
            axisInfo.maxValue -= move;
        }
    });
};

var calculatePaddings = function(axesInfo) {
    var minPadding,
        maxPadding,
        startPadding = 0,
        endPadding = 0;

    _each(axesInfo, function(_, axisInfo) {
        var inverted = axisInfo.inverted;
        minPadding = axisInfo.minValue > axisInfo.oldMinValue ? (axisInfo.minValue - axisInfo.oldMinValue) / getAxisRange(axisInfo) : 0;
        maxPadding = axisInfo.maxValue < axisInfo.oldMaxValue ? (axisInfo.oldMaxValue - axisInfo.maxValue) / getAxisRange(axisInfo) : 0;

        startPadding = _max(startPadding, inverted ? maxPadding : minPadding);
        endPadding = _max(endPadding, inverted ? minPadding : maxPadding);
    });
    return {
        start: startPadding,
        end: endPadding
    };
};

var correctMinMaxValuesByPaddings = function(axesInfo, paddings) {
    _each(axesInfo, function(_, info) {
        var range = getAxisRange(info),
            inverted = info.inverted;

        info.minValue -= paddings[inverted ? "end" : "start"] * range;
        info.maxValue += paddings[inverted ? "start" : "end"] * range;
        if(range > MIN_RANGE_FOR_ADJUST_BOUNDS) {
            info.minValue = _math.min(info.minValue, _adjustValue(info.minValue));
            info.maxValue = _max(info.maxValue, _adjustValue(info.maxValue));
        }
    });
};

var updateTickValuesIfSynchronizedValueUsed = function(axesInfo) {
    var hasSynchronizedValue = false;

    _each(axesInfo, function(_, info) {
        hasSynchronizedValue = hasSynchronizedValue || _isDefined(info.synchronizedValue);
    });

    _each(axesInfo, function(_, info) {
        var lastTickValue,
            tickInterval = info.tickInterval,
            tickValues = info.tickValues,
            maxValue = info.maxValue,
            minValue = info.minValue;

        if(hasSynchronizedValue && tickInterval) {
            while(tickValues[0] - tickInterval >= minValue) {
                tickValues.unshift(_adjustValue(tickValues[0] - tickInterval));
            }
            lastTickValue = tickValues[tickValues.length - 1];
            while((lastTickValue = lastTickValue + tickInterval) <= maxValue) {
                tickValues.push(commonUtils.isExponential(lastTickValue) ? _adjustValue(lastTickValue) : _applyPrecisionByMinDelta(minValue, tickInterval, lastTickValue));
            }
        }
        while(tickValues[0] < minValue) {
            tickValues.shift();
        }
        while(tickValues[tickValues.length - 1] > maxValue) {
            tickValues.pop();
        }
    });
};

var applyMinMaxValues = function(axesInfo) {
    _each(axesInfo, function(_, info) {
        var axis = info.axis,
            range = axis.getTranslator().getBusinessRange();

        if(range.min === range.minVisible) {
            range.min = info.minValue;
        }
        if(range.max === range.maxVisible) {
            range.max = info.maxValue;
        }
        range.minVisible = info.minValue;
        range.maxVisible = info.maxValue;

        if(_isDefined(info.stubData)) {
            range.stubData = info.stubData;
        }

        if(range.min > range.minVisible) {
            range.min = range.minVisible;
        }
        if(range.max < range.maxVisible) {
            range.max = range.maxVisible;
        }

        range.isSynchronized = true;
        axis.getTranslator().updateBusinessRange(range);
        axis.setTicks({ majorTicks: info.tickValues, minorTicks: info.minorValues });
    });
};

var correctAfterSynchronize = function(axesInfo) {
    var invalidAxisInfo = [],
        correctValue,
        validAxisInfo;
    _each(axesInfo, function(i, info) {
        if(info.oldMaxValue - info.oldMinValue === 0) {
            invalidAxisInfo.push(info);
        } else {
            if(!_isDefined(correctValue) && !_isDefined(info.synchronizedValue)) {
                correctValue = _abs((info.maxValue - info.minValue) / ((info.tickValues[_floor(info.tickValues.length / 2)] - info.minValue) || info.maxValue));
                validAxisInfo = info;
            }
        }
    });

    if(!_isDefined(correctValue)) {
        return;
    }
    _each(invalidAxisInfo, function(i, info) {
        var firstTick = info.tickValues[0],
            correctedTick = firstTick * correctValue,
            tickValues = validAxisInfo.tickValues,
            centralTick = tickValues[_floor(tickValues.length / 2)];

        if(firstTick > 0) {
            info.maxValue = correctedTick;
            info.minValue = 0;
        } else if(firstTick < 0) {
            info.minValue = correctedTick;
            info.maxValue = 0;
        } else if(firstTick === 0) {
            info.maxValue = validAxisInfo.maxValue - centralTick;
            info.minValue = validAxisInfo.minValue - centralTick;
        }
    });
};
var multiAxesSynchronizer = {
    synchronize: function(valueAxes) {
        _each(getValueAxesPerPanes(valueAxes), function(_, axes) {
            var axesInfo,
                paddings;
            if(axes.length > 1) {
                axesInfo = populateAxesInfo(axes);
                if(axesInfo.length === 0 || !getMainAxisInfo(axesInfo)) return;
                updateTickValues(axesInfo);

                correctMinMaxValues(axesInfo);
                paddings = calculatePaddings(axesInfo);


                correctMinMaxValuesByPaddings(axesInfo, paddings);

                correctAfterSynchronize(axesInfo);

                updateTickValuesIfSynchronizedValueUsed(axesInfo);
                _each(axesInfo, function() {
                    convertAxisInfo(this, logConverter);
                });
                applyMinMaxValues(axesInfo);
            }
        });
    }
};

module.exports = multiAxesSynchronizer;
