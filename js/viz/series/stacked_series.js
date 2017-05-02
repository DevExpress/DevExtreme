"use strict";

//there stackedline, fullstackedline, stackedbar, fullstackedbar, stackedarea, fullstackedarea
var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    extend = require("../../core/utils/extend").extend,
    areaSeries = require("./area_series").chart,
    chartAreaSeries = areaSeries.area,
    barSeries = require("./bar_series"),
    chartBarSeries = barSeries.chart.bar,
    lineSeries = require("./line_series").chart,
    rangeCalculator = require("./helpers/range_data_calculator"),
    _extend = extend,
    vizUtils = require("../core/utils"),
    objectUtils = require("../../core/utils/object"),
    _noop = noop,
    baseStackedSeries = {
        _processRange: _noop,
        getErrorBarRangeCorrector: _noop,
        _fillErrorBars: _noop,
        _calculateErrorBars: _noop,
        _processStackedRange: function() {
            var that = this,
                prevPoint;
            that._resetRangeData();
            $.each(that.getAllPoints(), function(i, p) {
                rangeCalculator.processRange(that, p, prevPoint);
                prevPoint = p;
            });
        },

        _getRangeData: function() {
            this._processStackedRange();
            return chartAreaSeries._getRangeData.apply(this, arguments);
        }
    },
    baseFullStackedSeries = _extend({}, baseStackedSeries, {
        _getRangeData: function(zoomArgs, calcIntervalFunction) {
            var that = this;
            that._processStackedRange();
            rangeCalculator.calculateRangeData(that, zoomArgs, calcIntervalFunction);
            rangeCalculator.addLabelPaddings(that);
            rangeCalculator.processFullStackedRange(that);
            rangeCalculator.calculateRangeMinValue(that, zoomArgs);

            return that._rangeData;
        },

        isFullStackedSeries: function() {
            return true;
        }
    });

exports.chart = {};
exports.polar = {};

exports.chart["stackedline"] = _extend({}, lineSeries.line, baseStackedSeries, {
    _getRangeData: function() {
        this._processStackedRange();
        return lineSeries.line._getRangeData.apply(this, arguments);
    }
});

exports.chart["stackedspline"] = _extend({}, lineSeries["spline"], baseStackedSeries, {
    _getRangeData: exports.chart["stackedline"]._getRangeData
});

exports.chart["fullstackedline"] = _extend({}, lineSeries.line, baseFullStackedSeries, {
    _getRangeData: function(zoomArgs, calcIntervalFunction) {
        var that = this;
        that._processStackedRange();
        rangeCalculator.calculateRangeData(that, zoomArgs, calcIntervalFunction);
        rangeCalculator.addLabelPaddings(that);
        rangeCalculator.processFullStackedRange(that);
        return that._rangeData;
    }
});

exports.chart["fullstackedspline"] = _extend({}, lineSeries["spline"], baseFullStackedSeries, {
    _getRangeData: exports.chart["fullstackedline"]._getRangeData
});

exports.chart["stackedbar"] = _extend({}, chartBarSeries, baseStackedSeries, {
    _getRangeData: function() {
        this._processStackedRange();
        return chartBarSeries._getRangeData.apply(this, arguments);
    }
});
exports.chart["fullstackedbar"] = _extend({}, chartBarSeries, baseFullStackedSeries, {
    _getRangeData: function() {
        var rangeData = baseFullStackedSeries._getRangeData.apply(this, arguments);
        rangeData.arg.stick = false;

        return rangeData;
    }
});

function clonePoint(point, value, minValue, position) {
    point = objectUtils.clone(point);
    point.value = value;
    point.minValue = minValue;
    point.translate();
    point.argument = point.argument + position;
    return point;
}

