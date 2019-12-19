import { debug } from '../../core/utils/console';
import { isDefined, isNumeric } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { getLog, raiseTo } from '../core/utils';
import { adjust } from '../../core/utils/math';

const _math = Math;
const _floor = _math.floor;
const _max = _math.max;
const _abs = _math.abs;

function getValueAxesPerPanes(valueAxes) {
    var result = {};

    valueAxes.forEach(axis => {
        var pane = axis.pane;
        if(!result[pane]) {
            result[pane] = [];
        }
        result[pane].push(axis);
    });

    return result;
}

var linearConverter = {
    transform: function(v, b) {
        return adjust(getLog(v, b));
    },

    addInterval: function(v, i) {
        return adjust(v + i);
    },

    getInterval: function(base, tickInterval) {
        return tickInterval;
    }
};

var logConverter = {
    transform: function(v, b) {
        return adjust(raiseTo(v, b));
    },

    addInterval: function(v, i) {
        return adjust(v * i);
    },

    getInterval: function(base, tickInterval) {
        return _math.pow(base, tickInterval);
    }
};

function convertAxisInfo(axisInfo, converter) {
    if(!axisInfo.isLogarithmic) {
        return;
    }
    var base = axisInfo.logarithmicBase,
        tickValues = axisInfo.tickValues,
        tick,
        ticks = [],
        interval;

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
    while(ticks.length < tickValues.length) {
        ticks.push(tick);
        tick = converter.addInterval(tick, interval);
    }

    ticks.tickInterval = axisInfo.tickInterval;
    axisInfo.tickValues = ticks;
}

function populateAxesInfo(axes) {
    return axes.reduce(function(result, axis) {
        var ticksValues = axis.getTicksValues(),
            majorTicks = ticksValues.majorTicksValues,
            options = axis.getOptions(),
            businessRange = axis.getTranslator().getBusinessRange(),
            visibleArea = axis.getVisibleArea(),

            axisInfo,
            tickInterval = axis._tickInterval,
            synchronizedValue = options.synchronizedValue;

        if(majorTicks && majorTicks.length > 0 &&
            isNumeric(majorTicks[0]) &&
            options.type !== 'discrete' &&
            !businessRange.isEmpty() &&
            !(businessRange.breaks && businessRange.breaks.length) &&
            axis.getViewport().action !== 'zoom'
        ) {

            axis.applyMargins();

            const startValue = axis.getTranslator().from(visibleArea[0]);
            const endValue = axis.getTranslator().from(visibleArea[1]);
            let minValue = startValue < endValue ? startValue : endValue;
            let maxValue = startValue < endValue ? endValue : startValue;

            if(minValue === maxValue && isDefined(synchronizedValue)) {
                tickInterval = _abs(majorTicks[0] - synchronizedValue) || 1;
                minValue = majorTicks[0] - tickInterval;
                maxValue = majorTicks[0] + tickInterval;
            }

            axisInfo = {
                axis: axis,
                isLogarithmic: options.type === 'logarithmic',
                logarithmicBase: businessRange.base,
                tickValues: majorTicks,
                minorValues: ticksValues.minorTicksValues,
                minorTickInterval: axis._minorTickInterval,
                minValue: minValue,
                oldMinValue: minValue,
                maxValue: maxValue,
                oldMaxValue: maxValue,
                inverted: businessRange.invert,
                tickInterval: tickInterval,
                synchronizedValue: synchronizedValue
            };

            convertAxisInfo(axisInfo, linearConverter);

            result.push(axisInfo);

            ///#DEBUG
            debug.assert((axisInfo.minValue === axisInfo.maxValue && (!isDefined(axisInfo.tickInterval) || isDefined(options.tickInterval))) || isDefined(axisInfo.tickInterval), 'tickInterval was not provided');
            ///#ENDDEBUG
        }
        return result;
    }, []);
}

function updateTickValues(axesInfo) {
    const maxTicksCount = axesInfo.reduce((max, axisInfo) => {
        return _max(max, axisInfo.tickValues.length);
    }, 0);

    axesInfo.forEach(axisInfo => {
        var ticksMultiplier,
            ticksCount,
            additionalStartTicksCount = 0,
            synchronizedValue = axisInfo.synchronizedValue,
            tickValues = axisInfo.tickValues,
            tickInterval = axisInfo.tickInterval;

        if(isDefined(synchronizedValue)) {
            axisInfo.baseTickValue = axisInfo.invertedBaseTickValue = synchronizedValue;
            axisInfo.tickValues = [axisInfo.baseTickValue];
        } else {
            if(tickValues.length > 1 && tickInterval) {
                ticksMultiplier = _floor((maxTicksCount + 1) / tickValues.length);
                ticksCount = ticksMultiplier > 1 ? _floor((maxTicksCount + 1) / ticksMultiplier) : maxTicksCount;
                additionalStartTicksCount = _floor((ticksCount - tickValues.length) / 2);

                while(additionalStartTicksCount > 0 && (tickValues[0] !== 0)) {
                    tickValues.unshift(adjust(tickValues[0] - tickInterval));
                    additionalStartTicksCount--;
                }
                while(tickValues.length < ticksCount) {
                    tickValues.push(adjust(tickValues[tickValues.length - 1] + tickInterval));
                }
                axisInfo.tickInterval = tickInterval / ticksMultiplier;
            }
            axisInfo.baseTickValue = tickValues[0];
            axisInfo.invertedBaseTickValue = tickValues[tickValues.length - 1];
        }
    });
}

