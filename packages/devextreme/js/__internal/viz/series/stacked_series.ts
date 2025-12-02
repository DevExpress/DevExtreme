/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop as _noop } from '@js/core/utils/common';
import { extend as _extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { clone } from '@js/core/utils/object';
import { map } from '@ts/viz/core/utils';

import { chart as areaSeries } from './area_series';
import { chart as _chart, polar as _polar } from './bar_series';
import { chart as lineSeries } from './line_series';
// @ts-expect-error
const chartAreaSeries = areaSeries.area;
// @ts-expect-error
const chartBarSeries = _chart.bar;

const baseStackedSeries = {
  _calculateErrorBars: _noop,
  _updateOptions(options) {
    this._stackName = `axis_${options.axis || 'default'}`;
  },
};

const chart = {};
const polar = {};
// @ts-expect-error
chart.stackedline = _extend({}, lineSeries.line, baseStackedSeries, { });
// @ts-expect-error
chart.stackedspline = _extend({}, lineSeries.spline, baseStackedSeries, {});
// @ts-expect-error
chart.fullstackedline = _extend({}, lineSeries.line, baseStackedSeries, {
  // @ts-expect-error
  getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue,
});
// @ts-expect-error
chart.fullstackedspline = _extend({}, lineSeries.spline, baseStackedSeries, {
  // @ts-expect-error
  getValueRangeInitialValue: areaSeries.area.getValueRangeInitialValue,
});
// @ts-expect-error
const stackedBar = chart.stackedbar = _extend({}, chartBarSeries, baseStackedSeries, {
  _updateOptions(options) {
    baseStackedSeries._updateOptions.call(this, options);
    this._stackName = `${this._stackName}_stack_${options.stack || 'default'}`;
  },
});
// @ts-expect-error
chart.fullstackedbar = _extend({}, chartBarSeries, baseStackedSeries, {
  _updateOptions: stackedBar._updateOptions,
});

function clonePoint(point, value, minValue, position) {
  point = clone(point);
  point.value = value;
  point.minValue = minValue;
  point.translate();
  point.argument += position;
  return point;
}

function preparePointsForStackedAreaSegment(points) {
  let i = 0;
  let p;
  const result = [];
  let array;
  const len = points.length;

  while (i < len) {
    p = points[i];
    array = [p];
    if (p.leftHole) {
      array = [clonePoint(p, p.leftHole, p.minLeftHole, 'left'), p];
    }
    if (p.rightHole) {
      array.push(clonePoint(p, p.rightHole, p.minRightHole, 'right'));
    }
    // @ts-expect-error
    result.push(array);
    i++;
  }

  return [].concat.apply([], result);
}
// @ts-expect-error
chart.stackedarea = _extend({}, chartAreaSeries, baseStackedSeries, {
  _prepareSegment(points, rotated) {
    return chartAreaSeries._prepareSegment.call(this, preparePointsForStackedAreaSegment(points), rotated);
  },
  _appendInGroup() {
    this._group.append(this._extGroups.seriesGroup).toBackground();
  },
});

function getPointsByArgFromPrevSeries(prevSeries, argument) {
  let result;
  while (!result && prevSeries) {
    result = prevSeries._segmentByArg && prevSeries._segmentByArg[argument]; // T357324
    prevSeries = prevSeries._prevSeries;
  }
  return result;
}
// @ts-expect-error
chart.stackedsplinearea = _extend({}, areaSeries.splinearea, baseStackedSeries, {
  _prepareSegment(points, rotated) {
    const that = this;
    let areaSegment;
    points = preparePointsForStackedAreaSegment(points);
    if (!this._prevSeries || points.length === 1) {
      // @ts-expect-error
      areaSegment = areaSeries.splinearea._prepareSegment.call(this, points, rotated);
    } else {
      // @ts-expect-error
      const forwardPoints = lineSeries.spline._calculateBezierPoints(points, rotated);
      let backwardPoints = map(points, (p) => {
        const point = p.getCoords(true);
        point.argument = p.argument;
        return point;
      });
      let prevSeriesForwardPoints = [];
      const pointByArg = {};
      let i = 0;
      const len = that._prevSeries._segments.length;

      while (i < len) {
        prevSeriesForwardPoints = prevSeriesForwardPoints.concat(that._prevSeries._segments[i].line);
        i++;
      }

      each(prevSeriesForwardPoints, (_, p) => {
        if (p.argument !== null) {
          const argument = p.argument.valueOf();
          if (!pointByArg[argument]) {
            pointByArg[argument] = [p];
          } else {
            pointByArg[argument].push(p);
          }
        }
      });
      that._prevSeries._segmentByArg = pointByArg;
      // @ts-expect-error
      backwardPoints = lineSeries.spline._calculateBezierPoints(backwardPoints, rotated);
      each(backwardPoints, (i, p) => {
        const argument = p.argument.valueOf();
        let prevSeriesPoints;
        if (i % 3 === 0) {
          prevSeriesPoints = pointByArg[argument] || getPointsByArgFromPrevSeries(that._prevSeries, argument);
          if (prevSeriesPoints) {
            // @ts-expect-error
            backwardPoints[i - 1] && prevSeriesPoints[0] && (backwardPoints[i - 1] = prevSeriesPoints[0]);
            // @ts-expect-error
            backwardPoints[i + 1] && (backwardPoints[i + 1] = prevSeriesPoints[2] || p);
          }
        }
      });
      areaSegment = {
        line: forwardPoints,
        area: forwardPoints.concat(backwardPoints.reverse()),
      };
      that._areaPointsToSplineAreaPoints(areaSegment.area);
    }
    return areaSegment;
  },
  // @ts-expect-error
  _appendInGroup: chart.stackedarea._appendInGroup,
});
// @ts-expect-error
chart.fullstackedarea = _extend({}, chartAreaSeries, baseStackedSeries, {
  // @ts-expect-error
  _prepareSegment: chart.stackedarea._prepareSegment,
  // @ts-expect-error
  _appendInGroup: chart.stackedarea._appendInGroup,
});
// @ts-expect-error
chart.fullstackedsplinearea = _extend({}, areaSeries.splinearea, baseStackedSeries, {
  // @ts-expect-error
  _prepareSegment: chart.stackedsplinearea._prepareSegment,
  // @ts-expect-error
  _appendInGroup: chart.stackedarea._appendInGroup,
});
// @ts-expect-error
polar.stackedbar = _extend({}, _polar.bar, baseStackedSeries, {
  _updateOptions(options) {
    baseStackedSeries._updateOptions.call(this, options);
    this._stackName = `${this._stackName}_stack_${options.stack || 'default'}`;
  },
});

export {
  chart,
  polar,
};
