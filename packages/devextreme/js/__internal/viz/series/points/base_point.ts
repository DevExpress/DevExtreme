/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop as _noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined as _isDefined } from '@js/core/utils/type';
import consts from '@ts/viz/components/consts';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import barPoint from '@ts/viz/series/points/bar_point';
import bubblePoint from '@ts/viz/series/points/bubble_point';
import candlestickPoint from '@ts/viz/series/points/candlestick_point';
import type { Label } from '@ts/viz/series/points/label';
import piePoint from '@ts/viz/series/points/pie_point';
import { polarBarPoint, polarSymbolPoint } from '@ts/viz/series/points/polar_point';
import rangeBarPoint from '@ts/viz/series/points/range_bar_point';
import rangeSymbolPoint from '@ts/viz/series/points/range_symbol_point';
import stockPoint from '@ts/viz/series/points/stock_point';
import symbolPoint from '@ts/viz/series/points/symbol_point';

type PointMixin = Record<string, ThemeValue>;

type PointLabel = InstanceType<typeof Label>;

type PointInstance = InstanceType<typeof Point>;

interface PointSeries {
  autoHidePointMarkers?: boolean;
  customizePoint: (point: PointInstance, pointData: ThemeValue) => void;
  getColor: () => string;
  getRenderer: () => ThemeValue;
  getMarkersGroup: () => ThemeValue;
  selectPoint: (point: PointInstance) => void;
  deselectPoint: (point: PointInstance) => void;
  hoverPoint: (point: PointInstance) => void;
  clearPointHover: () => void;
  showPointTooltip: (point: PointInstance) => void;
  hidePointTooltip: (point: PointInstance) => void;
  getVisibleArea: () => ThemeValue;
  getArgumentAxis: () => ThemeValue;
  getValueAxis: () => ThemeValue;
  getStackName: () => ThemeValue;
  _argumentChecker: (value: ThemeValue) => boolean;
  _valueChecker: (value: ThemeValue) => boolean;
}

interface PointCoords {
  x: number;
  y: number;
}

const mixins: Record<string, PointMixin> = {};
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

