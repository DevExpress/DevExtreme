import eventsEngine from '@js/common/core/events/core/events_engine';
import { isPointerEvent, isTouchEvent } from '@js/common/core/events/utils/index';
// @ts-expect-error
import { grep, noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { reverseEach as _reverseEach } from '@js/core/utils/iterator';
import { isDefined as _isDefined, isFunction } from '@js/core/utils/type';
import { LayoutManager } from '@js/viz/chart_components/layout_manager';
import * as trackerModule from '@js/viz/chart_components/tracker';
import { ThemeManager } from '@js/viz/components/chart_theme_manager';
import { validateData } from '@js/viz/components/data_validator';
import { Legend } from '@js/viz/components/legend';
// PLUGINS_SECTION
import { plugin as dataSourcePlugin } from '@js/viz/core/data_source';
import { plugin as exportPlugin } from '@js/viz/core/export';
import { plugin as loadingIndicatorPlugin } from '@js/viz/core/loading_indicator';
import { plugin as titlePlugin } from '@js/viz/core/title';
import { plugin as tooltipPlugin } from '@js/viz/core/tooltip';
import { map as _map, processSeriesTemplate, setCanvasValues as _setCanvasValues } from '@js/viz/core/utils';
import { Series } from '@js/viz/series/base_series';

import BaseWidget from '../core/m_base_widget';
import { RollingStock } from './rolling_stock';

type SortingMethodParams = (a: any, b: any) => number;

const { isArray } = Array;

const REINIT_REFRESH_ACTION = '_reinit';
const REINIT_DATA_SOURCE_REFRESH_ACTION = '_updateDataSource';
const DATA_INIT_REFRESH_ACTION = '_dataInit';
const FORCE_RENDER_REFRESH_ACTION = '_forceRender';
const RESIZE_REFRESH_ACTION = '_resize';
const ACTIONS_BY_PRIORITY = [REINIT_REFRESH_ACTION, REINIT_DATA_SOURCE_REFRESH_ACTION,
  DATA_INIT_REFRESH_ACTION, FORCE_RENDER_REFRESH_ACTION, RESIZE_REFRESH_ACTION];
const DEFAULT_OPACITY = 0.3;

const REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS = [
  'series',
  'commonSeriesSettings',
  'dataPrepareSettings',
  'seriesSelectionMode',
  'pointSelectionMode',
  'synchronizeMultiAxes',
  'resolveLabelsOverlapping',
];

const REFRESH_SERIES_FAMILIES_ACTION_OPTIONS = [
  'minBubbleSize',
  'maxBubbleSize',
  'barGroupPadding',
  'barGroupWidth',
  'negativesAsZeroes',
  'negativesAsZeros', // misspelling case
];

const FORCE_RENDER_REFRESH_ACTION_OPTIONS = [
  'adaptiveLayout',
  'crosshair',
  'resolveLabelOverlapping',
  'adjustOnZoom',
  'stickyHovering',
];

const FONT = 'font';

function checkHeightRollingStock(rollingStocks, stubCanvas) {
  const canvasSize = stubCanvas.end - stubCanvas.start;
  let size = 0;
  rollingStocks.forEach((rollingStock) => {
    size += rollingStock.getBoundingRect().width;
  });

  while (canvasSize < size) {
    size -= findAndKillSmallValue(rollingStocks);
  }
}

function findAndKillSmallValue(rollingStocks) {
  const smallestObject = rollingStocks.reduce((prev, rollingStock, index) => {
    if (!rollingStock) return prev;
    const value = rollingStock.value();
    return value < prev.value ? {
      value,
      rollingStock,
      index,
    } : prev;
  }, {
    rollingStock: undefined,
    value: Infinity,
    index: undefined,
  });

  smallestObject.rollingStock.getLabels()[0].draw(false);
  const { width } = smallestObject.rollingStock.getBoundingRect();
  rollingStocks[smallestObject.index] = null;

  return width;
}

function checkStackOverlap(rollingStocks) {
  let i;
  let j;
  let iLength;
  let jLength;
  let overlap = false;

  for (i = 0, iLength = rollingStocks.length - 1; i < iLength; i++) {
    for (j = i + 1, jLength = rollingStocks.length; j < jLength; j++) {
      if (i !== j && checkStacksOverlapping(rollingStocks[i], rollingStocks[j], true)) {
        overlap = true;
        break;
      }
    }
    if (overlap) break;
  }
  return overlap;
}

function resolveLabelOverlappingInOneDirection(
  points,
  canvas,
  isRotated: boolean,
  isInverted: boolean,
  shiftFunction,
  customSorting: SortingMethodParams = () => 0,
): boolean {
  const rollingStocks: RollingStock[] = [];
  const stubCanvas = {
    start: isRotated ? canvas.left : canvas.top,
    end: isRotated ? canvas.width - canvas.right : canvas.height - canvas.bottom,
  };
  let hasStackedSeries = false;
  let sortRollingStocks: RollingStock[];

  points.forEach((p) => {
    if (!p) return;

    hasStackedSeries = hasStackedSeries || p.series.isStackedSeries() || p.series.isFullStackedSeries();
    p.getLabels().forEach((l) => {
      if (l.isVisible()) {
        rollingStocks.push(new RollingStock(l, isRotated, shiftFunction));
      }
    });
  });

  if (hasStackedSeries) {
    if (Number(!isRotated) ^ Number(isInverted)) {
      rollingStocks.reverse();
    }

    sortRollingStocks = isInverted ? rollingStocks : sortRollingStocksByValue(rollingStocks);
  } else {
    const rollingStocksTmp = rollingStocks.slice();
    sortRollingStocks = rollingStocks.sort((a, b) => customSorting(a, b)
      || (a.getInitialPosition() - b.getInitialPosition())
      || (rollingStocksTmp.indexOf(a) - rollingStocksTmp.indexOf(b)));
  }

  if (!checkStackOverlap(sortRollingStocks)) return false;
  checkHeightRollingStock(sortRollingStocks, stubCanvas);

  prepareOverlapStacks(sortRollingStocks);

  sortRollingStocks.reverse();
  moveRollingStock(sortRollingStocks, stubCanvas);
  return true;
}

function checkStacksOverlapping(firstRolling, secondRolling, inTwoSides?) {
  if (!firstRolling || !secondRolling) return;
  const firstRect = firstRolling.getBoundingRect();
  const secondRect = secondRolling.getBoundingRect();
  const oppositeOverlapping = inTwoSides
    ? (firstRect.oppositeStart <= secondRect.oppositeStart && firstRect.oppositeEnd > secondRect.oppositeStart)
            || (secondRect.oppositeStart <= firstRect.oppositeStart && secondRect.oppositeEnd > firstRect.oppositeStart)
    : true;

  return firstRect.end > secondRect.start && oppositeOverlapping;
}

function sortRollingStocksByValue(rollingStocks) {
  const positiveRollingStocks = [];
  const negativeRollingStocks = [];

  rollingStocks.forEach((stock) => {
    if (stock.value() > 0) {
      positiveRollingStocks.push(stock as never);
    } else {
      negativeRollingStocks.unshift(stock as never);
    }
  });

  return positiveRollingStocks.concat(negativeRollingStocks);
}

function prepareOverlapStacks(rollingStocks): void {
  let root;

  for (let i = 0; i < rollingStocks.length - 1; i += 1) {
    const currentRollingStock = root || rollingStocks[i];
    if (checkStacksOverlapping(currentRollingStock, rollingStocks[i + 1])) {
      currentRollingStock.toChain(rollingStocks[i + 1]);
      rollingStocks[i + 1] = null;
      root = currentRollingStock;
    } else {
      root = rollingStocks[i + 1] || currentRollingStock;
    }
  }
}

function rollingStocksIsOut(rollingStock: RollingStock, canvas): boolean {
  return rollingStock.getBoundingRect().end > canvas.end;
}

function moveRollingStock(rollingStocks: (RollingStock | null)[], canvas): void {
  for (let i = 0; i < rollingStocks.length; i += 1) {
    const currentRollingStock = rollingStocks[i];
    let shouldSetCanvas = true;

    if (currentRollingStock !== null && rollingStocksIsOut(currentRollingStock, canvas)) {
      const currentBBox = currentRollingStock.getBoundingRect();
      for (let j = i + 1; j < rollingStocks.length; j += 1) {
        const nextRollingStock = rollingStocks[j];

        if (nextRollingStock) {
          const nextBBox = nextRollingStock.getBoundingRect();

          if (nextBBox.end > (currentBBox.start - (currentBBox.end - canvas.end))) {
            nextRollingStock.toChain(currentRollingStock);
            shouldSetCanvas = false;
            break;
          }
        }
      }
    }
    if (shouldSetCanvas) {
      currentRollingStock?.setRollingStockInCanvas(canvas);
    }
  }
}

function getLegendFields(name) {
  return {
    nameField: `${name}Name`,
    colorField: `${name}Color`,
    indexField: `${name}Index`,
  };
}

function getLegendSettings(legendDataField) {
  const formatObjectFields = getLegendFields(legendDataField);
  return {
    getFormatObject(data) {
      const res = {};
      res[formatObjectFields.indexField] = data.id;
      res[formatObjectFields.colorField] = data.states.normal.fill;
      res[formatObjectFields.nameField] = data.text;
      return res;
    },
    textField: formatObjectFields.nameField,
  };
}

function checkOverlapping(firstRect, secondRect) {
  return ((firstRect.x <= secondRect.x && secondRect.x <= firstRect.x + firstRect.width)
        || (firstRect.x >= secondRect.x && firstRect.x <= secondRect.x + secondRect.width))
        && ((firstRect.y <= secondRect.y && secondRect.y <= firstRect.y + firstRect.height)
            || (firstRect.y >= secondRect.y && firstRect.y <= secondRect.y + secondRect.height));
}

export const overlapping = {
  resolveLabelOverlappingInOneDirection,
};

export const BaseChart = BaseWidget.inherit({
  _eventsMap: {
    onSeriesClick: { name: 'seriesClick' },
    onPointClick: { name: 'pointClick' },
    onArgumentAxisClick: { name: 'argumentAxisClick' },
    onLegendClick: { name: 'legendClick' },
    onSeriesSelectionChanged: { name: 'seriesSelectionChanged' },
    onPointSelectionChanged: { name: 'pointSelectionChanged' },
    onSeriesHoverChanged: { name: 'seriesHoverChanged' },
    onPointHoverChanged: { name: 'pointHoverChanged' },
    onDone: { name: 'done', actionSettings: { excludeValidators: ['disabled'] } },
    onZoomStart: { name: 'zoomStart' },
    onZoomEnd: { name: 'zoomEnd' },
  },

  _fontFields: [`legend.${FONT}`, `legend.title.${FONT}`, `legend.title.subtitle.${FONT}`, `commonSeriesSettings.label.${FONT}`],

  _rootClassPrefix: 'dxc',

  _rootClass: 'dxc-chart',

  _initialChanges: ['INIT'],

  _themeDependentChanges: ['REFRESH_SERIES_REINIT'],

  _getThemeManagerOptions() {
    const themeOptions = this.callBase.apply(this, arguments);

    themeOptions.options = this.option();
    return themeOptions;
  },

  _createThemeManager() {
    const chartOption = this.option();
    const themeManager = new ThemeManager(this._getThemeManagerOptions());

    themeManager.setTheme(chartOption.theme, chartOption.rtlEnabled);
    return themeManager;
  },

  _initCore() {
    this._canvasClipRect = this._renderer.clipRect();

    this._createHtmlStructure();
    this._createLegend();
    this._createTracker();
    this._needHandleRenderComplete = true;
    this.layoutManager = new LayoutManager();
    this._createScrollBar();

    eventsEngine.on(this._$element, 'contextmenu', (event) => {
      /// #DEBUG
      this.eventType = 'contextmenu';
      /// #ENDDEBUG
      if (isTouchEvent(event) || isPointerEvent(event)) {
        event.preventDefault();
      }
    });
    eventsEngine.on(this._$element, 'MSHoldVisual', (event) => {
      /// #DEBUG
      this.eventType = 'MSHoldVisual';
      /// #ENDDEBUG
      event.preventDefault();
    });
  },

  // Common functionality is overridden because Chart has its own layout logic.
  // Nevertheless common logic should be used.
  _getLayoutItems: noop,

  _layoutManagerOptions() {
    return this._themeManager.getOptions('adaptiveLayout');
  },

  _reinit() {
    _setCanvasValues(this._canvas);
    this._reinitAxes();

    this._requestChange([
      'DATA_SOURCE',
      'DATA_INIT',
      'CORRECT_AXIS',
      'FULL_RENDER',
    ]);
  },

  _correctAxes: noop,

  _createHtmlStructure() {
    const renderer = this._renderer;
    const { root } = renderer;
    const createConstantLinesGroup = function () {
      // TODO: Must be created in the same place where used (advanced chart)
      return renderer.g().attr({ class: 'dxc-constant-lines-group' }).linkOn(root, 'constant-lines');
    };

    this._constantLinesGroup = {
      dispose() {
        this.under.dispose();
        this.above.dispose();
      },
      linkOff() {
        this.under.linkOff();
        this.above.linkOff();
      },
      clear() {
        this.under.linkRemove().clear();
        this.above.linkRemove().clear();
      },
      linkAppend() {
        this.under.linkAppend();
        this.above.linkAppend();
      },
    };
    this._labelsAxesGroup = renderer.g().attr({ class: 'dxc-elements-axes-group' });

    const appendLabelsAxesGroup = () => {
      this._labelsAxesGroup.linkOn(root, 'elements');
    };

    this._backgroundRect = renderer.rect().attr({ fill: 'gray', opacity: 0.0001 }).append(root);
    this._panesBackgroundGroup = renderer.g().attr({ class: 'dxc-background' }).append(root);

    this._stripsGroup = renderer.g().attr({ class: 'dxc-strips-group' }).linkOn(root, 'strips'); // TODO: Must be created in the same place where used (advanced chart)
    this._gridGroup = renderer.g().attr({ class: 'dxc-grids-group' }).linkOn(root, 'grids'); // TODO: Must be created in the same place where used (advanced chart)
    this._panesBorderGroup = renderer.g().attr({ class: 'dxc-border' }).linkOn(root, 'border'); // TODO: Must be created in the same place where used (chart)
    this._axesGroup = renderer.g().attr({ class: 'dxc-axes-group' }).linkOn(root, 'axes'); // TODO: Must be created in the same place where used (advanced chart)
    this._executeAppendBeforeSeries(appendLabelsAxesGroup);
    this._stripLabelAxesGroup = renderer.g().attr({ class: 'dxc-strips-labels-group' }).linkOn(root, 'strips-labels'); // TODO: Must be created in the same place where used (advanced chart)
    this._constantLinesGroup.under = createConstantLinesGroup();
    this._seriesGroup = renderer.g().attr({ class: 'dxc-series-group' }).linkOn(root, 'series');
    this._executeAppendAfterSeries(appendLabelsAxesGroup);
    this._constantLinesGroup.above = createConstantLinesGroup();
    this._scaleBreaksGroup = renderer.g().attr({ class: 'dxc-scale-breaks' }).linkOn(root, 'scale-breaks');
    this._labelsGroup = renderer.g().attr({ class: 'dxc-labels-group' }).linkOn(root, 'labels');
    this._crosshairCursorGroup = renderer.g().attr({ class: 'dxc-crosshair-cursor' }).linkOn(root, 'crosshair');
    this._legendGroup = renderer.g().attr({ class: 'dxc-legend', 'clip-path': this._getCanvasClipRectID() }).linkOn(root, 'legend').linkAppend(root)
      .enableLinks();
    this._scrollBarGroup = renderer.g().attr({ class: 'dxc-scroll-bar' }).linkOn(root, 'scroll-bar');
  },

  _executeAppendBeforeSeries() {},

  _executeAppendAfterSeries() {},

  _disposeObjectsInArray(propName: string, fieldNames: string[]) {
    (this[propName] || []).forEach((item) => {
      if (fieldNames && item) {
        fieldNames.forEach((field) => {
          item[field]?.dispose();
        });
      } else {
        item?.dispose();
      }
    });
    this[propName] = null;
  },

  _disposeCore() {
    const disposeObject = (propName: string): void => {
      // TODO: What is the purpose of the `if` check in a private function?
      if (this[propName]) {
        this[propName].dispose();
        this[propName] = null;
      }
    };
    const unlinkGroup = (name: string): void => {
      this[name].linkOff();
    };
    const disposeObjectsInArray = this._disposeObjectsInArray;

    this._renderer.stopAllAnimations();

    disposeObjectsInArray.call(this, 'series');

    disposeObject('_tracker');
    disposeObject('_crosshair');

    this.layoutManager = this._userOptions = this._canvas = this._groupsData = null;

    unlinkGroup('_stripsGroup');
    unlinkGroup('_gridGroup');
    unlinkGroup('_axesGroup');

    unlinkGroup('_constantLinesGroup');

    unlinkGroup('_stripLabelAxesGroup');
    unlinkGroup('_panesBorderGroup');
    unlinkGroup('_seriesGroup');
    unlinkGroup('_labelsGroup');
    unlinkGroup('_crosshairCursorGroup');
    unlinkGroup('_legendGroup');
    unlinkGroup('_scrollBarGroup');
    unlinkGroup('_scaleBreaksGroup');

    disposeObject('_canvasClipRect');
    disposeObject('_panesBackgroundGroup');
    disposeObject('_backgroundRect');

    disposeObject('_stripsGroup');
    disposeObject('_gridGroup');
    disposeObject('_axesGroup');

    disposeObject('_constantLinesGroup');

    disposeObject('_stripLabelAxesGroup');
    disposeObject('_panesBorderGroup');
    disposeObject('_seriesGroup');
    disposeObject('_labelsGroup');
    disposeObject('_crosshairCursorGroup');
    disposeObject('_legendGroup');
    disposeObject('_scrollBarGroup');
    disposeObject('_scaleBreaksGroup');
  },

  _getAnimationOptions() {
    return this._themeManager.getOptions('animation');
  },

  _getDefaultSize() {
    return { width: 400, height: 400 };
  },

  // TODO: Theme manager should stop knowing about user options then this method can be removed
  _getOption(name) {
    return this._themeManager.getOptions(name);
  },

  _applySize(rect) {
    this._rect = rect.slice();

    if (!this._changes.has('FULL_RENDER')) {
      this._processRefreshData(RESIZE_REFRESH_ACTION);
    }
  },

  // _resize: function () {
  //    if (this._updateLockCount) {// T244164
  //        this._processRefreshData(RESIZE_REFRESH_ACTION);
  //    } else {
  //        this._render(this.__renderOptions || { animate: false, isResize: true });
  //    }
  // },

  _resize() {
    this._doRender(this.__renderOptions || { animate: false, isResize: true });
  },

  _trackerType: 'ChartTracker',

  _createTracker() {
    // eslint-disable-next-line import/namespace
    this._tracker = new trackerModule[this._trackerType]({
      seriesGroup: this._seriesGroup,
      renderer: this._renderer,
      tooltip: this._tooltip,
      legend: this._legend,
      eventTrigger: this._eventTrigger,
    });
  },

  _getTrackerSettings() {
    return extend({ chart: this }, this._getSelectionModes());
  },

  _getSelectionModes() {
    const themeManager = this._themeManager;

    return {
      seriesSelectionMode: themeManager.getOptions('seriesSelectionMode'),
      pointSelectionMode: themeManager.getOptions('pointSelectionMode'),
    };
  },

  _updateTracker(trackerCanvases) {
    this._tracker.update(this._getTrackerSettings());
    this._tracker.setCanvases({
      left: 0,
      right: this._canvas.width,
      top: 0,
      bottom: this._canvas.height,
    }, trackerCanvases);
  },

  _createCanvasFromRect(rect) {
    const currentCanvas = this._canvas;
    return _setCanvasValues({
      left: rect[0],
      top: rect[1],
      right: currentCanvas.width - rect[2],
      bottom: currentCanvas.height - rect[3],
      width: currentCanvas.width,
      height: currentCanvas.height,
    });
  },

  _doRender(_options) {
    if (this._canvas.width === 0 && this._canvas.height === 0) return;

    this._resetIsReady(); // T207606
    const drawOptions = this._prepareDrawOptions(_options);
    const { recreateCanvas } = drawOptions;

    // T207665
    this._preserveOriginalCanvas();

    // T207665
    if (recreateCanvas) {
      this.__currentCanvas = this._canvas;
    } else {
      this._canvas = this.__currentCanvas;
    }

    /// #DEBUG
    this.DEBUG_canvas = _setCanvasValues(this._canvas);
    /// #ENDDEBUG

    recreateCanvas && this._updateCanvasClipRect(this._canvas);

    this._canvas = this._createCanvasFromRect(this._rect);

    this._renderer.stopAllAnimations(true);
    this._cleanGroups();
    const startTime = new Date();
    this._renderElements(drawOptions);

    this._lastRenderingTime = Number(new Date()) - Number(startTime);
  },

  _preserveOriginalCanvas() {
    this.__originalCanvas = this._canvas;
    this._canvas = extend({}, this._canvas); // NOTE: Instance of the original canvas must be preserved
  },

  _layoutAxes: noop,

  _renderElements(drawOptions) {
    const preparedOptions = this._prepareToRender(drawOptions);
    const isRotated = this._isRotated();
    const isLegendInside = this._isLegendInside();
    const trackerCanvases = [];
    const dirtyCanvas = extend({}, this._canvas);
    let argBusinessRange;
    let zoomMinArg;
    let zoomMaxArg;

    /// #DEBUG
    this.DEBUG_dirtyCanvas = dirtyCanvas;
    /// #ENDDEBUG

    this._renderer.lock();

    if (drawOptions.drawLegend && this._legend) {
      this._legendGroup.linkAppend();
    }

    this.layoutManager.setOptions(this._layoutManagerOptions());

    const layoutTargets = this._getLayoutTargets();

    this._layoutAxes((needSpace) => {
      const axisDrawOptions = needSpace ? extend({}, drawOptions, { animate: false, recreateCanvas: true }) : drawOptions;
      const canvas = this._renderAxes(axisDrawOptions, preparedOptions);
      this._shrinkAxes(needSpace, canvas);
    });

    this._applyClipRects(preparedOptions);
    this._appendSeriesGroups();
    this._createCrosshairCursor();

    layoutTargets.forEach(({ canvas }) => {
      trackerCanvases.push({
        left: canvas.left,
        right: canvas.width - canvas.right,
        top: canvas.top,
        bottom: canvas.height - canvas.bottom,
      } as never);
    });

    if (this._scrollBar) {
      argBusinessRange = this._argumentAxes[0].getTranslator().getBusinessRange();
      if (argBusinessRange.axisType === 'discrete' && argBusinessRange.categories && argBusinessRange.categories.length <= 1
                || argBusinessRange.axisType !== 'discrete' && argBusinessRange.min === argBusinessRange.max) {
        zoomMinArg = zoomMaxArg = undefined;
      } else {
        zoomMinArg = argBusinessRange.minVisible;
        zoomMaxArg = argBusinessRange.maxVisible;
      }

      this._scrollBar.init(argBusinessRange, !this._argumentAxes[0].getOptions().valueMarginsEnabled).setPosition(zoomMinArg, zoomMaxArg);
    }

    this._updateTracker(trackerCanvases);
    this._updateLegendPosition(drawOptions, isLegendInside);
    this._applyPointMarkersAutoHiding();
    this._renderSeries(drawOptions, isRotated, isLegendInside);

    this._renderGraphicObjects();

    this._renderer.unlock();
  },

  _updateLegendPosition: noop,

  _createCrosshairCursor: noop,

  _appendSeriesGroups() {
    this._seriesGroup.linkAppend();
    this._labelsGroup.linkAppend();
    this._appendAdditionalSeriesGroups();
  },

  _renderSeries(drawOptions, isRotated, isLegendInside) {
    this._calculateSeriesLayout(drawOptions, isRotated);
    this._renderSeriesElements(drawOptions, isLegendInside);
  },

  _calculateSeriesLayout(drawOptions, isRotated) {
    drawOptions.hideLayoutLabels = this.layoutManager.needMoreSpaceForPanesCanvas(this._getLayoutTargets(), isRotated)
            && !this._themeManager.getOptions('adaptiveLayout').keepLabels;

    this._updateSeriesDimensions(drawOptions);
  },

  _getArgFilter() {
    return () => true;
  },

  _getValFilter() {
    return () => true;
  },

  _getPointsToAnimation(series) {
    const argViewPortFilter = this._getArgFilter();

    return series.map((s) => {
      const valViewPortFilter = this._getValFilter(s);

      return s.getPoints().filter((p) => p.getOptions().visible && argViewPortFilter(p.argument)
                    && (valViewPortFilter(p.getMinValue(true)) || valViewPortFilter(p.getMaxValue(true)))).length;
    });
  },

  _renderSeriesElements(drawOptions, isLegendInside) {
    const { series } = this;
    const resolveLabelOverlapping = this._themeManager.getOptions('resolveLabelOverlapping');
    const pointsToAnimation = this._getPointsToAnimation(series);

    series.forEach((singleSeries, index) => {
      this._applyExtraSettings(singleSeries, drawOptions);
      const animationEnabled = drawOptions.animate
                && pointsToAnimation[index] <= drawOptions.animationPointsLimit
                && this._renderer.animationEnabled();

      singleSeries.draw(
        animationEnabled,
        drawOptions.hideLayoutLabels,
        this._getLegendCallBack(singleSeries),
      );
    });

    if (resolveLabelOverlapping === 'none') {
      this._adjustSeriesLabels(false);
    } else {
      this._locateLabels(resolveLabelOverlapping);
    }

    this._renderTrackers(isLegendInside);
    this._tracker.repairTooltip();

    this._renderExtraElements();
    this._clearCanvas();
    this._seriesElementsDrawn = true;
  },

  _changesApplied() {
    if (this._seriesElementsDrawn) {
      this._seriesElementsDrawn = false;
      this._drawn();
      this._renderCompleteHandler();
    }
  },

  _locateLabels(resolveLabelOverlapping) {
    this._resolveLabelOverlapping(resolveLabelOverlapping);
  },

  _renderExtraElements() {},

  _clearCanvas() {
    // T207665, T336349, T503616
    this._canvas = this.__originalCanvas;
  },

  _resolveLabelOverlapping(resolveLabelOverlapping) {
    let func;
    switch (resolveLabelOverlapping) {
      case 'stack':
        func = this._resolveLabelOverlappingStack;
        break;
      case 'hide':
        func = this._resolveLabelOverlappingHide;
        break;
      case 'shift':
        func = this._resolveLabelOverlappingShift;
        break;
      default:
        break;
    }
    return isFunction(func) && func.call(this);
  },

  _getVisibleSeries() {
    return grep(this.getAllSeries(), (series) => series.isVisible());
  },

  _resolveLabelOverlappingHide() {
    const labels = [];
    let currentLabel;
    let nextLabel;
    let currentLabelRect;
    let nextLabelRect;
    let i;
    let j;
    let points;
    const series = this._getVisibleSeries();

    for (i = 0; i < series.length; i++) {
      points = series[i].getVisiblePoints();

      for (j = 0; j < points.length; j++) {
        labels.push.apply(labels, points[j].getLabels());
      }
    }

    for (i = 0; i < labels.length; i++) {
      currentLabel = labels[i];
      if (!currentLabel.isVisible()) {
        continue;
      }

      currentLabelRect = currentLabel.getBoundingRect();

      for (j = i + 1; j < labels.length; j++) {
        nextLabel = labels[j];
        nextLabelRect = nextLabel.getBoundingRect();
        if (checkOverlapping(currentLabelRect, nextLabelRect)) {
          nextLabel.draw(false);
        }
      }
    }
  },

  _cleanGroups() {
    this._stripsGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
    this._gridGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
    this._axesGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
    this._constantLinesGroup.clear(); // TODO: Must be removed in the same place where appended (advanced chart)
    this._stripLabelAxesGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
    // that._seriesGroup.linkRemove().clear();
    this._labelsGroup.linkRemove().clear();
    this._crosshairCursorGroup.linkRemove().clear();
    this._scaleBreaksGroup.linkRemove().clear();
  },

  _allowLegendInsidePosition() {
    return false;
  },

  _createLegend() {
    const legendSettings = getLegendSettings(this._legendDataField);

    this._legend = new Legend({
      renderer: this._renderer,
      widget: this,
      group: this._legendGroup,
      backgroundClass: 'dxc-border',
      itemGroupClass: 'dxc-item',
      titleGroupClass: 'dxc-title',
      textField: legendSettings.textField,
      getFormatObject: legendSettings.getFormatObject,
      allowInsidePosition: this._allowLegendInsidePosition(),
    });

    this._updateLegend();

    this._layout.add(this._legend);
  },

  _updateLegend() {
    const themeManager = this._themeManager;
    const legendOptions = themeManager.getOptions('legend');
    const legendData = this._getLegendData();

    legendOptions.containerBackgroundColor = themeManager.getOptions('containerBackgroundColor');
    legendOptions._incidentOccurred = this._incidentOccurred; // TODO: Why is `_` used?
    this._legend.update(legendData, legendOptions, themeManager.theme('legend').title);
    this._change(['LAYOUT']);
  },

  _prepareDrawOptions(drawOptions) {
    const animationOptions = this._getAnimationOptions();
    const options = extend(
      {},
      {
        force: false,
        adjustAxes: true,
        drawLegend: true,
        drawTitle: true,
        animate: animationOptions.enabled,
        animationPointsLimit: animationOptions.maxPointCountSupported,
      },
      drawOptions,
      this.__renderOptions,
    ); // NOTE: This is to support `render` method options
    if (!_isDefined(options.recreateCanvas)) {
      options.recreateCanvas = options.adjustAxes && options.drawLegend && options.drawTitle;
    }
    return options;
  },

  _processRefreshData(newRefreshAction) {
    const currentRefreshActionPosition = ACTIONS_BY_PRIORITY.indexOf(this._currentRefreshData);
    const newRefreshActionPosition = ACTIONS_BY_PRIORITY.indexOf(newRefreshAction);
    if (!this._currentRefreshData || (currentRefreshActionPosition >= 0 && newRefreshActionPosition < currentRefreshActionPosition)) {
      this._currentRefreshData = newRefreshAction;
      // this._invalidate();
    }

    this._requestChange(['REFRESH']);
  },

  _getLegendData() {
    return _map(this._getLegendTargets(), (item) => {
      const { legendData } = item;
      const style = item.getLegendStyles;
      let { opacity } = style.normal;

      if (!item.visible) {
        if (!_isDefined(opacity) || opacity > DEFAULT_OPACITY) {
          opacity = DEFAULT_OPACITY;
        }
        legendData.textOpacity = DEFAULT_OPACITY;
      }
      const opacityStyle = { opacity };
      legendData.states = {
        hover: extend({}, style.hover, opacityStyle),
        selection: extend({}, style.selection, opacityStyle),
        normal: extend({}, style.normal, opacityStyle),
      };

      return legendData;
    });
  },

  _getLegendOptions(item) {
    return {
      legendData: {
        text: item[this._legendItemTextField],
        id: item.index,
        visible: true,
      },
      getLegendStyles: item.getLegendStyles(),
      visible: item.isVisible(),
    };
  },

  _disposeSeries(seriesIndex) {
    if (this.series) {
      if (_isDefined(seriesIndex)) {
        this.series[seriesIndex].dispose();
        this.series.splice(seriesIndex, 1);
      } else {
        this.series.forEach((s) => s.dispose());
        this.series.length = 0;
      }
    }
    if (!this.series?.length) {
      this.series = [];
    }
  },

  _disposeSeriesFamilies() {
    (this.seriesFamilies || []).forEach((family) => { family.dispose(); });
    this.seriesFamilies = null;
    this._needHandleRenderComplete = true;
  },

  _optionChanged(arg) {
    this._themeManager.resetOptions(arg.name);
    this.callBase.apply(this, arguments);
  },

  _applyChanges(...params) {
    this._themeManager.update(this._options.silent());
    this.callBase(...params);
  },

  _optionChangesMap: {
    animation: 'ANIMATION',
    dataSource: 'DATA_SOURCE',
    palette: 'PALETTE',
    paletteExtensionMode: 'PALETTE',

    legend: 'FORCE_DATA_INIT',
    seriesTemplate: 'FORCE_DATA_INIT',

    export: 'FORCE_RENDER',

    valueAxis: 'AXES_AND_PANES',
    argumentAxis: 'AXES_AND_PANES',
    commonAxisSettings: 'AXES_AND_PANES',
    panes: 'AXES_AND_PANES',
    commonPaneSettings: 'AXES_AND_PANES',
    defaultPane: 'AXES_AND_PANES',
    containerBackgroundColor: 'AXES_AND_PANES',

    rotated: 'ROTATED',

    autoHidePointMarkers: 'REFRESH_SERIES_REINIT',
    customizePoint: 'REFRESH_SERIES_REINIT',
    customizeLabel: 'REFRESH_SERIES_REINIT',

    scrollBar: 'SCROLL_BAR',
  },

  _optionChangesOrder: ['ROTATED', 'PALETTE', 'REFRESH_SERIES_REINIT', 'USE_SPIDER_WEB', 'AXES_AND_PANES', 'INIT', 'REINIT', 'DATA_SOURCE', 'REFRESH_SERIES_DATA_INIT', 'DATA_INIT', 'FORCE_DATA_INIT', 'REFRESH_AXES', 'CORRECT_AXIS'],

  _customChangesOrder: ['ANIMATION', 'REFRESH_SERIES_FAMILIES', 'FORCE_FIRST_DRAWING', 'FORCE_DRAWING',
    'FORCE_RENDER', 'VISUAL_RANGE', 'SCROLL_BAR', 'REINIT', 'REFRESH', 'FULL_RENDER'],

  _change_ANIMATION() {
    this._renderer.updateAnimationOptions(this._getAnimationOptions());
  },

  _change_DATA_SOURCE() {
    this._needHandleRenderComplete = true;
    this._updateDataSource();
  },

  _change_PALETTE() {
    this._themeManager.updatePalette();
    this._refreshSeries('DATA_INIT');
  },

  _change_REFRESH_SERIES_DATA_INIT() {
    this._refreshSeries('DATA_INIT');
  },

  _change_DATA_INIT() {
    if ((!this.series || this.needToPopulateSeries) && !this._changes.has('FORCE_DATA_INIT')) {
      this._dataInit();
    }
  },

  _change_FORCE_DATA_INIT() {
    this._dataInit();
  },

  _change_REFRESH_SERIES_FAMILIES() {
    this._processSeriesFamilies();
    this._populateBusinessRange();
    this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
  },

  _change_FORCE_RENDER() {
    this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
  },

  _change_AXES_AND_PANES() {
    this._refreshSeries('INIT');
  },

  _change_ROTATED() {
    this._createScrollBar();
    this._refreshSeries('INIT');
  },

  _change_REFRESH_SERIES_REINIT() {
    this._refreshSeries('INIT');
  },

  _change_REFRESH_AXES() {
    _setCanvasValues(this._canvas);
    this._reinitAxes();

    this._requestChange([
      'CORRECT_AXIS',
      'FULL_RENDER',
    ]);
  },

  _change_SCROLL_BAR() {
    this._createScrollBar();
    this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
  },

  _change_REINIT() {
    this._processRefreshData(REINIT_REFRESH_ACTION);
  },

  _change_FORCE_DRAWING() {
    this._resetComponentsAnimation();
  },

  _change_FORCE_FIRST_DRAWING() {
    this._resetComponentsAnimation(true);
  },

  _resetComponentsAnimation(isFirstDrawing) {
    this.series.forEach((s) => { s.resetApplyingAnimation(isFirstDrawing); });
    this._resetAxesAnimation(isFirstDrawing);
  },

  _resetAxesAnimation: noop,

  _refreshSeries(actionName) {
    this.needToPopulateSeries = true;
    this._requestChange([actionName]);
  },

  _change_CORRECT_AXIS() {
    this._correctAxes();
  },

  _doRefresh() {
    const methodName = this._currentRefreshData;
    if (methodName) {
      this._currentRefreshData = null;
      this._renderer.stopAllAnimations(true);
      this[methodName]();
    }
  },

  _updateCanvasClipRect(canvas) {
    const width = Math.max(canvas.width - canvas.left - canvas.right, 0);
    const height = Math.max(canvas.height - canvas.top - canvas.bottom, 0);

    this._canvasClipRect.attr({
      x: canvas.left, y: canvas.top, width, height,
    });
    this._backgroundRect.attr({
      x: canvas.left, y: canvas.top, width, height,
    });
  },

  _getCanvasClipRectID() {
    return this._canvasClipRect.id;
  },

  _dataSourceChangedHandler() {
    if (this._changes.has('INIT')) {
      this._requestChange(['DATA_INIT']);
    } else {
      this._requestChange(['FORCE_DATA_INIT']);
    }
  },

  _dataInit() {
    this._dataSpecificInit(true);
  },

  _processSingleSeries(singleSeries) {
    singleSeries.createPoints(false);
  },

  _handleSeriesDataUpdated() {
    if (this._getVisibleSeries().some((s) => s.useAggregation())) {
      this._populateMarginOptions();
    }

    this.series.forEach((s) => this._processSingleSeries(s), this);
  },

  _dataSpecificInit(needRedraw) {
    if (!this.series || this.needToPopulateSeries) {
      this.series = this._populateSeries();
    }
    this._repopulateSeries();
    this._seriesPopulatedHandlerCore();
    this._populateBusinessRange();
    this._tracker.updateSeries(this.series, this._changes.has('INIT'));
    this._updateLegend();
    if (needRedraw) {
      this._requestChange(['FULL_RENDER']);
    }
    // needRedraw && that._forceRender();
  },

  _forceRender() {
    this._doRender({ force: true });
  },

  _repopulateSeries() {
    const themeManager = this._themeManager;
    const data = this._dataSourceItems();
    const dataValidatorOptions = themeManager.getOptions('dataPrepareSettings');
    const seriesTemplate = themeManager.getOptions('seriesTemplate');

    if (seriesTemplate) {
      this._populateSeries(data);
    }

    this._groupSeries();
    const parsedData = validateData(data, this._groupsData, this._incidentOccurred, dataValidatorOptions);
    themeManager.resetPalette();

    this.series.forEach((singleSeries) => {
      singleSeries.updateData(parsedData[singleSeries.getArgumentField()]);
    });

    this._handleSeriesDataUpdated();
  },

  _renderCompleteHandler() {
    let allSeriesInited = true;
    if (this._needHandleRenderComplete) {
      this.series.forEach((s) => {
        allSeriesInited = allSeriesInited && s.canRenderCompleteHandle();
      });
      if (allSeriesInited) {
        this._needHandleRenderComplete = false;
        this._eventTrigger('done', { target: this });
      }
    }
  },

  _dataIsReady() {
    // In order to support scenario when chart is created without "dataSource" and it is considered
    // as data is being loaded the check for state of "dataSource" option is added
    return _isDefined(this.option('dataSource')) && this._dataIsLoaded();
  },

  _populateSeriesOptions(data) {
    const themeManager = this._themeManager;
    const seriesTemplate = themeManager.getOptions('seriesTemplate');
    const seriesOptions = seriesTemplate ? processSeriesTemplate(seriesTemplate, data || []) : this.option('series');
    const allSeriesOptions = isArray(seriesOptions) ? seriesOptions : seriesOptions ? [seriesOptions] : [];
    const extraOptions = this._getExtraOptions();
    let particularSeriesOptions;
    let seriesTheme;
    const seriesThemes = [];
    const seriesVisibilityChanged = (target) => {
      this._specialProcessSeries();
      this._populateBusinessRange(target && target.getValueAxis(), true);
      this._renderer.stopAllAnimations(true);
      this._updateLegend();
      this._requestChange(['FULL_RENDER']);
    };

    for (let i = 0; i < allSeriesOptions.length; i++) {
      particularSeriesOptions = extend(true, {}, allSeriesOptions[i], extraOptions);

      if (!_isDefined(particularSeriesOptions.name) || particularSeriesOptions.name === '') {
        particularSeriesOptions.name = `Series ${(i + 1).toString()}`;
      }

      particularSeriesOptions.rotated = this._isRotated();
      particularSeriesOptions.customizePoint = themeManager.getOptions('customizePoint');
      particularSeriesOptions.customizeLabel = themeManager.getOptions('customizeLabel');
      particularSeriesOptions.visibilityChanged = seriesVisibilityChanged;
      particularSeriesOptions.incidentOccurred = this._incidentOccurred;

      seriesTheme = themeManager.getOptions('series', particularSeriesOptions, allSeriesOptions.length);

      if (this._checkPaneName(seriesTheme)) {
        seriesThemes.push(seriesTheme as never);
      }
    }

    return seriesThemes;
  },

  _populateSeries(data) {
    const seriesBasis = [];
    const incidentOccurred = this._incidentOccurred;
    const seriesThemes = this._populateSeriesOptions(data);
    let particularSeries;
    let disposeSeriesFamilies = false;

    this.needToPopulateSeries = false;

    seriesThemes.forEach((theme) => {
      const findSeries = (s) => s.name === theme.name
        && !seriesBasis.map((sb: any) => sb.series).includes(s);

      const curSeries = this.series?.find(findSeries);
      if (curSeries && curSeries.type === theme.type) {
        seriesBasis.push({ series: curSeries, options: theme } as never);
      } else {
        seriesBasis.push({ options: theme } as never);
        disposeSeriesFamilies = true;
      }
    });

    (this.series?.length !== 0) && this._tracker.clearHover();

    _reverseEach(this.series, (index, series) => {
      if (!seriesBasis.some((s: any) => series === s.series)) {
        this._disposeSeries(index);
        disposeSeriesFamilies = true;
      }
    });

    !disposeSeriesFamilies && (disposeSeriesFamilies = seriesBasis.some((sb: any) => sb.series.name !== seriesThemes[sb.series.index].name));

    this.series = [];
    disposeSeriesFamilies && this._disposeSeriesFamilies();
    this._themeManager.resetPalette();
    const eventPipe = (data) => {
      this.series.forEach((currentSeries) => {
        currentSeries.notify(data);
      });
    };

    seriesBasis.forEach((basis: any) => {
      const seriesTheme = basis.options;
      const argumentAxis = this._argumentAxes?.filter((a) => a.pane === seriesTheme.pane)[0] ?? this.getArgumentAxis();
      const renderSettings = {
        commonSeriesModes: this._getSelectionModes(),
        argumentAxis,
        valueAxis: this._getValueAxis(seriesTheme.pane, seriesTheme.axis),
      };
      if (basis.series) {
        particularSeries = basis.series;
        particularSeries.updateOptions(seriesTheme, renderSettings);
      } else {
        particularSeries = new Series(extend({
          renderer: this._renderer,
          seriesGroup: this._seriesGroup,
          labelsGroup: this._labelsGroup,
          eventTrigger: this._eventTrigger,
          eventPipe,
          incidentOccurred,
        }, renderSettings), seriesTheme);
      }
      if (!particularSeries.isUpdated) {
        incidentOccurred('E2101', [seriesTheme.type]);
      } else {
        particularSeries.index = this.series.length;
        this.series.push(particularSeries);
      }
    });

    return this.series;
  },

  getStackedPoints(point) {
    const stackName = point.series.getStackName();
    return this._getVisibleSeries().reduce((stackPoints, series) => {
      if ((!_isDefined(series.getStackName()) || !_isDefined(stackName)) || stackName === series.getStackName()) {
        stackPoints = stackPoints.concat(series.getPointsByArg(point.argument));
      }
      return stackPoints;
    }, []);
  },

  // API
  getAllSeries: function getAllSeries() {
    return (this.series || []).slice();
  },

  getSeriesByName: function getSeriesByName(name) {
    const found = (this.series || []).find((singleSeries) => singleSeries.name === name);
    return found || null;
  },

  getSeriesByPos: function getSeriesByPos(pos) {
    return (this.series || [])[pos];
  },

  clearSelection: function clearSelection() {
    this._tracker.clearSelection();
  },

  hideTooltip() {
    this._tracker._hideTooltip();
  },

  clearHover() {
    this._tracker.clearHover();
  },

  render(renderOptions) {
    this.__renderOptions = renderOptions;
    this.__forceRender = renderOptions && renderOptions.force;
    this.callBase.apply(this, arguments);
    this.__renderOptions = this.__forceRender = null;
    return this;
  },

  refresh() {
    this._disposeSeries();
    this._disposeSeriesFamilies();
    this._requestChange(['CONTAINER_SIZE', 'REFRESH_SERIES_REINIT']);
  },

  _getMinSize() {
    const adaptiveLayout = this._layoutManagerOptions();
    return [adaptiveLayout.width, adaptiveLayout.height];
  },

  _change_REFRESH() {
    if (!this._changes.has('INIT')) {
      this._doRefresh();
    } else {
      this._currentRefreshData = null;
    }
  },

  _change_FULL_RENDER() {
    this._forceRender();
  },

  _change_INIT() {
    this._reinit();
  },

  _stopCurrentHandling() {
    if (this._disposed) {
      return;
    }
    this._tracker.stopCurrentHandling();
  },
});

REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS.forEach((name) => {
  BaseChart.prototype._optionChangesMap[name] = 'REFRESH_SERIES_DATA_INIT';
});

FORCE_RENDER_REFRESH_ACTION_OPTIONS.forEach((name) => {
  BaseChart.prototype._optionChangesMap[name] = 'FORCE_RENDER';
});

REFRESH_SERIES_FAMILIES_ACTION_OPTIONS.forEach((name) => {
  BaseChart.prototype._optionChangesMap[name] = 'REFRESH_SERIES_FAMILIES';
});

BaseChart.addPlugin(exportPlugin);
BaseChart.addPlugin(titlePlugin);
BaseChart.addPlugin(dataSourcePlugin);
BaseChart.addPlugin(tooltipPlugin);
BaseChart.addPlugin(loadingIndicatorPlugin);

// These are charts specifics on using title - they cannot be omitted because of charts custom layout.
// eslint-disable-next-line
const { _change_TITLE } = BaseChart.prototype;
BaseChart.prototype._change_TITLE = function () {
  _change_TITLE.apply(this, arguments);
  this._change(['FORCE_RENDER']);
};
