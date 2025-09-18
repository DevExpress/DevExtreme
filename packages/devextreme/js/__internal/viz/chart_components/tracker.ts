/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-return-assign */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { noop as _noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each as _each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import consts from '@ts/viz/components/consts';

import { getDistance, normalizeEnum as _normalizeEnum, pointInCanvas as inCanvas } from '../core/utils';

const _floor = Math.floor;
const eventsConsts = consts.events;
const statesConsts = consts.states;

const HOVER_STATE = statesConsts.hoverMark;
const NORMAL_STATE = statesConsts.normalMark;

const EVENT_NS = 'dxChartTracker';
const DOT_EVENT_NS = `.${EVENT_NS}`;
const POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);
const LEGEND_CLICK = 'legendClick';
const SERIES_CLICK = 'seriesClick';
const POINT_CLICK = 'pointClick';
const POINT_DATA = 'chart-data-point';
const SERIES_DATA = 'chart-data-series';
const ARG_DATA = 'chart-data-argument';
const DELAY = 100;
const HOLD_TIMEOUT = 300;

const NONE_MODE = 'none';
const ALL_ARGUMENT_POINTS_MODE = 'allargumentpoints';
const INCLUDE_POINTS_MODE = 'includepoints';
const EXLUDE_POINTS_MODE = 'excludepoints';
const LEGEND_HOVER_MODES = [INCLUDE_POINTS_MODE, EXLUDE_POINTS_MODE, NONE_MODE];

function getData(event, dataKey, tryCheckParent?) {
  const target = event.target;
  if (target.tagName === 'tspan') {
    return target.parentNode[dataKey];
  }
  const data = target[dataKey];
  if (tryCheckParent && !isDefined(data)) {
    const getParentData = function (node) {
      if (node.parentNode) {
        if (isDefined(node.parentNode[dataKey])) {
          return node.parentNode[dataKey];
        } else {
          return getParentData(node.parentNode);
        }
      }
      return undefined;
    };
    return getParentData(target);
  }
  return data;
}

function eventCanceled({ cancel }, target) {
  return cancel || !target.getOptions();
}

function correctLegendHoverMode(mode) {
  if (LEGEND_HOVER_MODES.includes(mode)) {
    return mode;
  } else {
    return INCLUDE_POINTS_MODE;
  }
}

function correctHoverMode(target) {
  const mode = target.getOptions().hoverMode;

  return mode === NONE_MODE ? mode : ALL_ARGUMENT_POINTS_MODE;
}

