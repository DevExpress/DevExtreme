"use strict";

var $ = require("jquery"),
    _math = Math,
    _abs = _math.abs,
    _min = _math.min,
    _max = _math.max,

    _each = $.each,
    _isEmptyObject = $.isEmptyObject,

    commonUtils = require("../../../core/utils/common"),
    _isDefined = commonUtils.isDefined,
    _isFinite = isFinite,

    unique = require("../../core/utils").unique,

    MIN_VISIBLE = "minVisible",
    MAX_VISIBLE = "maxVisible",
    DISCRETE = "discrete";

function _truncateValue(data, value) {
    var min = data.min,
        max = data.max;

    data.min = value < min || !_isDefined(min) ? value : min;
    data.max = value > max || !_isDefined(max) ? value : max;
}

function _processValue(series, type, value, prevValue, calcInterval) {
    var isDiscrete = (type === "arg" ? series.argumentAxisType : series.valueAxisType) === DISCRETE,
        data = series._rangeData[type],
        minInterval = data.interval,
        interval;

    if(isDiscrete) {
        data.categories = data.categories || [];
        data.categories.push(value);
    } else if(!isDiscrete) {
        _truncateValue(data, value);
        if(type === "arg") {
            interval = (_isDefined(prevValue) ? _abs(calcInterval ? calcInterval(value, prevValue) : value - prevValue) : interval) || minInterval;
            data.interval = _isDefined(interval) && (interval < minInterval || !_isDefined(minInterval)) ? interval : minInterval;
        }
    }
}

function _addToVisibleRange(series, value) {
    var data = series._rangeData.val,
        isDiscrete = (series.valueAxisType === DISCRETE);

    if(!isDiscrete) {
        if(value < data.minVisible || !_isDefined(data.minVisible)) {
            data.minVisible = value;
        }
        if(value > data.maxVisible || !_isDefined(data.maxVisible)) {
            data.maxVisible = value;
        }
    }
}

function _processRangeValue(series, val, minVal) {
    var data = series._rangeData.val;

    if(series.valueAxisType === DISCRETE) {
        data.categories = data.categories || [];
        data.categories.push(val, minVal);
    } else {
        _truncateValue(data, val);
        _truncateValue(data, minVal);
    }
}

function _processZoomArgument(series, zoomArgs, isDiscrete) {
    var data = series._rangeData.arg,
        minArg,
        maxArg;

    if(isDiscrete) {
        data.minVisible = zoomArgs.minArg;
        data.maxVisible = zoomArgs.maxArg;
        return;
    }

    minArg = zoomArgs.minArg < zoomArgs.maxArg ? zoomArgs.minArg : zoomArgs.maxArg;
    maxArg = zoomArgs.maxArg > zoomArgs.minArg ? zoomArgs.maxArg : zoomArgs.minArg;

    data.min = minArg < data.min ? minArg : data.min;
    data.max = maxArg > data.max ? maxArg : data.max;

    data.minVisible = minArg;
    data.maxVisible = maxArg;
}

function _correctZoomValue(series, zoomArgs) {
    var minVal,
        maxVal;

    if(_isDefined(zoomArgs.minVal) && _isDefined(zoomArgs.maxVal)) {
        minVal = zoomArgs.minVal < zoomArgs.maxVal ? zoomArgs.minVal : zoomArgs.maxVal;
        maxVal = zoomArgs.maxVal > zoomArgs.minVal ? zoomArgs.maxVal : zoomArgs.minVal;
    }
    if(_isDefined(zoomArgs.minVal)) {
        series._rangeData.val.min = minVal < series._rangeData.val.min ? minVal : series._rangeData.val.min;
        series._rangeData.val.minVisible = minVal;
    }
    if(_isDefined(zoomArgs.maxVal)) {
        series._rangeData.val.max = maxVal > series._rangeData.val.max ? maxVal : series._rangeData.val.max;
        series._rangeData.val.maxVisible = maxVal;
    }
}

