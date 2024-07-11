"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _common = require("../../core/utils/common");
var _extend2 = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _consts = _interopRequireDefault(require("../../viz/components/consts"));
var _annotations = require("../../viz/core/annotations");
var _center_template = require("../../viz/core/center_template");
var _utils = require("../../viz/core/utils");
var _range = require("../../viz/translators/range");
var _translator1d = require("../../viz/translators/translator1d");
var _m_base_chart = require("./chart_components/m_base_chart");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  states
} = _consts.default;
const seriesSpacing = _consts.default.pieSeriesSpacing;
const OPTIONS_FOR_REFRESH_SERIES = ['startAngle', 'innerRadius', 'segmentsDirection', 'type'];
const NORMAL_STATE = states.normalMark;
const HOVER_STATE = states.hoverMark;
const SELECTED_STATE = states.selectedMark;
const MAX_RESOLVE_ITERATION_COUNT = 5;
const LEGEND_ACTIONS = [states.resetItem, states.applyHover, states.applySelected, states.applySelected];
function shiftInColumnFunction(box, length) {
  return {
    x: box.x,
    y: box.y - length
  };
}
function dividePoints(series, points) {
  return series.getVisiblePoints().reduce((r, point) => {
    const angle = (0, _utils.normalizeAngle)(point.middleAngle);
    (angle <= 90 || angle >= 270 ? r.right : r.left).push(point);
    return r;
  }, points || {
    left: [],
    right: []
  });
}
function resolveOverlappedLabels(points, shiftCallback, inverseDirection, canvas) {
  let overlapped = false;
  if (inverseDirection) {
    points.left.reverse();
    points.right.reverse();
  }
  overlapped = _m_base_chart.overlapping.resolveLabelOverlappingInOneDirection(points.left, canvas, false, false, shiftCallback);
  return _m_base_chart.overlapping.resolveLabelOverlappingInOneDirection(points.right, canvas, false, false, shiftCallback) || overlapped;
}
function getLegendItemAction(points) {
  let state = NORMAL_STATE;
  points.forEach(point => {
    var _point$series;
    const seriesOptions = (_point$series = point.series) === null || _point$series === void 0 ? void 0 : _point$series.getOptions();
    let pointState = point.fullState;
    if ((seriesOptions === null || seriesOptions === void 0 ? void 0 : seriesOptions.hoverMode) === 'none') {
      pointState &= ~HOVER_STATE;
    }
    if ((seriesOptions === null || seriesOptions === void 0 ? void 0 : seriesOptions.selectionMode) === 'none') {
      pointState &= ~SELECTED_STATE;
    }
    state |= pointState;
  });
  return LEGEND_ACTIONS[state];
}
function correctPercentValue(value) {
  if ((0, _type.isNumeric)(value)) {
    if (value > 1) {
      value = 1;
    } else if (value < 0) {
      value = 0;
    }
  } else {
    value = undefined;
  }
  return value;
}
const pieSizeEqualizer = function () {
  function equalize(group, allPies) {
    const pies = allPies.filter(p => p._isVisible() && p.getSizeGroup() === group);
    const minRadius = Math.min.apply(null, pies.map(p => p.getSizeGroupLayout().radius));
    const minPie = pies.filter(p => p.getSizeGroupLayout().radius === minRadius);
    pies.forEach(p => p.render({
      force: true,
      sizeGroupLayout: minPie.length ? minPie[0].getSizeGroupLayout() : {}
    }));
  }
  function removeFromList(list, item) {
    return list.filter(li => li !== item);
  }
  function addToList(list, item) {
    return removeFromList(list, item).concat(item);
  }
  let pies = [];
  let timers = {};
  return {
    queue(pie) {
      const group = pie.getSizeGroup();
      pies = addToList(pies, pie);
      clearTimeout(timers[group]);
      timers[group] = setTimeout(() => {
        equalize(group, pies);
      });
    },
    remove(pie) {
      pies = removeFromList(pies, pie);
      if (!pies.length) {
        timers = {};
      }
    }
  };
}();
const dxPieChart = _m_base_chart.BaseChart.inherit({
  _themeSection: 'pie',
  _layoutManagerOptions() {
    return (0, _extend2.extend)(true, {}, this.callBase(), {
      piePercentage: correctPercentValue(this._themeManager.getOptions('diameter')),
      minPiePercentage: correctPercentValue(this._themeManager.getOptions('minDiameter'))
    });
  },
  _optionChangesMap: {
    diameter: 'REINIT',
    minDiameter: 'REINIT',
    sizeGroup: 'REINIT'
  },
  _disposeCore() {
    pieSizeEqualizer.remove(this);
    this.callBase();
  },
  _groupSeries() {
    var _series$;
    const {
      series
    } = this;
    this._groupsData = {
      groups: [{
        series,
        valueOptions: {
          valueType: 'numeric'
        }
      }],
      argumentOptions: (_series$ = series[0]) === null || _series$ === void 0 ? void 0 : _series$.getOptions()
    };
  },
  getArgumentAxis() {
    return null;
  },
  _getValueAxis() {
    const translator = new _translator1d.Translator1D().setCodomain(360, 0);
    return {
      getTranslator() {
        return translator;
      },
      setBusinessRange(range) {
        translator.setDomain(range.min, range.max);
      }
    };
  },
  _populateBusinessRange() {
    this.series.map(series => {
      const range = new _range.Range();
      range.addRange(series.getRangeData().val);
      series.getValueAxis().setBusinessRange(range);
      return range;
    });
  },
  _specialProcessSeries() {
    (0, _iterator.each)(this.series, (_, singleSeries) => {
      singleSeries.arrangePoints();
    });
  },
  _checkPaneName() {
    return true;
  },
  _processSingleSeries(singleSeries) {
    this.callBase(singleSeries);
    singleSeries.arrangePoints();
  },
  _handleSeriesDataUpdated() {
    let maxPointCount = 0;
    this.series.forEach(s => {
      maxPointCount = Math.max(s.getPointsCount(), maxPointCount);
    });
    this.series.forEach(s => {
      s.setMaxPointsCount(maxPointCount);
    });
    this.callBase();
  },
  _getLegendOptions(item) {
    const legendItem = this.callBase(item);
    const {
      legendData
    } = legendItem;
    legendData.argument = item.argument;
    legendData.argumentIndex = item.argumentIndex;
    legendData.points = [item];
    return legendItem;
  },
  _getLegendTargets() {
    const itemsByArgument = {};
    (this.series || []).forEach(series => {
      series.getPoints().forEach(point => {
        const argument = point.argument.valueOf();
        const index = series.getPointsByArg(argument).indexOf(point);
        const key = argument.valueOf().toString() + index;
        itemsByArgument[key] = itemsByArgument[key] || [];
        const argumentCount = itemsByArgument[key].push(point);
        point.index = itemsByArgument[key][argumentCount - 2] ? itemsByArgument[key][argumentCount - 2].index : Object.keys(itemsByArgument).length - 1;
        point.argumentIndex = index;
      });
    });
    const items = [];
    (0, _iterator.each)(itemsByArgument, (_, points) => {
      points.forEach((point, index) => {
        if (index === 0) {
          items.push(this._getLegendOptions(point));
          return;
        }
        const item = items[items.length - 1];
        item.legendData.points.push(point);
        if (!item.visible) {
          item.visible = point.isVisible();
        }
      });
    });
    return items;
  },
  _getLayoutTargets() {
    return [{
      canvas: this._canvas
    }];
  },
  _getLayoutSeries(series, drawOptions) {
    let layout;
    const canvas = this._canvas;
    let drawnLabels = false;
    layout = this.layoutManager.applyPieChartSeriesLayout(canvas, series, true);
    series.forEach(singleSeries => {
      singleSeries.correctPosition(layout, canvas);
      drawnLabels = singleSeries.drawLabelsWOPoints() || drawnLabels;
    });
    if (drawnLabels) {
      layout = this.layoutManager.applyPieChartSeriesLayout(canvas, series, drawOptions.hideLayoutLabels);
    }
    series.forEach(singleSeries => {
      singleSeries.hideLabels();
    });
    this._sizeGroupLayout = {
      x: layout.centerX,
      y: layout.centerY,
      radius: layout.radiusOuter,
      drawOptions
    };
    return layout;
  },
  _getLayoutSeriesForEqualPies(series, sizeGroupLayout) {
    const canvas = this._canvas;
    const layout = this.layoutManager.applyEqualPieChartLayout(series, sizeGroupLayout);
    series.forEach(s => {
      s.correctPosition(layout, canvas);
      s.drawLabelsWOPoints();
    });
    this.layoutManager.correctPieLabelRadius(series, layout, canvas);
    return layout;
  },
  _updateSeriesDimensions(drawOptions) {
    const visibleSeries = this._getVisibleSeries();
    const lengthVisibleSeries = visibleSeries.length;
    let innerRad;
    let delta;
    let layout;
    const {
      sizeGroupLayout
    } = drawOptions;
    if (lengthVisibleSeries) {
      layout = sizeGroupLayout ? this._getLayoutSeriesForEqualPies(visibleSeries, sizeGroupLayout) : this._getLayoutSeries(visibleSeries, drawOptions);
      delta = (layout.radiusOuter - layout.radiusInner - seriesSpacing * (lengthVisibleSeries - 1)) / lengthVisibleSeries;
      innerRad = layout.radiusInner;
      this._setGeometry(layout);
      visibleSeries.forEach(singleSeries => {
        singleSeries.correctRadius({
          radiusInner: innerRad,
          radiusOuter: innerRad + delta
        });
        innerRad += delta + seriesSpacing;
      });
    }
  },
  _renderSeries(drawOptions, isRotated, isLegendInside) {
    this._calculateSeriesLayout(drawOptions, isRotated);
    if (!drawOptions.sizeGroupLayout && this.getSizeGroup()) {
      pieSizeEqualizer.queue(this);
      this._clearCanvas();
      return;
    }
    this._renderSeriesElements(drawOptions, isLegendInside);
  },
  _getCenter() {
    return this._center;
  },
  getInnerRadius() {
    return this._innerRadius;
  },
  _getLegendCallBack() {
    const legend = this._legend;
    const items = this._getLegendTargets().map(i => i.legendData);
    return target => {
      items.forEach(data => {
        const points = [];
        const callback = legend.getActionCallback({
          index: data.id
        });
        this.series.forEach(series => {
          const seriesPoints = series.getPointsByKeys(data.argument, data.argumentIndex);
          points.push.apply(points, seriesPoints);
        });
        if (target && target.argument === data.argument && target.argumentIndex === data.argumentIndex) {
          points.push(target);
        }
        callback(getLegendItemAction(points));
      });
    };
  },
  _locateLabels(resolveLabelOverlapping) {
    let iterationCount = 0;
    let labelsWereOverlapped;
    let wordWrapApplied;
    do {
      wordWrapApplied = this._adjustSeriesLabels(resolveLabelOverlapping === 'shift');
      labelsWereOverlapped = this._resolveLabelOverlapping(resolveLabelOverlapping);
    } while ((labelsWereOverlapped || wordWrapApplied) && ++iterationCount < MAX_RESOLVE_ITERATION_COUNT);
  },
  _adjustSeriesLabels(moveLabelsFromCenter) {
    return this.series.reduce((r, s) => s.adjustLabels(moveLabelsFromCenter) || r, false);
  },
  _applyExtraSettings: _common.noop,
  _resolveLabelOverlappingShift() {
    const inverseDirection = this.option('segmentsDirection') === 'anticlockwise';
    const seriesByPosition = this.series.reduce((r, s) => {
      (r[s.getOptions().label.position] || r.outside).push(s);
      return r;
    }, {
      inside: [],
      columns: [],
      outside: []
    });
    let labelsOverlapped = false;
    const shiftFunction = (box, length) => (0, _utils.getVerticallyShiftedAngularCoords)(box, -length, this._center);
    if (seriesByPosition.inside.length > 0) {
      const pointsToResolve = seriesByPosition.inside.reduce((r, singleSeries) => {
        const visiblePoints = singleSeries.getVisiblePoints();
        return visiblePoints.reduce((r, point) => {
          r.left.push(point);
          return r;
        }, r);
      }, {
        left: [],
        right: []
      });
      labelsOverlapped = resolveOverlappedLabels(pointsToResolve, shiftInColumnFunction, inverseDirection, this._canvas) || labelsOverlapped;
    }
    labelsOverlapped = seriesByPosition.columns.reduce((r, singleSeries) => resolveOverlappedLabels(dividePoints(singleSeries), shiftInColumnFunction, inverseDirection, this._canvas) || r, labelsOverlapped);
    if (seriesByPosition.outside.length > 0) {
      labelsOverlapped = resolveOverlappedLabels(seriesByPosition.outside.reduce((r, singleSeries) => dividePoints(singleSeries, r), null), shiftFunction, inverseDirection, this._canvas) || labelsOverlapped;
    }
    return labelsOverlapped;
  },
  _setGeometry(_ref) {
    let {
      centerX: x,
      centerY: y,
      radiusInner
    } = _ref;
    this._center = {
      x,
      y
    };
    this._innerRadius = radiusInner;
  },
  _disposeSeries() {
    this.callBase.apply(this, arguments);
    this._abstractSeries = null;
  },
  _legendDataField: 'point',
  _legendItemTextField: 'argument',
  _applyPointMarkersAutoHiding: _common.noop,
  _renderTrackers: _common.noop,
  _trackerType: 'PieTracker',
  _createScrollBar: _common.noop,
  _updateAxesLayout: _common.noop,
  _applyClipRects: _common.noop,
  _appendAdditionalSeriesGroups: _common.noop,
  _prepareToRender: _common.noop,
  _isLegendInside: _common.noop,
  _renderAxes: _common.noop,
  _shrinkAxes: _common.noop,
  _isRotated: _common.noop,
  _seriesPopulatedHandlerCore: _common.noop,
  _reinitAxes: _common.noop,
  _correctAxes: _common.noop,
  _getExtraOptions() {
    return {
      startAngle: this.option('startAngle'),
      innerRadius: this.option('innerRadius'),
      segmentsDirection: this.option('segmentsDirection'),
      type: this.option('type')
    };
  },
  getSizeGroup() {
    return this._themeManager.getOptions('sizeGroup');
  },
  getSizeGroupLayout() {
    return this._sizeGroupLayout || {};
  }
});
(0, _iterator.each)(OPTIONS_FOR_REFRESH_SERIES, (_, name) => {
  dxPieChart.prototype._optionChangesMap[name] = 'REFRESH_SERIES_DATA_INIT';
});
dxPieChart.addPlugin(_center_template.plugins.pieChart);
dxPieChart.addPlugin(_annotations.plugins.core);
dxPieChart.addPlugin(_annotations.plugins.pieChart);
(0, _component_registrator.default)('dxPieChart', dxPieChart);
var _default = exports.default = dxPieChart;