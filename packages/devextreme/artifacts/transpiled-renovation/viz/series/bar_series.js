"use strict";

exports.polar = exports.chart = void 0;
var _extend2 = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var scatterSeries = _interopRequireWildcard(require("./scatter_series"));
var _area_series = require("./area_series");
var _utils = require("../core/utils");
var _type = require("../../core/utils/type");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const areaSeries = _area_series.chart.area;
const chartSeries = scatterSeries.chart;
const polarSeries = scatterSeries.polar;
const _extend = _extend2.extend;
const _each = _iterator.each;
const chart = exports.chart = {};
const polar = exports.polar = {};
const baseBarSeriesMethods = {
  _createLegendState: function (styleOptions, defaultColor) {
    return {
      fill: (0, _utils.extractColor)(styleOptions.color) || defaultColor,
      hatching: styleOptions.hatching,
      filter: styleOptions.highlight
    };
  },
  _getColorId: areaSeries._getColorId,
  _parsePointStyle: function (style, defaultColor, defaultBorderColor) {
    const color = (0, _utils.extractColor)(style.color) || defaultColor;
    const base = chartSeries._parsePointStyle.call(this, style, color, defaultBorderColor);
    base.fill = color;
    base.hatching = style.hatching;
    base.filter = style.highlight;
    base.dashStyle = style.border && style.border.dashStyle || 'solid';
    delete base.r;
    return base;
  },
  _applyMarkerClipRect: function (settings) {
    settings['clip-path'] = null;
  },
  _setGroupsSettings: function (animationEnabled, firstDrawing) {
    const that = this;
    let settings = {};
    chartSeries._setGroupsSettings.apply(that, arguments);
    if (animationEnabled && firstDrawing) {
      settings = this._getAffineCoordOptions();
    } else if (!animationEnabled) {
      settings = {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      };
    }
    that._markersGroup.attr(settings);
  },
  _drawPoint: function (options) {
    options.hasAnimation = options.hasAnimation && !options.firstDrawing;
    options.firstDrawing = false;
    chartSeries._drawPoint.call(this, options);
  },
  _getMainColor: function () {
    return this._options.mainSeriesColor;
  },
  _createPointStyles: function (pointOptions) {
    var _pointOptions$color;
    const that = this;
    const mainColor = (0, _utils.extractColor)(pointOptions.color, true) || that._getMainColor();
    const colorId = (_pointOptions$color = pointOptions.color) === null || _pointOptions$color === void 0 ? void 0 : _pointOptions$color.fillId;
    const hoverStyle = pointOptions.hoverStyle || {};
    const selectionStyle = pointOptions.selectionStyle || {};
    if (colorId) {
      that._turnOffHatching(hoverStyle, selectionStyle);
    }
    return {
      labelColor: mainColor,
      normal: that._parsePointStyle(pointOptions, mainColor, mainColor),
      hover: that._parsePointStyle(hoverStyle, colorId || mainColor, mainColor),
      selection: that._parsePointStyle(selectionStyle, colorId || mainColor, mainColor)
    };
  },
  _updatePointsVisibility: function () {
    const visibility = this._options.visible;
    (0, _iterator.each)(this._points, function (_, point) {
      point._options.visible = visibility;
    });
  },
  _getOptionsForPoint: function () {
    return this._options;
  },
  _animate: function (firstDrawing) {
    const that = this;
    const complete = function () {
      that._animateComplete();
    };
    const animateFunc = function (drawnPoints, complete) {
      const lastPointIndex = drawnPoints.length - 1;
      _each(drawnPoints || [], function (i, point) {
        point.animate(i === lastPointIndex ? complete : undefined, point.getMarkerCoords());
      });
    };
    that._animatePoints(firstDrawing, complete, animateFunc);
  },
  getValueRangeInitialValue: areaSeries.getValueRangeInitialValue,
  _patchMarginOptions: function (options) {
    var _this$getArgumentAxis;
    options.checkInterval = !this.useAggregation() || ((_this$getArgumentAxis = this.getArgumentAxis()) === null || _this$getArgumentAxis === void 0 ? void 0 : _this$getArgumentAxis.aggregatedPointBetweenTicks());
    return options;
  },
  _defaultAggregator: 'sum',
  _defineDrawingState() {},
  usePointsToDefineAutoHiding() {
    return false;
  }
};
chart.bar = _extend({}, chartSeries, baseBarSeriesMethods, {
  _getAffineCoordOptions: function () {
    const rotated = this._options.rotated;
    const direction = rotated ? 'X' : 'Y';
    const settings = {
      scaleX: rotated ? 0.001 : 1,
      scaleY: rotated ? 1 : 0.001
    };
    settings['translate' + direction] = this.getValueAxis().getTranslator().translate('canvas_position_default');
    return settings;
  },
  _animatePoints: function (firstDrawing, complete, animateFunc) {
    const that = this;
    that._markersGroup.animate({
      scaleX: 1,
      scaleY: 1,
      translateY: 0,
      translateX: 0
    }, undefined, complete);
    if (!firstDrawing) {
      animateFunc(that._drawnPoints, complete);
    }
  },
  checkSeriesViewportCoord(axis, coord) {
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
    const {
      rotated
    } = this._options;
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
  }
});
polar.bar = _extend({}, polarSeries, baseBarSeriesMethods, {
  _animatePoints: function (firstDrawing, complete, animateFunc) {
    animateFunc(this._drawnPoints, complete);
  },
  _setGroupsSettings: chartSeries._setGroupsSettings,
  _drawPoint: function (point, groups, animationEnabled) {
    chartSeries._drawPoint.call(this, point, groups, animationEnabled);
  },
  _parsePointStyle: function (style) {
    const base = baseBarSeriesMethods._parsePointStyle.apply(this, arguments);
    base.opacity = style.opacity;
    return base;
  },
  _createGroups: chartSeries._createGroups,
  _setMarkerGroupSettings: function () {
    const that = this;
    const markersSettings = that._createPointStyles(that._getMarkerGroupOptions()).normal;
    markersSettings['class'] = 'dxc-markers';
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
      const tmpPoint = (0, _type.isDefined)(p[paramName]) && (0, _type.isDefined)(params[paramName]) && p[paramName].valueOf() === params[paramName].valueOf() ? (0, _utils.convertPolarToXY)(argAxis.getCenter(), startAngle, -argAxis.getTranslatedAngle(p.angle), p.radius) : undefined;
      if ((0, _type.isDefined)(tmpPoint)) {
        coords = tmpPoint;
        break;
      }
    }
    return coords;
  },
  _createLegendState: areaSeries._createLegendState
});