const baseTrackerPrototype = {
  ctor(options) {
    const that = this;
    const data = { tracker: that };

    that._renderer = options.renderer;
    that._legend = options.legend;
    that._tooltip = options.tooltip;
    that._eventTrigger = options.eventTrigger;
    that._seriesGroup = options.seriesGroup;

    options.seriesGroup.off(DOT_EVENT_NS)
      .on(addNamespace(eventsConsts.showPointTooltip, EVENT_NS), data, that._showPointTooltip)
      .on(addNamespace(eventsConsts.hidePointTooltip, EVENT_NS), data, that._hidePointTooltip);

    that._renderer.root.off(DOT_EVENT_NS)
      .on(POINTER_ACTION, data, that._pointerHandler)
      .on(addNamespace(pointerEvents.up, EVENT_NS), () => clearTimeout(that._holdTimer))
      .on(addNamespace(clickEventName, EVENT_NS), data, that._clickHandler);
  },

  update(options) {
    this._chart = options.chart;
  },

  updateSeries(series, resetDecorations) {
    const that = this;
    const noHoveredSeries = !(series?.some((s) => s === that.hoveredSeries) || that._hoveredPoint && that._hoveredPoint.series);

    if (that._storedSeries !== series) {
      that._storedSeries = series || [];
    }

    if (noHoveredSeries) {
      that._clean();
      that._renderer.initDefsElements();
    }

    if (resetDecorations) {
      that.clearSelection();
      if (!noHoveredSeries) {
        that._hideTooltip(that.pointAtShownTooltip);
        that.clearHover();
      }
    }
  },

  setCanvases(mainCanvas, paneCanvases) {
    this._mainCanvas = mainCanvas;
    this._canvases = paneCanvases;
  },

  repairTooltip() {
    const point = this.pointAtShownTooltip;
    if (!point || !point.series || !point.isVisible()) {
      this._hideTooltip(point, true);
    } else {
      this._showTooltip(point);
    }
  },

  _setHoveredPoint(point) {
    if (point === this._hoveredPoint) {
      return;
    }
    this._releaseHoveredPoint();
    point.hover();
    this._hoveredPoint = point;
  },

  _releaseHoveredPoint(isPointerOut) {
    if (this._hoveredPoint && this._hoveredPoint.getOptions()) {
      this._hoveredPoint.clearHover();
      this._hoveredPoint = null;
      if (this._tooltip.isEnabled()) {
        this._hideTooltip(this._hoveredPoint, false, isPointerOut);
      }
    }
  },

  _setHoveredSeries(series, mode) {
    this._releaseHoveredSeries();
    this._releaseHoveredPoint();
    series.hover(mode);
    this.hoveredSeries = series;
  },

  _releaseHoveredSeries() { // hoveredPoint only for T273289
    if (this.hoveredSeries) {
      this.hoveredSeries.clearHover();
      this.hoveredSeries = null;
    }
  },

  clearSelection() {
    this._storedSeries.forEach((series) => {
      if (series) {
        series.clearSelection();
        series.getPoints().forEach((point) => point.clearSelection());
      }
    });
  },

  _clean() {
    const that = this;
    that.hoveredPoint = that.hoveredSeries = that._hoveredArgumentPoints = null;
    that._hideTooltip(that.pointAtShownTooltip);
  },

  clearHover(isPointerOut) {
    this._resetHoveredArgument();
    this._releaseHoveredSeries();
    this._releaseHoveredPoint(isPointerOut);
  },

  _hideTooltip(point, silent, isPointerOut) {
    const that = this;
    if (!that._tooltip || (point && that.pointAtShownTooltip !== point)) {
      return;
    }
    if (!silent && that.pointAtShownTooltip) {
      that.pointAtShownTooltip = null;
    }
    that._tooltip.hide(!!isPointerOut);
  },

  _showTooltip(point) {
    const that = this;
    let tooltipFormatObject;
    const eventData = { target: point };

    if (point?.getOptions()) {
      tooltipFormatObject = point.getTooltipFormatObject(that._tooltip, that._tooltip.isShared() && that._chart.getStackedPoints(point));
      if (!isDefined(tooltipFormatObject.valueText) && !tooltipFormatObject.points || !point.isVisible()) {
        return;
      }

      const coords = point.getTooltipParams(that._tooltip.getLocation());
      const rootOffset = that._renderer.getRootOffset();
      coords.x += rootOffset.left;
      coords.y += rootOffset.top;
      const callback = (result) => {
        result && (that.pointAtShownTooltip = point);
      };
      callback(that._tooltip.show(tooltipFormatObject, coords, eventData, undefined, callback));
    }
  },

  _showPointTooltip(event, point) {
    const that = event.data.tracker;
    const pointWithTooltip = that.pointAtShownTooltip;

    if (pointWithTooltip && pointWithTooltip !== point) {
      that._hideTooltip(pointWithTooltip);
    }
    that._showTooltip(point);
  },

  _hidePointTooltip(event, point) {
    event.data.tracker._hideTooltip(point, false, true);
  },

  _enableOutHandler() {
    if (this._outHandler) {
      return;
    }
    const that = this;
    const handler = function (e) {
      const rootOffset = that._renderer.getRootOffset();
      const x = _floor(e.pageX - rootOffset.left);
      const y = _floor(e.pageY - rootOffset.top);
      if (!inCanvas(that._mainCanvas, x, y) && !that._isCursorOnTooltip(e)) {
        that._pointerOut();
        that._disableOutHandler();
      }
    };

    eventsEngine.on(domAdapter.getDocument(), POINTER_ACTION, handler);
    this._outHandler = handler;
  },

  _isCursorOnTooltip(e) {
    return this._tooltip.isEnabled() && this._tooltip.isCursorOnTooltip(e.pageX, e.pageY);
  },

  _disableOutHandler() {
    this._outHandler && eventsEngine.off(domAdapter.getDocument(), POINTER_ACTION, this._outHandler);
    this._outHandler = null;
  },

  stopCurrentHandling() {
    this._pointerOut(true);
  },

  _pointerOut(force) {
    this.clearHover(true);
    (force || this._tooltip.isEnabled()) && this._hideTooltip(this.pointAtShownTooltip, false, true);
  },

  _triggerLegendClick(eventArgs, elementClick) {
    const eventTrigger = this._eventTrigger;

    eventTrigger(LEGEND_CLICK, eventArgs, () => {
      // @ts-expect-error
      !eventCanceled(eventArgs, eventArgs.target, 'legend') && eventTrigger(elementClick, eventArgs);
    });
  },

  _hoverLegendItem(x, y) {
    const that = this;
    const item = that._legend.getItemByCoord(x, y);
    let series;
    const legendHoverMode = correctLegendHoverMode(that._legend.getOptions().hoverMode);

    if (item) {
      series = that._storedSeries[item.id];
      if (!series.isHovered() || series.lastHoverMode !== legendHoverMode) {
        that._setHoveredSeries(series, legendHoverMode);
      }
      that._tooltip.isEnabled() && that._hideTooltip(that.pointAtShownTooltip);
    } else {
      that.clearHover();
    }
  },

  _processArgumentHoveredPoint(argument, argumentIndex) {
    this._releaseHoveredPoint();
  },

  _hoverArgument(argument, argumentIndex) {
    const that = this;
    const hoverMode = that._getArgumentHoverMode();

    if (isDefined(argument)) {
      this._processArgumentHoveredPoint(argument, argumentIndex);

      that._hoveredArgument = argument;
      that._argumentIndex = argumentIndex;
      that._notifySeries({
        action: 'pointHover',
        notifyLegend: that._notifyLegendOnHoverArgument,
        target: {
          argument,
          fullState: HOVER_STATE,
          argumentIndex,
          getOptions() {
            return { hoverMode };
          },
        },
      });
    }
  },

  _resetHoveredArgument() {
    const that = this;
    let hoverMode;

    if (isDefined(that._hoveredArgument)) {
      hoverMode = that._getArgumentHoverMode();
      that._notifySeries({
        action: 'clearPointHover',
        notifyLegend: that._notifyLegendOnHoverArgument,
        target: {
          fullState: NORMAL_STATE,
          argumentIndex: that._argumentIndex,
          argument: that._hoveredArgument,
          getOptions() {
            return { hoverMode };
          },
        },
      });
      that._hoveredArgument = null;
    }
  },

  _notifySeries(data) {
    this._storedSeries.forEach((series) => {
      series.notify(data);
    });
  },

  _pointerHandler(e) {
    const that = e.data.tracker;
    const rootOffset = that._renderer.getRootOffset();
    const x = _floor(e.pageX - rootOffset.left);
    const y = _floor(e.pageY - rootOffset.top);
    const canvas = that._getCanvas(x, y);
    let series = getData(e, SERIES_DATA);
    let point = getData(e, POINT_DATA) || series?.getPointByCoord(x, y);

    that._isHolding = false;
    clearTimeout(that._holdTimer);
    if (e.type === pointerEvents.down) {
      that._holdTimer = setTimeout(() => that._isHolding = true, HOLD_TIMEOUT);
    }

    if (point && !point.getMarkerVisibility()) {
      point = undefined;
    }
    that._enableOutHandler();

    if (that._legend.coordsIn(x, y)) {
      that._hoverLegendItem(x, y);
      return;
    }

    if (that.hoveredSeries && that.hoveredSeries !== that._stuckSeries) {
      that._releaseHoveredSeries();
    }

    if (that._hoverArgumentAxis(x, y, e)) {
      return;
    }

    if (that._isPointerOut(canvas, point)) {
      that._pointerOut();
    }

    if (!canvas && !point) {
      return;
    }

    if (series && !point) {
      point = series.getNeighborPoint(x, y);
      if (!that._stickyHovering && point && !point.coordsIn(x, y)) {
        point = null;
      }
      if (series !== that.hoveredSeries) {
        that._setTimeout(() => {
          that._setHoveredSeries(series);
          that._setStuckSeries(e, series, x, y);
          that._pointerComplete(point, x, y);
        }, series);
        return;
      }
    } else if (point) {
      if (e.type !== pointerEvents.move && e.pointerType !== 'touch') {
        return;
      }
      if (that.hoveredSeries) {
        that._setTimeout(() => that._pointerOnPoint(point, x, y, e), point);
      } else {
        that._pointerOnPoint(point, x, y, e);
      }
      return;
    } else if (that._setStuckSeries(e, undefined, x, y) && that._stickyHovering) {
      series = that._stuckSeries;
      point = series.getNeighborPoint(x, y);
      that._releaseHoveredSeries();
      point?.getMarkerVisibility() && that._setHoveredPoint(point);
    } else if (!that._stickyHovering) {
      that._pointerOut();
    }

    that._pointerComplete(point, x, y);
  },

  _pointerOnPoint(point, x, y) {
    this._resetHoveredArgument();
    this._setHoveredPoint(point);
    this._pointerComplete(point, x, y);
  },

  _pointerComplete(point) {
    this.pointAtShownTooltip !== point && this._tooltip.isEnabled() && this._showTooltip(point);
  },

  _clickHandler(e) {
    const that = e.data.tracker;

    if (that._isHolding) {
      return;
    }

    const rootOffset = that._renderer.getRootOffset();
    const x = _floor(e.pageX - rootOffset.left);
    const y = _floor(e.pageY - rootOffset.top);
    let point = getData(e, POINT_DATA);
    const series = that._stuckSeries || getData(e, SERIES_DATA) || point?.series;
    const axis = that._argumentAxis;

    if (that._legend.coordsIn(x, y)) {
      const item = that._legend.getItemByCoord(x, y);
      if (item) {
        that._legendClick(item, e);
      }
    } else if (axis?.coordsIn(x, y)) {
      const argument = getData(e, ARG_DATA, true);
      if (isDefined(argument)) {
        that._eventTrigger('argumentAxisClick', { argument, event: e });
      }
    } else if (series) {
      point = point || series.getPointByCoord(x, y);
      if (point?.getMarkerVisibility()) {
        that._pointClick(point, e);
      } else {
        getData(e, SERIES_DATA) && that._eventTrigger(SERIES_CLICK, { target: series, event: e });
      }
    }
  },

  dispose() {
    const that = this;
    that._disableOutHandler();
    that._renderer.root.off(DOT_EVENT_NS);
    that._seriesGroup.off(DOT_EVENT_NS);
  },
};

