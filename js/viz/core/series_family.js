var isNumeric = require("../../core/utils/type").isNumeric,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined,
    _math = Math,
    _round = _math.round,
    _abs = _math.abs,
    _pow = _math.pow,
    _each = each,
    _noop = require("../../core/utils/common").noop,
    vizUtils = require("./utils"),
    DEFAULT_BAR_GROUP_PADDING = 0.3,
    _normalizeEnum = vizUtils.normalizeEnum;

function validateBarPadding(barPadding) {
    return (barPadding < 0 || barPadding > 1) ? undefined : barPadding;
}

function validateBarGroupPadding(barGroupPadding) {
    return (barGroupPadding < 0 || barGroupPadding > 1) ? DEFAULT_BAR_GROUP_PADDING : barGroupPadding;
}

function isStackExist(series, arg, equalBarWidth) {
    return series.some(function(s) {
        return (equalBarWidth && !s.getOptions().ignoreEmptyPoints) || s.getPointsByArg(arg, true).some(function(point) {
            return point.hasValue();
        });
    });
}

function correctStackCoordinates(series, currentStacks, arg, stack, parameters, barsArea, seriesStackIndexCallback) {
    series.forEach(function(series) {
        var stackIndex = seriesStackIndexCallback(currentStacks.indexOf(stack), currentStacks.length),
            points = series.getPointsByArg(arg, true),
            barPadding = validateBarPadding(series.getOptions().barPadding),
            barWidth = series.getOptions().barWidth,
            offset = getOffset(stackIndex, parameters),
            width = parameters.width,
            extraParameters;

        if(stackIndex === -1) {
            return;
        }

        if(isDefined(barPadding) || isDefined(barWidth)) {
            extraParameters = calculateParams(barsArea, currentStacks.length, 1 - barPadding, barWidth);
            width = extraParameters.width;
            offset = getOffset(stackIndex, extraParameters);
        }

        correctPointCoordinates(points, width, offset);
    });
}

function adjustBarSeriesDimensionsCore(series, options, seriesStackIndexCallback) {
    var commonStacks = [],
        allArguments = [],
        seriesInStacks = {},
        barWidth = options.barWidth,
        barGroupWidth = options.barGroupWidth,
        interval = series[0] && series[0].getArgumentAxis().getTranslator().getInterval(),
        barsArea = barGroupWidth ? (interval > barGroupWidth ? barGroupWidth : interval) : (interval * (1 - validateBarGroupPadding(options.barGroupPadding)));

    series.forEach(function(s, i) {
        var stackName = s.getStackName() || s.getBarOverlapGroup() || i.toString(),
            argument;

        for(argument in s.pointsByArgument) {
            if(allArguments.indexOf(argument.valueOf()) === -1) {
                allArguments.push(argument.valueOf());
            }
        }
        if(commonStacks.indexOf(stackName) === -1) {
            commonStacks.push(stackName);
            seriesInStacks[stackName] = [];
        }
        seriesInStacks[stackName].push(s);
    });

    allArguments.forEach(function(arg) {
        const currentStacks = commonStacks.reduce((stacks, stack) => {
            if(isStackExist(seriesInStacks[stack], arg, options.equalBarWidth)) {
                stacks.push(stack);
            }

            return stacks;
        }, []);

        const parameters = calculateParams(barsArea, currentStacks.length, barWidth);
        commonStacks.forEach(stack => {
            correctStackCoordinates(seriesInStacks[stack], currentStacks, arg, stack, parameters, barsArea, seriesStackIndexCallback);
        });
    });
}

