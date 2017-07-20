"use strict";

var isNumeric = require("../../core/utils/type").isNumeric,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    inArray = require("../../core/utils/array").inArray,
    _math = Math,
    _round = _math.round,
    _abs = _math.abs,
    _pow = _math.pow,
    _each = each,
    _noop = require("../../core/utils/common").noop,
    vizUtils = require("./utils"),
    _normalizeEnum = vizUtils.normalizeEnum;

function getStacksWithArgument(stackKeepers, argument) {
    var stacksWithArgument = [];
    _each(stackKeepers, function(stackName, seriesInStack) {
        _each(seriesInStack, function(_, singleSeries) {
            var points = singleSeries.getPointsByArg(argument),
                pointsLength = points.length,
                i;
            for(i = 0; i < pointsLength; ++i) {
                if(points[i].hasValue()) {
                    stacksWithArgument.push(stackName);
                    return false;
                }
            }
        });
    });
    return stacksWithArgument;
}

function correctPointCoordinatesForStacks(stackKeepers, stacksWithArgument, argument, parameters) {
    _each(stackKeepers, function(stackName, seriesInStack) {
        var stackIndex = inArray(stackName, stacksWithArgument),
            offset;
        if(stackIndex === -1) {
            return;
        }
        offset = getOffset(stackIndex, parameters);
        _each(seriesInStack, function(_, singleSeries) {
            correctPointCoordinates(singleSeries.getPointsByArg(argument) || [], parameters.width, offset);
        });
    });
}

function adjustBarSeriesDimensionsCore(series, interval, stackCount, options, seriesStackIndexCallback) {
    var percentWidth,
        stackIndex,
        i,
        points,
        stackName,
        argumentsKeeper = {},
        stackKeepers = {},
        stacksWithArgument,
        barsArea = interval * 0.7,
        barWidth = options.barWidth,
        parameters;

    if(options.equalBarWidth) {
        percentWidth = (barWidth && (barWidth < 0 || barWidth > 1)) ? 0 : barWidth;

        parameters = calculateParams(barsArea, stackCount, percentWidth);
        for(i = 0; i < series.length; i++) {
            stackIndex = seriesStackIndexCallback(i, stackCount);
            points = series[i].getPoints();
            correctPointCoordinates(points, parameters.width, getOffset(stackIndex, parameters));
        }
    } else {
        //TODO: optimize everything
        //collect every stack which we have
        //every single series with no stack
        _each(series, function(i, singleSeries) {
            stackName = singleSeries.getStackName && singleSeries.getStackName();
            stackName = stackName || i.toString();
            if(!stackKeepers[stackName]) {
                stackKeepers[stackName] = [];
            }
            stackKeepers[stackName].push(singleSeries);
            _each(singleSeries.getPoints(), function(_, point) {
                var argument = point.argument;
                if(!argumentsKeeper.hasOwnProperty(argument)) {
                    argumentsKeeper[argument.valueOf()] = 1;
                }
            });
        });

        for(var argument in argumentsKeeper) {
            stacksWithArgument = getStacksWithArgument(stackKeepers, argument);
            parameters = calculateParams(barsArea, stacksWithArgument.length);
            correctPointCoordinatesForStacks(stackKeepers, stacksWithArgument, argument, parameters);
        }
    }
}

function calculateParams(barsArea, count, percentWidth) {
    var spacing,
        width,
        middleIndex = count / 2;

    if(!percentWidth) {
        spacing = _round(barsArea / count * 0.2);
        width = _round((barsArea - spacing * (count - 1)) / count);
        width < 2 && (width = 2);
    } else {
        width = _round(barsArea * percentWidth / count);
        spacing = _round(count > 1 ? (barsArea - barsArea * percentWidth) / (count - 1) : 0);
    }

    return { width: width, spacing: spacing, middleIndex: middleIndex };
}

function getOffset(stackIndex, parameters) {
    return ((stackIndex - parameters.middleIndex) + 0.5) * parameters.width - (((parameters.middleIndex - stackIndex) - 0.5) * parameters.spacing);
}

