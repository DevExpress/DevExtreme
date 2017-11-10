"use strict";
var _math = Math,
    _abs = _math.abs,
    unique = require("../../core/utils").unique,
    _isDefined = require("../../../core/utils/common").isDefined,
    DISCRETE = "discrete";

function addLabelPaddings(series, valueRange) {
    var labelOptions = series.getOptions().label;

    if(series.areLabelsVisible() && labelOptions && labelOptions.visible && labelOptions.position !== "inside") {
        if(valueRange.min < 0) {
            valueRange.minSpaceCorrection = true;
        }
        if(valueRange.max > 0) {
            valueRange.maxSpaceCorrection = true;
        }
    }
}

function addRangeSeriesLabelPaddings(series, range) {
    if(series.areLabelsVisible() && series._options.label.visible && series._options.label.position !== "inside") {
        range.minSpaceCorrection = range.maxSpaceCorrection = true;
    }
}

function continuousRangeCalculator(range, minValue, maxValue) {
    range.min = range.min < minValue ? range.min : minValue;
    range.max = range.max > maxValue ? range.max : maxValue;
}

function getRangeCalculator(axisType, calcInterval) {
    if(axisType === DISCRETE) {
        return function(range, minValue, maxValue) {
            if(minValue !== maxValue) {
                range.categories.push(maxValue);
            }
            range.categories.push(minValue);
        };
    }
    if(calcInterval) {
        return function(range, value) {
            var interval = calcInterval(value, range.prevValue),
                minInterval = range.interval;

            range.interval = (minInterval < interval ? minInterval : interval) || minInterval;
            range.prevValue = value;
            continuousRangeCalculator(range, value, value);
        };
    }
    return continuousRangeCalculator;
}

function getInitialRange(axisType, dataType, firstValue) {
    var range = {
        axisType: axisType,
        dataType: dataType
    };

    if(axisType === DISCRETE) {
        range.categories = [];
    } else {
        range.min = firstValue;
        range.max = firstValue;
    }
    return range;
}

function processCategories(range) {
    if(range.categories) {
        range.categories = unique(range.categories);
    }
}

function getValueForArgument(point, extraPoint, x) {
    if(extraPoint) {
        var y1 = point.value,
            y2 = extraPoint.value,
            x1 = point.argument,
            x2 = extraPoint.argument;

        return ((x - x1) * (y2 - y1)) / (x2 - x1) + y1;
    } else {
        return point.value;
    }
}

function getViewPortFilter(viewport) {
    if(!_isDefined(viewport.max) && !_isDefined(viewport.min)) {
        return function() {
            return true;
        };
    }
    if(!_isDefined(viewport.max)) {
        return function(argument) {
            return argument >= viewport.min;
        };
    }
    if(!_isDefined(viewport.min)) {
        return function(argument) {
            return argument <= viewport.max;
        };
    }
    return function(argument) {
        return argument >= viewport.min && argument <= viewport.max;
    };
}

function calculateRangeBetweenPoints(rangeCalculator, range, point, prevPoint, bound) {
    var value = getValueForArgument(point, prevPoint, bound);
    rangeCalculator(range, value, value);
}

function getViewportReducer(series) {
    var rangeCalculator = getRangeCalculator(series.valueAxisType),
        viewport = series.getArgumentAxis() && series.getArgumentAxis().getViewport() || {},
        viewportFilter;

    viewportFilter = getViewPortFilter(viewport);

    return function(range, point, index, points) {
        var argument = point.argument;

        if(!point.hasValue()) {
            return range;
        }

        if(viewportFilter(argument)) {
            if(!range.startCalc) {
                range.startCalc = true;
                calculateRangeBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.min);
            }
            rangeCalculator(range, point.getMinValue(), point.getMaxValue());
        } else if(_isDefined(viewport.max) && argument > viewport.max) {
            if(!range.startCalc) {
                calculateRangeBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.min);
            }
            range.endCalc = true;
            calculateRangeBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.max);
        }

        return range;
    };
}

function getIntervalCalculator(series) {
    var calcInterval = series.getArgumentAxis() && series.getArgumentAxis().calcInterval;
    if(calcInterval) {
        return calcInterval;
    }

    return function(value, prevValue) {
        return _abs(value - prevValue);
    };
}

module.exports = {
    getRangeData: function(series) {
        var points = series.getPoints(),
            intervalCalculator = getIntervalCalculator(series),
            argumentCalculator = getRangeCalculator(series.argumentAxisType, points.length > 1 && intervalCalculator),
            valueRangeCalculator = getRangeCalculator(series.valueAxisType),
            viewportReducer = getViewportReducer(series),
            range = points.reduce(function(range, point, index, points) {
                var argument = point.argument;
                argumentCalculator(range.arg, argument, argument);
                if(point.hasValue()) {
                    valueRangeCalculator(range.val, point.getMinValue(), point.getMaxValue());
                    viewportReducer(range.viewport, point, index, points);
                }
                return range;
            }, {
                arg: getInitialRange(series.argumentAxisType, series.argumentType, points.length ? points[0].argument : undefined),
                val: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined),
                viewport: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined)
            });


        processCategories(range.arg);
        processCategories(range.val);

        return range;
    },

    getViewport: function(series) {
        var points = series.getPoints(),
            range = {},
            reducer;

        if(series.valueAxisType !== DISCRETE && series.argumentAxisType !== DISCRETE) {
            reducer = getViewportReducer(series);
            range = getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined);
            points.some(function(point, index) {
                reducer(range, point, index, points);
                return range.endCalc;
            });
        }
        return range;
    },
    //TODO - remove it
    addLabelPaddings: addLabelPaddings,
    addRangeSeriesLabelPaddings: addRangeSeriesLabelPaddings
};