function _processZoomValue(series, zoomArgs) {
    var adjustOnZoom = zoomArgs.adjustOnZoom,
        points = series._points || [],
        lastVisibleIndex,
        prevPointAdded = false,
        rangeData = series._rangeData,
        errorBarCorrector = series.getErrorBarRangeCorrector();

    _each(points, function(index, point) {
        var arg = point.argument,
            prevPoint = index > 0 ? points[index - 1] : null;

        if(adjustOnZoom && series.argumentAxisType !== DISCRETE && arg >= rangeData.arg.minVisible && arg <= rangeData.arg.maxVisible) {
            if(!prevPointAdded) {
                if(prevPoint && prevPoint.hasValue()) {
                    _addToVisibleRange(series, prevPoint.value);
                    _correctMinMaxByErrorBar(rangeData.val, prevPoint, errorBarCorrector, MIN_VISIBLE, MAX_VISIBLE);
                }
                prevPointAdded = true;
            }
            if(point.hasValue()) {
                _addToVisibleRange(series, point.value);
                _correctMinMaxByErrorBar(rangeData.val, point, errorBarCorrector, MIN_VISIBLE, MAX_VISIBLE);
            }
            lastVisibleIndex = index;
        }
    });

    if(_isDefined(lastVisibleIndex) && lastVisibleIndex < points.length - 1 && points[lastVisibleIndex + 1].hasValue()) {
        _addToVisibleRange(series, points[lastVisibleIndex + 1].value);
    }

    _correctZoomValue(series, zoomArgs);
}

function _processZoomRangeValue(series, zoomArgs, maxValueName, minValueName) {
    var adjustOnZoom = zoomArgs.adjustOnZoom,
        points = series._points || [],
        argRangeData = series._rangeData.arg,
        lastVisibleIndex,
        prevPointAdded = false;

    _each(points, function(index, point) {
        var arg = point.argument,
            prevPoint = index > 0 ? points[index - 1] : null;

        if(adjustOnZoom && series.argumentAxisType !== DISCRETE && arg >= argRangeData.minVisible && arg <= argRangeData.maxVisible) {
            if(!prevPointAdded) {
                if(prevPoint && prevPoint.hasValue()) {
                    _addToVisibleRange(series, prevPoint[maxValueName]);
                    _addToVisibleRange(series, prevPoint[minValueName]);
                }
                prevPointAdded = true;
            }
            if(point.hasValue()) {
                _addToVisibleRange(series, point[maxValueName]);
                _addToVisibleRange(series, point[minValueName]);
            }
            lastVisibleIndex = index;
        }
    });

    if(_isDefined(lastVisibleIndex) && lastVisibleIndex < points.length - 1 && points[lastVisibleIndex + 1].hasValue()) {
        _addToVisibleRange(series, points[lastVisibleIndex + 1].value);
    }

    _correctZoomValue(series, zoomArgs);
}

function _processNewInterval(series, calcInterval) {
    var data = series._rangeData,
        points = series._points || [],
        isArgumentAxisDiscrete = series.argumentAxisType === DISCRETE;

    delete data.arg.interval;
    _each(points, function(index, point) {
        var arg = point.argument,
            prevPoint = index > 0 ? points[index - 1] : null,
            prevArg = prevPoint && prevPoint.argument;

        !isArgumentAxisDiscrete && _processValue(series, "arg", arg, prevArg, calcInterval);
    });
}

function _fillRangeData(series) {
    var data = series._rangeData;

    data.val.categories && (data.val.categories = unique(data.val.categories));

    data.arg.axisType = series.argumentAxisType;
    data.arg.dataType = series.argumentType;

    data.val.axisType = series.valueAxisType;
    data.val.dataType = series.valueType;
}

function processTwoValues(series, point, prevPoint, highValueName, lowValueName) {
    var val = point[highValueName],
        minVal = point[lowValueName],
        arg = point.argument,
        prevVal = prevPoint && prevPoint[highValueName],
        prevMinVal = prevPoint && prevPoint[lowValueName],
        prevArg = prevPoint && prevPoint.argument;

    point.hasValue() && _processRangeValue(series, val, minVal, prevVal, prevMinVal);
    _processValue(series, "arg", arg, prevArg);
}

