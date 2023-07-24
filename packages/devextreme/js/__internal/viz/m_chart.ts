import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { extend as _extend } from '@js/core/utils/extend';
import { each as _each } from '@js/core/utils/iterator';
import { getPrecision } from '@js/core/utils/math';
import { getHeight } from '@js/core/utils/size';
import { isDefined as _isDefined, type } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import { Crosshair, getMargins } from '@js/viz/chart_components/crosshair';
import { LayoutManager } from '@js/viz/chart_components/layout_manager';
import multiAxesSynchronizer from '@js/viz/chart_components/multi_axes_synchronizer';
import { ScrollBar } from '@js/viz/chart_components/scroll_bar';
import shutterZoom from '@js/viz/chart_components/shutter_zoom';
import zoomAndPan from '@js/viz/chart_components/zoom_and_pan';
import { plugins } from '@js/viz/core/annotations';
import {
  convertVisualRangeObject, extractColor,
  getCategoriesInfo,
  getLog, isRelativeHeightPane,
  map as _map, normalizePanesHeight,
  PANE_PADDING,
  rangesAreEqual,
  updatePanesCanvases,
} from '@js/viz/core/utils';
import rangeDataCalculator from '@js/viz/series/helpers/range_data_calculator';
import { Range } from '@js/viz/translators/range';
// @ts-expect-error
import { prepareSegmentRectPoints } from '@js/viz/utils';

import { AdvancedChart } from './chart_components/m_advanced_chart';
import { overlapping } from './chart_components/m_base_chart';

const DEFAULT_PANE_NAME = 'default';
const VISUAL_RANGE = 'VISUAL_RANGE';
const DEFAULT_PANES = [{
  name: DEFAULT_PANE_NAME,
  border: {},
}];
const DISCRETE = 'discrete';

const { isArray } = Array;

function getFirstAxisNameForPane(axes, paneName, defaultPane) {
  let result;
  for (let i = 0; i < axes.length; i++) {
    if (axes[i].pane === paneName || (axes[i].pane === undefined && paneName === defaultPane)) {
      result = axes[i].name;
      break;
    }
  }
  if (!result) {
    result = axes[0].name;
  }
  return result;
}

function changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility) {
  const gridOpt = axis.getOptions().grid;
  const minorGridOpt = axis.getOptions().minorGrid;

  gridOpt.visible = gridVisibility;
  minorGridOpt && (minorGridOpt.visible = minorGridVisibility);
}

function hideGridsOnNonFirstValueAxisForPane(axesForPane) {
  let axisShown = false;
  const hiddenStubAxis = [];
  const minorGridVisibility = axesForPane.some((axis) => {
    const minorGridOptions = axis.getOptions().minorGrid;
    return minorGridOptions && minorGridOptions.visible;
  });
  const gridVisibility = axesForPane.some((axis) => {
    const gridOptions = axis.getOptions().grid;
    return gridOptions && gridOptions.visible;
  });

  if (axesForPane.length > 1) {
    axesForPane.forEach((axis) => {
      const gridOpt = axis.getOptions().grid;

      if (axisShown) {
        changeVisibilityAxisGrids(axis, false, false);
      } else if (gridOpt && gridOpt.visible) {
        if (axis.getTranslator().getBusinessRange().isEmpty()) {
          changeVisibilityAxisGrids(axis, false, false);
          hiddenStubAxis.push(axis as never);
        } else {
          axisShown = true;
          changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility);
        }
      }
    });

    !axisShown && hiddenStubAxis.length && changeVisibilityAxisGrids(hiddenStubAxis[0], gridVisibility, minorGridVisibility);
  }
}

function findAxisOptions(valueAxes, valueAxesOptions, axisName) {
  let result;
  let axInd;

  for (axInd = 0; axInd < valueAxesOptions.length; axInd++) {
    if (valueAxesOptions[axInd].name === axisName) {
      result = valueAxesOptions[axInd];
      result.priority = axInd;
      break;
    }
  }
  if (!result) {
    for (axInd = 0; axInd < valueAxes.length; axInd++) {
      if (valueAxes[axInd].name === axisName) {
        result = valueAxes[axInd].getOptions();
        result.priority = valueAxes[axInd].priority;
        break;
      }
    }
  }

  return result;
}

function findAxis(paneName, axisName, axes) {
  let axis;
  let i;
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    if (axis.name === axisName && axis.pane === paneName) {
      return axis;
    }
  }
  if (paneName) {
    return findAxis(undefined, axisName, axes);
  }
}

function compareAxes(a, b) {
  return a.priority - b.priority;
}

// checks if pane with provided name exists in this panes array
function doesPaneExist(panes, paneName) {
  let found = false;
  _each(panes, (_, pane) => {
    if (pane.name === paneName) {
      found = true;
      return false;
    }
    return undefined;
  });
  return found;
}

// utilities used in axes rendering
function accumulate(field, src1, src2, auxSpacing) {
  const val1 = src1[field] || 0;
  const val2 = src2[field] || 0;
  return val1 + val2 + (val1 && val2 ? auxSpacing : 0);
}

function pickMax(field, src1, src2) {
  return pickMaxValue(src1[field], src2[field]);
}

function pickMaxValue(val1, val2) {
  return Math.max(val1 || 0, val2 || 0);
}

function getAxisMargins(axis) {
  return axis.getMargins();
}

function getHorizontalAxesMargins(axes, getMarginsFunc) {
  return axes.reduce((margins, axis) => {
    const axisMargins = getMarginsFunc(axis);
    const paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {};
    const spacing = axis.getMultipleAxesSpacing();

    paneMargins.top = accumulate('top', paneMargins, axisMargins, spacing);
    paneMargins.bottom = accumulate('bottom', paneMargins, axisMargins, spacing);
    paneMargins.left = pickMax('left', paneMargins, axisMargins);
    paneMargins.right = pickMax('right', paneMargins, axisMargins);

    margins.top = pickMax('top', paneMargins, margins);
    margins.bottom = pickMax('bottom', paneMargins, margins);
    margins.left = pickMax('left', paneMargins, margins);
    margins.right = pickMax('right', paneMargins, margins);

    const orthogonalAxis = axis.getOrthogonalAxis?.();
    if (orthogonalAxis && orthogonalAxis.customPositionIsAvailable()
            && (!axis.customPositionIsBoundaryOrthogonalAxis() || !orthogonalAxis.customPositionEqualsToPredefined())) {
      margins[orthogonalAxis.getResolvedBoundaryPosition()] = 0;
    }
    return margins;
  }, { panes: {} });
}

function getVerticalAxesMargins(axes) {
  return axes.reduce((margins, axis) => {
    const axisMargins = axis.getMargins();
    const paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {};
    const spacing = axis.getMultipleAxesSpacing();

    paneMargins.top = pickMax('top', paneMargins, axisMargins);
    paneMargins.bottom = pickMax('bottom', paneMargins, axisMargins);
    paneMargins.left = accumulate('left', paneMargins, axisMargins, spacing);
    paneMargins.right = accumulate('right', paneMargins, axisMargins, spacing);

    margins.top = pickMax('top', paneMargins, margins);
    margins.bottom = pickMax('bottom', paneMargins, margins);
    margins.left = pickMax('left', paneMargins, margins);
    margins.right = pickMax('right', paneMargins, margins);

    return margins;
  }, { panes: {} });
}

