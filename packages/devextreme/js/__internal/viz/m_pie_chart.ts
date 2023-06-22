import registerComponent from '@js/core/component_registrator';
import { noop as _noop } from '@js/core/utils/common';
import { extend as _extend } from '@js/core/utils/extend';
import { each as _each } from '@js/core/utils/iterator';
import { isNumeric } from '@js/core/utils/type';
import consts from '@js/viz/components/consts';
import { plugins as annotationsPlugins } from '@js/viz/core/annotations';
import { plugins as centerTemplatePlugins } from '@js/viz/core/center_template';
import { getVerticallyShiftedAngularCoords as _getVerticallyShiftedAngularCoords, normalizeAngle } from '@js/viz/core/utils';
import { Range } from '@js/viz/translators/range';
import { Translator1D } from '@js/viz/translators/translator1d';

import { BaseChart, overlapping } from './chart_components/m_base_chart';

const { states } = consts;
const seriesSpacing = consts.pieSeriesSpacing;

const OPTIONS_FOR_REFRESH_SERIES = ['startAngle', 'innerRadius', 'segmentsDirection', 'type'];
const NORMAL_STATE = states.normalMark;
const HOVER_STATE = states.hoverMark;
const SELECTED_STATE = states.selectedMark;
const MAX_RESOLVE_ITERATION_COUNT = 5;
const LEGEND_ACTIONS = [states.resetItem, states.applyHover, states.applySelected, states.applySelected];

function getLegendItemAction(points) {
  let state = NORMAL_STATE;

  points.forEach((point) => {
    const seriesOptions = point.series?.getOptions();
    let pointState = point.fullState;

    if (seriesOptions?.hoverMode === 'none') {
      pointState &= ~HOVER_STATE;
    }
    if (seriesOptions?.selectionMode === 'none') {
      pointState &= ~SELECTED_STATE;
    }

    state |= pointState;
  });

  return LEGEND_ACTIONS[state];
}

