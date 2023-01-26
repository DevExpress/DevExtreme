// there stackedline, fullstackedline, stackedbar, fullstackedbar, stackedarea, fullstackedarea
import { noop as _noop } from '../../core/utils/common';

import { extend as _extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { chart as areaSeries } from './area_series';
const chartAreaSeries = areaSeries.area;
import { chart as _chart, polar as _polar } from './bar_series';
const chartBarSeries = _chart.bar;
import { chart as lineSeries } from './line_series';
import { map } from '../core/utils';
import { clone } from '../../core/utils/object';
const baseStackedSeries = {
    _calculateErrorBars: _noop,
    _updateOptions: function(options) {
        this._stackName = 'axis_' + (options.axis || 'default');
    }
};

const chart = {};
const polar = {};

chart['stackedline'] = _extend({}, lineSeries.line, baseStackedSeries, { });

chart['stackedspline'] = _extend({}, lineSeries['spline'], baseStackedSeries, {});

chart['fullstackedline'] = _extend({}, lineSeries.line, baseStackedSeries, {
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});

chart['fullstackedspline'] = _extend({}, lineSeries['spline'], baseStackedSeries, {
    getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue
});

const stackedBar = chart['stackedbar'] = _extend({}, chartBarSeries, baseStackedSeries, {
    _updateOptions: function(options) {
        baseStackedSeries._updateOptions.call(this, options);
        this._stackName = this._stackName + '_stack_' + (options.stack || 'default');
    }
});

chart['fullstackedbar'] = _extend({}, chartBarSeries, baseStackedSeries, {
    _updateOptions: stackedBar._updateOptions
});

function clonePoint(point, value, minValue, position) {
    point = clone(point);
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

chart['stackedarea'] = _extend({}, chartAreaSeries, baseStackedSeries, {
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

chart['stackedsplinearea'] = _extend({}, areaSeries['splinearea'], baseStackedSeries, {
    _prepareSegment: function(points, rotated) {
        const that = this;
        let areaSegment;
        points = preparePointsForStackedAreaSegment(points);
        if(!this._prevSeries || points.length === 1) {
            areaSegment = areaSeries['splinearea']._prepareSegment.call(this, points, rotated);
        } else {
            const forwardPoints = lineSeries.spline._calculateBezierPoints(points, rotated);
            let backwardPoints = map(points, function(p) {
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
    _appendInGroup: chart['stackedarea']._appendInGroup
});

chart['fullstackedarea'] = _extend({}, chartAreaSeries, baseStackedSeries, {
    _prepareSegment: chart['stackedarea']._prepareSegment,
    _appendInGroup: chart['stackedarea']._appendInGroup
});

chart['fullstackedsplinearea'] = _extend({}, areaSeries['splinearea'], baseStackedSeries, {
    _prepareSegment: chart['stackedsplinearea']._prepareSegment,
    _appendInGroup: chart['stackedarea']._appendInGroup
});

polar['stackedbar'] = _extend({}, _polar.bar, baseStackedSeries, {});

export {
    chart,
    polar
};