function preparePointsForStackedAreaSegment(points) {
    var i = 0,
        p,
        result = [],
        array,
        len = points.length;

    while(i < len) {
        p = points[i];
        array = [p];
        if(p.leftHole) {
            array = [clonePoint(p, p.leftHole, p.minLeftHole, "left"), p];
        }
        if(p.rightHole) {
            array.push(clonePoint(p, p.rightHole, p.minRightHole, "right"));
        }
        result.push(array);
        i++;
    }

    return [].concat.apply([], result);
}

exports.chart["stackedarea"] = _extend({}, chartAreaSeries, baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        return chartAreaSeries._prepareSegment.call(this, preparePointsForStackedAreaSegment(points, this._prevSeries), rotated);
    },
    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup).toBackground();
    }
});

function getPointsByArgFromPrevSeries(prevSeries, argument) {
    var result;
    while(!result && prevSeries) {
        result = prevSeries._segmentByArg && prevSeries._segmentByArg[argument];    // T357324
        prevSeries = prevSeries._prevSeries;
    }
    return result;
}

exports.chart["stackedsplinearea"] = _extend({}, areaSeries["splinearea"], baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        var that = this,
            areaSegment;
        points = preparePointsForStackedAreaSegment(points, that._prevSeries);
        if(!this._prevSeries || points.length === 1) {
            areaSegment = areaSeries["splinearea"]._prepareSegment.call(this, points, rotated);
        } else {
            var forwardPoints = lineSeries["spline"]._calculateBezierPoints(points, rotated),
                backwardPoints = vizUtils.map(points, function(p) {
                    var point = p.getCoords(true);
                    point.argument = p.argument;
                    return point;
                }),
                prevSeriesForwardPoints = [],
                pointByArg = {},
                i = 0,
                len = that._prevSeries._segments.length;

            while(i < len) {
                prevSeriesForwardPoints = prevSeriesForwardPoints.concat(that._prevSeries._segments[i].line);
                i++;
            }

            $.each(prevSeriesForwardPoints, function(_, p) {
                if(p.argument !== null) {
                    var argument = p.argument.valueOf();
                    if(!pointByArg[argument]) {
                        pointByArg[argument] = [p];
                    } else {
                        pointByArg[argument].push(p);
                    }
                }
            });
            that._prevSeries._segmentByArg = pointByArg;
            backwardPoints = lineSeries["spline"]._calculateBezierPoints(backwardPoints, rotated);
            $.each(backwardPoints, function(i, p) {
                var argument = p.argument.valueOf(),
                    prevSeriesPoints;
                if(i % 3 === 0) {
                    prevSeriesPoints = pointByArg[argument] || getPointsByArgFromPrevSeries(that._prevSeries, argument);
                    if(prevSeriesPoints) {
                        backwardPoints[i - 1] && prevSeriesPoints[0] && (backwardPoints[i - 1] = prevSeriesPoints[0]);
                        backwardPoints[i + 1] && (backwardPoints[i + 1] = prevSeriesPoints[2] || p);
                    }
                }
            });
            areaSegment = {
                line: forwardPoints,
                area: forwardPoints.concat(backwardPoints.reverse())
            };
            that._areaPointsToSplineAreaPoints(areaSegment.area);
        }
        return areaSegment;
    },
    _appendInGroup: exports.chart["stackedarea"]._appendInGroup
});

exports.chart["fullstackedarea"] = _extend({}, chartAreaSeries, baseFullStackedSeries, {
    _prepareSegment: exports.chart["stackedarea"]._prepareSegment,
    _appendInGroup: exports.chart["stackedarea"]._appendInGroup
});

exports.chart["fullstackedsplinearea"] = _extend({}, areaSeries["splinearea"], baseFullStackedSeries, {
    _prepareSegment: exports.chart["stackedsplinearea"]._prepareSegment,
    _appendInGroup: exports.chart["stackedarea"]._appendInGroup
});

exports.polar["stackedbar"] = _extend({}, barSeries.polar.bar, baseStackedSeries, {
    _getRangeData: function() {
        this._processStackedRange();
        return barSeries.polar.bar._getRangeData.apply(this, arguments);
    }
});