function isNoneMode(mode: ThemeValue): boolean {
  return _normalizeEnum(mode) === 'none';
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Point = class Point {
  declare fullState: number;

  declare series: PointSeries;

  declare _viewCounters: Record<string, number>;

  declare _emptySettings: Record<string, null>;

  declare argument: ThemeValue;

  declare initialArgument: ThemeValue;

  declare originalArgument: ThemeValue;

  declare tag: ThemeValue;

  declare index: number;

  declare _dataItem: ThemeValue;

  declare data: ThemeValue;

  declare lowError: ThemeValue;

  declare highError: ThemeValue;

  declare aggregationInfo: ThemeValue;

  declare value: ThemeValue;

  declare minValue: ThemeValue;

  declare graphic: ThemeValue;

  declare _label: PointLabel;

  declare _errorBar: ThemeValue;

  declare _options: ThemeValue;

  declare _styles: ThemeValue;

  declare _currentStyle: string;

  declare _needDeletingOnDraw: boolean;

  declare _needClearingOnDraw: boolean;

  declare translated: boolean;

  declare inVisibleArea: boolean;

  declare x: number;

  declare y: number;

  declare minX: number;

  declare minY: number;

  declare defaultX: number;

  declare defaultY: number;

  declare leftHole: number | null;

  declare minLeftHole: number | null;

  declare rightHole: number | null;

  declare minRightHole: number | null;

  declare _updateData: (dataItem: ThemeValue, argumentWasChanged: boolean) => void;

  declare _fillStyle: () => void;

  declare _updateLabelData: () => void;

  declare _updateLabelOptions: (type: string) => void;

  declare _hasGraphic: () => boolean;

  declare _drawMarker: (renderer: ThemeValue, group: ThemeValue, animationEnabled?: boolean, firstDrawing?: boolean) => void;

  declare _updateMarker: (animationEnabled: boolean | undefined, style: ThemeValue, group?: ThemeValue, legendCallback?: ThemeValue) => void;

  declare _drawLabel: () => void;

  declare _translate: () => void;

  declare _getGraphicBBox: (location?: string) => ThemeValue;

  declare _getFormatObject: (tooltip: ThemeValue) => ThemeValue;

  declare clearMarker: () => void;

  declare deleteLabel: () => void;

  declare hasCoords: () => boolean;

  declare correctPosition: (correction: ThemeValue) => void;

  declare correctRadius: (correction: ThemeValue) => void;

  declare correctLabelRadius: (radiusLabels: number) => void;

  declare getCrosshairData: (x: number, y: number) => ThemeValue;

  declare getPointRadius: () => number;

  declare _populatePointShape: (symbol: string, radius: number) => ThemeValue;

  declare _checkSymbol: (oldOptions: ThemeValue, newOptions: ThemeValue) => boolean;

  declare getMarkerCoords: () => ThemeValue;

  declare hide: () => void;

  declare show: () => void;

  declare hideMarker: (type?: string) => void;

  declare setInvisibility: () => void;

  declare clearVisibility: () => void;

  declare isVisible: () => boolean;

  declare resetCorrection: () => void;

  declare correctValue: (correction: number, percent?: number, base?: number) => void;

  declare resetValue: () => void;

  declare setPercentValue: (absTotal: number, total: number, leftHoleTotal?: number, rightHoleTotal?: number) => void;

  declare correctCoordinates: (correctOptions: ThemeValue) => void;

  declare coordsIn: (x: number, y: number) => boolean;

  declare getTooltipParams: (location?: string) => ThemeValue;

  declare applyWordWrap: (moveLabelsFromCenter?: boolean) => void;

  declare setLabelTrackerData: () => void;

  declare updateLabelCoord: (moveLabelsFromCenter?: boolean) => void;

  declare drawLabel: () => void;

  declare correctLabelPosition: (label: PointLabel) => void;

  declare getMinValue: (noErrorBar?: boolean) => ThemeValue;

  declare getMaxValue: (noErrorBar?: boolean) => ThemeValue;

  declare _drawErrorBar: (renderer: ThemeValue, group: ThemeValue, animationEnabled?: boolean) => void;

  declare getMarkerVisibility: () => boolean;

  constructor(series: PointSeries, dataItem: ThemeValue, options: ThemeValue) {
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

  getColor(): string {
    if (!this.hasValue() && !this._styles.usePointCustomOptions) {
      this.series.customizePoint(this, this._dataItem);
    }
    return this._styles.normal.fill || this.series.getColor();
  }

  _getStyle(): ThemeValue {
    return this._styles[this._currentStyle || 'normal'];
  }

  update(dataItem: ThemeValue, options: ThemeValue): void {
    this.updateOptions(options);
    this.updateData(dataItem);
  }

  updateData(dataItem: ThemeValue): void {
    const argumentWasChanged = this.argument !== dataItem.argument;
    this.argument = this.initialArgument = this.originalArgument = dataItem.argument;
    this.tag = dataItem.tag;
    this.index = dataItem.index;

    this._dataItem = dataItem;

    this.data = dataItem.data;

    this.lowError = dataItem.lowError;
    this.highError = dataItem.highError;

    this.aggregationInfo = dataItem.aggregationInfo;

    this._updateData(dataItem, argumentWasChanged);

    !this.hasValue() && this.setInvisibility();

    this._fillStyle();
    this._updateLabelData();
  }

  deleteMarker(): void {
    if (this.graphic) {
      this.graphic.dispose();
    }
    this.graphic = null;
  }

  draw(renderer: ThemeValue, groups: ThemeValue, animationEnabled?: boolean, firstDrawing?: boolean): this {
    if (this._needDeletingOnDraw || (this.series.autoHidePointMarkers && !this.isSelected())) {
      this.deleteMarker();
      this._needDeletingOnDraw = false;
    }
    if (this._needClearingOnDraw) {
      this.clearMarker();
      this._needClearingOnDraw = false;
    }

    if (!this._hasGraphic()) {
      this.getMarkerVisibility() && !this.series.autoHidePointMarkers && this._drawMarker(renderer, groups.markers, animationEnabled, firstDrawing);
    } else {
      this._updateMarker(animationEnabled, this._getStyle(), groups.markers);
    }

    this._drawLabel();

    this._drawErrorBar(renderer, groups.errorBars, animationEnabled);
    return this;
  }

  _getViewStyle(): string {
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
  }

  applyView(legendCallback?: ThemeValue): void {
    const style = this._getViewStyle();
    this._currentStyle = style;
    if (!this.graphic && this.getMarkerVisibility() && this.series.autoHidePointMarkers && (style === SELECTION || style === HOVER)) {
      this._drawMarker(this.series.getRenderer(), this.series.getMarkersGroup());
    }
    if (this.graphic) {
      if (this.series.autoHidePointMarkers && style !== SELECTION && style !== HOVER) {
        this.deleteMarker();
      } else {
        if (style === 'normal') {
          this.clearMarker();
        } else {
          this.graphic.toForeground();
        }
        this._updateMarker(true, this._styles[style], undefined, legendCallback);
      }
    }
  }

  setView(style: string): void {
    this._viewCounters[style]++;
    this.applyView();
  }

  resetView(style: string): void {
    const viewCounters = this._viewCounters;

    --viewCounters[style];
    if (viewCounters[style] < 0) { // T661080
      viewCounters[style] = 0;
    }
    this.applyView();
  }

  releaseHoverState(): void {
    if (this.graphic && !this.isSelected()) {
      this.graphic.toBackground();
    }
  }

  select(): void {
    this.series.selectPoint(this);
  }

  clearSelection(): void {
    this.series.deselectPoint(this);
  }

  hover(): void {
    this.series.hoverPoint(this);
  }

  clearHover(): void {
    this.series.clearPointHover();
  }

  showTooltip(): void {
    this.series.showPointTooltip(this);
  }

  hideTooltip(): void {
    this.series.hidePointTooltip(this);
  }

  _checkLabelsChanging(oldType: string, newType: string): number | boolean {
    const isNewRange = ~newType.indexOf('range');
    const isOldRange = ~oldType.indexOf('range');

    return (isOldRange && !isNewRange) || (!isOldRange && isNewRange);
  }

  updateOptions(newOptions: ThemeValue): void {
    if (!newOptions) {
      return;
    }

    const oldOptions = this._options;
    const widgetType = newOptions.widgetType;
    const oldType = oldOptions && oldOptions.type;
    const newType = newOptions.type;
    const newPointTypeMixin = pointTypes[widgetType][newType];

    if (oldType !== newType) {
      this._needDeletingOnDraw = true;
      this._needClearingOnDraw = false;

      if (oldType) {
        this._checkLabelsChanging(oldType, newType) && this.deleteLabel();
        this._resetType(mixins[pointTypes[oldType]]);
      }
      this._setType(mixins[newPointTypeMixin]);
    } else {
      this._needDeletingOnDraw = this._needDeletingOnDraw || this._checkSymbol(oldOptions, newOptions);
      this._needClearingOnDraw = this._checkCustomize(oldOptions, newOptions);
    }

    this._options = newOptions;

    this._fillStyle();
    this._updateLabelOptions(newPointTypeMixin);
  }

  translate(): void {
    if (this.hasValue()) {
      this._translate();
      this.translated = true;
    }
  }

  _checkCustomize(oldOptions: ThemeValue, newOptions: ThemeValue): boolean {
    return oldOptions.styles.usePointCustomOptions && !newOptions.styles.usePointCustomOptions;
  }

  _getCustomLabelVisibility(): boolean | null {
    return this._styles.useLabelCustomOptions ? !!this._options.label.visible : null;
  }

  getBoundingRect(): ThemeValue {
    return this._getGraphicBBox();
  }

  _resetType(methods: PointMixin | undefined): void {
    for (const methodName in methods) {
      delete this[methodName];
    }
  }

  _setType(methods: PointMixin): void {
    for (const methodName in methods) {
      this[methodName] = methods[methodName];
    }
  }

  isInVisibleArea(): boolean {
    return this.inVisibleArea;
  }

  isSelected(): boolean {
    return !!(this.fullState & SELECTED_STATE);
  }

  isHovered(): boolean {
    return !!(this.fullState & HOVER_STATE);
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  animate(complete: (() => void) | undefined, settings: ThemeValue, partitionDuration?: number): void {
    if (!this.graphic) {
      complete && complete();
      return;
    }
    this.graphic.animate(settings, { partitionDuration }, complete);
  }

  getCoords(min?: boolean): PointCoords {
    if (!min) {
      return { x: this.x, y: this.y };
    }

    if (!this._options.rotated) {
      return { x: this.x, y: this.minY + (this.y - this.minY ? 0 : 1) };
    }

    return { x: this.minX - (this.x - this.minX ? 0 : 1), y: this.y };
  }

  getDefaultCoords(): PointCoords {
    return !this._options.rotated ? { x: this.x, y: this.defaultY } : { x: this.defaultX, y: this.y };
  }

  setDefaultCoords(): void {
    const coords = this.getDefaultCoords();

    this.x = coords.x;
    this.y = coords.y;
  }

  _getVisibleArea(): ThemeValue {
    return this.series.getVisibleArea();
  }

  _getArgTranslator(): ThemeValue {
    return this.series.getArgumentAxis().getTranslator();
  }

  _getValTranslator(): ThemeValue {
    return this.series.getValueAxis().getTranslator();
  }

  isArgumentCorrect(): boolean {
    return this.series._argumentChecker(this.argument);
  }

  isValueCorrect(): boolean {
    const valueChecker = this.series._valueChecker;
    return valueChecker(this.getMinValue()) && valueChecker(this.getMaxValue());
  }

  hasValue(): boolean {
    return this.value !== null && this.minValue !== null && this.isArgumentCorrect() && this.isValueCorrect();
  }

  dispose(): void {
    this.deleteMarker();
    this.deleteLabel();
    this._errorBar && this._errorBar.dispose();
    // @ts-expect-error dispose() drops the references
    this._options = this._styles = this.series = this._errorBar = null;
  }

  getTooltipFormatObject(tooltip: ThemeValue, stackPoints?: PointInstance[]): ThemeValue {
    const tooltipFormatObject = this._getFormatObject(tooltip);
    const sharedTooltipValuesArray: string[] = [];
    const tooltipStackPointsFormatObject: ThemeValue[] = [];

    if (stackPoints) {
      stackPoints.forEach((point) => {
        if (!point.isVisible()) return;
        const formatObject = point._getFormatObject(tooltip);
        tooltipStackPointsFormatObject.push(formatObject);
        sharedTooltipValuesArray.push(`${formatObject.seriesName}: ${formatObject.valueText}`);
      });

      _extend(tooltipFormatObject, {
        points: tooltipStackPointsFormatObject,
        valueText: sharedTooltipValuesArray.join('\n'),
        stackName: this.series.getStackName() || null,
      });
    }

    const aggregationInfo = this.aggregationInfo;
    if (aggregationInfo) {
      const axis = this.series.getArgumentAxis();
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
  }

  setHole(holeValue: ThemeValue, position: string): void {
    const minValue = isFinite(this.minValue) ? this.minValue : 0;
    if (_isDefined(holeValue)) {
      if (position === 'left') {
        this.leftHole = this.value - holeValue;
        this.minLeftHole = minValue - holeValue;
      } else {
        this.rightHole = this.value - holeValue;
        this.minRightHole = minValue - holeValue;
      }
    }
  }

  resetHoles(): void {
    this.leftHole = null;
    this.minLeftHole = null;
    this.rightHole = null;
    this.minRightHole = null;
  }

  getLabel(): PointLabel {
    return this._label;
  }

  getLabels(): PointLabel[] {
    return [this._label];
  }

  getCenterCoord(): PointCoords {
    return {
      x: this.x,
      y: this.y,
    };
  }
};
mixins.symbolPoint = symbolPoint;
mixins.barPoint = barPoint;
mixins.bubblePoint = bubblePoint;
mixins.piePoint = piePoint;
mixins.rangeSymbolPoint = rangeSymbolPoint;
mixins.rangeBarPoint = rangeBarPoint;
mixins.candlestickPoint = candlestickPoint;
mixins.stockPoint = stockPoint;
mixins.polarSymbolPoint = polarSymbolPoint;
mixins.polarBarPoint = polarBarPoint;

Object.assign(Point.prototype, {
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
});

/// #DEBUG
export function DEBUG_set_Point(value: typeof Point): void {
  Point = value;
}
/// #ENDDEBUG