function performActionOnAxes(axes, action, actionArgument1?, actionArgument2?, actionArgument3?) {
  axes.forEach((axis) => {
    axis[action](actionArgument1 && actionArgument1[axis.pane], actionArgument2 && actionArgument2[axis.pane] || actionArgument2, actionArgument3);
  });
}

function shrinkCanvases(isRotated, canvases, sizes, verticalMargins, horizontalMargins) {
  function getMargin(side, margins, pane) {
    const m = !(isRotated ? ['left', 'right'] : ['top', 'bottom']).includes(side) ? margins : margins.panes[pane] || {};
    return m[side];
  }

  function getMaxMargin(side, margins1, margins2, pane) {
    return pickMaxValue(getMargin(side, margins1, pane), getMargin(side, margins2, pane));
  }

  const getOriginalField = (field) => `original${field[0].toUpperCase()}${field.slice(1)}`;

  function shrink(canvases, paneNames, sizeField, startMargin, endMargin, oppositeMargins) {
    paneNames = paneNames.sort((p1, p2) => canvases[p2][startMargin] - canvases[p1][startMargin]);
    paneNames.forEach((pane) => {
      const canvas = canvases[pane];
      oppositeMargins.forEach((margin) => {
        canvas[margin] = canvas[getOriginalField(margin)] + getMaxMargin(margin, verticalMargins, horizontalMargins, pane);
      });
    });

    const firstPane = canvases[paneNames[0]];

    let emptySpace = paneNames.reduce((space, paneName) => {
      space -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, paneName) + getMaxMargin(endMargin, verticalMargins, horizontalMargins, paneName);
      return space;
    }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - canvases[paneNames[paneNames.length - 1]][getOriginalField(startMargin)]) - PANE_PADDING * (paneNames.length - 1);

    emptySpace -= Object.keys(sizes).reduce((prev, key) => prev + (!isRelativeHeightPane(sizes[key]) ? sizes[key].height : 0), 0);

    paneNames.reduce((offset, pane) => {
      const canvas = canvases[pane];
      const paneSize = sizes[pane];

      offset -= getMaxMargin(endMargin, verticalMargins, horizontalMargins, pane);
      canvas[endMargin] = firstPane[sizeField] - offset;
      offset -= !isRelativeHeightPane(paneSize) ? paneSize.height : Math.floor(emptySpace * paneSize.height);
      canvas[startMargin] = offset;
      offset -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, pane) + PANE_PADDING;

      return offset;
    }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - (emptySpace < 0 ? emptySpace : 0));
  }

  const paneNames = Object.keys(canvases);
  if (!isRotated) {
    shrink(canvases, paneNames, 'height', 'top', 'bottom', ['left', 'right']);
  } else {
    shrink(canvases, paneNames, 'width', 'left', 'right', ['top', 'bottom']);
  }

  return canvases;
}

function drawAxesWithTicks(axes, condition, canvases, panesBorderOptions) {
  if (condition) {
    performActionOnAxes(axes, 'createTicks', canvases);
    multiAxesSynchronizer.synchronize(axes);
  }
  performActionOnAxes(axes, 'draw', !condition && canvases, panesBorderOptions);
}

function shiftAxis(side1, side2) {
  const shifts = {};
  return function (axis) {
    if (!axis.customPositionIsAvailable() || axis.customPositionEqualsToPredefined()) {
      const shift = shifts[axis.pane] = shifts[axis.pane] || {
        top: 0, left: 0, bottom: 0, right: 0,
      };
      const spacing = axis.getMultipleAxesSpacing();
      const margins = axis.getMargins();

      axis.shift(shift);

      shift[side1] = accumulate(side1, shift, margins, spacing);
      shift[side2] = accumulate(side2, shift, margins, spacing);
    } else {
      axis.shift({
        top: 0, left: 0, bottom: 0, right: 0,
      });
    }
  };
}

function getCommonSize(side, margins) {
  let size = 0;
  let paneMargins;

  Object.keys(margins.panes).forEach((pane) => {
    paneMargins = margins.panes[pane];
    size += side === 'height' ? paneMargins.top + paneMargins.bottom : paneMargins.left + paneMargins.right;
  });

  return size;
}

function checkUsedSpace(sizeShortage, side, axes, getMarginFunc) {
  let size = 0;
  if (sizeShortage[side] > 0) {
    size = getCommonSize(side, getMarginFunc(axes, getAxisMargins));

    performActionOnAxes(axes, 'hideTitle');

    sizeShortage[side] -= size - getCommonSize(side, getMarginFunc(axes, getAxisMargins));
  }
  if (sizeShortage[side] > 0) {
    performActionOnAxes(axes, 'hideOuterElements');
  }
}

function axisAnimationEnabled(drawOptions, pointsToAnimation) {
  const pointsCount = pointsToAnimation.reduce((sum, count) => sum + count, 0) / pointsToAnimation.length;

  return drawOptions.animate && pointsCount <= drawOptions.animationPointsLimit;
}

function collectMarkersInfoBySeries(allSeries, filteredSeries, argAxis) {
  const series = [];
  const overloadedSeries = {};
  const argVisualRange = argAxis.visualRange();
  const argTranslator = argAxis.getTranslator();
  const argViewPortFilter = rangeDataCalculator.getViewPortFilter(argVisualRange || {});
  filteredSeries.forEach((s) => {
    const valAxis = s.getValueAxis();
    const valVisualRange = valAxis.getCanvasRange();
    const valTranslator = valAxis.getTranslator();
    const seriesIndex = allSeries.indexOf(s);
    const valViewPortFilter = rangeDataCalculator.getViewPortFilter(valVisualRange || {});

    overloadedSeries[seriesIndex] = {};
    filteredSeries.forEach((sr) => { overloadedSeries[seriesIndex][allSeries.indexOf(sr)] = 0; });
    const seriesPoints = [];

    s.getPoints().filter((p) => p.getOptions().visible && argViewPortFilter(p.argument)
            && (valViewPortFilter(p.getMinValue(true)) || valViewPortFilter(p.getMaxValue(true)))).forEach((p) => {
      const tp = {
        seriesIndex,
        argument: p.argument,
        value: p.getMaxValue(true),
        size: p.bubbleSize || p.getOptions().size,
        x: undefined,
        y: undefined,
      };
      if (p.getMinValue(true) !== p.getMaxValue(true)) {
        const mp = _extend({}, tp);
        mp.value = p.getMinValue(true);
        mp.x = argTranslator.to(mp.argument, 1);
        mp.y = valTranslator.to(mp.value, 1);
        seriesPoints.push(mp as never);
      }
      tp.x = argTranslator.to(tp.argument, 1);
      tp.y = valTranslator.to(tp.value, 1);
      seriesPoints.push(tp as never);
    });

    overloadedSeries[seriesIndex].pointsCount = seriesPoints.length;
    overloadedSeries[seriesIndex].total = 0;
    overloadedSeries[seriesIndex].continuousSeries = 0;
    series.push({ name: s.name, index: seriesIndex, points: seriesPoints } as never);
  });
  return { series, overloadedSeries };
}