function calculateRangeMinValue(series, zoomArgs) {
    var data = series._rangeData.val,
        minVisible = data[MIN_VISIBLE],
        maxVisible = data[MAX_VISIBLE];
    zoomArgs = zoomArgs || {};

    if(data) {
        if(series.valueAxisType !== "logarithmic" && series.valueType !== "datetime" && series.showZero !== false) {
            data[MIN_VISIBLE] = (minVisible > (zoomArgs.minVal || 0)) ? zoomArgs.minVal || 0 : minVisible;
            data[MAX_VISIBLE] = (maxVisible < (zoomArgs.maxVal || 0)) ? zoomArgs.maxVal || 0 : maxVisible;

            data.min = data.min > 0 ? 0 : data.min;
            data.max = data.max < 0 ? 0 : data.max;
        }
    }
}

function processFullStackedRange(series) {
    var data = series._rangeData.val,
        isRangeEmpty = _isEmptyObject(data);

    data.percentStick = true;
    if(!isRangeEmpty) {
        data.min = data.min > 0 ? 0 : data.min;
        data.max = data.max < 0 ? 0 : data.max;
    }
}

function _correctMinMaxByErrorBar(data, point, getMinMaxCorrector, minSelector, maxSelector) {
    if(!getMinMaxCorrector) {
        return;
    }
    var correctionData = getMinMaxCorrector(point),
        minError = _min.apply(undefined, correctionData),
        maxError = _max.apply(undefined, correctionData);

    if(_isFinite(minError) && data[minSelector] > minError) {
        data[minSelector] = minError;
    }
    if(_isFinite(maxError) && data[maxSelector] < maxError) {
        data[maxSelector] = maxError;
    }
}

function processRange(series, point, prevPoint, getMinMaxCorrector) {
    var val = point.value,
        arg = point.argument,
        prevVal = prevPoint && prevPoint.value,
        prevArg = prevPoint && prevPoint.argument;

    point.hasValue() && _processValue(series, "val", val, prevVal);
    _processValue(series, "arg", arg, prevArg);

    _correctMinMaxByErrorBar(series._rangeData.val, point, getMinMaxCorrector, "min", "max");
}

function addLabelPaddings(series) {
    var labelOptions = series.getOptions().label,
        valueData;
    if(series.areLabelsVisible() && labelOptions && labelOptions.visible && labelOptions.position !== "inside") {
        valueData = series._rangeData.val;
        if(valueData.min < 0) {
            valueData.minSpaceCorrection = true;
        }
        if(valueData.max > 0) {
            valueData.maxSpaceCorrection = true;
        }
    }
}

function addRangeSeriesLabelPaddings(series) {
    var data = series._rangeData.val;

    if(series.areLabelsVisible() && series._options.label.visible && series._options.label.position !== "inside") {
        data.minSpaceCorrection = data.maxSpaceCorrection = true;
    }
}

function calculateRangeData(series, zoomArgs, calcIntervalFunction, maxValueName, minValueName) {

    var valueData = series._rangeData.val,

        isRangeSeries = !!maxValueName && !!minValueName,
        isDiscrete = series.argumentAxisType === DISCRETE;

    if(zoomArgs && _isDefined(zoomArgs.minArg) && _isDefined(zoomArgs.maxArg)) {
        if(!isDiscrete) {
            valueData[MIN_VISIBLE] = zoomArgs.minVal;
            valueData[MAX_VISIBLE] = zoomArgs.maxVal;
        }
        _processZoomArgument(series, zoomArgs, isDiscrete);
        if(isRangeSeries) {
            _processZoomRangeValue(series, zoomArgs, maxValueName, minValueName);
        } else {
            _processZoomValue(series, zoomArgs);
        }

    } else if(!zoomArgs && calcIntervalFunction) {
        _processNewInterval(series, calcIntervalFunction);
    }

    _fillRangeData(series);
}

module.exports = {
    processRange: processRange,
    calculateRangeData: calculateRangeData,
    addLabelPaddings: addLabelPaddings,
    addRangeSeriesLabelPaddings: addRangeSeriesLabelPaddings,
    processFullStackedRange: processFullStackedRange,
    calculateRangeMinValue: calculateRangeMinValue,
    processTwoValues: processTwoValues
};
