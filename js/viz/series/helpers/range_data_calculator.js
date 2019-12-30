import { unique, getAddFunction, getLog } from '../../core/utils';
import { isDefined } from '../../../core/utils/type';
import { noop } from '../../../core/utils/common';
const DISCRETE = 'discrete';
const { abs, floor, ceil, min } = Math;

function continuousRangeCalculator(range, minValue, maxValue) {
    range.min = range.min < minValue ? range.min : minValue;
    range.max = range.max > maxValue ? range.max : maxValue;
}

function createGetLogFunction(axisType, axis) {
    if(axisType !== 'logarithmic') {
        return null;
    }
    const base = axis.getOptions().logarithmBase;

    return value => {
        const log = getLog(abs(value), base);
        const round = log < 0 ? floor : ceil;
        return round(log);
    };
}

function getRangeCalculator(axisType, axis, getLog) {
    let rangeCalculator = continuousRangeCalculator;
    if(axisType === DISCRETE) {
        rangeCalculator = function(range, minValue, maxValue) {
            if(minValue !== maxValue) {
                range.categories.push(maxValue);
            }
            range.categories.push(minValue);
        };
    } else if(axis) {
        rangeCalculator = function(range, value) {
            const interval = axis.calculateInterval(value, range.prevValue);
            const minInterval = range.interval;

            range.interval = (minInterval < interval ? minInterval : interval) || minInterval;
            range.prevValue = value;
            continuousRangeCalculator(range, value, value);
        };
    }

    if(getLog) {
        return (range, minValue, maxValue) => {
            const minArgs = [];
            rangeCalculator(range, minValue, maxValue);
            minValue !== 0 && minArgs.push(getLog(minValue));
            maxValue !== 0 && minArgs.push(getLog(maxValue));
            const linearThreshold = min.apply(null, minArgs);
            range.linearThreshold = range.linearThreshold < linearThreshold ? range.linearThreshold : linearThreshold;
        };
    }
    return rangeCalculator;
}

function getInitialRange(axisType, dataType, firstValue) {
    const range = {
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
    return range;
}

function getValueForArgument(point, extraPoint, x, range) {
    if(extraPoint && isDefined(extraPoint.value)) {
        const y1 = point.value;
        const y2 = extraPoint.value;
        const x1 = point.argument;
        const x2 = extraPoint.argument;

        const r = ((x - x1) * (y2 - y1)) / (x2 - x1) + y1.valueOf();
        return range.dataType === 'datetime' ? new Date(r) : r;
    } else {
        return point.value;
    }
}

function calculateRangeBetweenPoints(rangeCalculator, range, point, prevPoint, bound) {
    const value = getValueForArgument(point, prevPoint, bound, range);
    rangeCalculator(range, value, value);
}

function isLineSeries(series) {
    return series.type.toLowerCase().indexOf('line') >= 0 || series.type.toLowerCase().indexOf('area') >= 0;
}

function getViewportReducer(series) {
    const rangeCalculator = getRangeCalculator(series.valueAxisType);
    const argumentAxis = series.getArgumentAxis();
    const viewport = argumentAxis && series.getArgumentAxis().visualRange() || {};
    let viewportFilter;
    const calculatePointBetweenPoints = isLineSeries(series) ? calculateRangeBetweenPoints : noop;

    if(argumentAxis && argumentAxis.getMarginOptions().checkInterval) {
        const range = series.getArgumentAxis().getTranslator().getBusinessRange();
        const add = getAddFunction(range, false);
        const interval = range.interval;

        if(isFinite(interval) && isDefined(viewport.startValue) && isDefined(viewport.endValue)) {
            viewport.startValue = add(viewport.startValue, interval, -1);
            viewport.endValue = add(viewport.endValue, interval);
        }
    }

    viewportFilter = getViewPortFilter(viewport);

    return function(range, point, index, points) {
        const argument = point.argument;

        if(!point.hasValue()) {
            return range;
        }

        if(viewportFilter(argument)) {
            if(!range.startCalc) {
                range.startCalc = true;
                calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.startValue);
            }
            rangeCalculator(range, point.getMinValue(), point.getMaxValue());
        } else if(!viewport.categories && isDefined(viewport.startValue) && argument > viewport.startValue) {
            if(!range.startCalc) {
                calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.startValue);
            }
            range.endCalc = true;
            calculatePointBetweenPoints(rangeCalculator, range, point, points[index - 1], viewport.endValue);
        }

        return range;
    };
}

function getViewPortFilter(viewport) {
    if(viewport.categories) {
        const dictionary = viewport.categories.reduce((result, category) => {
            result[category.valueOf()] = true;
            return result;
        }, {});
        return argument =>isDefined(argument) && dictionary[argument.valueOf()];
    }
    if(!isDefined(viewport.startValue) && !isDefined(viewport.endValue)) {
        return () => true;
    }
    if(!isDefined(viewport.endValue)) {
        return argument => argument >= viewport.startValue;
    }
    if(!isDefined(viewport.startValue)) {
        return argument => argument <= viewport.endValue;
    }
    return argument => argument >= viewport.startValue && argument <= viewport.endValue;
}

