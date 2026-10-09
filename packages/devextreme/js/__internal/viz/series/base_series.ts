/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { applyDataTypePreset } from '@ts/core/global_format_config';
import { paintedColor } from '@ts/core/utils/css_variables';
import { noop as _noop } from '@ts/core/utils/m_common';
import { extend as _extend } from '@ts/core/utils/m_extend';
import { each as _each } from '@ts/core/utils/m_iterator';
import { isDefined as _isDefined, isEmptyObject as _isEmptyObject, isFunction } from '@ts/core/utils/m_type';
import consts from '@ts/viz/components/consts';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';

import * as areaSeries from './area_series';
import * as barSeries from './bar_series';
import { chart as bubbleSeriesChart } from './bubble_series';
import * as financialSeries from './financial_series';
import rangeCalculator from './helpers/range_data_calculator';
import * as lineSeries from './line_series';
import * as pieSeries from './pie_series';
import { Point } from './points/base_point';
import { chart as rangeSeriesChart } from './range_series';
import * as scatterSeries from './scatter_series';
import * as stackedSeries from './stacked_series';

type SeriesPoint = InstanceType<typeof Point>;

type LegendCallback = (item?: ThemeValue) => void;

type ValueChecker = (value?: ThemeValue) => boolean;

interface SeriesSettings {
  renderer: ThemeValue;
  seriesGroup?: ThemeValue;
  labelsGroup?: ThemeValue;
  eventTrigger?: ThemeValue;
  eventPipe?: ThemeValue;
  incidentOccurred: ThemeValue;
  commonSeriesModes?: ThemeValue;
  valueAxis?: ThemeValue;
  argumentAxis?: ThemeValue;
}

interface SeriesLegendStyles {
  normal: ThemeValue;
  hover: ThemeValue;
  selection: ThemeValue;
}

interface SeriesStyles {
  labelColor: string;
  normal: ThemeValue;
  hover: ThemeValue;
  selection: ThemeValue;
  legendStyles: SeriesLegendStyles;
}

interface BusinessRange {
  arg: ThemeValue;
  val: ThemeValue;
}

interface DrawPointOptions {
  point: SeriesPoint;
  groups: ThemeValue;
  hasAnimation: boolean;
  firstDrawing: boolean;
}

const seriesNS: Record<string, ThemeValue> = {};
const states = consts.states;

const DISCRETE = 'discrete';
const SELECTED_STATE = states.selectedMark;
const HOVER_STATE = states.hoverMark;
const HOVER = states.hover;
const NORMAL = states.normal;
const SELECTION = states.selection;
const APPLY_SELECTED = states.applySelected;
const APPLY_HOVER = states.applyHover;
const RESET_ITEM = states.resetItem;
const NONE_MODE = 'none';
const INCLUDE_POINTS = 'includepoints';
const NEAREST_POINT = 'nearestpoint';
const SERIES_SELECTION_CHANGED = 'seriesSelectionChanged';
const POINT_SELECTION_CHANGED = 'pointSelectionChanged';
const SERIES_HOVER_CHANGED = 'seriesHoverChanged';
const POINT_HOVER_CHANGED = 'pointHoverChanged';
const ALL_SERIES_POINTS = 'allseriespoints';
const ALL_ARGUMENT_POINTS = 'allargumentpoints';
const POINT_HOVER = 'pointHover';
const CLEAR_POINT_HOVER = 'clearPointHover';
const SERIES_SELECT = 'seriesSelect';
const POINT_SELECT = 'pointSelect';
const POINT_DESELECT = 'pointDeselect';
const getEmptyBusinessRange = function (): BusinessRange {
  return { arg: {}, val: {} };
};

function triggerEvent(element: ThemeValue, event: string, point?: SeriesPoint): void {
  element && element.trigger(event, point);
}
seriesNS.mixins = {
  chart: {},
  pie: {},
  polar: {},
};
seriesNS.mixins.chart.scatter = scatterSeries.chart;
seriesNS.mixins.polar.scatter = scatterSeries.polar;
_extend(seriesNS.mixins.pie, pieSeries);
_extend(
  seriesNS.mixins.chart,
  lineSeries.chart,
  areaSeries.chart,
  barSeries.chart,
  rangeSeriesChart,
  bubbleSeriesChart,
  financialSeries,
  stackedSeries.chart,
);
_extend(seriesNS.mixins.polar, lineSeries.polar, areaSeries.polar, barSeries.polar, stackedSeries.polar);

function includePointsMode(mode: ThemeValue): boolean {
  mode = _normalizeEnum(mode);

  return mode === INCLUDE_POINTS || mode === ALL_SERIES_POINTS;
}

function getLabelOptions(labelOptions: ThemeValue, defaultColor: string): ThemeValue {
  const opt = labelOptions || {};
  const labelFont = _extend({}, opt.font) || {};
  const labelBorder = opt.border || {};
  const labelConnector = opt.connector || {};
  const backgroundAttr = {
    fill: opt.backgroundColor || defaultColor,
    'stroke-width': labelBorder.visible ? labelBorder.width || 0 : 0,
    stroke: labelBorder.visible && labelBorder.width ? labelBorder.color : 'none',
    dashStyle: labelBorder.dashStyle,
  };
  const connectorAttr = {
    stroke: labelConnector.visible && labelConnector.width ? labelConnector.color || defaultColor : 'none',
    'stroke-width': labelConnector.visible ? labelConnector.width || 0 : 0,
  };

  labelFont.color = opt.backgroundColor === 'none' && _normalizeEnum(labelFont.color) === '#ffffff' && opt.position !== 'inside' ? defaultColor : labelFont.color;

  return {
    alignment: opt.alignment,
    format: opt.format,
    argumentFormat: opt.argumentFormat,
    customizeText: isFunction(opt.customizeText) ? opt.customizeText : undefined,
    attributes: { font: labelFont },
    visible: labelFont.size !== 0 ? opt.visible : false,
    showForZeroValues: opt.showForZeroValues,
    horizontalOffset: opt.horizontalOffset,
    verticalOffset: opt.verticalOffset,
    radialOffset: opt.radialOffset,
    background: backgroundAttr,
    position: opt.position,
    connector: connectorAttr,
    rotationAngle: opt.rotationAngle,
    wordWrap: opt.wordWrap,
    textOverflow: opt.textOverflow,
    cssClass: opt.cssClass,
    displayFormat: opt.displayFormat,
  };
}