function correctPointCoordinates(points, width, offset) {
    _each(points, function(_, point) {
        point.correctCoordinates({
            width: width,
            offset: offset
        });
    });
}

function checkMinBarSize(value, minShownValue) {
    return _abs(value) < minShownValue ? value >= 0 ? minShownValue : -minShownValue : value;
}

function getValueType(value) {
    return (value >= 0) ? "positive" : "negative";
}

function getVisibleSeries(that) {
    return vizUtils.map(that.series, function(s) {
        return s.isVisible() ? s : null;
    });
}

function getAbsStackSumByArg(stackKeepers, stackName, argument) {
    var positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0,
        negativeStackValue = (-(stackKeepers.negative[stackName] || {})[argument]) || 0;
    return positiveStackValue + negativeStackValue;
}

function getSeriesStackIndexCallback(rotated, series, stackIndexes) {
    if(!rotated) {
        return function(seriesIndex) { return stackIndexes ? stackIndexes[series[seriesIndex].getStackName()] : seriesIndex; };
    } else {
        return function(seriesIndex, stackCount) { return stackCount - (stackIndexes ? stackIndexes[series[seriesIndex].getStackName()] : seriesIndex) - 1; };
    }
}

function adjustBarSeriesDimensions(translators) {
    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assert(translators, "translator was not passed or empty");
    ///#ENDDEBUG
    var that = this,
        series = getVisibleSeries(that);

    adjustBarSeriesDimensionsCore(series, translators.arg.getInterval(), series.length, that._options, getSeriesStackIndexCallback(that.rotated, series));
}

function adjustStackedBarSeriesDimensions(translators) {
    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assert(translators, "translators was not passed or empty");
    ///#ENDDEBUG
    var that = this,
        series = getVisibleSeries(that),
        stackIndexes = {},
        stackCount = 0;

    _each(series, function() {
        var stackName = this.getStackName();
        if(!(stackIndexes.hasOwnProperty(stackName))) {
            stackIndexes[stackName] = stackCount++;
        }
    });

    adjustBarSeriesDimensionsCore(series, translators.arg.getInterval(), stackCount, that._options, getSeriesStackIndexCallback(that.rotated, series, stackIndexes));
}

function adjustStackedSeriesValues() {
    var that = this,
        negativesAsZeroes = that._options.negativesAsZeroes,
        series = getVisibleSeries(that),
        stackKeepers = {
            positive: {},
            negative: {}
        },
        holesStack = {
            left: {},
            right: {}
        };

    _each(series, function(seriesIndex, singleSeries) {
        var points = singleSeries.getPoints(),
            hole = false;
        singleSeries._prevSeries = series[seriesIndex - 1];

        singleSeries.holes = extend(true, {}, holesStack);

        _each(points, function(index, point) {
            var value = point.initialValue,
                argument = point.argument.valueOf(),
                stackName = singleSeries.getStackName(),
                stacks = (value >= 0) ? stackKeepers.positive : stackKeepers.negative,
                currentStack;

            if(negativesAsZeroes && value < 0) {
                stacks = stackKeepers.positive;
                value = 0;
                point.resetValue();
            }

            stacks[stackName] = stacks[stackName] || {};
            currentStack = stacks[stackName];

            if(currentStack[argument]) {
                point.correctValue(currentStack[argument]);
                currentStack[argument] += value;
            } else {
                currentStack[argument] = value;
                point.resetCorrection();
            }
            if(!point.hasValue()) {
                var prevPoint = points[index - 1];
                if(!hole && prevPoint && prevPoint.hasValue()) {
                    argument = prevPoint.argument.valueOf();
                    prevPoint._skipSetRightHole = true;
                    holesStack.right[argument] = (holesStack.right[argument] || 0) + (prevPoint.value - (isFinite(prevPoint.minValue) ? prevPoint.minValue : 0));
                }
                hole = true;
            } else if(hole) {
                hole = false;
                holesStack.left[argument] = (holesStack.left[argument] || 0) + (point.value - (isFinite(point.minValue) ? point.minValue : 0));
                point._skipSetLeftHole = true;
            }
        });

    });
    _each(series, function(seriesIndex, singleSeries) {
        var points = singleSeries.getPoints(),
            holes = singleSeries.holes;
        _each(points, function(index, point) {
            var argument = point.argument.valueOf();
            point.resetHoles();
            !point._skipSetLeftHole && point.setHole(holes.left[argument] || holesStack.left[argument] && 0, "left");
            !point._skipSetRightHole && point.setHole(holes.right[argument] || holesStack.right[argument] && 0, "right");
            point._skipSetLeftHole = null;
            point._skipSetRightHole = null;
        });
    });
    that._stackKeepers = stackKeepers;
    _each(series, function(_, singleSeries) {
        _each(singleSeries.getPoints(), function(_, point) {
            var argument = point.argument.valueOf();
            point.setPercentValue(getAbsStackSumByArg(stackKeepers, singleSeries.getStackName(), argument), that.fullStacked, holesStack.left[argument], holesStack.right[argument]);
        });
    });
}

