/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable array-callback-return */

import { noop } from '@js/core/utils/common';
/// #DEBUG
import { debug } from '@js/core/utils/console';
/// #ENDDEBUG
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { extractColor, map, normalizeAngle } from '@ts/viz/core/utils';

import { chart as barChart } from './bar_series';
import { chart } from './scatter_series';

const chartScatterSeries = chart;
// @ts-expect-error
const barSeries = barChart.bar;

const _extend = extend;
const _each = each;
const _noop = noop;
const _map = map;

const _isFinite = isFinite;
const _max = Math.max;

const ANIMATION_DURATION = 0.7;
const INSIDE = 'inside';

export const pie = _extend({}, barSeries, {
  _setGroupsSettings() {
    // @ts-expect-error
    chartScatterSeries._setGroupsSettings.apply(this, arguments);
    this._labelsGroup.attr({ 'pointer-events': null });
  },

  _createErrorBarGroup: _noop,

  _drawPoint(options) {
    const point = options.point;
    const legendCallback = this._legendCallback;
    // @ts-expect-error
    chartScatterSeries._drawPoint.call(this, options);
    !point.isVisible() && point.setInvisibility();
    point.isSelected() && legendCallback();
  },

  _getOldPoint(data, oldPointsByArgument, index) {
    const point = (this._points || [])[index];
    if (point) {
      oldPointsByArgument[point.argument.valueOf()] = oldPointsByArgument[point.argument.valueOf()].filter((p) => p !== point);
    }
    return point;
  },

  adjustLabels(moveLabelsFromCenter) {
    return (this._points || []).reduce((r, p) => {
      if (p._label.isVisible()) {
        p.setLabelTrackerData();
        r = p.applyWordWrap(moveLabelsFromCenter) || r;
        p.updateLabelCoord(moveLabelsFromCenter);
        return r;
      }
    }, false);
  },

  _applyElementsClipRect: _noop,

  getColor: _noop,

  areErrorBarsVisible: _noop,

  drawLabelsWOPoints() {
    const that = this;

    if (that._options.label.position === INSIDE) {
      return false;
    }

    that._labelsGroup.append(that._extGroups.labelsGroup);
    (that._points || []).forEach((point) => {
      point.drawLabel();
    });

    return true;
  },

  getPointsCount() {
    return this._data.filter((d) => this._checkData(d)).length;
  },

  setMaxPointsCount(count) {
    this._pointsCount = count;
  },

  _getCreatingPointOptions(data, dataIndex) {
    return this._getPointOptions(data, dataIndex);
  },

  _updateOptions(options) {
    this.labelSpace = 0;
    this.innerRadius = this.type === 'pie' ? 0 : options.innerRadius;
  },

  _checkData(data, skippedFields) {
    const base = barSeries._checkData.call(this, data, skippedFields, { value: this.getValueFields()[0] });
    return this._options.paintNullPoints ? base : base && data.value !== null;
  },
  // @ts-expect-error
  _createGroups: chartScatterSeries._createGroups,

  _setMarkerGroupSettings() {
    this._markersGroup.attr({ class: 'dxc-markers' });
  },

  _getMainColor(data, point) {
    const pointsByArg = this.getPointsByArg(data.argument);
    const argumentIndex = point ? pointsByArg.indexOf(point) : pointsByArg.length;

    return this._options.mainSeriesColor(data.argument, argumentIndex, this._pointsCount);
  },

  _getPointOptions(data) {
    return this._parsePointOptions(this._preparePointOptions(), this._options.label, data);
  },

  _getRangeData() {
    return this._rangeData;
  },

  _createPointStyles(pointOptions, data, point) {
    const that = this;
    const mainColor = extractColor(pointOptions.color, true) || that._getMainColor(data, point);
    const colorId = pointOptions.color?.fillId;
    const hoverStyle = pointOptions.hoverStyle || {};
    const selectionStyle = pointOptions.selectionStyle || {};

    if (colorId) {
      that._turnOffHatching(hoverStyle, selectionStyle);
    }

    return {
      labelColor: mainColor,
      normal: that._parsePointStyle(pointOptions, mainColor, mainColor),
      hover: that._parsePointStyle(hoverStyle, colorId || mainColor, mainColor),
      selection: that._parsePointStyle(selectionStyle, colorId || mainColor, mainColor),
      legendStyles: {
        normal: that._createLegendState(pointOptions, mainColor),
        hover: that._createLegendState(hoverStyle, colorId || mainColor),
        selection: that._createLegendState(selectionStyle, colorId || mainColor),
      },
    };
  },

  _getArrangeMinShownValue(points, total) {
    const minSegmentSize = this._options.minSegmentSize;
    let totalMinSegmentSize = 0;
    let totalNotMinValues = 0;

    total = total || points.length;

    _each(points, (_, point) => {
      if (point.isVisible()) {
        if (point.normalInitialValue < minSegmentSize * total / 360) {
          totalMinSegmentSize += minSegmentSize;
        } else {
          totalNotMinValues += point.normalInitialValue;
        }
      }
    });

    return totalMinSegmentSize < 360 ? minSegmentSize * totalNotMinValues / (360 - totalMinSegmentSize) : 0;
  },

  _applyArrangeCorrection(points, minShownValue, total) {
    const options = this._options;
    const isClockWise = options.segmentsDirection !== 'anticlockwise';
    const shiftedAngle = _isFinite(options.startAngle) ? normalizeAngle(options.startAngle) : 0;
    const minSegmentSize = options.minSegmentSize;
    let percent;
    let correction = 0;
    let zeroTotalCorrection = 0;

    if (total === 0) {
      total = points.filter((el) => el.isVisible()).length;
      zeroTotalCorrection = 1;
    }

    _each(isClockWise ? points : points.concat([]).reverse(), (_, point) => {
      const val = point.isVisible() ? zeroTotalCorrection || point.normalInitialValue : 0;
      let updatedZeroValue;

      if (minSegmentSize && point.isVisible() && val < minShownValue) {
        updatedZeroValue = minShownValue;
      }
      percent = val / total;
      point.correctValue(correction, percent, zeroTotalCorrection + (updatedZeroValue || 0));
      point.shiftedAngle = shiftedAngle;
      correction += updatedZeroValue || val;
    });
    this._rangeData = { val: { min: 0, max: correction } };
  },

  _removePoint(point) {
    const points = this.getPointsByArg(point.argument);
    points.splice(points.indexOf(point), 1); // T485210
    point.dispose();
  },

  arrangePoints() {
    const that = this;
    const originalPoints = that._points || [];
    const minSegmentSize = that._options.minSegmentSize;
    let minShownValue;
    let isAllPointsNegative = true;
    let i = 0;
    const len = originalPoints.length;

    while (i < len && isAllPointsNegative) {
      isAllPointsNegative = originalPoints[i].value <= 0;
      i++;
    }

    const points = that._points = _map(originalPoints, (point) => {
      if (point.value === null || (!isAllPointsNegative && point.value < 0)) {
        that._removePoint(point);
        return null;
      } else {
        return point;
      }
    });
    // @ts-expect-error
    const maxValue = points.reduce((max, p) => _max(max, Math.abs(p.initialValue)), 0);
    points.forEach((p) => {
      // @ts-expect-error
      p.normalInitialValue = p.initialValue / (maxValue !== 0 ? maxValue : 1);
    });
    // @ts-expect-error
    const total = points.reduce((total, point) => total + (point.isVisible() ? point.normalInitialValue : 0), 0);
    if (minSegmentSize) {
      minShownValue = this._getArrangeMinShownValue(points, total);
    }
    that._applyArrangeCorrection(points, minShownValue, total);
  },

  correctPosition(correction, canvas) {
    /// #DEBUG
    debug.assert(correction, 'correction was not passed');
    debug.assertParam(correction.centerX, 'correction.centerX was not passed');
    debug.assertParam(correction.centerY, 'correction.centerY was not passed');
    debug.assertParam(correction.radiusInner, 'correction.radiusInner was not passed');
    debug.assertParam(correction.radiusOuter, 'correction.radiusOuter was not passed');
    debug.assertParam(canvas, 'correction.canvas was not passed');
    /// #ENDDEBUG
    _each(this._points, (_, point) => {
      point.correctPosition(correction);
    });
    this.setVisibleArea(canvas);
  },

  correctRadius(correction) {
    this._points.forEach((point) => {
      point.correctRadius(correction);
    });
  },

  correctLabelRadius(labelRadius) {
    this._points.forEach((point) => {
      point.correctLabelRadius(labelRadius);
    });
  },

  setVisibleArea(canvas) {
    this._visibleArea = {
      minX: canvas.left,
      maxX: canvas.width - canvas.right,
      minY: canvas.top,
      maxY: canvas.height - canvas.bottom,
    };
  },

  _applyVisibleArea: _noop,

  _animate(firstDrawing) {
    const that = this;
    const points = that._points;
    const pointsCount = points && points.length;
    const completeFunc = function () {
      that._animateComplete();
    };
    let animatePoint;

    if (firstDrawing) {
      animatePoint = function (p, i) {
        p.animate(i === pointsCount - 1 ? completeFunc : undefined, ANIMATION_DURATION, (1 - ANIMATION_DURATION) * i / (pointsCount - 1));
      };
    } else {
      animatePoint = function (p, i) {
        p.animate(i === pointsCount - 1 ? completeFunc : undefined);
      };
    }
    points.forEach(animatePoint);
  },

  getVisiblePoints() {
    return _map(this._points, (p) => (p.isVisible() ? p : null));
  },

  getPointsByKeys(arg, argumentIndex) {
    const pointsByArg = this.getPointsByArg(arg);
    return pointsByArg[argumentIndex] && [pointsByArg[argumentIndex]] || [];
  },
});

export const doughnut = pie;
export const donut = pie;