function getAxisRange(axisInfo) {
    return (axisInfo.maxValue - axisInfo.minValue) || 1; // T153054
}

function getMainAxisInfo(axesInfo) {
    for(var i = 0; i < axesInfo.length; i++) {
        if(!axesInfo[i].stubData) {
            return axesInfo[i];
        }
    }
    return null;
}

function correctMinMaxValues(axesInfo) {
    var mainAxisInfo = getMainAxisInfo(axesInfo),
        mainAxisInfoTickInterval = mainAxisInfo.tickInterval;

    axesInfo.forEach(axisInfo => {
        var scale,
            move,
            mainAxisBaseValueOffset,
            valueFromAxisInfo;

        if(axisInfo !== mainAxisInfo) {
            if(mainAxisInfoTickInterval && axisInfo.tickInterval) {
                if(axisInfo.stubData && isDefined(axisInfo.synchronizedValue)) {
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
}

function calculatePaddings(axesInfo) {
    var minPadding,
        maxPadding,
        startPadding = 0,
        endPadding = 0;

    axesInfo.forEach(axisInfo => {
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
}

function correctMinMaxValuesByPaddings(axesInfo, paddings) {
    axesInfo.forEach(info => {
        var range = getAxisRange(info),
            inverted = info.inverted;

        info.minValue = adjust(info.minValue - paddings[inverted ? 'end' : 'start'] * range);
        info.maxValue = adjust(info.maxValue + paddings[inverted ? 'start' : 'end'] * range);
    });
}

function updateTickValuesIfSynchronizedValueUsed(axesInfo) {
    var hasSynchronizedValue = false;

    axesInfo.forEach(info => {
        hasSynchronizedValue = hasSynchronizedValue || isDefined(info.synchronizedValue);
    });

    axesInfo.forEach(info => {
        var tickInterval = info.tickInterval,
            tickValues = info.tickValues,
            maxValue = info.maxValue,
            minValue = info.minValue,
            tick;

        if(hasSynchronizedValue && tickInterval) {
            while((tick = adjust(tickValues[0] - tickInterval)) >= minValue) {
                tickValues.unshift(tick);
            }
            tick = tickValues[tickValues.length - 1];
            while((tick = adjust(tick + tickInterval)) <= maxValue) {
                tickValues.push(tick);
            }
        }
        while(tickValues[0] + tickInterval / 10 < minValue) {
            tickValues.shift();
        }
        while(tickValues[tickValues.length - 1] - tickInterval / 10 > maxValue) {
            tickValues.pop();
        }
    });
}

function applyMinMaxValues(axesInfo) {
    axesInfo.forEach(info => {
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

        if(range.min > range.minVisible) {
            range.min = range.minVisible;
        }
        if(range.max < range.maxVisible) {
            range.max = range.maxVisible;
        }

        axis.getTranslator().updateBusinessRange(range);
        axis.setTicks({ majorTicks: info.tickValues, minorTicks: info.minorValues });
    });
}

function correctAfterSynchronize(axesInfo) {
    var invalidAxisInfo = [],
        correctValue;

    axesInfo.forEach(info => {
        if(info.oldMaxValue - info.oldMinValue === 0) {
            invalidAxisInfo.push(info);
        } else {
            if(!isDefined(correctValue) && !isDefined(info.synchronizedValue)) {
                correctValue = _abs((info.maxValue - info.minValue) / ((info.tickValues[_floor(info.tickValues.length / 2)] - info.minValue) || info.maxValue));
            }
        }
    });

    if(!isDefined(correctValue)) {
        return;
    }
    invalidAxisInfo.forEach(info => {
        var firstTick = info.tickValues[0],
            correctedTick = firstTick * correctValue;

        if(firstTick > 0) {
            info.maxValue = correctedTick;
            info.minValue = 0;
        } else if(firstTick < 0) {
            info.minValue = correctedTick;
            info.maxValue = 0;
        }
    });
}

function updateMinorTicks(axesInfo) {
    axesInfo.forEach(function(axisInfo) {
        if(!axisInfo.minorTickInterval) {
            return;
        }

        var ticks = [];

        var interval = axisInfo.minorTickInterval,
            tickCount = axisInfo.tickInterval / interval - 1;

        for(var i = 1; i < axisInfo.tickValues.length; i++) {
            var tick = axisInfo.tickValues[i - 1];
            for(var j = 0; j < tickCount; j++) {
                tick += interval;
                ticks.push(tick);
            }
        }

        axisInfo.minorValues = ticks;
    });
}

var multiAxesSynchronizer = {
    synchronize: function(valueAxes) {
        each(getValueAxesPerPanes(valueAxes), function(_, axes) {
            var axesInfo,
                paddings;
            if(axes.length > 1) {
                axesInfo = populateAxesInfo(axes);
                if(axesInfo.length < 2 || !getMainAxisInfo(axesInfo)) return;
                updateTickValues(axesInfo);

                correctMinMaxValues(axesInfo);
                paddings = calculatePaddings(axesInfo);

                correctMinMaxValuesByPaddings(axesInfo, paddings);

                correctAfterSynchronize(axesInfo);

                updateTickValuesIfSynchronizedValueUsed(axesInfo);

                updateMinorTicks(axesInfo);

                axesInfo.forEach(info => {
                    convertAxisInfo(info, logConverter);
                });
                applyMinMaxValues(axesInfo);
            }
        });
    }
};

module.exports = multiAxesSynchronizer;