function updateStackedSeriesValues(translators) {
    var that = this,
        series = getVisibleSeries(that),
        stack = that._stackKeepers,
        stackKeepers = {
            positive: {},
            negative: {}
        };
    _each(series, function(_, singleSeries) {
        var minBarSize = singleSeries.getOptions().minBarSize,
            tr = singleSeries.axis ? translators.axesTrans[singleSeries.axis] : translators,
            minShownBusinessValue = minBarSize && tr.val.getMinBarSize(minBarSize),
            stackName = singleSeries.getStackName();

        _each(singleSeries.getPoints(), function(index, point) {
            if(!point.hasValue()) {
                return;
            }
            var value = point.initialValue,
                argument = point.argument.valueOf(),
                updateValue,
                valueType,
                currentStack;

            if(that.fullStacked) {
                value = ((value / (getAbsStackSumByArg(stack, stackName, argument))) || 0);
            }

            updateValue = checkMinBarSize(value, minShownBusinessValue);
            valueType = getValueType(updateValue);
            currentStack = stackKeepers[valueType][stackName] = stackKeepers[valueType][stackName] || {};

            if(currentStack[argument]) {
                point.minValue = currentStack[argument];
                currentStack[argument] += updateValue;
            } else {
                currentStack[argument] = updateValue;
            }
            point.value = currentStack[argument];
        });
    });

    if(that.fullStacked) {
        updateFullStackedSeriesValues(series, stackKeepers);
    }
}

function updateFullStackedSeriesValues(series, stackKeepers) {
    _each(series, function(_, singleSeries) {
        var stackName = (singleSeries.getStackName) ? singleSeries.getStackName() : "default";

        _each(singleSeries.getPoints(), function(index, point) {
            var stackSum = getAbsStackSumByArg(stackKeepers, stackName, point.argument.valueOf());
            point.value = point.value / stackSum;
            if(isNumeric(point.minValue)) {
                point.minValue = point.minValue / stackSum;
            }
        });
    });
}

function updateBarSeriesValues(translators) {
    _each(this.series, function(_, singleSeries) {
        var minBarSize = singleSeries.getOptions().minBarSize,
            tr = singleSeries.axis ? translators.axesTrans[singleSeries.axis] : translators,
            minShownBusinessValue = minBarSize && tr.val.getMinBarSize(minBarSize);

        if(minShownBusinessValue) {
            _each(singleSeries.getPoints(), function(index, point) {
                if(point.hasValue()) {
                    point.value = checkMinBarSize(point.initialValue, minShownBusinessValue);
                }
            });
        }
    });
}

function adjustCandlestickSeriesDimensions(translators) {
    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assert(translators, "translator was not passed or empty");
    ///#ENDDEBUG
    var series = getVisibleSeries(this);

    adjustBarSeriesDimensionsCore(series, translators.arg.getInterval(), series.length, { barWidth: null, equalBarWidth: true }, getSeriesStackIndexCallback(this.rotated, series));
}