function setPointHoverState(point: SeriesPoint, legendCallback: LegendCallback): void {
  point.fullState |= HOVER_STATE;
  point.applyView(legendCallback);
}

function releasePointHoverState(point: SeriesPoint, legendCallback: LegendCallback): void {
  point.fullState &= ~HOVER_STATE;
  point.applyView(legendCallback);
  point.releaseHoverState();
}

function setPointSelectedState(point: SeriesPoint, legendCallback: LegendCallback): void {
  point.fullState |= SELECTED_STATE;
  point.applyView(legendCallback);
}

function releasePointSelectedState(point: SeriesPoint, legendCallback: LegendCallback): void {
  point.fullState &= ~SELECTED_STATE;
  point.applyView(legendCallback);
}

function mergePointOptionsCore(base: ThemeValue, extra: ThemeValue): ThemeValue {
  const options = _extend({}, base, extra);
  options.border = _extend({}, base && base.border, extra && extra.border);
  return options;
}

function mergePointOptions(base: ThemeValue, extra: ThemeValue): ThemeValue {
  const options = mergePointOptionsCore(base, extra);
  options.image = _extend(true, {}, base.image, extra.image);
  options.selectionStyle = mergePointOptionsCore(base.selectionStyle, extra.selectionStyle);
  options.hoverStyle = mergePointOptionsCore(base.hoverStyle, extra.hoverStyle);
  return options;
}

function getData(pointData: ThemeValue): ThemeValue {
  return pointData.data;
}

