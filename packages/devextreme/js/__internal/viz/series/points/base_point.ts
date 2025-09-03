/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop as _noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined as _isDefined } from '@js/core/utils/type';
import consts from '@ts/viz/components/consts';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import barPoint from '@ts/viz/series/points/bar_point';
import bubblePoint from '@ts/viz/series/points/bubble_point';
import candlestickPoint from '@ts/viz/series/points/candlestick_point';
import piePoint from '@ts/viz/series/points/pie_point';
import { polarBarPoint, polarSymbolPoint } from '@ts/viz/series/points/polar_point';
import rangeBarPoint from '@ts/viz/series/points/range_bar_point';
import rangeSymbolPoint from '@ts/viz/series/points/range_symbol_point';
import stockPoint from '@ts/viz/series/points/stock_point';
import symbolPoint from '@ts/viz/series/points/symbol_point';

const mixins = {};
const _extend = extend;

const statesConsts = consts.states;
const SYMBOL_POINT = 'symbolPoint';
const POLAR_SYMBOL_POINT = 'polarSymbolPoint';
const BAR_POINT = 'barPoint';
const POLAR_BAR_POINT = 'polarBarPoint';
const PIE_POINT = 'piePoint';
const SELECTED_STATE = statesConsts.selectedMark;
const HOVER_STATE = statesConsts.hoverMark;
const NORMAL_STATE = statesConsts.normalMark;
const HOVER = statesConsts.hover;
const NORMAL = statesConsts.normal;
const SELECTION = statesConsts.selection;

const pointTypes = {
  chart: {
    scatter: SYMBOL_POINT,
    line: SYMBOL_POINT,
    spline: SYMBOL_POINT,
    stepline: SYMBOL_POINT,
    stackedline: SYMBOL_POINT,
    fullstackedline: SYMBOL_POINT,
    stackedspline: SYMBOL_POINT,
    fullstackedspline: SYMBOL_POINT,
    stackedsplinearea: SYMBOL_POINT,
    fullstackedsplinearea: SYMBOL_POINT,
    area: SYMBOL_POINT,
    splinearea: SYMBOL_POINT,
    steparea: SYMBOL_POINT,
    stackedarea: SYMBOL_POINT,
    fullstackedarea: SYMBOL_POINT,
    rangearea: 'rangeSymbolPoint',
    bar: BAR_POINT,
    stackedbar: BAR_POINT,
    fullstackedbar: BAR_POINT,
    rangebar: 'rangeBarPoint',
    bubble: 'bubblePoint',
    stock: 'stockPoint',
    candlestick: 'candlestickPoint',
  },
  pie: {
    pie: PIE_POINT,
    doughnut: PIE_POINT,
    donut: PIE_POINT,
  },
  polar: {
    scatter: POLAR_SYMBOL_POINT,
    line: POLAR_SYMBOL_POINT,
    area: POLAR_SYMBOL_POINT,
    bar: POLAR_BAR_POINT,
    stackedbar: POLAR_BAR_POINT,
  },
};

function isNoneMode(mode) {
  return _normalizeEnum(mode) === 'none';
}

export function Point(series, dataItem, options) {
  this.fullState = NORMAL_STATE;
  this.series = series;
  this.update(dataItem, options);
  this._viewCounters = {
    hover: 0,
    selection: 0,
  };

  this._emptySettings = {
    fill: null,
    stroke: null,
    dashStyle: null,
    filter: null,
  };
}
// @ts-expect-error
mixins.symbolPoint = symbolPoint;
// @ts-expect-error
mixins.barPoint = barPoint;
// @ts-expect-error
mixins.bubblePoint = bubblePoint;
// @ts-expect-error
mixins.piePoint = piePoint;
// @ts-expect-error
mixins.rangeSymbolPoint = rangeSymbolPoint;
// @ts-expect-error
mixins.rangeBarPoint = rangeBarPoint;
// @ts-expect-error
mixins.candlestickPoint = candlestickPoint;
// @ts-expect-error
mixins.stockPoint = stockPoint;
// @ts-expect-error
mixins.polarSymbolPoint = polarSymbolPoint;
// @ts-expect-error
mixins.polarBarPoint = polarBarPoint;