const isOverlay = (currentPoint, overlayPoint, pointRadius) => {
  const pointHitsLeftBorder = overlayPoint.x - pointRadius <= currentPoint.x;
  const pointHitsRightBorder = overlayPoint.x + pointRadius >= currentPoint.x;
  const pointHitsTopBorder = overlayPoint.y - pointRadius <= currentPoint.y;
  const pointHitsBottomBorder = overlayPoint.y + pointRadius >= currentPoint.y;
  const isPointOverlappedHorizontally = pointHitsLeftBorder && pointHitsRightBorder;
  const isPointOverlappedVertically = pointHitsTopBorder && pointHitsBottomBorder;

  return isPointOverlappedHorizontally && isPointOverlappedVertically;
};

const isPointOverlapped = (currentPoint, points, skipSamePointsComparing?) => {
  const radiusPoint = currentPoint.getOptions().size / 2;

  for (let i = 0; i < points.length; i++) {
    if (!skipSamePointsComparing) {
      const isXCoordinateSame = points[i].x === currentPoint.x;
      const isYCoordinateSame = points[i].y === currentPoint.y;

      if (isXCoordinateSame && isYCoordinateSame) {
        continue;
      }
    }

    if (isOverlay(currentPoint, points[i], radiusPoint)) {
      return true;
    }
  }
  return false;
};

function fastHidingPointMarkersByArea(canvas, markersInfo, series) {
  const area = canvas.width * canvas.height;
  const seriesPoints = markersInfo.series;

  for (let i = seriesPoints.length - 1; i >= 0; i--) {
    const currentSeries = series.filter((s) => s.name === seriesPoints[i].name)[0];
    const { points } = seriesPoints[i];
    const pointSize = points.length ? points[0].size : 0;
    const pointsArea = pointSize * pointSize * points.length;
    if (currentSeries.autoHidePointMarkersEnabled() && pointsArea >= area / seriesPoints.length) {
      const { index } = seriesPoints[i];
      currentSeries.autoHidePointMarkers = true;
      seriesPoints.splice(i, 1);
      series.splice(series.indexOf(currentSeries), 1);
      markersInfo.overloadedSeries[index] = null;
    }
  }
}

function updateMarkersInfo(points, overloadedSeries) {
  let isContinuousSeries = false;
  for (let i = 0; i < points.length - 1; i++) {
    const curPoint = points[i];
    const { size } = curPoint;
    if (_isDefined(curPoint.x) && _isDefined(curPoint.y)) {
      for (let j = i + 1; j < points.length; j++) {
        const nextPoint = points[j];
        const nextX = nextPoint?.x;
        const nextY = nextPoint?.y;

        if (!_isDefined(nextX) || Math.abs(curPoint.x - nextX) >= size) {
          isContinuousSeries = isContinuousSeries && (j !== i + 1);
          break;
        } else {
          const distance = _isDefined(nextX) && _isDefined(nextY) && Math.sqrt((curPoint.x - nextX) ** 2 + (curPoint.y - nextY) ** 2);
          if (distance && distance < size) {
            overloadedSeries[curPoint.seriesIndex][nextPoint.seriesIndex]++;
            overloadedSeries[curPoint.seriesIndex].total++;
            if (!isContinuousSeries) {
              overloadedSeries[curPoint.seriesIndex].continuousSeries++;
              isContinuousSeries = true;
            }
          }
        }
      }
    }
  }
}

// utilities used in axes rendering