export const ChartTracker = function (options) {
  this.ctor(options);
};

extend(ChartTracker.prototype, baseTrackerPrototype, {
  _pointClick(point, event) {
    const that = this;
    const eventTrigger = that._eventTrigger;
    const series = point.series;
    const eventArgs = { target: point, event };

    eventTrigger(POINT_CLICK, eventArgs, () => {
      // @ts-expect-error
      !eventCanceled(eventArgs, series, 'point') && eventTrigger(SERIES_CLICK, { target: series, event });
    });
  },
  /// #DEBUG
  __trackerDelay: DELAY,
  /// #ENDDEBUG

  update(options) {
    const that = this;
    baseTrackerPrototype.update.call(this, options);
    that._argumentAxis = options.argumentAxis || {};
    that._axisHoverEnabled = that._argumentAxis && _normalizeEnum(that._argumentAxis.getOptions().hoverMode) === ALL_ARGUMENT_POINTS_MODE;
    that._rotated = options.rotated;
    that._crosshair = options.crosshair;
    that._stickyHovering = options.stickyHovering;
  },

  _getCanvas(x, y) {
    const that = this;
    const canvases = that._canvases || [];
    for (let i = 0; i < canvases.length; i++) {
      const c = canvases[i];
      if (inCanvas(c, x, y)) {
        return c;
      }
    }
    return null;
  },

  _isPointerOut(canvas, point) {
    return !canvas && this._stuckSeries && point?.series !== this._stuckSeries;
  },

  _hideCrosshair() {
    this._crosshair?.hide();
  },

  _moveCrosshair(point, x, y) {
    if (this._crosshair && point?.isVisible()) {
      this._crosshair.show({ point, x, y });
    }
  },

  _clean() {
    const that = this;
    baseTrackerPrototype._clean.call(that);
    that._resetTimer();
    that._stuckSeries = null;
  },

  _getSeriesForShared(x, y) {
    const that = this;
    const points = [];
    let point = null;
    let distance = Infinity;

    if (that._tooltip.isShared() && !that.hoveredSeries) {
      _each(that._storedSeries, (_, series) => {
        const point = series.getNeighborPoint(x, y);
        // @ts-expect-error
        point && points.push(point);
      });
      _each(points, (_, p) => {
        const coords = p.getCrosshairData(x, y);
        const d = getDistance(x, y, coords.x, coords.y);
        if (d < distance) {
          point = p;
          distance = d;
        }
      });
    }
    // @ts-expect-error
    return point?.series;
  },

  _setTimeout(callback, keeper) {
    const that = this;
    if (that._timeoutKeeper !== keeper) {
      that._resetTimer();
      that._hoverTimeout = setTimeout(() => {
        callback();
        that._timeoutKeeper = null;
      }, DELAY);
      that._timeoutKeeper = keeper;
    }
  },

  _resetTimer() {
    clearTimeout(this._hoverTimeout);
    this._timeoutKeeper = this._hoverTimeout = null;
  },

  _stopEvent(e) {
    if (!isDefined(e.cancelable) || e.cancelable) {
      e.preventDefault();
      e.stopPropagation(); // T249548
    }
  },

  _setStuckSeries(e, series, x, y) {
    if (e.pointerType !== 'mouse') {
      this._stuckSeries = null;
    } else {
      this._stuckSeries = (series || this._stuckSeries) || this._getSeriesForShared(x, y);
    }
    return !!this._stuckSeries;
  },

  _pointerOut() {
    const that = this;
    that._stuckSeries = null;
    that._hideCrosshair();
    that._resetTimer();
    // @ts-expect-error
    baseTrackerPrototype._pointerOut.apply(that, arguments);
  },
  // @ts-expect-error
  _hoverArgumentAxis(x, y, e) {
    const that = this;
    that._resetHoveredArgument();
    if (that._axisHoverEnabled && that._argumentAxis.coordsIn(x, y)) {
      that._hoverArgument(getData(e, ARG_DATA, true));
      return true;
    }
  },

  _pointerComplete(point, x, y) {
    const that = this;
    that.hoveredSeries && that.hoveredSeries.updateHover(x, y);
    that._resetTimer();
    that._moveCrosshair(point, x, y);
    baseTrackerPrototype._pointerComplete.call(that, point);
  },

  _legendClick(item, e) {
    const series = this._storedSeries[item.id];
    this._triggerLegendClick({ target: series, event: e }, SERIES_CLICK);
  },

  _hoverLegendItem(x, y) {
    this._stuckSeries = null;
    this._hideCrosshair();
    baseTrackerPrototype._hoverLegendItem.call(this, x, y);
  },

  _pointerOnPoint(point, x, y, e) {
    this._setStuckSeries(e, point.series, x, y);
    this._releaseHoveredSeries();
    // @ts-expect-error
    baseTrackerPrototype._pointerOnPoint.call(this, point, x, y, e);
  },

  _notifyLegendOnHoverArgument: false,

  _getArgumentHoverMode() {
    return correctHoverMode(this._argumentAxis);
  },

  dispose() {
    this._resetTimer();
    baseTrackerPrototype.dispose.call(this);
  },
});