Point.prototype = {
  constructor: Point,

  getColor() {
    if (!this.hasValue() && !this._styles.usePointCustomOptions) {
      this.series.customizePoint(this, this._dataItem);
    }
    return this._styles.normal.fill || this.series.getColor();
  },

  _getStyle() {
    return this._styles[this._currentStyle || 'normal'];
  },

  update(dataItem, options) {
    this.updateOptions(options);
    this.updateData(dataItem);
  },

  updateData(dataItem) {
    const that = this;
    const argumentWasChanged = that.argument !== dataItem.argument;
    that.argument = that.initialArgument = that.originalArgument = dataItem.argument;
    that.tag = dataItem.tag;
    that.index = dataItem.index;

    that._dataItem = dataItem;

    that.data = dataItem.data;

    that.lowError = dataItem.lowError;
    that.highError = dataItem.highError;

    that.aggregationInfo = dataItem.aggregationInfo;

    that._updateData(dataItem, argumentWasChanged);

    !that.hasValue() && that.setInvisibility();

    that._fillStyle();
    that._updateLabelData();
  },

  deleteMarker() {
    const that = this;
    if (that.graphic) {
      that.graphic.dispose();
    }
    that.graphic = null;
  },

  draw(renderer, groups, animationEnabled, firstDrawing) {
    const that = this;
    if (that._needDeletingOnDraw || (that.series.autoHidePointMarkers && !that.isSelected())) {
      that.deleteMarker();
      that._needDeletingOnDraw = false;
    }
    if (that._needClearingOnDraw) {
      that.clearMarker();
      that._needClearingOnDraw = false;
    }

    if (!that._hasGraphic()) {
      that.getMarkerVisibility() && !that.series.autoHidePointMarkers && that._drawMarker(renderer, groups.markers, animationEnabled, firstDrawing);
    } else {
      that._updateMarker(animationEnabled, this._getStyle(), groups.markers);
    }

    that._drawLabel();

    that._drawErrorBar(renderer, groups.errorBars, animationEnabled);
    return that;
  },

  _getViewStyle() {
    let state = NORMAL_STATE;
    let fullState = this.fullState;
    const styles = [NORMAL, HOVER, SELECTION, SELECTION];

    if (this._viewCounters.hover) {
      state |= HOVER_STATE;
    }

    if (this._viewCounters.selection) {
      state |= SELECTED_STATE;
    }

    if (isNoneMode(this.getOptions().selectionMode)) {
      fullState &= ~SELECTED_STATE;
    }

    if (isNoneMode(this.getOptions().hoverMode)) {
      fullState &= ~HOVER_STATE;
    }

    state |= fullState;

    return styles[state];
  },

  applyView(legendCallback) {
    const that = this;
    const style = that._getViewStyle();
    that._currentStyle = style;
    if (!that.graphic && that.getMarkerVisibility() && that.series.autoHidePointMarkers && (style === SELECTION || style === HOVER)) {
      that._drawMarker(that.series.getRenderer(), that.series.getMarkersGroup());
    }
    if (that.graphic) {
      if (that.series.autoHidePointMarkers && style !== SELECTION && style !== HOVER) {
        that.deleteMarker();
      } else {
        if (style === 'normal') {
          that.clearMarker();
        } else {
          that.graphic.toForeground();
        }
        that._updateMarker(true, that._styles[style], undefined, legendCallback);
      }
    }
  },

  setView(style) {
    this._viewCounters[style]++;
    this.applyView();
  },

  resetView(style) {
    const viewCounters = this._viewCounters;

    --viewCounters[style];
    if (viewCounters[style] < 0) { // T661080
      viewCounters[style] = 0;
    }
    this.applyView();
  },

  releaseHoverState() {
    const that = this;
    if (that.graphic && !that.isSelected()) {
      that.graphic.toBackground();
    }
  },

  select() {
    this.series.selectPoint(this);
  },

  clearSelection() {
    this.series.deselectPoint(this);
  },

  hover() {
    this.series.hoverPoint(this);
  },

  clearHover() {
    this.series.clearPointHover();
  },

  showTooltip() {
    this.series.showPointTooltip(this);
  },

  hideTooltip() {
    this.series.hidePointTooltip(this);
  },

  _checkLabelsChanging(oldType, newType) {
    const isNewRange = ~newType.indexOf('range');
    const isOldRange = ~oldType.indexOf('range');

    return (isOldRange && !isNewRange) || (!isOldRange && isNewRange);
  },

  updateOptions(newOptions) {
    if (!newOptions) {
      return;
    }

    const that = this;
    const oldOptions = that._options;
    const widgetType = newOptions.widgetType;
    const oldType = oldOptions && oldOptions.type;
    const newType = newOptions.type;
    const newPointTypeMixin = pointTypes[widgetType][newType];

    if (oldType !== newType) {
      that._needDeletingOnDraw = true;
      that._needClearingOnDraw = false;

      if (oldType) {
        that._checkLabelsChanging(oldType, newType) && that.deleteLabel();
        that._resetType(mixins[pointTypes[oldType]]);
      }
      that._setType(mixins[newPointTypeMixin]);
    } else {
      that._needDeletingOnDraw = that._needDeletingOnDraw || that._checkSymbol(oldOptions, newOptions);
      that._needClearingOnDraw = that._checkCustomize(oldOptions, newOptions);
    }

    that._options = newOptions;

    that._fillStyle();
    that._updateLabelOptions(newPointTypeMixin);
  },

  translate() {
    if (this.hasValue()) {
      this._translate();
      this.translated = true;
    }
  },

  _checkCustomize(oldOptions, newOptions) {
    return oldOptions.styles.usePointCustomOptions && !newOptions.styles.usePointCustomOptions;
  },

  _getCustomLabelVisibility() {
    return this._styles.useLabelCustomOptions ? !!this._options.label.visible : null;
  },

  getBoundingRect() {
    return this._getGraphicBBox();
  },

  _resetType(methods) {
    for (const methodName in methods) {
      delete this[methodName];
    }
  },

  _setType(methods) {
    for (const methodName in methods) {
      this[methodName] = methods[methodName];
    }
  },

  isInVisibleArea() {
    return this.inVisibleArea;
  },

  isSelected() {
    return !!(this.fullState & SELECTED_STATE);
  },

  isHovered() {
    return !!(this.fullState & HOVER_STATE);
  },

  getOptions() {
    return this._options;
  },

  animate(complete, settings, partitionDuration) {
    if (!this.graphic) {
      complete && complete();
      return;
    }
    this.graphic.animate(settings, { partitionDuration }, complete);
  },

  getCoords(min) {
    const that = this;
    if (!min) {
      return { x: that.x, y: that.y };
    }

    if (!that._options.rotated) {
      return { x: that.x, y: that.minY + (that.y - that.minY ? 0 : 1) };
    }

    return { x: that.minX - (that.x - that.minX ? 0 : 1), y: that.y };
  },

  getDefaultCoords() {
    const that = this;
    return !that._options.rotated ? { x: that.x, y: that.defaultY } : { x: that.defaultX, y: that.y };
  },

  setDefaultCoords() {
    const coords = this.getDefaultCoords();

    this.x = coords.x;
    this.y = coords.y;
  },

  _getVisibleArea() {
    return this.series.getVisibleArea();
  },

  _getArgTranslator() {
    return this.series.getArgumentAxis().getTranslator();
  },

  _getValTranslator() {
    return this.series.getValueAxis().getTranslator();
  },

  isArgumentCorrect() {
    return this.series._argumentChecker(this.argument);
  },

  isValueCorrect() {
    const valueChecker = this.series._valueChecker;
    return valueChecker(this.getMinValue()) && valueChecker(this.getMaxValue());
  },

  hasValue() {
    return this.value !== null && this.minValue !== null && this.isArgumentCorrect() && this.isValueCorrect();
  },
  hasCoords: _noop,
  correctPosition: _noop,
  correctRadius: _noop,
  correctLabelRadius: _noop,
  getCrosshairData: _noop,
  getPointRadius: _noop,
  _populatePointShape: _noop,
  _checkSymbol: _noop,
  getMarkerCoords: _noop,
  hide: _noop,
  show: _noop,
  hideMarker: _noop,
  setInvisibility: _noop,
  clearVisibility: _noop,
  isVisible: _noop,
  resetCorrection: _noop,
  correctValue: _noop,
  resetValue: _noop,
  setPercentValue: _noop,
  correctCoordinates: _noop,
  coordsIn: _noop,
  getTooltipParams: _noop,
  applyWordWrap: _noop,
  setLabelTrackerData: _noop,
  updateLabelCoord: _noop,
  drawLabel: _noop,
  correctLabelPosition: _noop,
  getMinValue: _noop,
  getMaxValue: _noop,
  _drawErrorBar: _noop,
  getMarkerVisibility: _noop,
  dispose() {
    const that = this;
    that.deleteMarker();
    that.deleteLabel();
    that._errorBar && this._errorBar.dispose();
    that._options = that._styles = that.series = that._errorBar = null;
  },

  getTooltipFormatObject(tooltip, stackPoints) {
    const that = this;
    const tooltipFormatObject = that._getFormatObject(tooltip);
    const sharedTooltipValuesArray = [];
    const tooltipStackPointsFormatObject = [];

    if (stackPoints) {
      stackPoints.forEach((point) => {
        if (!point.isVisible()) return;
        const formatObject = point._getFormatObject(tooltip);
        // @ts-expect-error
        tooltipStackPointsFormatObject.push(formatObject);
        // @ts-expect-error
        sharedTooltipValuesArray.push(`${formatObject.seriesName}: ${formatObject.valueText}`);
      });

      _extend(tooltipFormatObject, {
        points: tooltipStackPointsFormatObject,
        valueText: sharedTooltipValuesArray.join('\n'),
        stackName: that.series.getStackName() || null,
      });
    }

    const aggregationInfo = that.aggregationInfo;
    if (aggregationInfo) {
      const axis = that.series.getArgumentAxis();
      const rangeText = axis.formatRange(
        aggregationInfo.intervalStart,
        aggregationInfo.intervalEnd,
        aggregationInfo.aggregationInterval,
        tooltip.getOptions().argumentFormat,
      );

      if (rangeText) {
        tooltipFormatObject.valueText += `\n${rangeText}`;
      }
    }
    return tooltipFormatObject;
  },

  setHole(holeValue, position) {
    const that = this;
    const minValue = isFinite(that.minValue) ? that.minValue : 0;
    if (_isDefined(holeValue)) {
      if (position === 'left') {
        that.leftHole = that.value - holeValue;
        that.minLeftHole = minValue - holeValue;
      } else {
        that.rightHole = that.value - holeValue;
        that.minRightHole = minValue - holeValue;
      }
    }
  },
  resetHoles() {
    this.leftHole = null;
    this.minLeftHole = null;
    this.rightHole = null;
    this.minRightHole = null;
  },
  getLabel() {
    return this._label;
  },
  getLabels() {
    return [this._label];
  },
  getCenterCoord() {
    return {
      x: this.x,
      y: this.y,
    };
  },
};