function adjustBubbleSeriesDimensions(translators) {
    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assert(translators, "translator was not passed or empty");
    ///#ENDDEBUG
    var that = this,
        series = getVisibleSeries(that),
        options = that._options,
        visibleAreaX = translators.arg.getCanvasVisibleArea(),
        visibleAreaY = translators.val.getCanvasVisibleArea(),
        min = _math.min((visibleAreaX.max - visibleAreaX.min), (visibleAreaY.max - visibleAreaY.min)),
        minBubbleArea = _pow(options.minBubbleSize, 2),
        maxBubbleArea = _pow(min * options.maxBubbleSize, 2),
        equalBubbleSize = (min * options.maxBubbleSize + options.minBubbleSize) / 2,
        minPointSize = Infinity,
        maxPointSize = 0,
        pointSize,
        bubbleArea,
        sizeProportion,
        sizeDispersion,
        areaDispersion;

    _each(series, function(_, seriesItem) {
        _each(seriesItem.getPoints(), function(_, point) {
            maxPointSize = maxPointSize > point.size ? maxPointSize : point.size;
            minPointSize = minPointSize < point.size ? minPointSize : point.size;
        });
    });
    sizeDispersion = maxPointSize - minPointSize;
    areaDispersion = _abs(maxBubbleArea - minBubbleArea);

    minPointSize = minPointSize < 0 ? 0 : minPointSize;
    _each(series, function(_, seriesItem) {
        _each(seriesItem.getPoints(), function(_, point) {
            if(maxPointSize === minPointSize) {
                pointSize = _round(equalBubbleSize);
            } else {
                sizeProportion = _abs(point.size - minPointSize) / sizeDispersion;
                bubbleArea = areaDispersion * sizeProportion + minBubbleArea;
                pointSize = _round(_math.sqrt(bubbleArea));
            }
            point.correctCoordinates(pointSize);
        });
    });
}

function SeriesFamily(options) {
    ///#DEBUG
    var debug = require("../../core/utils/console").debug;
    debug.assert(options.type, "type was not passed or empty");
    ///#ENDDEBUG

    var that = this;

    that.type = _normalizeEnum(options.type);
    that.pane = options.pane;
    that.rotated = options.rotated;
    that.series = [];

    that.updateOptions(options);

    switch(that.type) {
        case "bar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.updateSeriesValues = updateBarSeriesValues;
            break;
        case "rangebar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            break;

        case "fullstackedbar":
            that.fullStacked = true;
            that.adjustSeriesDimensions = adjustStackedBarSeriesDimensions;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            that.updateSeriesValues = updateStackedSeriesValues;
            break;

        case "stackedbar":
            that.adjustSeriesDimensions = adjustStackedBarSeriesDimensions;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            that.updateSeriesValues = updateStackedSeriesValues;
            break;

        case "fullstackedarea":
        case "fullstackedline":
        case "fullstackedspline":
        case "fullstackedsplinearea":
            that.fullStacked = true;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;

        case "stackedarea":
        case "stackedsplinearea":
        case "stackedline":
        case "stackedspline":
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;

        case "candlestick":
        case "stock":
            that.adjustSeriesDimensions = adjustCandlestickSeriesDimensions;
            break;

        case "bubble":
            that.adjustSeriesDimensions = adjustBubbleSeriesDimensions;
            break;
    }
}


exports.SeriesFamily = SeriesFamily;

SeriesFamily.prototype = {
    constructor: SeriesFamily,

    adjustSeriesDimensions: _noop,

    adjustSeriesValues: _noop,

    updateSeriesValues: _noop,

    updateOptions: function(options) {
        this._options = options;
    },

    dispose: function() {
        this.series = this.translators = null;
    },

    add: function(series) {
        var type = this.type;
        this.series = vizUtils.map(series, function(singleSeries) {
            return singleSeries.type === type ? singleSeries : null;
        });
    }
};
