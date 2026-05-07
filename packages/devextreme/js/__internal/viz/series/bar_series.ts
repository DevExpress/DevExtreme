/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined as _isDefined } from '@js/core/utils/type';
import { convertPolarToXY, extractColor } from '@ts/viz/core/utils';

import { chart as areaChart } from './area_series';
import * as scatterSeries from './scatter_series';
// @ts-expect-error
const areaSeries = areaChart.area;
const chartSeries = scatterSeries.chart;
const polarSeries = scatterSeries.polar;

const _extend = extend;
const _each = each;

const chart = {};
const polar = {};

const baseBarSeriesMethods = {
  _createLegendState(styleOptions, defaultColor) {
    return {
      fill: extractColor(styleOptions.color) || defaultColor,
      hatching: styleOptions.hatching,
      filter: styleOptions.highlight,
    };
  },

  _getColorId: areaSeries._getColorId,

  _parsePointStyle(style, defaultColor, defaultBorderColor) {
    const color = extractColor(style.color) || defaultColor;
    // @ts-expect-error
    const base = chartSeries._parsePointStyle.call(this, style, color, defaultBorderColor);
    base.fill = color;
    base.hatching = style.hatching;
    base.filter = style.highlight;
    base.dashStyle = style.border && style.border.dashStyle || 'solid';
    delete base.r;

    return base;
  },

  _applyMarkerClipRect(settings) {
    settings['clip-path'] = null;
  },

  _setGroupsSettings(animationEnabled, firstDrawing) {
    const that = this;
    let settings = {};
    // @ts-expect-error
    chartSeries._setGroupsSettings.apply(that, arguments);
    if (animationEnabled && firstDrawing) {
      settings = this._getAffineCoordOptions();
    } else if (!animationEnabled) {
      settings = {
        scaleX: 1, scaleY: 1, translateX: 0, translateY: 0,
      };
    }
    that._markersGroup.attr(settings);
  },

  _drawPoint(options) {
    options.hasAnimation = options.hasAnimation && !options.firstDrawing;
    options.firstDrawing = false;
    // @ts-expect-error
    chartSeries._drawPoint.call(this, options);
  },

  _getMainColor() {
    return this._options.mainSeriesColor;
  },

  _createPointStyles(pointOptions) {
    const that = this;
    const mainColor = extractColor(pointOptions.color, true) || that._getMainColor();
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
    };
  },

  _updatePointsVisibility() {
    const visibility = this._options.visible;
    each(this._points, (_, point) => {
      point._options.visible = visibility;
    });
  },

  _getOptionsForPoint() {
    return this._options;
  },

  _animate(firstDrawing) {
    const that = this;
    const complete = function () {
      that._animateComplete();
    };
    const animateFunc = function (drawnPoints, complete) {
      const lastPointIndex = drawnPoints.length - 1;
      _each(drawnPoints || [], (i, point) => {
        point.animate(i === lastPointIndex ? complete : undefined, point.getMarkerCoords());
      });
    };
    that._animatePoints(firstDrawing, complete, animateFunc);
  },

  getValueRangeInitialValue: areaSeries.getValueRangeInitialValue,

  _patchMarginOptions(options) {
    options.checkInterval = !this.useAggregation() || this.getArgumentAxis()?.aggregatedPointBetweenTicks();
    return options;
  },

  _defaultAggregator: 'sum',

  _defineDrawingState() {},

  usePointsToDefineAutoHiding() {
    return false;
  },
};
// @ts-expect-error
chart.bar = _extend({}, chartSeries, baseBarSeriesMethods, {
  _getAffineCoordOptions() {
    const rotated = this._options.rotated;
    const direction = rotated ? 'X' : 'Y';
    const settings = {
      scaleX: rotated ? 0.001 : 1,
      scaleY: rotated ? 1 : 0.001,
    };

    settings[`translate${direction}`] = this.getValueAxis().getTranslator().translate('canvas_position_default');

    return settings;
  },

  _animatePoints(firstDrawing, complete, animateFunc) {
    const that = this;
    that._markersGroup.animate({
      scaleX: 1, scaleY: 1, translateY: 0, translateX: 0,
    }, undefined, complete);
    if (!firstDrawing) {
      animateFunc(that._drawnPoints, complete);
    }
  },

  checkSeriesViewportCoord(axis, coord) {
    // @ts-expect-error
    if (!chartSeries.checkSeriesViewportCoord.call(this)) {
      return false;
    }
    if (axis.isArgumentAxis) {
      return true;
    }
    const translator = axis.getTranslator();
    const range = this.getViewport();
    const min = translator.translate(range.categories ? range.categories[0] : range.min);
    const max = translator.translate(range.categories ? range.categories[range.categories.length - 1] : range.max);
    const rotated = this.getOptions().rotated;
    const inverted = axis.getOptions().inverted;

    return rotated && !inverted || !rotated && inverted ? coord >= min && coord <= max : coord >= max && coord <= min;
  },

  getSeriesPairCoord(coord, isArgument) {
    let oppositeCoord = null;
    const { rotated } = this._options;
    const isOpposite = !isArgument && !rotated || isArgument && rotated;
    const coordName = isOpposite ? 'vy' : 'vx';
    const oppositeCoordName = isOpposite ? 'vx' : 'vy';
    const points = this.getPoints();

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let tmpCoord;

      if (isArgument) {
        tmpCoord = p.getCenterCoord()[coordName[1]] === coord ? p[oppositeCoordName] : undefined;
      } else {
        tmpCoord = p[coordName] === coord ? p[oppositeCoordName] : undefined;
      }

      if (this._checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
        oppositeCoord = tmpCoord;
        break;
      }
    }

    return oppositeCoord;
  },
});
// @ts-expect-error
polar.bar = _extend({}, polarSeries, baseBarSeriesMethods, {
  _animatePoints(firstDrawing, complete, animateFunc) {
    animateFunc(this._drawnPoints, complete);
  },
  // @ts-expect-error
  _setGroupsSettings: chartSeries._setGroupsSettings,

  _drawPoint(point, groups, animationEnabled) {
    // @ts-expect-error
    chartSeries._drawPoint.call(this, point, groups, animationEnabled);
  },

  _parsePointStyle(style) {
    // @ts-expect-error
    const base = baseBarSeriesMethods._parsePointStyle.apply(this, arguments);
    base.opacity = style.opacity;
    return base;
  },
  // @ts-expect-error
  _createGroups: chartSeries._createGroups,

  _setMarkerGroupSettings() {
    const that = this;
    const markersSettings = that._createPointStyles(that._getMarkerGroupOptions()).normal;

    markersSettings.class = 'dxc-markers';
    that._applyMarkerClipRect(markersSettings);
    const groupSettings = _extend({}, markersSettings);
    delete groupSettings.opacity; // T110796
    that._markersGroup.attr(groupSettings);
  },

  getSeriesPairCoord(params, isArgument) {
    let coords = null;
    const paramName = isArgument ? 'argument' : 'radius';
    const points = this.getVisiblePoints();
    const argAxis = this.getArgumentAxis();
    const startAngle = argAxis.getAngles()[0];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tmpPoint = _isDefined(p[paramName]) && _isDefined(params[paramName]) && p[paramName].valueOf() === params[paramName].valueOf()
        ? convertPolarToXY(argAxis.getCenter(), startAngle, -argAxis.getTranslatedAngle(p.angle), p.radius) : undefined;

      if (_isDefined(tmpPoint)) {
        // @ts-expect-error
        coords = tmpPoint;
        break;
      }
    }

    return coords;
  },

  _createLegendState: areaSeries._createLegendState,
});

export {
  chart,
  polar,
};