function getValueChecker(axisType: string, axis: ThemeValue): ValueChecker {
  if (!axis || axisType !== 'logarithmic' || axis.getOptions().allowNegatives !== false) {
    return () => true;
  } else {
    return (value) => value > 0;
  }
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Series = class Series {
  declare fullState: number;

  declare _extGroups: SeriesSettings;

  declare _renderer: ThemeValue;

  declare _group: ThemeValue;

  declare _eventTrigger: (name: string, args: ThemeValue) => void;

  declare _eventPipe: (data: ThemeValue) => void;

  declare _incidentOccurred: (id: string, args?: ThemeValue[]) => void;

  declare _legendCallback: LegendCallback;

  declare type: string;

  declare isUpdated: boolean;

  declare _firstDrawing: boolean;

  declare _options: ThemeValue;

  declare _pointOptions: ThemeValue;

  declare name: string;

  declare pane: string;

  declare tag: ThemeValue;

  declare _seriesModes: ThemeValue;

  declare _valueAxis: ThemeValue;

  declare axis: string | undefined;

  declare _argumentAxis: ThemeValue;

  declare _stackName: string | null;

  declare _visible: boolean;

  declare stack: ThemeValue;

  declare barOverlapGroup: ThemeValue;

  declare _processEmptyValue: (value: ThemeValue) => ThemeValue;

  declare argumentType: string;

  declare valueType: string;

  declare argumentAxisType: string;

  declare valueAxisType: string;

  declare showZero: boolean;

  declare _canRenderCompleteHandle?: boolean;

  declare _data: ThemeValue[];

  declare _useAllAggregatedPoints: boolean;

  declare pointsByArgument: Record<string, SeriesPoint[]>;

  declare _points: SeriesPoint[];

  declare _drawnPoints: SeriesPoint[];

  declare _segments: SeriesPoint[][];

  declare _graphics: ThemeValue;

  declare _trackers: ThemeValue;

  declare _markersGroup: ThemeValue;

  declare _errorBarGroup: ThemeValue;

  declare _labelsGroup: ThemeValue;

  declare _elementsGroup: ThemeValue;

  declare _bordersGroup: ThemeValue;

  declare _trackersGroup: ThemeValue;

  declare _isAllPointsTranslated: boolean;

  declare _resetApplyingAnimation: boolean;

  declare lastSelectionMode: string;

  declare lastHoverMode: string;

  declare _nearestPoint: SeriesPoint | null;

  declare _paneClipRectID: ThemeValue;

  declare _widePaneClipRectID: ThemeValue;

  declare _forceClipping: boolean;

  declare _clipLabels: boolean;

  declare _styles: SeriesStyles;

  declare _rangeData: ThemeValue;

  declare _prevSeries: ThemeValue;

  declare autoHidePointMarkers?: boolean;

  declare _aggregators: Record<string, (aggregationInfo: ThemeValue, series: ThemeValue) => ThemeValue>;

  declare _defaultAggregator: string;

  declare _parseStyle: (options: ThemeValue, defaultColor: string, defaultBorderColor?: string) => ThemeValue;

  declare _getCreatingPointOptions: (data: ThemeValue, dataIndex?: number) => ThemeValue;

  declare _updateOptions: (options: ThemeValue) => void;

  declare _createGroups: () => void;

  declare _getPointDataSelector: () => (data: ThemeValue, options?: ThemeValue) => ThemeValue;

  declare _endUpdateData: () => void;

  declare _calculateErrorBars: (data: ThemeValue[]) => void;

  declare _checkData: (data: ThemeValue, skippedFields?: ThemeValue, fieldsToCheck?: ThemeValue) => boolean;

  declare _removeElement: (element: ThemeValue) => void;

  declare _drawPoint: (options: DrawPointOptions) => void;

  declare _drawSegment: (points: SeriesPoint[], animationEnabled: boolean, segmentCount: number, lastSegment: boolean) => void;

  declare _animate: (firstDrawing?: boolean) => void;

  declare _appendInGroup: () => void;

  declare _setGroupsSettings: (animationEnabled: boolean, firstDrawing: boolean) => void;

  declare _applyStyle: (style: ThemeValue) => void;

  declare _applyVisibleArea: () => void;

  declare _applyElementsClipRect: (settings: Record<string, ThemeValue>) => void;

  declare _applyClearingSettings: (settings: Record<string, ThemeValue>) => void;

  declare _getRangeData: () => ThemeValue;

  declare _getOptionsForPoint: () => ThemeValue;

  declare _createPointStyles: (pointOptions: ThemeValue, data?: ThemeValue, point?: SeriesPoint) => ThemeValue;

  declare _patchMarginOptions: (options: ThemeValue) => ThemeValue;

  declare getVisibleArea: () => ThemeValue;

  declare _createLegendState: (styleOptions: ThemeValue, defaultColor: string) => ThemeValue;

  declare getValueFields: () => string[];

  declare getSizeField: () => string;

  declare getArgumentField: () => string;

  declare autoHidePointMarkersEnabled: () => boolean;

  declare usePointsToDefineAutoHiding: () => boolean;

  declare _updatePointsVisibility: () => void;

  declare correctPosition: (correction: ThemeValue, canvas: ThemeValue) => void;

  declare drawTrackers: () => void;

  declare getNeighborPoint: (x: number, y: number) => SeriesPoint | null | undefined;

  declare areErrorBarsVisible: () => boolean;

  declare _getColorId: (options: ThemeValue) => ThemeValue;

  constructor(settings: SeriesSettings, options: ThemeValue) {
    this.fullState = 0;
    this._extGroups = settings;
    this._renderer = settings.renderer;
    this._group = settings.renderer.g().attr({ class: 'dxc-series' });
    this._eventTrigger = settings.eventTrigger;
    this._eventPipe = settings.eventPipe;
    this._incidentOccurred = settings.incidentOccurred;

    this._legendCallback = _noop;
    this.updateOptions(options, settings);
  }

  getLegendStyles(): SeriesLegendStyles {
    return this._styles.legendStyles;
  }

  _createStyles(options: ThemeValue): void {
    const mainSeriesColor = options.mainSeriesColor;
    const colorId = this._getColorId(options);
    const hoverStyle = options.hoverStyle || {};
    const selectionStyle = options.selectionStyle || {};

    if (colorId) {
      this._turnOffHatching(hoverStyle, selectionStyle);
    }

    this._styles = {
      labelColor: mainSeriesColor,
      normal: this._parseStyle(options, mainSeriesColor, mainSeriesColor),
      hover: this._parseStyle(hoverStyle, colorId || mainSeriesColor, mainSeriesColor),
      selection: this._parseStyle(selectionStyle, colorId || mainSeriesColor, mainSeriesColor),
      legendStyles: {
        normal: this._createLegendState(options, colorId || mainSeriesColor),
        hover: this._createLegendState(hoverStyle, colorId || mainSeriesColor),
        selection: this._createLegendState(selectionStyle, colorId || mainSeriesColor),
      },
    };
  }

  setClippingParams(baseId: ThemeValue, wideId: ThemeValue, forceClipping: boolean, clipLabels = true): void {
    this._paneClipRectID = baseId;
    this._widePaneClipRectID = wideId;
    this._forceClipping = forceClipping;
    this._clipLabels = clipLabels;
  }

  applyClip(): void {
    this._group.attr({ 'clip-path': this._paneClipRectID });
  }

  resetClip(): void {
    this._group.attr({ 'clip-path': null });
  }

  getTagField(): string { return this._options.tagField || 'tag'; }

  getPoints(): SeriesPoint[] {
    return this._points;
  }

  getPointsInViewPort(): ThemeValue {
    return rangeCalculator.getPointsInViewPort(this);
  }

  _createPoint(data: ThemeValue, index: number, oldPoint?: SeriesPoint): SeriesPoint {
    data.index = index;
    const pointsByArgument = this.pointsByArgument;
    const options = this._getCreatingPointOptions(data);
    const arg = data.argument.valueOf();
    let point = oldPoint;

    if (point) {
      point.update(data, options);
    } else {
      point = new Point(this, data, options);
      if (this.isSelected() && includePointsMode(this.lastSelectionMode)) {
        point.setView(SELECTION);
      }
    }

    const pointByArgument = pointsByArgument[arg];
    if (pointByArgument) {
      pointByArgument.push(point);
    } else {
      pointsByArgument[arg] = [point];
    }

    if (point.hasValue()) {
      this.customizePoint(point, data);
    }
    return point;
  }

  getRangeData(): ThemeValue {
    return this._visible ? this._getRangeData() : getEmptyBusinessRange();
  }

  getArgumentRange(): ThemeValue {
    return this._visible ? rangeCalculator.getArgumentRange(this) : getEmptyBusinessRange();
  }

  getViewport(): ThemeValue {
    return rangeCalculator.getViewport(this);
  }

  _deleteGroup(groupName: string): void {
    const group = this[groupName];
    if (group) {
      group.dispose();
      this[groupName] = null;
    }
  }

  updateOptions(newOptions: ThemeValue, settings?: SeriesSettings): void {
    const widgetType = newOptions.widgetType;
    const oldType = this.type;
    const newType = newOptions.type;

    this.type = newType && _normalizeEnum(newType.toString());

    if (!this._checkType(widgetType) || this._checkPolarBarType(widgetType, newOptions)) {
      this.dispose();
      this.isUpdated = false;
      return;
    }

    if (oldType !== this.type) {
      this._firstDrawing = true;
      this._resetType(oldType, widgetType);
      this._setType(this.type, widgetType);
    } else {
      this._defineDrawingState();
    }

    this._options = newOptions;
    this._pointOptions = null;

    this.name = newOptions.name;
    this.pane = newOptions.pane;

    this.tag = newOptions.tag;

    if (settings) {
      this._seriesModes = settings.commonSeriesModes || this._seriesModes;
      this._valueAxis = settings.valueAxis || this._valueAxis;
      this.axis = this._valueAxis && this._valueAxis.name;
      this._argumentAxis = settings.argumentAxis || this._argumentAxis;
    }

    this._createStyles(newOptions);

    this._stackName = null;

    this._updateOptions(newOptions);

    this._visible = newOptions.visible;
    this.isUpdated = true;

    this.stack = newOptions.stack;
    this.barOverlapGroup = newOptions.barOverlapGroup;

    this._createGroups();

    this._processEmptyValue = newOptions.ignoreEmptyPoints ? (x): ThemeValue => (x === null ? undefined : x) : (x): ThemeValue => x;
  }

  _defineDrawingState(): void {
    this._firstDrawing = true;
  }

  _disposePoints(points: SeriesPoint[] | null | undefined): void {
    _each(points || [], (_, p) => {
      p.dispose();
    });
  }

  updateDataType(settings: ThemeValue): this {
    this.argumentType = settings.argumentType;
    this.valueType = settings.valueType;
    this.argumentAxisType = settings.argumentAxisType;
    this.valueAxisType = settings.valueAxisType;
    this.showZero = settings.showZero;
    this._argumentChecker = getValueChecker(settings.argumentAxisType, this.getArgumentAxis());
    this._valueChecker = getValueChecker(settings.valueAxisType, this.getValueAxis());

    return this;
  }

  _argumentChecker(): boolean {
    return true;
  }

  _valueChecker(): boolean {
    return true;
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  _getOldPoint(data: ThemeValue, oldPointsByArgument: Record<string, SeriesPoint[]>, index: number): SeriesPoint | undefined {
    const arg = data.argument && data.argument.valueOf();
    const point = (oldPointsByArgument[arg] || [])[0];

    if (point) {
      oldPointsByArgument[arg].splice(0, 1);
    }

    return point;
  }

  updateData(data: ThemeValue): void {
    const options = this._options;
    const nameField = options.nameField;

    data = data || [];

    if (data.length) {
      this._canRenderCompleteHandle = true;
    }

    const dataSelector = this._getPointDataSelector();
    let itemsWithoutArgument = 0;

    this._data = data.reduce((data, dataItem, index) => {
      const pointDataItem = dataSelector(dataItem);
      if (_isDefined(pointDataItem.argument)) {
        if (!nameField || dataItem[nameField] === options.nameFieldValue) {
          pointDataItem.index = index;
          data.push(pointDataItem);
        }
      } else {
        itemsWithoutArgument++;
      }
      return data;
    }, []);

    if (itemsWithoutArgument && itemsWithoutArgument === data.length) {
      this._incidentOccurred('W2002', [this.name, this.getArgumentField()]);
    }
    this._endUpdateData();
  }

  _getData(): ThemeValue {
    let data = this._data || [];

    if (this.useAggregation()) {
      const aggregateByCategory = this.argumentAxisType === DISCRETE;

      const argumentRange = aggregateByCategory ? {} : this.getArgumentRange();
      const aggregationInfo = aggregateByCategory ? {} : this.getArgumentAxis().getAggregationInfo(this._useAllAggregatedPoints, argumentRange);

      data = this._resample(aggregationInfo, data);
    }

    return data;
  }

  useAggregation(): boolean {
    const aggregation = this.getOptions().aggregation;

    return aggregation && aggregation.enabled;
  }

  createPoints(useAllAggregatedPoints?: boolean): void {
    this._normalizeUsingAllAggregatedPoints(useAllAggregatedPoints);
    this._createPoints();
  }

  _normalizeUsingAllAggregatedPoints(useAllAggregatedPoints?: boolean): void {
    this._useAllAggregatedPoints = this.useAggregation() && (this.argumentAxisType === DISCRETE || ((this._data || []).length > 1 && !!useAllAggregatedPoints));
  }

  _createPoints(): void {
    const oldPointsByArgument = this.pointsByArgument || {};
    const data = this._getData();

    this.pointsByArgument = {};

    this._calculateErrorBars(data);

    const skippedFields = {};
    const points = data.reduce((points, pointDataItem) => {
      if (this._checkData(pointDataItem, skippedFields)) {
        const pointIndex = points.length;
        const oldPoint = this._getOldPoint(pointDataItem, oldPointsByArgument, pointIndex);
        const point = this._createPoint(pointDataItem, pointIndex, oldPoint);

        points.push(point);
      }
      return points;
    }, []);

    for (const field in skippedFields) {
      if (skippedFields[field] === data.length) {
        this._incidentOccurred('W2002', [this.name, field]);
      }
    }
    Object.keys(oldPointsByArgument).forEach((key) => this._disposePoints(oldPointsByArgument[key]));

    this._points = points;
  }

  _removeOldSegments(): void {
    const startIndex = this._segments.length;

    _each(this._graphics.splice(startIndex, this._graphics.length) || [], (_, elem) => {
      this._removeElement(elem);
    });
    if (this._trackers) {
      _each(this._trackers.splice(startIndex, this._trackers.length) || [], (_, elem) => {
        elem.remove();
      });
    }
  }

  _prepareSegmentsPosition(): void {
    const points = this._points || [];
    const isCloseSegment = points[0] && points[0].hasValue() && this._options.closed;
    const segments = points.reduce((segments: ThemeValue, p) => {
      const segment = segments.at(-1);

      if (!p.translated) {
        p.setDefaultCoords();
      }

      if (p.hasValue() && p.hasCoords()) {
        segment.push(p);
      } else if (!p.hasValue() && segment.length) {
        segments.push([]);
      }

      return segments;
    }, [[]]);

    this._drawSegments(segments, isCloseSegment, false);
  }

  _drawElements(animationEnabled: boolean, firstDrawing: boolean): void {
    const points = this._points || [];
    const isCloseSegment = points[0] && points[0].hasValue() && this._options.closed;
    const groupForPoint = {
      markers: this._markersGroup,
      errorBars: this._errorBarGroup,
    };

    this._drawnPoints = [];
    this._graphics = this._graphics || [];
    this._segments = [];

    const segments = points.reduce((segments: ThemeValue, p) => {
      const segment = segments.at(-1);

      if (p.hasValue() && p.hasCoords()) {
        this._drawPoint({
          point: p, groups: groupForPoint, hasAnimation: animationEnabled, firstDrawing,
        });
        segment.push(p);
      } else if (!p.hasValue()) {
        segment.length && segments.push([]);
      } else {
        p.setInvisibility();
      }

      return segments;
    }, [[]]);

    this._drawSegments(segments, isCloseSegment, animationEnabled);
    this._firstDrawing = !points.length;
    this._removeOldSegments();
    animationEnabled && this._animate(firstDrawing);
  }

  _drawSegments(segments: SeriesPoint[][], closeSegment: boolean, animationEnabled: boolean): void {
    segments.forEach((segment, index) => {
      if (segment.length) {
        const lastSegment = closeSegment && index === segments.length - 1;

        this._drawSegment(segment, animationEnabled, index, lastSegment);
      }
    });
  }

  draw(animationEnabled: boolean, hideLayoutLabels?: boolean, legendCallback?: LegendCallback): void {
    const firstDrawing = this._firstDrawing;

    this._legendCallback = legendCallback || this._legendCallback;

    if (!this._visible) {
      this._group.remove();
      return;
    }

    this._appendInGroup();

    if (!this._isAllPointsTranslated) {
      this.prepareCoordinatesForPoints();
    }

    this._setGroupsSettings(animationEnabled, firstDrawing);
    !firstDrawing && !this._resetApplyingAnimation && this._prepareSegmentsPosition();
    this._drawElements(animationEnabled, firstDrawing);
    hideLayoutLabels && this.hideLabels();

    if (this.isSelected()) {
      this._changeStyle(this.lastSelectionMode, undefined, true);
    } else if (this.isHovered()) {
      this._changeStyle(this.lastHoverMode, undefined, true);
    } else {
      this._applyStyle(this._styles.normal);
    }
    this._isAllPointsTranslated = false;
    this._resetApplyingAnimation = false;
  }

  _translatePoints(): void {
    const points = this._points ?? [];

    points.forEach((p) => {
      p.translate();
    });
  }

  prepareCoordinatesForPoints(): void {
    this._applyVisibleArea();
    this._translatePoints();
    this._isAllPointsTranslated = true;
  }

  _setLabelGroupSettings(animationEnabled: boolean): void {
    const settings: Record<string, ThemeValue> = { class: 'dxc-labels', 'pointer-events': 'none' };
    this._clipLabels && this._applyElementsClipRect(settings);
    this._applyClearingSettings(settings);
    animationEnabled && (settings.opacity = 0.001);
    this._labelsGroup.attr(settings).append(this._extGroups.labelsGroup);
  }

  _checkType(widgetType: string): boolean {
    return !!seriesNS.mixins[widgetType][this.type];
  }

  _checkPolarBarType(widgetType: string, options: ThemeValue): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    return widgetType === 'polar' && options.spiderWidget && this.type.indexOf('bar') !== -1;
  }

  _resetType(seriesType: string | undefined, widgetType: string): void {
    let methodName;
    let methods;

    if (seriesType) {
      methods = seriesNS.mixins[widgetType][seriesType];
      for (methodName in methods) {
        delete this[methodName];
      }
    }
  }

  _setType(seriesType: string, widgetType: string): void {
    let methodName;
    const methods = seriesNS.mixins[widgetType][seriesType];

    for (methodName in methods) {
      this[methodName] = methods[methodName];
    }
  }

  _setPointsView(view: string, target?: SeriesPoint): void {
    this.getPoints().forEach((point) => {
      if (target !== point) {
        point.setView(view);
      }
    });
  }

  _resetPointsView(view: string, target?: SeriesPoint): void {
    this.getPoints().forEach((point) => {
      if (target !== point) {
        point.resetView(view);
      }
    });
  }

  _resetNearestPoint(): void {
    this._nearestPoint && this._nearestPoint.series !== null && this._nearestPoint.resetView(HOVER);
    this._nearestPoint = null;
  }

  _setSelectedState(mode?: string): void {
    this.lastSelectionMode = _normalizeEnum(mode || this._options.selectionMode);

    this.fullState |= SELECTED_STATE;

    this._resetNearestPoint();
    this._changeStyle(this.lastSelectionMode);

    if (this.lastSelectionMode !== NONE_MODE && this.isHovered() && includePointsMode(this.lastHoverMode)) {
      this._resetPointsView(HOVER);
    }
  }

  _releaseSelectedState(): void {
    this.fullState &= ~SELECTED_STATE;

    this._changeStyle(this.lastSelectionMode, SELECTION);

    if (this.lastSelectionMode !== NONE_MODE && this.isHovered() && includePointsMode(this.lastHoverMode)) {
      this._setPointsView(HOVER);
    }
  }

  isFullStackedSeries(): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    return this.type.indexOf('fullstacked') === 0;
  }

  isStackedSeries(): boolean {
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    return this.type.indexOf('stacked') === 0;
  }

  resetApplyingAnimation(isFirstDrawing?: boolean): void {
    this._resetApplyingAnimation = true;
    if (isFirstDrawing) {
      this._firstDrawing = true;
    }
  }

  isFinancialSeries(): boolean {
    return this.type === 'stock' || this.type === 'candlestick';
  }

  _canChangeView(): boolean {
    return !this.isSelected() && _normalizeEnum(this._options.hoverMode) !== NONE_MODE;
  }

  _changeStyle(mode: string, resetView?: string, skipPoints?: boolean): void {
    let state = this.fullState;
    const styles = [NORMAL, HOVER, SELECTION, SELECTION];

    if (this.lastHoverMode === 'none') {
      state &= ~HOVER_STATE;
    }

    if (this.lastSelectionMode === 'none') {
      state &= ~SELECTED_STATE;
    }

    if (includePointsMode(mode) && !skipPoints) {
      if (!resetView) {
        this._setPointsView(styles[state]);
      } else {
        this._resetPointsView(resetView);
      }
    }

    this._legendCallback([RESET_ITEM, APPLY_HOVER, APPLY_SELECTED, APPLY_SELECTED][state]);
    this._applyStyle(this._styles[styles[state]]);
  }

  updateHover(x: number, y: number): void {
    const currentNearestPoint = this._nearestPoint;
    const point = this.isHovered() && this.lastHoverMode === NEAREST_POINT && this.getNeighborPoint(x, y);

    if (point !== currentNearestPoint && !(this.isSelected() && this.lastSelectionMode !== NONE_MODE)) {
      this._resetNearestPoint();
      if (point) {
        point.setView(HOVER);
        this._nearestPoint = point;
      }
    }
  }

  _getMainAxisName(): string {
    return this._options.rotated ? 'X' : 'Y';
  }

  areLabelsVisible(): boolean {
    return !_isDefined(this._options.maxLabelCount) || (this._points.length <= this._options.maxLabelCount);
  }

  getLabelVisibility(): boolean {
    return this.areLabelsVisible() && this._options.label && this._options.label.visible;
  }

  customizePoint(point: SeriesPoint, pointData: ThemeValue): void {
    const options = this._options;
    const customizePoint = options.customizePoint;
    let customizeObject;
    let pointOptions;
    let customLabelOptions;
    let customOptions;
    const customizeLabel = options.customizeLabel;
    let useLabelCustomOptions;
    let usePointCustomOptions;

    if (customizeLabel && customizeLabel.call) {
      customizeObject = _extend({ seriesName: this.name }, pointData);
      customizeObject.series = this;
      customLabelOptions = customizeLabel.call(customizeObject, customizeObject);
      useLabelCustomOptions = customLabelOptions && !_isEmptyObject(customLabelOptions);
      customLabelOptions = useLabelCustomOptions ? _extend(true, {}, options.label, customLabelOptions) : null;
    }

    if (customizePoint && customizePoint.call) {
      customizeObject = customizeObject || _extend({ seriesName: this.name }, pointData);
      customizeObject.series = this;
      customOptions = customizePoint.call(customizeObject, customizeObject);
      usePointCustomOptions = customOptions && !_isEmptyObject(customOptions);
    }

    if (useLabelCustomOptions || usePointCustomOptions) {
      pointOptions = this._parsePointOptions(this._preparePointOptions(customOptions), customLabelOptions || options.label, pointData, point);
      pointOptions.styles.useLabelCustomOptions = useLabelCustomOptions;
      pointOptions.styles.usePointCustomOptions = usePointCustomOptions;

      point.updateOptions(pointOptions);
    }
  }

  show(): void {
    if (!this._visible) {
      this._changeVisibility(true);
    }
  }

  hide(): void {
    if (this._visible) {
      this._changeVisibility(false);
    }
  }

  _changeVisibility(visibility: boolean): void {
    this._visible = this._options.visible = visibility;
    this._updatePointsVisibility();
    this.hidePointTooltip();
    this._options.visibilityChanged(this);
  }

  hideLabels(): void {
    _each(this._points, (_, point) => {
      point._label.draw(false);
    });
  }

  _turnOffHatching(hoverStyle: ThemeValue, selectionStyle: ThemeValue): void {
    if (hoverStyle.hatching) {
      hoverStyle.hatching.direction = 'none';
    }
    if (selectionStyle.hatching) {
      selectionStyle.hatching.direction = 'none';
    }
  }

  _parsePointOptions(pointOptions: ThemeValue, labelOptions: ThemeValue, data?: ThemeValue, point?: SeriesPoint): ThemeValue {
    const options = this._options;
    const styles = this._createPointStyles(pointOptions, data, point);
    const parsedOptions = _extend({}, pointOptions, {
      type: options.type,
      rotated: options.rotated,
      styles,
      widgetType: options.widgetType,
      visibilityChanged: options.visibilityChanged,
    });

    parsedOptions.label = getLabelOptions(labelOptions, styles.labelColor);
    parsedOptions.label.format = applyDataTypePreset(parsedOptions.label.format, that.valueType);
    parsedOptions.label.argumentFormat = applyDataTypePreset(
      parsedOptions.label.argumentFormat,
      that.argumentType,
    );

    if (this.areErrorBarsVisible()) {
      parsedOptions.errorBars = options.valueErrorBar;
    }

    return parsedOptions;
  }

  _preparePointOptions(customOptions?: ThemeValue): ThemeValue {
    const pointOptions = this._getOptionsForPoint();
    return customOptions ? mergePointOptions(pointOptions, customOptions) : pointOptions;
  }

  _getMarkerGroupOptions(): ThemeValue {
    return _extend(false, {}, this._getOptionsForPoint(), { hoverStyle: {}, selectionStyle: {} });
  }

  _getAggregationMethod(isValueAxisDiscrete: boolean): (aggregationInfo: ThemeValue, series: ThemeValue) => ThemeValue {
    const options = this.getOptions().aggregation;
    const method = _normalizeEnum(options.method);
    const customAggregator = method === 'custom' && options.calculate;

    if (customAggregator) {
      return customAggregator;
    }

    if (isValueAxisDiscrete) {
      return ({ data }) => data[0];
    }

    return this._aggregators[method] || this._aggregators[this._defaultAggregator];
  }

  _resample({ interval, ticks }: ThemeValue, data: ThemeValue): ThemeValue[] {
    const options = this.getOptions();

    const dataSelector = this._getPointDataSelector();
    const addAggregatedData = (target, data, aggregationInfo?): void => {
      if (!data) {
        return;
      }
      const processData = (d): void => {
        const pointData = d && dataSelector(d, options);
        if (pointData && this._checkData(pointData)) {
          pointData.aggregationInfo = aggregationInfo;
          target.push(pointData);
        }
      };

      if (Array.isArray(data)) {
        data.forEach(processData);
      } else {
        processData(data);
      }
    };

    const isValueAxisDiscrete = this.valueAxisType === DISCRETE;
    const aggregateByCategory = this.argumentAxisType === DISCRETE;
    const aggregationMethod = this._getAggregationMethod(isValueAxisDiscrete);

    if (aggregateByCategory) {
      const categories = this.getArgumentAxis().getTranslator().getBusinessRange().categories;
      const groups = categories.reduce((g, category) => {
        g[category.valueOf()] = [];
        return g;
      }, {});

      data.forEach((dataItem) => {
        groups[dataItem.argument.valueOf()].push(dataItem);
      });

      return categories.reduce((result, c) => {
        addAggregatedData(result, aggregationMethod({
          aggregationInterval: null,
          intervalStart: c,
          intervalEnd: c,
          data: groups[c.valueOf()].map(getData),
        }, this));
        return result;
      }, []);
    }

    if (isValueAxisDiscrete) {
      return data.reduce((result, dataItem, index, data) => {
        result[1].push(dataItem);
        if (index === data.length - 1 || (index + 1) % interval === 0) {
          const dataInInterval = result[1];
          const aggregationInfo = {
            aggregationInterval: interval,
            data: dataInInterval.map(getData),
          };
          addAggregatedData(result[0], aggregationMethod(aggregationInfo, this));
          result[1] = [];
        }
        return result;
      }, [[], []])[0];
    }

    const aggregatedData = [];

    if (ticks.length === 1) {
      const aggregationInfo = {
        intervalStart: ticks[0],
        intervalEnd: ticks[0],
        aggregationInterval: null,
        data: data.map(getData),
      };
      addAggregatedData(aggregatedData, aggregationMethod(aggregationInfo, this), aggregationInfo);
    } else {
      let dataIndex = 0;

      for (let i = 1; i < ticks.length; i++) {
        const intervalEnd = ticks[i];
        const intervalStart = ticks[i - 1];
        const dataInInterval: ThemeValue[] = [];
        while (data[dataIndex] && data[dataIndex].argument < intervalEnd) {
          if (data[dataIndex].argument >= intervalStart) {
            dataInInterval.push(data[dataIndex]);
          }
          dataIndex++;
        }
        const aggregationInfo = {
          intervalStart,
          intervalEnd,
          aggregationInterval: interval,
          data: dataInInterval.map(getData),
        };
        addAggregatedData(aggregatedData, aggregationMethod(aggregationInfo, this), aggregationInfo);
      }
    }

    this._endUpdateData();
    return aggregatedData;
  }

  canRenderCompleteHandle(): boolean {
    const result = this._canRenderCompleteHandle;
    delete this._canRenderCompleteHandle;
    return !!result;
  }

  isHovered(): boolean {
    return !!(this.fullState & 1);
  }

  isSelected(): boolean {
    return !!(this.fullState & 2);
  }

  isVisible(): boolean {
    return this._visible;
  }

  getAllPoints(): SeriesPoint[] {
    this._createAllAggregatedPoints();
    return (this._points || []).slice();
  }

  getPointByPos(pos: number): SeriesPoint {
    this._createAllAggregatedPoints();
    return (this._points || [])[pos];
  }

  getVisiblePoints(): SeriesPoint[] {
    return (this._drawnPoints || []).slice();
  }

  selectPoint(point: SeriesPoint): void {
    if (!point.isSelected()) {
      setPointSelectedState(point, this._legendCallback);
      this._eventPipe({ action: POINT_SELECT, target: point });
      this._eventTrigger(POINT_SELECTION_CHANGED, { target: point });
    }
  }

  deselectPoint(point: SeriesPoint): void {
    if (point.isSelected()) {
      releasePointSelectedState(point, this._legendCallback);
      this._eventPipe({ action: POINT_DESELECT, target: point });
      this._eventTrigger(POINT_SELECTION_CHANGED, { target: point });
    }
  }

  hover(mode?: string): void {
    const eventTrigger = this._eventTrigger;

    if (this.isHovered()) {
      return;
    }

    this.lastHoverMode = _normalizeEnum(mode || this._options.hoverMode);

    this.fullState |= HOVER_STATE;

    this._changeStyle(this.lastHoverMode, undefined, this.isSelected() && this.lastSelectionMode !== NONE_MODE);

    eventTrigger(SERIES_HOVER_CHANGED, { target: this });
  }

  clearHover(): void {
    const eventTrigger = this._eventTrigger;

    if (!this.isHovered()) {
      return;
    }

    this._resetNearestPoint();
    this.fullState &= ~HOVER_STATE;

    this._changeStyle(this.lastHoverMode, HOVER, this.isSelected() && this.lastSelectionMode !== NONE_MODE);

    eventTrigger(SERIES_HOVER_CHANGED, { target: this });
  }

  hoverPoint(point: SeriesPoint): void {
    if (!point.isHovered()) {
      point.clearHover();
      setPointHoverState(point, this._legendCallback);
      this._canChangeView() && this._applyStyle(this._styles.hover);
      this._eventPipe({ action: POINT_HOVER, target: point });
      this._eventTrigger(POINT_HOVER_CHANGED, { target: point });
    }
  }

  clearPointHover(): void {
    this.getPoints().some((currentPoint) => {
      if (currentPoint.isHovered()) {
        releasePointHoverState(currentPoint, this._legendCallback);
        this._canChangeView() && this._applyStyle(this._styles.normal);
        this._eventPipe({ action: CLEAR_POINT_HOVER, target: currentPoint });
        this._eventTrigger(POINT_HOVER_CHANGED, { target: currentPoint });
        return true;
      }
      return false;
    });
  }

  showPointTooltip(point: SeriesPoint): void {
    triggerEvent(this._extGroups.seriesGroup, 'showpointtooltip', point);
  }

  hidePointTooltip(point?: SeriesPoint): void {
    triggerEvent(this._extGroups.seriesGroup, 'hidepointtooltip', point);
  }

  select(): void {
    if (!this.isSelected()) {
      this._setSelectedState(this._options.selectionMode);
      this._eventPipe({ action: SERIES_SELECT, target: this });
      this._group.toForeground();
      this._eventTrigger(SERIES_SELECTION_CHANGED, { target: this });
    }
  }

  clearSelection(): void {
    if (this.isSelected()) {
      this._releaseSelectedState();
      this._eventTrigger(SERIES_SELECTION_CHANGED, { target: this });
    }
  }

  getPointsByArg(arg: ThemeValue, skipPointsCreation?: boolean): SeriesPoint[] {
    const argValue = arg.valueOf();
    let points = this.pointsByArgument[argValue];

    if (!points && !skipPointsCreation && this._createAllAggregatedPoints()) {
      points = this.pointsByArgument[argValue];
    }
    return points || [];
  }

  _createAllAggregatedPoints(): boolean {
    if (this.useAggregation() && !this._useAllAggregatedPoints) {
      this.createPoints(true);
      return true;
    }
    return false;
  }

  getPointsByKeys(arg: ThemeValue, argumentIndex?: number): SeriesPoint[];

  getPointsByKeys(arg: ThemeValue): SeriesPoint[] {
    return this.getPointsByArg(arg);
  }

  notify(data: ThemeValue): void {
    const action = data.action;
    const seriesModes = this._seriesModes;
    const target = data.target;
    const targetOptions = target.getOptions();
    const pointHoverMode = _normalizeEnum(targetOptions.hoverMode);
    const selectionModeOfPoint = _normalizeEnum(targetOptions.selectionMode);

    if (action === POINT_HOVER) {
      this._hoverPointHandler(target, pointHoverMode, data.notifyLegend);
    } else if (action === CLEAR_POINT_HOVER) {
      this._clearPointHoverHandler(target, pointHoverMode, data.notifyLegend);
    } else if (action === SERIES_SELECT) {
      (target !== this) && (seriesModes.seriesSelectionMode === 'single') && this.clearSelection();
    } else if (action === POINT_SELECT) {
      if (seriesModes.pointSelectionMode === 'single') {
        this.getPoints().some((currentPoint) => {
          if (currentPoint !== target && currentPoint.isSelected()) {
            this.deselectPoint(currentPoint);
            return true;
          }
          return false;
        });
      }
      this._selectPointHandler(target, selectionModeOfPoint);
    } else if (action === POINT_DESELECT) {
      this._deselectPointHandler(target, selectionModeOfPoint);
    }
  }

  _selectPointHandler(target: ThemeValue, mode: string): void {
    if (mode === ALL_SERIES_POINTS) {
      (target.series === this) && this._setPointsView(SELECTION, target);
    } else if (mode === ALL_ARGUMENT_POINTS) {
      this.getPointsByKeys(target.argument, target.argumentIndex).forEach((currentPoint) => {
        (currentPoint !== target) && currentPoint.setView(SELECTION);
      });
    }
  }

  _deselectPointHandler(target: ThemeValue, mode: string): void {
    if (mode === ALL_SERIES_POINTS) {
      (target.series === this) && this._resetPointsView(SELECTION, target);
    } else if (mode === ALL_ARGUMENT_POINTS) {
      this.getPointsByKeys(target.argument, target.argumentIndex).forEach((currentPoint) => {
        (currentPoint !== target) && currentPoint.resetView(SELECTION);
      });
    }
  }

  _hoverPointHandler(target: ThemeValue, mode: string, notifyLegend?: boolean): void {
    if (target.series !== this && mode === ALL_ARGUMENT_POINTS) {
      this.getPointsByKeys(target.argument, target.argumentIndex).forEach((currentPoint) => {
        currentPoint.setView(HOVER);
      });
      notifyLegend && this._legendCallback(target);
    } else if (mode === ALL_SERIES_POINTS && target.series === this) {
      this._setPointsView(HOVER, target);
    }
  }

  _clearPointHoverHandler(target: ThemeValue, mode: string, notifyLegend?: boolean): void {
    if (mode === ALL_ARGUMENT_POINTS) {
      (target.series !== this) && this.getPointsByKeys(target.argument, target.argumentIndex).forEach((currentPoint) => {
        currentPoint.resetView(HOVER);
      });
      notifyLegend && this._legendCallback(target);
    } else if (mode === ALL_SERIES_POINTS && target.series === this) {
      this._resetPointsView(HOVER, target);
    }
  }

  _deletePoints(): void {
    this._disposePoints(this._points);
    // @ts-expect-error dispose() drops the references
    this._points = this._drawnPoints = null;
  }

  _deleteTrackers(): void {
    _each(this._trackers || [], (_, tracker) => {
      tracker.remove();
    });
    this._trackersGroup && this._trackersGroup.dispose();
    this._trackers = this._trackersGroup = null;
  }

  dispose(): void {
    this._deletePoints();
    this._group.dispose();
    this._labelsGroup && this._labelsGroup.dispose();
    this._errorBarGroup && this._errorBarGroup.dispose();

    this._deleteTrackers();

    // @ts-expect-error dispose() drops the references
    this._group = this._extGroups = this._markersGroup = this._elementsGroup = this._bordersGroup = this._labelsGroup = this._errorBarGroup = this._graphics = this._rangeData = this._renderer = this._styles = this._options = this._pointOptions = this._drawnPoints = this.pointsByArgument = this._segments = this._prevSeries = null;
  }

  getMarginOptions(): ThemeValue {
    return this._patchMarginOptions({
      percentStick: this.isFullStackedSeries(),
    });
  }

  getColor(): string {
    return paintedColor(this.getLegendStyles().normal.fill, this._renderer?.root?.element);
  }

  getOpacity(): number {
    return this._options.opacity;
  }

  getStackName(): string | null {
    return this._stackName;
  }

  getBarOverlapGroup(): ThemeValue {
    return this._options.barOverlapGroup;
  }

  getPointByCoord(x: number, y: number): SeriesPoint | null {
    const point = this.getNeighborPoint(x, y);
    return point?.coordsIn(x, y) ? point : null;
  }

  getValueAxis(): ThemeValue {
    return this._valueAxis;
  }

  getArgumentAxis(): ThemeValue {
    return this._argumentAxis;
  }

  getMarkersGroup(): ThemeValue {
    return this._markersGroup;
  }

  getRenderer(): ThemeValue {
    return this._renderer;
  }

  removePointElements(): void {
    if (this._markersGroup) {
      _each(this._points, (_, p) => p.deleteMarker());
      this._markersGroup.dispose();
      this._markersGroup = null;
    }
  }

  removeGraphicElements(): void {
    if (this._elementsGroup) {
      this._elementsGroup.dispose();
      this._elementsGroup = null;
    }
    _each(this._graphics || [], (_, elem) => {
      this._removeElement(elem);
    });
    this._graphics = null;
  }

  removeBordersGroup(): void {
    if (this._bordersGroup) {
      this._bordersGroup.dispose();
      this._bordersGroup = null;
    }
  }
};

Object.assign(Series.prototype, {
  _createLegendState: _noop,

  getValueFields: _noop,

  getSizeField: _noop,

  getArgumentField: _noop,

  autoHidePointMarkersEnabled: _noop,

  usePointsToDefineAutoHiding: _noop,

  // TODO. Problem related to 'point' option for bar-like series. Revisit this code once options parsing is changed
  // see T243839, T231939
  _updatePointsVisibility: _noop,

  correctPosition: _noop,

  drawTrackers: _noop,

  getNeighborPoint: _noop,

  areErrorBarsVisible: _noop,

  _getColorId: _noop,
});

export const mixins = seriesNS.mixins;

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_Series(value: typeof Series): void {
  Series = value;
}
/// #ENDDEBUG