function calculateParams(barsArea, count, percentWidth, fixedBarWidth) {
    var spacing,
        width;

    if(fixedBarWidth) {
        width = Math.min(fixedBarWidth, _round(barsArea / count));
        spacing = count > 1 ? _round((barsArea - width * count) / (count - 1)) : 0;
    } else if(isDefined(percentWidth)) {
        width = _round(barsArea * percentWidth / count);
        spacing = _round(count > 1 ? (barsArea - barsArea * percentWidth) / (count - 1) : 0);
    } else {
        spacing = _round(barsArea / count * 0.2);
        width = _round((barsArea - spacing * (count - 1)) / count);
    }

    return { width: width > 1 ? width : 1, spacing: spacing, middleIndex: count / 2 };
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

function getValueType(value) {
    return (value >= 0) ? "positive" : "negative";
}

function getVisibleSeries(that) {
    return that.series.filter(function(s) {
        return s.isVisible();
    });
}

function getAbsStackSumByArg(stackKeepers, stackName, argument) {
    var positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0,
        negativeStackValue = (-(stackKeepers.negative[stackName] || {})[argument]) || 0;
    return positiveStackValue + negativeStackValue;
}

function getStackSumByArg(stackKeepers, stackName, argument) {
    var positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0,
        negativeStackValue = (stackKeepers.negative[stackName] || {})[argument] || 0;
    return positiveStackValue + negativeStackValue;
}

function getSeriesStackIndexCallback(inverted) {
    if(!inverted) {
        return function(index) { return index; };
    } else {
        return function(index, stackCount) { return stackCount - index - 1; };
    }
}

function isInverted(series) {
    return series[0] && series[0].getArgumentAxis().getTranslator().isInverted();
}

function adjustBarSeriesDimensions() {
    const series = getVisibleSeries(this);
    adjustBarSeriesDimensionsCore(series, this._options, getSeriesStackIndexCallback(isInverted(series)));
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
        },
        lastSeriesInStack = {};

    series.forEach(function(singleSeries) {
        var stackName = singleSeries.getStackName() || singleSeries.getBarOverlapGroup(),
            hole = false;

        singleSeries._prevSeries = lastSeriesInStack[stackName];
        lastSeriesInStack[stackName] = singleSeries;

        singleSeries.holes = extend(true, {}, holesStack);

        singleSeries.getPoints().forEach(function(point, index, points) {
            var value = point.initialValue && point.initialValue.valueOf(),
                argument = point.argument.valueOf(),
                stacks = (value >= 0) ? stackKeepers.positive : stackKeepers.negative,
                isNotBarSeries = singleSeries.type !== "bar",
                currentStack;

            if(negativesAsZeroes && value < 0) {
                stacks = stackKeepers.positive;
                value = 0;
                point.resetValue();
            }

            stacks[stackName] = stacks[stackName] || {};
            currentStack = stacks[stackName];

            if(currentStack[argument]) {
                if(isNotBarSeries) point.correctValue(currentStack[argument]);
                currentStack[argument] += value;
            } else {
                currentStack[argument] = value;
                if(isNotBarSeries) point.resetCorrection();
            }
            if(!point.hasValue()) {
                var prevPoint = points[index - 1];
                if(!hole && prevPoint && prevPoint.hasValue()) {
                    argument = prevPoint.argument.valueOf();
                    prevPoint._skipSetRightHole = true;
                    holesStack.right[argument] = (holesStack.right[argument] || 0) + (prevPoint.value.valueOf() - (isFinite(prevPoint.minValue) ? prevPoint.minValue.valueOf() : 0));
                }
                hole = true;
            } else if(hole) {
                hole = false;
                holesStack.left[argument] = (holesStack.left[argument] || 0) + (point.value.valueOf() - (isFinite(point.minValue) ? point.minValue.valueOf() : 0));
                point._skipSetLeftHole = true;
            }
        });

    });
    series.forEach(function(singleSeries) {
        var holes = singleSeries.holes;
        singleSeries.getPoints().forEach(function(point) {
            var argument = point.argument.valueOf();
            point.resetHoles();
            !point._skipSetLeftHole && point.setHole(holes.left[argument] || holesStack.left[argument] && 0, "left");
            !point._skipSetRightHole && point.setHole(holes.right[argument] || holesStack.right[argument] && 0, "right");
            point._skipSetLeftHole = null;
            point._skipSetRightHole = null;
        });
    });

    that._stackKeepers = stackKeepers;
    series.forEach(function(singleSeries) {
        singleSeries.getPoints().forEach(function(point) {
            var argument = point.argument.valueOf(),
                stackName = singleSeries.getStackName() || singleSeries.getBarOverlapGroup(),
                absTotal = getAbsStackSumByArg(stackKeepers, stackName, argument),
                total = getStackSumByArg(stackKeepers, stackName, argument);

            point.setPercentValue(absTotal, total, holesStack.left[argument], holesStack.right[argument]);
        });
    });
}

function updateStackedSeriesValues() {
    var that = this,
        series = getVisibleSeries(that),
        stack = that._stackKeepers,
        stackKeepers = {
            positive: {},
            negative: {}
        };
    _each(series, function(_, singleSeries) {
        var minBarSize = singleSeries.getOptions().minBarSize,
            valueAxisTranslator = singleSeries.getValueAxis().getTranslator(),
            minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize),
            stackName = singleSeries.getStackName();

        _each(singleSeries.getPoints(), function(index, point) {
            if(!point.hasValue()) {
                return;
            }
            var value = point.initialValue && point.initialValue.valueOf(),
                argument = point.argument.valueOf(),
                updateValue,
                valueType,
                currentStack;

            if(that.fullStacked) {
                value = ((value / (getAbsStackSumByArg(stack, stackName, argument))) || 0);
            }

            updateValue = valueAxisTranslator.checkMinBarSize(value, minShownBusinessValue, point.value);
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

function updateBarSeriesValues() {
    _each(this.series, function(_, singleSeries) {
        var minBarSize = singleSeries.getOptions().minBarSize,
            valueAxisTranslator = singleSeries.getValueAxis().getTranslator(),
            minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);

        if(minShownBusinessValue) {
            _each(singleSeries.getPoints(), function(index, point) {
                if(point.hasValue()) {
                    point.value = valueAxisTranslator.checkMinBarSize(point.initialValue, minShownBusinessValue);
                }
            });
        }
    });
}

function adjustCandlestickSeriesDimensions() {
    const series = getVisibleSeries(this);
    adjustBarSeriesDimensionsCore(series, { barWidth: null, equalBarWidth: true, barGroupPadding: 0.3 }, getSeriesStackIndexCallback(isInverted(series)));
}

function adjustBubbleSeriesDimensions() {
    var series = getVisibleSeries(this);

    if(!series.length) {
        return;
    }

    var options = this._options,
        visibleAreaX = series[0].getArgumentAxis().getVisibleArea(),
        visibleAreaY = series[0].getValueAxis().getVisibleArea(),
        min = _math.min((visibleAreaX[1] - visibleAreaX[0]), (visibleAreaY[1] - visibleAreaY[0])),
        minBubbleArea = _pow(options.minBubbleSize, 2),
        maxBubbleArea = _pow(min * options.maxBubbleSize, 2),
        equalBubbleSize = (min * options.maxBubbleSize + options.minBubbleSize) / 2,
        minPointSize = Infinity,
        maxPointSize = -Infinity,
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
    that.series = [];

    that.updateOptions(options);

    switch(that.type) {
        case "bar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.updateSeriesValues = updateBarSeriesValues;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;
        case "rangebar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            break;

        case "fullstackedbar":
            that.fullStacked = true;
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            that.updateSeriesValues = updateStackedSeriesValues;
            break;

        case "stackedbar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
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
        this.series = null;
    },

    add: function(series) {
        var type = this.type;
        this.series = vizUtils.map(series, function(singleSeries) {
            return singleSeries.type === type ? singleSeries : null;
        });
    }
};