export const PieTracker = function (options) {
  this.ctor(options);
};

extend(PieTracker.prototype, baseTrackerPrototype, {
  _isPointerOut(_, point) {
    return !point;
  },

  _legendClick(item, e) {
    const that = this;
    const points = [];

    that._storedSeries.forEach((s) => points.push.apply(points, s.getPointsByKeys(item.argument, item.argumentIndex)));
    that._eventTrigger(LEGEND_CLICK, { target: item.argument, points, event: e });
  },

  _pointClick(point, e) {
    this._eventTrigger(POINT_CLICK, { target: point, event: e });
  },

  _hoverLegendItem(x, y) {
    const that = this;
    const item = that._legend.getItemByCoord(x, y);

    if (item && that._hoveredArgument !== item.argument) {
      that._resetHoveredArgument();
      that._hoverArgument(item.argument, item.argumentIndex);
    } else if (!item) {
      that.clearHover();
    }
  },

  _getArgumentHoverMode() {
    return correctHoverMode(this._legend);
  },

  _processArgumentHoveredPoint(argument, argumentIndex) {
    const points = this._storedSeries.flatMap((series) => series.getPointsByKeys(argument, argumentIndex));

    if (points.length === 1) {
      this._setHoveredPoint(points[0]);
    } else {
      this._releaseHoveredPoint();
    }
  },

  _hoverArgumentAxis: _noop,
  _setStuckSeries: _noop,
  _getCanvas: _noop,
  _notifyLegendOnHoverArgument: true,
});