const dxChart = AdvancedChart.inherit({
  _themeSection: 'chart',

  _fontFields: ['crosshair.label.font'],

  _initCore() {
    this.paneAxis = {};
    this.callBase();
  },

  _init() {
    this._containerInitialHeight = hasWindow() ? getHeight(this._$element) : 0;
    this.callBase();
  },

  _correctAxes() {
    this._correctValueAxes(true);
  },

  _setDeprecatedOptions() {
    this.callBase();
    _extend(this._deprecatedOptions, {
      'argumentAxis.aggregateByCategory': { since: '23.1', message: 'Use the aggregation.enabled property' },
    });
  },

  _getExtraOptions: noop,

  _createPanes() {
    const that = this;
    let panes = that.option('panes');
    let panesNameCounter = 0;
    let defaultPane;

    if (!panes || (isArray(panes) && !panes.length)) {
      panes = DEFAULT_PANES;
    }

    that.callBase();

    defaultPane = that.option('defaultPane');
    panes = _extend(true, [], isArray(panes) ? panes : [panes]);
    _each(panes, (_, pane) => {
      pane.name = !_isDefined(pane.name) ? DEFAULT_PANE_NAME + panesNameCounter++ : pane.name;
    });

    if (_isDefined(defaultPane)) {
      if (!doesPaneExist(panes, defaultPane)) {
        that._incidentOccurred('W2101', [defaultPane]);
        defaultPane = panes[panes.length - 1].name;
      }
    } else {
      defaultPane = panes[panes.length - 1].name;
    }
    that.defaultPane = defaultPane;

    panes = that._isRotated() ? panes.reverse() : panes;

    return panes;
  },

  _getAxisRenderingOptions() {
    return {
      axisType: 'xyAxes', drawingType: 'linear',
    };
  },

  _prepareAxisOptions(typeSelector, userOptions, rotated) {
    return {
      isHorizontal: (typeSelector === 'argumentAxis') !== rotated,
      containerColor: this._themeManager.getOptions('containerBackgroundColor'),
    };
  },

  _checkPaneName(seriesTheme) {
    const paneList = _map(this.panes, (pane) => pane.name);
    seriesTheme.pane = seriesTheme.pane || this.defaultPane;

    return paneList.includes(seriesTheme.pane);
  },

  _initCustomPositioningAxes() {
    const that = this;
    const argumentAxis = that.getArgumentAxis();
    const valueAxisName = argumentAxis.getOptions().customPositionAxis;
    const valueAxis = that._valueAxes.filter((v) => v.pane === argumentAxis.pane && (!valueAxisName || valueAxisName === v.name))[0];

    that._valueAxes.forEach((v) => {
      if (argumentAxis !== v.getOrthogonalAxis()) {
        v.getOrthogonalAxis = () => argumentAxis;
        v.customPositionIsBoundaryOrthogonalAxis = () => argumentAxis.customPositionIsBoundary();
      }
    });

    if (_isDefined(valueAxis) && valueAxis !== argumentAxis.getOrthogonalAxis()) {
      argumentAxis.getOrthogonalAxis = () => valueAxis;
      argumentAxis.customPositionIsBoundaryOrthogonalAxis = () => that._valueAxes.some((v) => v.customPositionIsBoundary());
    } else if (_isDefined(argumentAxis.getOrthogonalAxis()) && !_isDefined(valueAxis)) {
      argumentAxis.getOrthogonalAxis = noop;
    }
  },

  _getAllAxes() {
    return this._argumentAxes.concat(this._valueAxes);
  },

  _resetAxesAnimation(isFirstDrawing, isHorizontal) {
    const axes = _isDefined(isHorizontal) ? isHorizontal ^ this._isRotated() ? this._argumentAxes : this._valueAxes : this._getAllAxes();
    axes.forEach((a) => { a.resetApplyingAnimation(isFirstDrawing); });
  },

  _axesBoundaryPositioning() {
    const allAxes = this._getAllAxes();
    let boundaryStateChanged = false;

    allAxes.forEach((a) => {
      if (!a.customPositionIsAvailable()) {
        return;
      }
      const prevBoundaryState = a.customPositionIsBoundary();
      a._customBoundaryPosition = a.getCustomBoundaryPosition();
      boundaryStateChanged = boundaryStateChanged
        || (prevBoundaryState !== a.customPositionIsBoundary());
    });

    return boundaryStateChanged;
  },

  _getCrosshairMargins() {
    const crosshairOptions = this._getCrosshairOptions() || {};
    const crosshairEnabled = crosshairOptions.enabled;
    const margins = getMargins();

    const horizontalLabel = _extend(
      true,
      {},
      crosshairOptions.label,
      crosshairOptions.horizontalLine.label,
    );
    const verticalLabel = _extend(
      true,
      {},
      crosshairOptions.label,
      crosshairOptions.verticalLine.label,
    );

    return {
      x: crosshairEnabled && crosshairOptions.horizontalLine.visible && horizontalLabel.visible ? margins.x : 0,
      y: crosshairEnabled && crosshairOptions.verticalLine.visible && verticalLabel.visible ? margins.y : 0,
    };
  },

  _getValueAxis(paneName, axisName) {
    const that = this;
    const valueAxes = that._valueAxes;
    const valueAxisOptions = that.option('valueAxis') || {};
    const valueAxesOptions = isArray(valueAxisOptions) ? valueAxisOptions : [valueAxisOptions];
    const rotated = that._isRotated();
    const crosshairMargins = that._getCrosshairMargins();
    let axisOptions;
    let axis;

    axisName = axisName || getFirstAxisNameForPane(valueAxes, paneName, that.defaultPane);

    axis = findAxis(paneName, axisName, valueAxes);
    if (!axis) {
      axisOptions = findAxisOptions(valueAxes, valueAxesOptions, axisName);
      if (!axisOptions) {
        that._incidentOccurred('W2102', [axisName]);
        axisOptions = {
          name: axisName,
          priority: valueAxes.length,
        };
      }
      axis = that._createAxis(false, that._populateAxesOptions('valueAxis', axisOptions, {
        pane: paneName,
        name: axisName,
        optionPath: isArray(valueAxisOptions) ? `valueAxis[${axisOptions.priority}]` : 'valueAxis',
        crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x,
      }, rotated));
      axis.applyVisualRangeSetter(that._getVisualRangeSetter());
      valueAxes.push(axis);
    }

    axis.setPane(paneName);

    return axis;
  },

  _correctValueAxes(needHideGrids) {
    const that = this;
    const synchronizeMultiAxes = that._themeManager.getOptions('synchronizeMultiAxes');
    const valueAxes = that._valueAxes;
    const paneWithAxis = {};

    that.series.forEach((series) => {
      const axis = series.getValueAxis();
      paneWithAxis[axis.pane] = true;
    });

    that.panes.forEach((pane) => {
      const paneName = pane.name;
      if (!paneWithAxis[paneName]) {
        that._getValueAxis(paneName); // creates an value axis if there is no one for pane
      }
      if (needHideGrids && synchronizeMultiAxes) {
        hideGridsOnNonFirstValueAxisForPane(valueAxes.filter((axis) => axis.pane === paneName));
      }
    });

    that._valueAxes = valueAxes.filter((axis) => {
      if (!axis.pane) {
        axis.setPane(that.defaultPane);
      }
      const paneExists = doesPaneExist(that.panes, axis.pane);
      if (!paneExists) {
        axis.dispose();
        axis = null;
      }
      return paneExists;
    }).sort(compareAxes);

    const defaultAxis = this.getValueAxis();

    that._valueAxes.forEach((axis) => {
      const { optionPath } = axis.getOptions();
      if (optionPath) {
        const axesWithSamePath = that._valueAxes.filter((a) => a.getOptions().optionPath === optionPath);
        if (axesWithSamePath.length > 1) {
          if (axesWithSamePath.some((a) => a === defaultAxis)) {
            axesWithSamePath.forEach((a) => {
              if (a !== defaultAxis) {
                a.getOptions().optionPath = null;
              }
            });
          } else {
            axesWithSamePath.forEach((a, i) => {
              if (i !== 0) {
                a.getOptions().optionPath = null;
              }
            });
          }
        }
      }
    });
  },

  _getSeriesForPane(paneName) {
    const paneSeries = [];
    _each(this.series, (_, oneSeries) => {
      if (oneSeries.pane === paneName) {
        paneSeries.push(oneSeries as never);
      }
    });
    return paneSeries;
  },

  _createPanesBorderOptions() {
    const commonBorderOptions = this._themeManager.getOptions('commonPaneSettings').border;
    const panesBorderOptions = {};
    this.panes.forEach((pane) => { panesBorderOptions[pane.name] = _extend(true, {}, commonBorderOptions, pane.border); });
    return panesBorderOptions;
  },

  _createScrollBar() {
    const that = this;
    const scrollBarOptions = that._themeManager.getOptions('scrollBar') || {};
    const scrollBarGroup = that._scrollBarGroup;

    if (scrollBarOptions.visible) {
      scrollBarOptions.rotated = that._isRotated();
      that._scrollBar = (that._scrollBar || new ScrollBar(that._renderer, scrollBarGroup)).update(scrollBarOptions);
    } else {
      scrollBarGroup.linkRemove();
      that._scrollBar && that._scrollBar.dispose();
      that._scrollBar = null;
    }
  },

  _executeAppendAfterSeries(append) {
    append();
  },

  _prepareToRender() {
    const panesBorderOptions = this._createPanesBorderOptions();

    this._createPanesBackground();
    this._appendAxesGroups();

    this._adjustViewport();

    return panesBorderOptions;
  },

  _adjustViewport() {
    const adjustOnZoom = this._themeManager.getOptions('adjustOnZoom');

    if (!adjustOnZoom) {
      return;
    }

    this._valueAxes.forEach((axis) => axis.adjust());
  },

  _recreateSizeDependentObjects(isCanvasChanged) {
    const that = this;
    const series = that._getVisibleSeries();
    const useAggregation = series.some((s) => s.useAggregation());
    const zoomChanged = that._isZooming();

    if (!useAggregation) {
      return;
    }

    that._argumentAxes.forEach((axis) => {
      axis.updateCanvas(that._canvas, true);
    });
    series.forEach((series) => {
      if (series.useAggregation() && (isCanvasChanged || zoomChanged || !series._useAllAggregatedPoints)) {
        series.createPoints();
      }
    });
    that._processSeriesFamilies();
  },

  _isZooming() {
    const that = this;
    const argumentAxis = that.getArgumentAxis();

    if (!argumentAxis || !argumentAxis.getTranslator()) {
      return false;
    }

    const businessRange = argumentAxis.getTranslator().getBusinessRange();
    const zoomRange = argumentAxis.getViewport();
    let min = zoomRange ? zoomRange.min : 0;
    let max = zoomRange ? zoomRange.max : 0;

    if (businessRange.axisType === 'logarithmic') {
      min = getLog(min, businessRange.base);
      max = getLog(max, businessRange.base);
    }
    const viewportDistance = businessRange.axisType === DISCRETE ? getCategoriesInfo(businessRange.categories, min, max).categories.length : Math.abs(max - min);
    let precision = getPrecision(viewportDistance);
    precision = precision > 1 ? 10 ** (precision - 2) : 1;
    const zoomChanged = Math.round((that._zoomLength - viewportDistance) * precision) / precision !== 0;
    that._zoomLength = viewportDistance;

    return zoomChanged;
  },

  _handleSeriesDataUpdated() {
    const that = this;
    const viewport = new Range();

    that.series.forEach((s) => {
      viewport.addRange(s.getArgumentRange());
    });

    that._argumentAxes.forEach((axis) => {
      axis.updateCanvas(that._canvas, true);
      axis.setBusinessRange(viewport, that._axesReinitialized);
    });

    that.callBase();
  },

  _isLegendInside() {
    return this._legend && this._legend.getPosition() === 'inside';
  },

  _isRotated() {
    return this._themeManager.getOptions('rotated');
  },

  _getLayoutTargets() {
    return this.panes;
  },

  _applyClipRects(panesBorderOptions) {
    const that = this;

    that._drawPanesBorders(panesBorderOptions);
    that._createClipRectsForPanes();
    that._applyClipRectsForAxes();
    that._fillPanesBackground();
  },

  _updateLegendPosition(drawOptions, legendHasInsidePosition) {
    const that = this;
    if (drawOptions.drawLegend && that._legend && legendHasInsidePosition) {
      const { panes } = that;
      const newCanvas = _extend({}, panes[0].canvas);
      const layoutManager = new LayoutManager();

      newCanvas.right = panes[panes.length - 1].canvas.right;
      newCanvas.bottom = panes[panes.length - 1].canvas.bottom;
      layoutManager.layoutInsideLegend(
        that._legend,
        newCanvas,
      );
    }
  },

  _allowLegendInsidePosition() {
    return true;
  },

  _applyExtraSettings(series) {
    const that = this;
    const paneIndex = that._getPaneIndex(series.pane);
    const panesClipRects = that._panesClipRects;
    const wideClipRect = panesClipRects.wide[paneIndex];
    series.setClippingParams(panesClipRects.base[paneIndex].id, wideClipRect && wideClipRect.id, that._getPaneBorderVisibility(paneIndex));
  },

  _updatePanesCanvases(drawOptions) {
    if (!drawOptions.recreateCanvas) {
      return;
    }

    updatePanesCanvases(this.panes, this._canvas, this._isRotated());
  },

  _normalizePanesHeight() {
    normalizePanesHeight(this.panes);
  },

  _renderScaleBreaks() {
    this._valueAxes.concat(this._argumentAxes).forEach((axis) => {
      axis.drawScaleBreaks();
    });
  },

  _getArgFilter() {
    return rangeDataCalculator.getViewPortFilter(this.getArgumentAxis().visualRange() || {});
  },

  _hidePointsForSingleSeriesIfNeeded(series) {
    const seriesPoints = series.getPoints();
    let overlappedPointsCount = 0;

    for (let i = 0; i < seriesPoints.length; i++) {
      const currentPoint = seriesPoints[i];
      const overlappingPoints = seriesPoints.slice(i + 1);

      overlappedPointsCount += Number(isPointOverlapped(currentPoint, overlappingPoints));
      if (overlappedPointsCount > seriesPoints.length / 2) {
        series.autoHidePointMarkers = true;
        break;
      }
    }
  },

  _applyAutoHidePointMarkers(filteredSeries) {
    let overlappingPoints = [];

    const reducerFunc = (pointsCount, currentPoint) => pointsCount + isPointOverlapped(currentPoint, overlappingPoints, true);

    for (let i = filteredSeries.length - 1; i >= 0; i--) {
      const currentSeries = filteredSeries[i];

      if (!currentSeries.autoHidePointMarkersEnabled()) {
        continue;
      }

      currentSeries.autoHidePointMarkers = false;
      this._hidePointsForSingleSeriesIfNeeded(currentSeries);

      if (!currentSeries.autoHidePointMarkers) {
        const seriesPoints = currentSeries.getPoints();
        const overlappingPointsCount = seriesPoints
          .reduce(
            reducerFunc,
            0,
          );

        if (overlappingPointsCount < seriesPoints.length) {
          overlappingPoints = overlappingPoints.concat(seriesPoints);
        } else {
          currentSeries.autoHidePointMarkers = true;
        }
      }
    }
  },

  _applyPointMarkersAutoHiding() {
    const that = this;
    const allSeries = that.series;

    if (!that._themeManager.getOptions('autoHidePointMarkers')) {
      allSeries.forEach((s) => { s.autoHidePointMarkers = false; });
      return;
    }

    that.panes.forEach(({ borderCoords, name }) => {
      const series = allSeries.filter((s) => s.pane === name && s.usePointsToDefineAutoHiding());
      series.forEach((singleSeries) => {
        singleSeries.prepareCoordinatesForPoints();
      });
      const argAxis = that.getArgumentAxis();
      const markersInfo = collectMarkersInfoBySeries(allSeries, series, argAxis);
      fastHidingPointMarkersByArea(borderCoords, markersInfo, series);
      if (markersInfo.series.length) {
        const argVisualRange = argAxis.visualRange();
        const argAxisIsDiscrete = argAxis.getOptions().type === DISCRETE;
        const sortingCallback = argAxisIsDiscrete
          ? (p1, p2) => argVisualRange.categories.indexOf(p1.argument) - argVisualRange.categories.indexOf(p2.argument)
          : (p1, p2) => p1.argument - p2.argument;
        let points = [];

        markersInfo.series.forEach((s) => { points = points.concat((s as any).points); });
        points.sort(sortingCallback);
        updateMarkersInfo(points, markersInfo.overloadedSeries);
        that._applyAutoHidePointMarkers(series);
      }
    });
  },

  _renderAxes(drawOptions, panesBorderOptions) {
    function calculateTitlesWidth(axes) {
      return axes.map((axis) => {
        if (!axis.getTitle) return 0;

        const title = axis.getTitle();
        return title ? title.bBox.width : 0;
      });
    }
    const that = this;
    const rotated = that._isRotated();
    const synchronizeMultiAxes = that._themeManager.getOptions('synchronizeMultiAxes');
    const scrollBar = that._scrollBar ? [that._scrollBar] : [];
    const extendedArgAxes = that._isArgumentAxisBeforeScrollBar() ? that._argumentAxes.concat(scrollBar) : scrollBar.concat(that._argumentAxes);
    const verticalAxes = rotated ? that._argumentAxes : that._valueAxes;
    const verticalElements = rotated ? extendedArgAxes : that._valueAxes;
    const horizontalAxes = rotated ? that._valueAxes : that._argumentAxes;
    const horizontalElements = rotated ? that._valueAxes : extendedArgAxes;
    const allAxes = verticalAxes.concat(horizontalAxes);
    const allElements = allAxes.concat(scrollBar);
    const verticalAxesFirstDrawing = verticalAxes.some((v) => v.isFirstDrawing());

    that._normalizePanesHeight();
    that._updatePanesCanvases(drawOptions);

    let panesCanvases = that.panes.reduce((canvases, pane) => {
      canvases[pane.name] = _extend({}, pane.canvas);
      return canvases;
    }, {});
    const paneSizes = that.panes.reduce((sizes, pane) => {
      sizes[pane.name] = {
        height: pane.height,
        unit: pane.unit,
      };
      return sizes;
    }, {});
    const cleanPanesCanvases = _extend(true, {}, panesCanvases);

    that._initCustomPositioningAxes();
    const needCustomAdjustAxes = that._axesBoundaryPositioning();

    if (!drawOptions.adjustAxes && !needCustomAdjustAxes) {
      drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
      drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
      performActionOnAxes(allAxes, 'prepareAnimation');
      that._renderScaleBreaks();
      horizontalAxes.forEach((a) => a.resolveOverlappingForCustomPositioning(verticalAxes));
      verticalAxes.forEach((a) => a.resolveOverlappingForCustomPositioning(horizontalAxes));
      return false;
    }
    if (needCustomAdjustAxes) {
      allAxes.forEach((a) => a.customPositionIsAvailable() && a.shift({
        top: 0, left: 0, bottom: 0, right: 0,
      }));
    }

    if (that._scrollBar) {
      that._scrollBar.setPane(that.panes);
    }

    let vAxesMargins = { panes: {}, left: 0, right: 0 };
    let hAxesMargins = getHorizontalAxesMargins(horizontalElements, (axis) => axis.estimateMargins(panesCanvases[axis.pane]));
    panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

    const drawAxesAndSetCanvases = (isHorizontal) => {
      const axes = isHorizontal ? horizontalAxes : verticalAxes;
      const condition = (isHorizontal ? rotated : !rotated) && synchronizeMultiAxes;
      drawAxesWithTicks(axes, condition, panesCanvases, panesBorderOptions);
      if (isHorizontal) {
        hAxesMargins = getHorizontalAxesMargins(horizontalElements, getAxisMargins);
      } else {
        vAxesMargins = getVerticalAxesMargins(verticalElements);
      }
      panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);
    };

    drawAxesAndSetCanvases(false);
    drawAxesAndSetCanvases(true);
    if (!that._changesApplying && that._estimateTickIntervals(verticalAxes, panesCanvases)) {
      drawAxesAndSetCanvases(false);
    }

    let oldTitlesWidth = calculateTitlesWidth(verticalAxes);

    const visibleSeries = that._getVisibleSeries();
    const pointsToAnimation = that._getPointsToAnimation(visibleSeries);
    const axesIsAnimated = axisAnimationEnabled(drawOptions, pointsToAnimation);

    performActionOnAxes(allElements, 'updateSize', panesCanvases, axesIsAnimated);

    horizontalElements.forEach(shiftAxis('top', 'bottom'));
    verticalElements.forEach(shiftAxis('left', 'right'));

    that._renderScaleBreaks();

    that.panes.forEach((pane) => {
      _extend(pane.canvas, panesCanvases[pane.name]);
    });

    that._valueAxes.forEach((axis) => {
      axis.setInitRange();
    });

    verticalAxes.forEach((axis, i) => {
      if (axis.hasWrap?.()) {
        const title = axis.getTitle();
        const newTitleWidth = title ? title.bBox.width : 0;
        const offset = newTitleWidth - oldTitlesWidth[i];
        if (axis.getOptions().position === 'right') {
          vAxesMargins.right += offset;
        } else {
          vAxesMargins.left += offset;
          that.panes.forEach(({ name }) => { vAxesMargins.panes[name].left += offset; });
        }

        panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

        performActionOnAxes(allElements, 'updateSize', panesCanvases, false, false);
        oldTitlesWidth = calculateTitlesWidth(verticalAxes);
      }
    });

    if (verticalAxes.some((v) => v.customPositionIsAvailable() && v.getCustomPosition() !== v._axisPosition)) {
      axesIsAnimated && that._resetAxesAnimation(verticalAxesFirstDrawing, false);
      performActionOnAxes(verticalAxes, 'updateSize', panesCanvases, axesIsAnimated);
    }

    horizontalAxes.forEach((a) => a.resolveOverlappingForCustomPositioning(verticalAxes));
    verticalAxes.forEach((a) => a.resolveOverlappingForCustomPositioning(horizontalAxes));

    return cleanPanesCanvases;
  },

  _getExtraTemplatesItems() {
    const that = this;
    const allAxes = (that._argumentAxes || []).concat(that._valueAxes || []);

    const elements = that._collectTemplatesFromItems(allAxes);

    return {
      items: elements.items,
      groups: elements.groups,
      launchRequest() {
        allAxes.forEach((a) => {
          a.setRenderedState(true);
        });
      },
      doneRequest() {
        allAxes.forEach((a) => {
          a.setRenderedState(false);
        });
      },
    };
  },

  _estimateTickIntervals(axes, canvases) {
    return axes.some((axis) => axis.estimateTickInterval(canvases[axis.pane]));
  },

  checkForMoreSpaceForPanesCanvas() {
    const that = this;
    const rotated = that._isRotated();
    const panesAreCustomSized = that.panes.filter((p) => p.unit).length === that.panes.length;
    let needSpace = false as any;

    if (panesAreCustomSized) {
      let needHorizontalSpace = 0;
      let needVerticalSpace = 0;

      if (rotated) {
        const argAxisRightMargin = that.getArgumentAxis().getMargins().right;
        const rightPanesIndent = Math.min.apply(Math, that.panes.map((p) => p.canvas.right));
        needHorizontalSpace = that._canvas.right + argAxisRightMargin - rightPanesIndent;
      } else {
        const argAxisBottomMargin = that.getArgumentAxis().getMargins().bottom;
        const bottomPanesIndent = Math.min.apply(Math, that.panes.map((p) => p.canvas.bottom));
        needVerticalSpace = that._canvas.bottom + argAxisBottomMargin - bottomPanesIndent;
      }

      needSpace = needHorizontalSpace > 0 || needVerticalSpace > 0 ? { width: needHorizontalSpace, height: needVerticalSpace } : false;
      if (needVerticalSpace !== 0) {
        const realSize = that.getSize();
        const customSize = that.option('size');
        const container = that._$element[0];
        const containerHasStyledHeight = !!parseInt(container.style.height, 10) || that._containerInitialHeight !== 0;

        if (!rotated && !(customSize && customSize.height) && !containerHasStyledHeight) {
          that._forceResize(realSize.width, realSize.height + needVerticalSpace);
          needSpace = false;
        }
      }
    } else {
      needSpace = that.layoutManager.needMoreSpaceForPanesCanvas(that._getLayoutTargets(), rotated, (pane) => ({ width: rotated && !!pane.unit, height: !rotated && !!pane.unit }));
    }

    return needSpace;
  },

  _forceResize(width, height) {
    this._renderer.resize(width, height);
    this._updateSize();
    this._setContentSize();
    this._preserveOriginalCanvas();
    this._updateCanvasClipRect(this._canvas);
  },

  _shrinkAxes(sizeShortage, panesCanvases) {
    if (!sizeShortage || !panesCanvases) {
      return;
    }
    this._renderer.stopAllAnimations(true);
    const that = this;
    const rotated = that._isRotated();
    const scrollBar = that._scrollBar ? [that._scrollBar] : [];
    const extendedArgAxes = that._isArgumentAxisBeforeScrollBar() ? that._argumentAxes.concat(scrollBar) : scrollBar.concat(that._argumentAxes);
    const verticalAxes = rotated ? extendedArgAxes : that._valueAxes;
    const horizontalAxes = rotated ? that._valueAxes : extendedArgAxes;
    const allAxes = verticalAxes.concat(horizontalAxes);

    if (sizeShortage.width || sizeShortage.height) {
      checkUsedSpace(sizeShortage, 'height', horizontalAxes, getHorizontalAxesMargins);
      checkUsedSpace(sizeShortage, 'width', verticalAxes, getVerticalAxesMargins);

      performActionOnAxes(allAxes, 'updateSize', panesCanvases);

      const paneSizes = that.panes.reduce((sizes, pane) => {
        sizes[pane.name] = {
          height: pane.height,
          unit: pane.unit,
        };
        return sizes;
      }, {});

      panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, getVerticalAxesMargins(verticalAxes), getHorizontalAxesMargins(horizontalAxes, getAxisMargins));
      performActionOnAxes(allAxes, 'updateSize', panesCanvases);
      horizontalAxes.forEach(shiftAxis('top', 'bottom'));
      verticalAxes.forEach(shiftAxis('left', 'right'));

      that.panes.forEach((pane) => _extend(pane.canvas, panesCanvases[pane.name]));
    }
  },

  _isArgumentAxisBeforeScrollBar() {
    const that = this;
    const argumentAxis = that.getArgumentAxis();

    if (that._scrollBar) {
      const argAxisPosition = argumentAxis.getResolvedBoundaryPosition();
      const argAxisLabelPosition = argumentAxis.getOptions().label?.position;
      const scrollBarPosition = that._scrollBar.getOptions().position;

      return argumentAxis.hasNonBoundaryPosition() || scrollBarPosition === argAxisPosition && argAxisLabelPosition !== scrollBarPosition;
    }

    return false;
  },

  _getPanesParameters() {
    const that = this;
    const { panes } = that;
    let i;
    const params = [];
    for (i = 0; i < panes.length; i++) {
      if (that._getPaneBorderVisibility(i)) {
        params.push({ coords: panes[i].borderCoords, clipRect: that._panesClipRects.fixed[i] } as never);
      }
    }
    return params;
  },

  _createCrosshairCursor() {
    const that = this;
    const options = that._themeManager.getOptions('crosshair') || {};
    const argumentAxis = that.getArgumentAxis();
    const axes = !that._isRotated() ? [[argumentAxis], that._valueAxes] : [that._valueAxes, [argumentAxis]];
    const parameters = { canvas: that._getCommonCanvas(), panes: that._getPanesParameters(), axes };

    if (!options || !options.enabled) {
      return;
    }
    if (!that._crosshair) {
      that._crosshair = new Crosshair(that._renderer, options, parameters, that._crosshairCursorGroup);
    } else {
      that._crosshair.update(options, parameters);
    }
    that._crosshair.render();
  },

  _getCommonCanvas() {
    let i;
    let canvas;
    let commonCanvas;
    const { panes } = this;

    for (i = 0; i < panes.length; i++) {
      canvas = panes[i].canvas;
      if (!commonCanvas) { // TODO
        commonCanvas = _extend({}, canvas);
      } else {
        commonCanvas.right = canvas.right;
        commonCanvas.bottom = canvas.bottom;
      }
    }
    return commonCanvas;
  },

  _createPanesBackground() {
    const that = this;
    const defaultBackgroundColor = that._themeManager.getOptions('commonPaneSettings').backgroundColor;
    let backgroundColor;
    const renderer = that._renderer;
    let rect;
    let i;
    const rects = [];
    that._panesBackgroundGroup.clear();

    for (i = 0; i < that.panes.length; i++) {
      backgroundColor = that.panes[i].backgroundColor || defaultBackgroundColor;
      if (!backgroundColor || backgroundColor === 'none') {
        rects.push(null as never);
        continue;
      }
      rect = renderer.rect(0, 0, 0, 0).attr({
        fill: extractColor(backgroundColor),
        'stroke-width': 0,
      }).append(that._panesBackgroundGroup);
      rects.push(rect as never);
    }
    that.panesBackground = rects;
  },

  _fillPanesBackground() {
    const that = this;
    let bc;

    _each(that.panes, (i, pane) => {
      bc = pane.borderCoords;

      if (that.panesBackground[i] !== null) {
        that.panesBackground[i].attr({
          x: bc.left, y: bc.top, width: bc.width, height: bc.height,
        });
      }
    });
  },

  _calcPaneBorderCoords(pane) {
    const { canvas } = pane;
    const bc = pane.borderCoords = pane.borderCoords || {};

    bc.left = canvas.left;
    bc.top = canvas.top;
    bc.right = canvas.width - canvas.right;
    bc.bottom = canvas.height - canvas.bottom;
    bc.width = Math.max(bc.right - bc.left, 0);
    bc.height = Math.max(bc.bottom - bc.top, 0);
  },

  _drawPanesBorders(panesBorderOptions) {
    const that = this;
    const rotated = that._isRotated();

    that._panesBorderGroup.linkRemove().clear();

    _each(that.panes, (i, pane) => {
      const borderOptions = panesBorderOptions[pane.name];
      const attr = {
        fill: 'none',
        stroke: borderOptions.color,
        'stroke-opacity': borderOptions.opacity,
        'stroke-width': borderOptions.width,
        dashStyle: borderOptions.dashStyle,
        'stroke-linecap': 'square',
      };

      that._calcPaneBorderCoords(pane, rotated);

      if (!borderOptions.visible) {
        return;
      }
      const bc = pane.borderCoords;

      const segmentRectParams = prepareSegmentRectPoints(bc.left, bc.top, bc.width, bc.height, borderOptions);
      that._renderer.path(segmentRectParams.points, segmentRectParams.pathType).attr(attr).append(that._panesBorderGroup);
    });

    that._panesBorderGroup.linkAppend();
  },

  _createClipRect(clipArray, index, left, top, width, height) {
    const that = this;
    let clipRect = clipArray[index];

    if (!clipRect) {
      clipRect = that._renderer.clipRect(left, top, width, height);
      clipArray[index] = clipRect;
    } else {
      clipRect.attr({
        x: left, y: top, width, height,
      });
    }
  },

  _createClipRectsForPanes() {
    const that = this;
    const canvas = that._canvas;

    _each(that.panes, (i, pane) => {
      let needWideClipRect = false;
      const bc = pane.borderCoords;
      let { left } = bc;
      let { top } = bc;
      let { width } = bc;
      let { height } = bc;
      const panesClipRects = that._panesClipRects;

      that._createClipRect(panesClipRects.fixed, i, left, top, width, height);
      that._createClipRect(panesClipRects.base, i, left, top, width, height);

      _each(that.series, (_, series) => {
        if (series.pane === pane.name && (series.isFinancialSeries() || series.areErrorBarsVisible())) {
          needWideClipRect = true;
        }
      });

      if (needWideClipRect) {
        if (that._isRotated()) {
          top = 0;
          height = canvas.height;
        } else {
          left = 0;
          width = canvas.width;
        }
        that._createClipRect(panesClipRects.wide, i, left, top, width, height);
      } else {
        panesClipRects.wide[i] = null;
      }
    });
  },

  _applyClipRectsForAxes() {
    const that = this;
    const axes = that._getAllAxes();
    const chartCanvasClipRectID = that._getCanvasClipRectID();

    for (let i = 0; i < axes.length; i++) {
      const elementsClipRectID = that._getElementsClipRectID(axes[i].pane);
      axes[i].applyClipRects(elementsClipRectID, chartCanvasClipRectID);
    }
  },

  _getPaneBorderVisibility(paneIndex) {
    const commonPaneBorderVisible = this._themeManager.getOptions('commonPaneSettings').border.visible;
    const pane = this.panes[paneIndex] || {};
    const paneBorder = pane.border || {};

    return 'visible' in paneBorder ? paneBorder.visible : commonPaneBorderVisible;
  },

  _getCanvasForPane(paneName) {
    const { panes } = this;
    const panesNumber = panes.length;
    let i;

    for (i = 0; i < panesNumber; i++) {
      if (panes[i].name === paneName) {
        return panes[i].canvas;
      }
    }
  },

  _getTrackerSettings() {
    const that = this;
    const themeManager = that._themeManager;
    return _extend(this.callBase(), {
      chart: that,
      rotated: that._isRotated(),
      crosshair: that._getCrosshairOptions().enabled ? that._crosshair : null,
      stickyHovering: themeManager.getOptions('stickyHovering'),
    });
  },

  _resolveLabelOverlappingStack() {
    const that = this;
    const isRotated = that._isRotated();
    const shiftDirection = isRotated ? function (box, length) { return { x: box.x - length, y: box.y }; } : function (box, length) { return { x: box.x, y: box.y - length }; };

    _each(that._getStackPoints(), (_, stacks) => {
      _each(stacks, (_, points) => {
        const isInverted = points[0].series.getValueAxis().getOptions().inverted;
        overlapping.resolveLabelOverlappingInOneDirection(points, that._getCommonCanvas(), isRotated, isInverted, shiftDirection, (a, b) => {
          const coordPosition = isRotated ? 1 : 0;
          const figureCenter1 = a.labels[0].getFigureCenter()[coordPosition];
          const figureCenter12 = b.labels[0].getFigureCenter()[coordPosition];
          if (figureCenter1 - figureCenter12 === 0) {
            return (a.value() - b.value()) * (a.labels[0].getPoint().series.getValueAxis().getTranslator().isInverted() ? -1 : 1);
          }
          return 0;
        });
      });
    });
  },

  _getStackPoints() {
    const stackPoints = {};
    const visibleSeries = this._getVisibleSeries();

    _each(visibleSeries, (_, singleSeries) => {
      const points = singleSeries.getPoints();
      const stackName = singleSeries.getStackName() || null;

      _each(points, (_, point) => {
        const { argument } = point;

        if (!stackPoints[argument]) {
          stackPoints[argument] = {};
        }
        if (!stackPoints[argument][stackName]) {
          stackPoints[argument][stackName] = [];
        }
        stackPoints[argument][stackName].push(point);
      });
    });

    return stackPoints;
  },

  _getCrosshairOptions() {
    return this._getOption('crosshair');
  },

  // API
  zoomArgument(min, max) {
    const that = this;

    if (!that._initialized || !_isDefined(min) && !_isDefined(max)) {
      return;
    }

    that.getArgumentAxis().visualRange([min, max]);
  },

  resetVisualRange() {
    const that = this;
    const axes = that._argumentAxes;
    const nonVirtualArgumentAxis = that.getArgumentAxis();

    axes.forEach((axis) => {
      axis.resetVisualRange(nonVirtualArgumentAxis !== axis);
      that._applyCustomVisualRangeOption(axis);
    });
    that.callBase();
  },

  // T218011 for dashboards
  getVisibleArgumentBounds() {
    const translator = this._argumentAxes[0].getTranslator();
    const range = translator.getBusinessRange();
    const isDiscrete = range.axisType === DISCRETE;
    const { categories } = range;

    return {
      minVisible: isDiscrete ? range.minVisible || categories[0] : range.minVisible,
      maxVisible: isDiscrete ? range.maxVisible || categories[categories.length - 1] : range.maxVisible,
    };
  },

  _change_FULL_RENDER() {
    this.callBase();
    if (this._changes.has(VISUAL_RANGE)) {
      this._raiseZoomEndHandlers();
    }
  },

  _getAxesForScaling() {
    return [this.getArgumentAxis()].concat(this._valueAxes);
  },

  _applyVisualRangeByVirtualAxes(axis, range) {
    const that = this;
    if (axis.isArgumentAxis) {
      if (axis !== that.getArgumentAxis()) {
        return true;
      }
      that._argumentAxes.filter((a) => a !== axis).forEach((a) => a.visualRange(range, { start: true, end: true }));
    }
    return false;
  },

  _raiseZoomEndHandlers() {
    this._argumentAxes.forEach((axis) => axis.handleZoomEnd());
    this.callBase();
  },

  _setOptionsByReference() {
    this.callBase();

    _extend(this._optionsByReference, {
      'argumentAxis.visualRange': true,
    });
  },

  option() {
    const option = this.callBase.apply(this, arguments);
    const valueAxis = this._options.silent('valueAxis');

    if (type(valueAxis) === 'array') {
      for (let i = 0; i < valueAxis.length; i++) {
        const optionPath = `valueAxis[${i}].visualRange`;
        this._optionsByReference[optionPath] = true;
      }
    }

    return option;
  },

  _notifyVisualRange() {
    const that = this;
    const argAxis = that._argumentAxes[0];
    const argumentVisualRange = convertVisualRangeObject(argAxis.visualRange(), !isArray(that.option('argumentAxis.visualRange')));

    if (!argAxis.skipEventRising || !rangesAreEqual(argumentVisualRange, that.option('argumentAxis.visualRange'))) {
      that.option('argumentAxis.visualRange', argumentVisualRange);
    } else {
      argAxis.skipEventRising = null;
    }

    that.callBase();
  },
});

dxChart.addPlugin(shutterZoom);
dxChart.addPlugin(zoomAndPan);
dxChart.addPlugin(plugins.core);
dxChart.addPlugin(plugins.chart);

registerComponent('dxChart', dxChart);
export default dxChart;