module.exports = {
    getViewPortFilter,

    getArgumentRange: function(series) {
        const data = series._data || [];
        let range = {};
        if(data.length) {
            if(series.argumentAxisType === DISCRETE) {
                range = {
                    categories: data.map(item => item.argument)
                };
            } else {
                let interval;
                if(data.length > 1) {
                    const i1 = series.getArgumentAxis().calculateInterval(data[0].argument, data[1].argument);
                    const i2 = series.getArgumentAxis().calculateInterval(data[data.length - 1].argument, data[data.length - 2].argument);
                    interval = min(i1, i2);
                }
                range = {
                    min: data[0].argument,
                    max: data[data.length - 1].argument,
                    interval
                };
            }
        }
        return processCategories(range);
    },

    getRangeData: function(series) {
        const points = series.getPoints();
        const useAggregation = series.useAggregation();
        const argumentCalculator = getRangeCalculator(series.argumentAxisType, points.length > 1 && series.getArgumentAxis(), createGetLogFunction(series.argumentAxisType, series.getArgumentAxis()));
        const valueRangeCalculator = getRangeCalculator(series.valueAxisType, null, createGetLogFunction(series.valueAxisType, series.getValueAxis()));
        const viewportReducer = getViewportReducer(series);
        const range = points.reduce(function(range, point, index, points) {
            const argument = point.argument;
            if(!point.isArgumentCorrect()) {
                return range;
            }

            argumentCalculator(range.arg, argument, argument);
            if(point.hasValue()) {
                valueRangeCalculator(range.val, point.getMinValue(), point.getMaxValue());
                viewportReducer(range.viewport, point, index, points);
            }
            return range;
        }, {
            arg: getInitialRange(series.argumentAxisType, series.argumentType),
            val: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined),
            viewport: getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined)
        });

        if(useAggregation) {
            const argumentRange = this.getArgumentRange(series);
            if(series.argumentAxisType === DISCRETE) {
                range.arg = argumentRange;
            } else {
                const viewport = series.getArgumentAxis().getViewport();
                if(isDefined(viewport.startValue) || isDefined(viewport.length)) {
                    argumentCalculator(range.arg, argumentRange.min, argumentRange.min);
                }
                if(isDefined(viewport.endValue) || isDefined(viewport.length) && isDefined(viewport.startValue)) {
                    argumentCalculator(range.arg, argumentRange.max, argumentRange.max);
                }
            }
        }

        processCategories(range.arg);
        processCategories(range.val);

        return range;
    },

    getViewport: function(series) {
        const points = series.getPoints();
        let range = {};
        let reducer;

        reducer = getViewportReducer(series);
        range = getInitialRange(series.valueAxisType, series.valueType, points.length ? series.getValueRangeInitialValue() : undefined);
        points.some(function(point, index) {
            reducer(range, point, index, points);
            return range.endCalc;
        });

        return range;
    },

    getPointsInViewPort: function(series) {
        const argumentViewPortFilter = getViewPortFilter(series.getArgumentAxis().visualRange() || {});
        const valueViewPort = series.getValueAxis().visualRange() || {};
        const valueViewPortFilter = getViewPortFilter(valueViewPort);
        const points = series.getPoints();
        const addValue = function(values, point, isEdge) {
            const minValue = point.getMinValue();
            const maxValue = point.getMaxValue();
            const isMinValueInViewPort = valueViewPortFilter(minValue);
            const isMaxValueInViewPort = valueViewPortFilter(maxValue);

            if(isMinValueInViewPort) {
                values.push(minValue);
            }
            if(maxValue !== minValue && isMaxValueInViewPort) {
                values.push(maxValue);
            }
            if(isEdge && !isMinValueInViewPort && !isMaxValueInViewPort) {
                if(!values.length) {
                    values.push(valueViewPort.startValue);
                } else {
                    values.push(valueViewPort.endValue);
                }
            }
        };
        const addEdgePoints = isLineSeries(series) ? function(result, points, index) {
            const point = points[index];
            const prevPoint = points[index - 1];
            const nextPoint = points[index + 1];

            if(nextPoint && argumentViewPortFilter(nextPoint.argument)) {
                addValue(result[1], point, true);
            }

            if(prevPoint && argumentViewPortFilter(prevPoint.argument)) {
                addValue(result[1], point, true);
            }
        } : noop;
        const checkPointInViewport = function(result, point, index) {
            if(argumentViewPortFilter(point.argument)) {
                addValue(result[0], point);
            } else {
                addEdgePoints(result, points, index);
            }
            return result;
        };

        return points.reduce(checkPointInViewport, [[], []]);
    }
};
