// there stackedline, fullstackedline, stackedbar, fullstackedbar, stackedarea, fullstackedarea
const _noop = require('../../core/utils/common').noop;
const _extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const areaSeries = require('./area_series').chart;
const chartAreaSeries = areaSeries.area;
const barSeries = require('./bar_series');
const chartBarSeries = barSeries.chart.bar;
const lineSeries = require('./line_series').chart;
const vizUtils = require('../core/utils');
const objectUtils = require('../../core/utils/object');
const baseStackedSeries = {
    _calculateErrorBars: _noop,
    _updateOptions: function(options) {
        this._stackName = 'axis_' + (options.axis || 'default');
    }
};

exports.chart = {};
exports.polar = {};

exports.chart['stackedline'] = _extend({}, lineSeries.line, baseStackedSeries, { });

exports.chart['stackedspline'] = _extend({}, lineSeries['spline'], baseStackedSeries, {});

exports.chart['fullstackedline'] = _extend({}, lineSeries.line, baseStackedSeries, {
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});

exports.chart['fullstackedspline'] = _extend({}, lineSeries['spline'], baseStackedSeries, {
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});

const stackedBar = exports.chart['stackedbar'] = _extend({}, chartBarSeries, baseStackedSeries, {
    _updateOptions: function(options) {
        baseStackedSeries._updateOptions.call(this, options);
        this._stackName = this._stackName + '_stack_' + (options.stack || 'default');
    }
});

exports.chart['fullstackedbar'] = _extend({}, chartBarSeries, baseStackedSeries, {
    _updateOptions: stackedBar._updateOptions
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
    let i = 0;
    let p;
    const result = [];
    let array;
    const len = points.length;

    while(i < len) {
        p = points[i];
        array = [p];
        if(p.leftHole) {
            array = [clonePoint(p, p.leftHole, p.minLeftHole, 'left'), p];
        }
        if(p.rightHole) {
            array.push(clonePoint(p, p.rightHole, p.minRightHole, 'right'));
        }
        result.push(array);
        i++;
    }

    return [].concat.apply([], result);
}

exports.chart['stackedarea'] = _extend({}, chartAreaSeries, baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        return chartAreaSeries._prepareSegment.call(this, preparePointsForStackedAreaSegment(points), rotated);
    },
    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup).toBackground();
    }
});

function getPointsByArgFromPrevSeries(prevSeries, argument) {
    let result;
    while(!result && prevSeries) {
        result = prevSeries._segmentByArg && prevSeries._segmentByArg[argument]; // T357324
        prevSeries = prevSeries._prevSeries;
    }
    return result;
}

exports.chart['stackedsplinearea'] = _extend({}, areaSeries['splinearea'], baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        const that = this;
        let areaSegment;
        points = preparePointsForStackedAreaSegment(points);
        if(!this._prevSeries || points.length === 1) {
            areaSegment = areaSeries['splinearea']._prepareSegment.call(this, points, rotated);
        } else {
            const forwardPoints = lineSeries.spline._calculateBezierPoints(points, rotated);
            let backwardPoints = vizUtils.map(points, function(p) {
                const point = p.getCoords(true);
                point.argument = p.argument;
                return point;
            });
            let prevSeriesForwardPoints = [];
            const pointByArg = {};
            let i = 0;
            const len = that._prevSeries._segments.length;

            while(i < len) {
                prevSeriesForwardPoints = prevSeriesForwardPoints.concat(that._prevSeries._segments[i].line);
                i++;
            }

            each(prevSeriesForwardPoints, function(_, p) {
                if(p.argument !== null) {
                    const argument = p.argument.valueOf();
                    if(!pointByArg[argument]) {
                        pointByArg[argument] = [p];
                    } else {
                        pointByArg[argument].push(p);
                    }
                }
            });
            that._prevSeries._segmentByArg = pointByArg;
            backwardPoints = lineSeries.spline._calculateBezierPoints(backwardPoints, rotated);
            each(backwardPoints, function(i, p) {
                const argument = p.argument.valueOf();
                let prevSeriesPoints;
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
    _appendInGroup: exports.chart['stackedarea']._appendInGroup
});

exports.chart['fullstackedarea'] = _extend({}, chartAreaSeries, baseStackedSeries, {
    _prepareSegment: exports.chart['stackedarea']._prepareSegment,
    _appendInGroup: exports.chart['stackedarea']._appendInGroup
});

exports.chart['fullstackedsplinearea'] = _extend({}, areaSeries['splinearea'], baseStackedSeries, {
    _prepareSegment: exports.chart['stackedsplinearea']._prepareSegment,
    _appendInGroup: exports.chart['stackedarea']._appendInGroup
});

exports.polar['stackedbar'] = _extend({}, barSeries.polar.bar, baseStackedSeries, {});