function correctPercentValue(value) {
  if (isNumeric(value)) {
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

const pieSizeEqualizer = (function () {
  function equalize(group, allPies) {
    const pies = allPies.filter((p) => p._isVisible() && p.getSizeGroup() === group);
    const minRadius = Math.min.apply(null, pies.map((p) => p.getSizeGroupLayout().radius));
    const minPie = pies.filter((p) => p.getSizeGroupLayout().radius === minRadius);

    pies.forEach((p) => p.render({
      force: true,
      sizeGroupLayout: minPie.length ? minPie[0].getSizeGroupLayout() : {},
    }));
  }

  function removeFromList(list, item) {
    return list.filter((li) => li !== item);
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
    },
  };
}());

const dxPieChart = BaseChart.inherit({
  _themeSection: 'pie',

  _layoutManagerOptions() {
    return _extend(true, {}, this.callBase(), {
      piePercentage: correctPercentValue(this._themeManager.getOptions('diameter')),
      minPiePercentage: correctPercentValue(this._themeManager.getOptions('minDiameter')),
    });
  },

  _optionChangesMap: {
    diameter: 'REINIT',
    minDiameter: 'REINIT',
    sizeGroup: 'REINIT',
  },

  _disposeCore() {
    pieSizeEqualizer.remove(this);
    this.callBase();
  },

  _groupSeries() {
    const { series } = this;

    this._groupsData = {
      groups: [{
        series,
        valueOptions: { valueType: 'numeric' },
      }],
      argumentOptions: series[0] && series[0].getOptions(),
    };
  },

  getArgumentAxis() {
    return null;
  },

  _getValueAxis() {
    const translator = new Translator1D()
      .setCodomain(360, 0);

    return {
      getTranslator() {
        return translator;
      },
      setBusinessRange(range) {
        translator.setDomain(range.min, range.max);
      },
    };
  },

  _populateBusinessRange() {
    this.series.map((series) => {
      const range = new Range();
      range.addRange(series.getRangeData().val);
      series.getValueAxis().setBusinessRange(range);
      return range;
    });
  },

  _specialProcessSeries() {
    _each(this.series, (_, singleSeries) => {
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
    this.series.forEach((s) => {
      maxPointCount = Math.max(s.getPointsCount(), maxPointCount);
    });
    this.series.forEach((s) => {
      s.setMaxPointsCount(maxPointCount);
    });
    this.callBase();
  },

  _getLegendOptions(item) {
    const legendItem = this.callBase(item);
    const { legendData } = legendItem;

    legendData.argument = item.argument;
    legendData.argumentIndex = item.argumentIndex;

    legendData.points = [item];

    return legendItem;
  },

  _getLegendTargets() {
    const that = this;
    const itemsByArgument = {};

    (that.series || []).forEach((series) => {
      series.getPoints().forEach((point) => {
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
    _each(itemsByArgument, (_, points) => {
      (points as any).forEach((point, index) => {
        if (index === 0) {
          items.push(that._getLegendOptions(point) as never);
          return;
        }
        const item = items[items.length - 1] as any;
        item.legendData.points.push(point as never);
        if (!item.visible) {
          item.visible = point.isVisible();
        }
      });
    });

    return items;
  },

  _getLayoutTargets() {
    return [{ canvas: this._canvas }];
  },

  _getLayoutSeries(series, drawOptions) {
    const that = this;
    let layout;
    const canvas = that._canvas;
    let drawnLabels = false;

    layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, true);
    series.forEach((singleSeries) => {
      singleSeries.correctPosition(layout, canvas);
      drawnLabels = singleSeries.drawLabelsWOPoints() || drawnLabels;
    });

    if (drawnLabels) {
      layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, drawOptions.hideLayoutLabels);
    }

    series.forEach((singleSeries) => {
      singleSeries.hideLabels();
    });

    that._sizeGroupLayout = {
      x: layout.centerX,
      y: layout.centerY,
      radius: layout.radiusOuter,
      drawOptions,
    };

    return layout;
  },

  _getLayoutSeriesForEqualPies(series, sizeGroupLayout) {
    const canvas = this._canvas;
    const layout = this.layoutManager.applyEqualPieChartLayout(series, sizeGroupLayout);

    series.forEach((s) => {
      s.correctPosition(layout, canvas);
      s.drawLabelsWOPoints();
    });

    this.layoutManager.correctPieLabelRadius(series, layout, canvas);

    return layout;
  },

  _updateSeriesDimensions(drawOptions) {
    const that = this;
    const visibleSeries = that._getVisibleSeries();
    const lengthVisibleSeries = visibleSeries.length;
    let innerRad;
    let delta;
    let layout;
    const { sizeGroupLayout } = drawOptions;

    if (lengthVisibleSeries) {
      layout = sizeGroupLayout ? that._getLayoutSeriesForEqualPies(visibleSeries, sizeGroupLayout) : that._getLayoutSeries(visibleSeries, drawOptions);

      delta = (layout.radiusOuter - layout.radiusInner - seriesSpacing * (lengthVisibleSeries - 1)) / lengthVisibleSeries;
      innerRad = layout.radiusInner;

      that._setGeometry(layout);

      visibleSeries.forEach((singleSeries) => {
        singleSeries.correctRadius({
          radiusInner: innerRad,
          radiusOuter: innerRad + delta,
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
    const that = this;
    const legend = this._legend;
    const items = this._getLegendTargets().map((i) => i.legendData);

    return function (target) {
      items.forEach((data) => {
        const points = [];
        const callback = legend.getActionCallback({ index: data.id });

        that.series.forEach((series) => {
          const seriesPoints = series.getPointsByKeys(data.argument, data.argumentIndex);
          points.push.apply(points, seriesPoints);
        });

        if (target && target.argument === data.argument && target.argumentIndex === data.argumentIndex) {
          points.push(target as never);
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

  _applyExtraSettings: _noop,

  _resolveLabelOverlappingShift() {
    const that = this;
    const inverseDirection = that.option('segmentsDirection') === 'anticlockwise';
    const seriesByPosition = that.series.reduce((r, s) => {
      (r[s.getOptions().label.position] || r.outside).push(s);
      return r;
    }, { inside: [], columns: [], outside: [] });
    let labelsOverlapped = false;

    if (seriesByPosition.inside.length > 0) {
      labelsOverlapped = resolve(seriesByPosition.inside.reduce((r, singleSeries) => singleSeries.getVisiblePoints().reduce((r, point) => {
        r.left.push(point);
        return r;
      }, r), { left: [], right: [] }), shiftInColumnFunction) || labelsOverlapped;
    }

    labelsOverlapped = seriesByPosition.columns.reduce((r, singleSeries) => resolve(dividePoints(singleSeries), shiftInColumnFunction) || r, labelsOverlapped);

    if (seriesByPosition.outside.length > 0) {
      labelsOverlapped = resolve(seriesByPosition.outside.reduce((r, singleSeries) => dividePoints(singleSeries, r), null), shiftFunction) || labelsOverlapped;
    }
    return labelsOverlapped;

    function dividePoints(series, points?) {
      return series.getVisiblePoints().reduce((r, point) => {
        const angle = normalizeAngle(point.middleAngle);
        (angle <= 90 || angle >= 270 ? r.right : r.left).push(point);
        return r;
      }, points || { left: [], right: [] });
    }

    function resolve(points, shiftCallback) {
      let overlapped = false;
      if (inverseDirection) {
        points.left.reverse();
        points.right.reverse();
      }

      overlapped = overlapping.resolveLabelOverlappingInOneDirection(points.left, that._canvas, false, false, shiftCallback);
      return overlapping.resolveLabelOverlappingInOneDirection(points.right, that._canvas, false, false, shiftCallback) || overlapped;
    }

    function shiftFunction(box, length) {
      return _getVerticallyShiftedAngularCoords(box, -length, that._center);
    }

    function shiftInColumnFunction(box, length) {
      return { x: box.x, y: box.y - length };
    }
  },

  _setGeometry({ centerX: x, centerY: y, radiusInner }) {
    this._center = { x, y };
    this._innerRadius = radiusInner;
  },

  _disposeSeries() {
    this.callBase.apply(this, arguments);
    this._abstractSeries = null;
  },

  _legendDataField: 'point',

  _legendItemTextField: 'argument',

  _applyPointMarkersAutoHiding: _noop,

  _renderTrackers: _noop,

  _trackerType: 'PieTracker',

  _createScrollBar: _noop,

  _updateAxesLayout: _noop,

  _applyClipRects: _noop,

  _appendAdditionalSeriesGroups: _noop,

  _prepareToRender: _noop,

  _isLegendInside: _noop,

  _renderAxes: _noop,

  _shrinkAxes: _noop,

  _isRotated: _noop,

  _seriesPopulatedHandlerCore: _noop,

  _reinitAxes: _noop,

  _correctAxes: _noop,

  _getExtraOptions() {
    const that = this;
    return {
      startAngle: that.option('startAngle'),
      innerRadius: that.option('innerRadius'),
      segmentsDirection: that.option('segmentsDirection'),
      type: that.option('type'),
    };
  },

  getSizeGroup() {
    return this._themeManager.getOptions('sizeGroup');
  },

  getSizeGroupLayout() {
    return this._sizeGroupLayout || {};
  },
});

_each(OPTIONS_FOR_REFRESH_SERIES, (_, name) => {
  dxPieChart.prototype._optionChangesMap[name] = 'REFRESH_SERIES_DATA_INIT';
});

dxPieChart.addPlugin(centerTemplatePlugins.pieChart);
dxPieChart.addPlugin(annotationsPlugins.core);
dxPieChart.addPlugin(annotationsPlugins.pieChart);

registerComponent('dxPieChart', dxPieChart);

export default dxPieChart;
