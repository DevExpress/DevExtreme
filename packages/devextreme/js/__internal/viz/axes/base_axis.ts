/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop as _noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { adjust } from '@js/core/utils/math';
import {
  isDate, isDefined, isFunction, isPlainObject, type,
} from '@js/core/utils/type';
import formatHelper from '@js/format_helper';
import { multiplyInExponentialForm } from '@ts/core/utils/m_math';
import constants from '@ts/viz/axes/axes_constants';
import { calculateCanvasMargins, measureLabels } from '@ts/viz/axes/axes_utils';
import createConstantLine from '@ts/viz/axes/constant_line';
import * as polarMethods from '@ts/viz/axes/polar_axes';
import { formatRange, smartFormatter as _format } from '@ts/viz/axes/smart_formatter';
import createStrip from '@ts/viz/axes/strip';
import { tick } from '@ts/viz/axes/tick';
import { tickGenerator } from '@ts/viz/axes/tick_generator';
import xyMethods from '@ts/viz/axes/xy_axes';
import { getParser } from '@ts/viz/components/parse_utils';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

import {
  adjustVisualRange,
  convertVisualRangeObject,
  getAddFunction,
  getCategoriesInfo,
  getLogExt as getLog,
  getVizRangeObject,
  patchFontOptions,
  raiseToExt as raiseTo,
  rotateBBox,
  valueOf,
} from '../core/utils';
import type { RangeData, RangeInstance } from '../translators/range';
import { Range } from '../translators/range';
import type { Translator2DInstance, Translator2DOptions } from '../translators/translator2d';
import { Translator2D } from '../translators/translator2d';

type IncidentOccurred = (errorId: string, args?: ThemeValue[]) => void;

type VisualRangeSetter = (axis: ThemeValue, range: ThemeValue) => void;

type TicksGenerator = (
  tickInterval: ThemeValue,
  skipTickGeneration: boolean,
  min: ThemeValue,
  max: ThemeValue,
  breaks?: ThemeValue[],
) => ThemeValue;

interface AxisRenderSettings {
  renderer: ThemeValue;
  incidentOccurred?: IncidentOccurred;
  eventTrigger?: (name: string, args: ThemeValue) => void;
  stripsGroup?: ThemeValue;
  stripLabelAxesGroup?: ThemeValue;
  labelsAxesGroup?: ThemeValue;
  constantLinesGroup?: ThemeValue;
  scaleBreaksGroup?: ThemeValue;
  axesContainerGroup?: ThemeValue;
  gridGroup?: ThemeValue;
  widgetClass?: string;
  axisClass?: string;
  axisType: string;
  drawingType: string;
  isArgumentAxis?: boolean;
  getTemplate?: (template: ThemeValue) => ThemeValue;
}

interface StripPosition {
  from: number;
  to: number;
  outOfCanvas?: boolean;
}

interface LabelTranslation {
  translateX: number;
  translateY: number;
}

interface ConstantLineGroups {
  inside: ThemeValue;
  outside1: ThemeValue;
  left: ThemeValue;
  top: ThemeValue;
  outside2: ThemeValue;
  right: ThemeValue;
  bottom: ThemeValue;
  remove: () => void;
  clear: () => void;
}

interface LabelFormatObject {
  value: ThemeValue;
  valueText: string;
  min: ThemeValue;
  max: ThemeValue;
  point?: ThemeValue;
}

interface Margins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface OrthogonalPositions {
  start: number;
  end: number;
  center?: number;
}

interface ValueMargins {
  startPadding: number;
  endPadding: number;
  minValue?: ThemeValue;
  maxValue?: ThemeValue;
  interval?: ThemeValue;
  isSpacedMargin?: boolean;
}

interface CorrectedValuesToZero {
  start: number | null;
  end: number | null;
  correctedMin?: number;
  correctedMax?: number;
}

interface ZoomResults {
  isPrevented: boolean;
  skipEventRising?: boolean;
  range: ThemeValue;
}

type AxisInstance = InstanceType<typeof Axis>;

const convertTicksToValues = constants.convertTicksToValues;
const _math = Math;
const _abs = _math.abs;
const _max = _math.max;
const _min = _math.min;
const _isArray = Array.isArray;

const DEFAULT_AXIS_LABEL_SPACING = 5;
const MAX_GRID_BORDER_ADHENSION = 4;

const PANNING_CORRECTION_ITERATION_COUNT = 5;
const PANNING_CORRECTION_PRECISION = 1e-4;

const ZOOM_FACTOR_PRECISION = 2;
const ZOOM_FACTOR_MULTIPLIER = 10 ** ZOOM_FACTOR_PRECISION;

const TOP = constants.top;
const BOTTOM = constants.bottom;
const LEFT = constants.left;
const RIGHT = constants.right;
const CENTER = constants.center;

const KEEP = 'keep';
const SHIFT = 'shift';
const RESET = 'reset';

const ROTATE = 'rotate';

const DEFAULT_AXIS_DIVISION_FACTOR = 50;
const DEFAULT_MINOR_AXIS_DIVISION_FACTOR = 15;

const SCROLL_THRESHOLD = 5;
const MIN_BAR_MARGIN = 5;
const MAX_MARGIN_VALUE = 0.8;

const dateIntervals = {
  day: 86400000,
  week: 604800000,
};

function getTickGenerator(
  options: ThemeValue,
  incidentOccurred: IncidentOccurred,
  skipTickGeneration: boolean | undefined,
  rangeIsEmpty: boolean,
  adjustDivisionFactor: (value: number) => number,
  { allowNegatives, linearThreshold }: { allowNegatives?: boolean; linearThreshold?: number },
): ThemeValue {
  return tickGenerator({
    axisType: options.type,
    dataType: options.dataType,
    logBase: options.logarithmBase,
    allowNegatives,
    linearThreshold,

    axisDivisionFactor: adjustDivisionFactor(options.axisDivisionFactor || DEFAULT_AXIS_DIVISION_FACTOR),
    minorAxisDivisionFactor: adjustDivisionFactor(options.minorAxisDivisionFactor || DEFAULT_MINOR_AXIS_DIVISION_FACTOR),
    numberMultipliers: options.numberMultipliers,
    calculateMinors: options.minorTick.visible || options.minorGrid.visible || options.calculateMinors,

    allowDecimals: options.allowDecimals,
    endOnTick: options.endOnTick,

    incidentOccurred,

    firstDayOfWeek: options.workWeek?.[0],
    skipTickGeneration,
    skipCalculationLimits: options.skipCalculationLimits,

    generateExtraTick: options.generateExtraTick,

    minTickInterval: options.minTickInterval,
    rangeIsEmpty,
  });
}

function createMajorTick(axis: AxisInstance, renderer: ThemeValue, skippedCategory: ThemeValue): ThemeValue {
  const options = axis.getOptions();

  return tick(
    axis,
    renderer,
    options.tick,
    options.grid,
    skippedCategory,
    false,
  );
}

function createMinorTick(axis: AxisInstance, renderer: ThemeValue): ThemeValue {
  const options = axis.getOptions();

  return tick(
    axis,
    renderer,
    options.minorTick,
    options.minorGrid,
  );
}

function createBoundaryTick(axis: AxisInstance, renderer: ThemeValue, isFirst: boolean): ThemeValue {
  const options = axis.getOptions();

  return tick(
    axis,
    renderer,
    extend({}, options.tick, { visible: options.showCustomBoundaryTicks }),
    options.grid,
    undefined,
    false,
    isFirst ? -1 : 1,
  );
}

function callAction(elements: ThemeValue[] | null | undefined, action: string, actionArgument1?: ThemeValue, actionArgument2?: ThemeValue): void {
  (elements || []).forEach((e) => e[action](actionArgument1, actionArgument2));
}

function initTickCoords(ticks: ThemeValue[]): void {
  callAction(ticks, 'initCoords');
}

function drawTickMarks(ticks: ThemeValue[], options: ThemeValue): void {
  callAction(ticks, 'drawMark', options);
}

function drawGrids(ticks: ThemeValue[], drawLine: ThemeValue): void {
  callAction(ticks, 'drawGrid', drawLine);
}

function updateTicksPosition(ticks: ThemeValue[], options: ThemeValue, animate?: boolean): void {
  callAction(ticks, 'updateTickPosition', options, animate);
}

function updateGridsPosition(ticks: ThemeValue[], animate?: boolean): void {
  callAction(ticks, 'updateGridPosition', animate);
}

function cleanUpInvalidTicks(ticks: ThemeValue[]): void {
  let i = ticks.length - 1;
  for (i; i >= 0; i--) {
    if (!removeInvalidTick(ticks, i)) {
      break;
    }
  }
  for (i = 0; i < ticks.length; i++) {
    if (removeInvalidTick(ticks, i)) {
      i--;
    } else {
      break;
    }
  }
}

function removeInvalidTick(ticks: ThemeValue[], i: number): boolean {
  if (ticks[i].coords.x === null || ticks[i].coords.y === null) {
    ticks.splice(i, 1);
    return true;
  }
  return false;
}

function validateAxisOptions(options: ThemeValue): void {
  const labelOptions = options.label;
  let position = options.position;
  const defaultPosition = options.isHorizontal ? BOTTOM : LEFT;
  const secondaryPosition = options.isHorizontal ? TOP : RIGHT;

  let labelPosition = labelOptions.position;

  if (position !== defaultPosition && position !== secondaryPosition) {
    position = defaultPosition;
  }

  if (!labelPosition || labelPosition === 'outside') {
    labelPosition = position;
  } else if (labelPosition === 'inside') {
    labelPosition = {
      [TOP]: BOTTOM,
      [BOTTOM]: TOP,
      [LEFT]: RIGHT,
      [RIGHT]: LEFT,
    }[position];
  }
  if (labelPosition !== defaultPosition && labelPosition !== secondaryPosition) {
    labelPosition = position;
  }

  if (labelOptions.alignment !== CENTER && !labelOptions.userAlignment) {
    labelOptions.alignment = {
      [TOP]: CENTER,
      [BOTTOM]: CENTER,
      [LEFT]: RIGHT,
      [RIGHT]: LEFT,
    }[labelPosition];
  }

  options.position = position;
  labelOptions.position = labelPosition;
  options.hoverMode = options.hoverMode ? options.hoverMode.toLowerCase() : 'none';
  labelOptions.minSpacing = labelOptions.minSpacing ?? DEFAULT_AXIS_LABEL_SPACING;

  options.type && (options.type = options.type.toLowerCase());
  options.argumentType && (options.argumentType = options.argumentType.toLowerCase());
  options.valueType && (options.valueType = options.valueType.toLowerCase());
}

function getOptimalAngle(boxes: ThemeValue[], labelOpt: ThemeValue): number {
  const angle = _math.asin((boxes[0].height + labelOpt.minSpacing) / (boxes[1].x - boxes[0].x)) * 180 / _math.PI;
  return angle < 45 ? -45 : -90;
}

function updateLabels(ticks: ThemeValue[], step: number, func?: (tick: ThemeValue, index: number) => void): void {
  ticks.forEach((tick, index) => {
    if (tick.getContentContainer()) {
      if (index % step !== 0) {
        tick.removeLabel();
      } else if (func) {
        func(tick, index);
      }
    }
  });
}

function getZoomBoundValue(optionValue: ThemeValue, dataValue: ThemeValue): ThemeValue {
  if (optionValue === undefined) {
    return dataValue;
  } else if (optionValue === null) {
    return undefined;
  } else {
    return optionValue;
  }
}

function configureGenerator(
  options: ThemeValue,
  axisDivisionFactor: number | undefined,
  viewPort: RangeInstance,
  screenDelta: number,
  minTickInterval: ThemeValue,
): TicksGenerator {
  const tickGeneratorOptions = extend({}, options, {
    endOnTick: true,
    axisDivisionFactor,
    skipCalculationLimits: true,
    generateExtraTick: true,
    minTickInterval,
  });

  return function (tickInterval, skipTickGeneration, min, max, breaks) {
    return getTickGenerator(tickGeneratorOptions, _noop, skipTickGeneration, viewPort.isEmpty(), (v) => v, viewPort)(
      {
        min,
        max,
        categories: viewPort.categories,
        isSpacedMargin: viewPort.isSpacedMargin,
      },
      screenDelta,
      tickInterval,
      isDefined(tickInterval),
      undefined,
      undefined,
      undefined,
      breaks,
    );
  };
}

function getConstantLineSharpDirection(coord: number, axisCanvas: { start: number; end: number }): number {
  return Math.max(axisCanvas.start, axisCanvas.end) !== coord ? 1 : -1;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Axis = class Axis {
  declare _renderer: ThemeValue;

  declare _incidentOccurred: ThemeValue;

  declare _eventTrigger: ThemeValue;

  declare _stripsGroup: ThemeValue;

  declare _stripLabelAxesGroup: ThemeValue;

  declare _labelsAxesGroup: ThemeValue;

  declare _constantLinesGroup: ThemeValue;

  declare _scaleBreaksGroup: ThemeValue;

  declare _axesContainerGroup: ThemeValue;

  declare _gridContainerGroup: ThemeValue;

  declare _axisCssPrefix: string;

  declare _translator: Translator2DInstance;

  declare isArgumentAxis?: boolean;

  declare _viewport: ThemeValue;

  declare _prevDataInfo: { isEmpty?: boolean; containsConstantLine?: boolean };

  declare _firstDrawing: boolean;

  declare _initRange: { startValue?: ThemeValue; endValue?: ThemeValue };

  declare _getTemplate: ThemeValue;

  declare _axisGroup: ThemeValue;

  declare _axisStripGroup: ThemeValue;

  declare _axisGridGroup: ThemeValue;

  declare _axisElementsGroup: ThemeValue;

  declare _axisLineGroup: ThemeValue;

  declare _axisTitleGroup: ThemeValue;

  declare _axisConstantLineGroups: ThemeValue;

  declare _axisStripLabelGroup: ThemeValue;

  declare _axisBreaksGroup: ThemeValue;

  declare _axisElement: ThemeValue;

  declare _options: ThemeValue;

  declare _initTypes: { type?: string; argumentType?: string; valueType?: string };

  declare _isHorizontal: boolean;

  declare pane?: string;

  declare name?: string;

  declare priority?: number;

  declare isVirtual?: boolean;

  declare _hasLabelFormat: boolean;

  declare _textOptions: ThemeValue;

  declare _textFontStyles: ThemeValue;

  declare _tickOffset: number;

  declare _strips: ThemeValue;

  declare _title: ThemeValue;

  declare _outsideConstantLines: ThemeValue[];

  declare _insideConstantLines: ThemeValue[];

  declare _majorTicks: ThemeValue;

  declare _minorTicks: ThemeValue;

  declare _boundaryTicks: ThemeValue[];

  declare _ticksToRemove: ThemeValue;

  declare _dateMarkers: ThemeValue[];

  declare _canvas: ThemeValue;

  declare _orthogonalPositions: ThemeValue;

  declare _axisPosition: number;

  declare _axisShift?: number;

  declare _constantLabelOffset: number;

  declare _seriesData: RangeInstance;

  declare _series: ThemeValue[];

  declare _lastVisualRangeUpdateMode?: string;

  declare _storedZoomEndParams: ThemeValue;

  declare _tickInterval: ThemeValue;

  declare _minorTickInterval: ThemeValue;

  declare _estimatedTickInterval: ThemeValue;

  declare _aggregationInterval: ThemeValue;

  declare _initialBreaks: ThemeValue[];

  declare _isSynchronized: boolean;

  declare _marginOptions?: ThemeValue;

  declare _resetApplyingAnimation: boolean;

  declare _templatesRendered: ThemeValue;

  declare _drawn: boolean;

  declare borderOptions: ThemeValue;

  declare parser: (value: ThemeValue) => ThemeValue;

  declare _boundaryTicksVisibility: { min?: boolean; max?: boolean };

  declare _getTranslatedCoord: (value: ThemeValue, offset?: number) => number | null;

  declare _createAxisElement: () => ThemeValue;

  declare _updateAxisElementPosition: () => void;

  declare _checkAlignmentConstantLineLabels: (labelOptions: ThemeValue) => void;

  declare _getConstantLineLabelsCoords: (value: number, labelOptions: ThemeValue) => { x: number; y: number };

  declare _getAdjustedStripLabelCoords: (strip: ThemeValue) => LabelTranslation;

  declare _getMaxLabelHeight: (boxes: ThemeValue[], spacing: number) => number;

  declare _getStick: () => boolean;

  declare customPositionIsBoundary: () => boolean;

  declare getRadius?: () => number;

  declare getOrthogonalAxis: () => ThemeValue;

  declare getCustomPosition: (position?: ThemeValue) => number;

  declare getCustomBoundaryPosition: (position?: ThemeValue) => ThemeValue;

  declare resolveOverlappingForCustomPositioning: (oppositeAxes: ThemeValue[]) => void;

  declare _disposeBreaksGroup: () => void;

  declare _measureTitle: () => void;

  declare _updateLabelsPosition: () => void;

  declare getMarkerTrackers: () => ThemeValue;

  declare _drawDateMarkers: () => ThemeValue[] | undefined;

  declare _adjustDateMarkers: (offset: number) => number;

  declare coordsIn: (x: number, y: number) => boolean;

  declare areCoordsOutsideAxis: (coords: ThemeValue) => boolean;

  declare _getSkippedCategory: (ticks: ThemeValue[]) => ThemeValue;

  declare _initAxisPositions: () => void;

  declare _drawTitle: () => void;

  declare _updateTitleCoords: () => void;

  declare _adjustConstantLineLabels: (constantLines: ThemeValue[]) => number;

  declare _adjustTitle: (offset: number) => void;

  declare _checkTitleOverflow: (titleElement?: ThemeValue) => void;

  declare getSpiderTicks: () => ThemeValue[];

  declare setSpiderTicks: (ticks: ThemeValue[]) => void;

  declare _checkBoundedLabelsOverlapping: (majorTicks: ThemeValue[], boxes: ThemeValue[], mode: string) => void;

  declare _checkShiftedLabels: (majorTicks: ThemeValue[], boxes: ThemeValue[], minSpacing: number, alignment: string) => void;

  declare drawScaleBreaks: (customCanvas?: ThemeValue) => void;

  declare _visualRange: VisualRangeSetter;

  declare _rotateConstantLine: (line: ThemeValue, value: number) => void;

  declare _getTickMarkPoints: (coords: ThemeValue, length: number, options?: ThemeValue) => number[];

  declare _validateOverlappingMode: (mode: string, displayMode?: string) => string;

  declare _getStep: (boxes: ThemeValue[], rotationAngle?: number) => number;

  declare _validateDisplayMode: (mode: string) => string;

  declare shift: (margins: ThemeValue) => void;

  constructor(renderSettings: AxisRenderSettings) {
    this._renderer = renderSettings.renderer;
    this._incidentOccurred = renderSettings.incidentOccurred;
    this._eventTrigger = renderSettings.eventTrigger;

    this._stripsGroup = renderSettings.stripsGroup;
    this._stripLabelAxesGroup = renderSettings.stripLabelAxesGroup;
    this._labelsAxesGroup = renderSettings.labelsAxesGroup;
    this._constantLinesGroup = renderSettings.constantLinesGroup;
    this._scaleBreaksGroup = renderSettings.scaleBreaksGroup;
    this._axesContainerGroup = renderSettings.axesContainerGroup;
    this._gridContainerGroup = renderSettings.gridGroup;
    this._axisCssPrefix = `${renderSettings.widgetClass}-${renderSettings.axisClass ? `${renderSettings.axisClass}-` : ''}`;

    this._setType(renderSettings.axisType, renderSettings.drawingType);
    this._createAxisGroups();
    this._translator = this._createTranslator();
    this.isArgumentAxis = renderSettings.isArgumentAxis;
    this._viewport = {};
    this._prevDataInfo = {};

    this._firstDrawing = true;

    this._initRange = {};
    this._getTemplate = renderSettings.getTemplate;
  }

  _drawAxis(): void {
    const options = this._options;

    if (!options.visible) {
      return;
    }

    this._axisElement = this._createAxisElement();
    this._updateAxisElementPosition();

    this._axisElement.attr({ 'stroke-width': options.width, stroke: options.color, 'stroke-opacity': options.opacity })
      .sharp(this._getSharpParam(true), this.getAxisSharpDirection())
      .append(this._axisLineGroup);
  }

  _createPathElement(points: number[], attr: ThemeValue, sharpDirection?: number): ThemeValue {
    return this.sharp(this._renderer.path(points, 'line').attr(attr), sharpDirection);
  }

  sharp(svgElement: ThemeValue, sharpDirection = 1): ThemeValue {
    return svgElement.sharp(this._getSharpParam(), sharpDirection);
  }

  customPositionIsAvailable(): boolean {
    return false;
  }

  hasNonBoundaryPosition(): boolean {
    return false;
  }

  customPositionIsBoundaryOrthogonalAxis(): boolean {
    return false;
  }

  getResolvedBoundaryPosition(): string {
    return this.getOptions().position;
  }

  getAxisSharpDirection(): number {
    const position = this.getResolvedBoundaryPosition();
    return this.hasNonBoundaryPosition() || position !== BOTTOM && position !== RIGHT ? 1 : -1;
  }

  getSharpDirectionByCoords(coords: ThemeValue): number {
    const canvas = this._getCanvasStartEnd();
    const maxCoord = Math.max(canvas.start, canvas.end);

    return this.getRadius ? 0 : maxCoord !== coords[this._isHorizontal ? 'x' : 'y'] ? 1 : -1;
  }

  _getGridLineDrawer(): (tick: ThemeValue, gridStyle: ThemeValue) => ThemeValue {
    const that = this;

    return function (tick, gridStyle) {
      const grid = that._getGridPoints(tick.coords);

      if (grid.points) {
        return that._createPathElement(grid.points, gridStyle, that.getSharpDirectionByCoords(tick.coords));
      }
      return null;
    };
  }

  _getGridPoints(coords: ThemeValue): { points: number[] | null } {
    const isHorizontal = this._isHorizontal;
    const tickPositionField = isHorizontal ? 'x' : 'y';
    const orthogonalPositions = this._orthogonalPositions;
    const positionFrom = orthogonalPositions.start;
    const positionTo = orthogonalPositions.end;

    const borderOptions = this.borderOptions;

    const canvasStart = isHorizontal ? LEFT : TOP;
    const canvasEnd = isHorizontal ? RIGHT : BOTTOM;
    const axisCanvas = this.getCanvas();
    const canvas = {
      left: axisCanvas.left,
      right: axisCanvas.width - axisCanvas.right,
      top: axisCanvas.top,
      bottom: axisCanvas.height - axisCanvas.bottom,
    };
    const firstBorderLinePosition = borderOptions.visible && borderOptions[canvasStart] ? canvas[canvasStart] : undefined;
    const lastBorderLinePosition = borderOptions.visible && borderOptions[canvasEnd] ? canvas[canvasEnd] : undefined;
    const minDelta = MAX_GRID_BORDER_ADHENSION + firstBorderLinePosition;
    const maxDelta = lastBorderLinePosition - MAX_GRID_BORDER_ADHENSION;

    if (this.areCoordsOutsideAxis(coords)
            || coords[tickPositionField] === undefined
            || (coords[tickPositionField] < minDelta || coords[tickPositionField] > maxDelta)) {
      return { points: null };
    }

    return {
      points: isHorizontal
        ? coords[tickPositionField] !== null ? [coords[tickPositionField], positionFrom, coords[tickPositionField], positionTo] : null
        : coords[tickPositionField] !== null ? [positionFrom, coords[tickPositionField], positionTo, coords[tickPositionField]] : null,
    };
  }

  _getConstantLinePos(parsedValue: ThemeValue, canvasStart: number, canvasEnd: number): number | undefined {
    const value = this._getTranslatedCoord(parsedValue);

    if (!isDefined(value) || value < _min(canvasStart, canvasEnd) || value > _max(canvasStart, canvasEnd)) {
      return undefined;
    }

    return value;
  }

  _getConstantLineGraphicAttributes(value: number): { points: number[] } {
    const positionFrom = this._orthogonalPositions.start;
    const positionTo = this._orthogonalPositions.end;

    return {
      points: this._isHorizontal ? [value, positionFrom, value, positionTo] : [positionFrom, value, positionTo, value],
    };
  }

  _createConstantLine(value: number, attr: ThemeValue): ThemeValue {
    return this._createPathElement(this._getConstantLineGraphicAttributes(value).points, attr, getConstantLineSharpDirection(value, this._getCanvasStartEnd()));
  }

  _drawConstantLineLabelText(text: string, x: number, y: number, { font, cssClass }: ThemeValue, group: ThemeValue): ThemeValue {
    return this._renderer.text(text, x, y)
      .css(patchFontOptions(extend({}, this._options.label.font, font)))
      .attr({ align: 'center', class: cssClass })
      .append(group);
  }

  _drawConstantLineLabels(parsedValue: ThemeValue, lineLabelOptions: ThemeValue, value: number, group: ThemeValue): ThemeValue {
    let text = lineLabelOptions.text;
    const options = this._options;
    const labelOptions = options.label;

    this._checkAlignmentConstantLineLabels(lineLabelOptions);

    text = text ?? this.formatLabel(parsedValue, labelOptions);
    const coords = this._getConstantLineLabelsCoords(value, lineLabelOptions);

    return this._drawConstantLineLabelText(text, coords.x, coords.y, lineLabelOptions, group);
  }

  _getStripPos(startValue: ThemeValue, endValue: ThemeValue, canvasStart: number, canvasEnd: number, range: ThemeValue): StripPosition {
    const isContinuous = !!(range.minVisible || range.maxVisible);
    const categories = (range.categories || []).reduce((result, cat) => {
      result.push(cat.valueOf());
      return result;
    }, []);
    let start;
    let end;
    let swap;
    let startCategoryIndex;
    let endCategoryIndex;

    if (!isContinuous) {
      if (isDefined(startValue) && isDefined(endValue)) {
        const parsedStartValue = this.parser(startValue);
        const parsedEndValue = this.parser(endValue);
        startCategoryIndex = categories.indexOf(parsedStartValue?.valueOf() ?? undefined);
        endCategoryIndex = categories.indexOf(parsedEndValue?.valueOf() ?? undefined);
        if (startCategoryIndex === -1 || endCategoryIndex === -1) {
          return { from: 0, to: 0, outOfCanvas: true };
        }
        if (startCategoryIndex > endCategoryIndex) {
          swap = endValue;
          endValue = startValue;
          startValue = swap;
        }
      }
    }

    if (isDefined(startValue)) {
      startValue = this.validateUnit(startValue, 'E2105', 'strip');
      start = this._getTranslatedCoord(startValue, -1);
    } else {
      start = canvasStart;
    }

    if (isDefined(endValue)) {
      endValue = this.validateUnit(endValue, 'E2105', 'strip');
      end = this._getTranslatedCoord(endValue, 1);
    } else {
      end = canvasEnd;
    }

    const stripPosition: StripPosition = start < end ? { from: start, to: end } : { from: end, to: start };
    const visibleArea = this.getVisibleArea();

    if (stripPosition.from <= visibleArea[0] && stripPosition.to <= visibleArea[0] || stripPosition.from >= visibleArea[1] && stripPosition.to >= visibleArea[1]) {
      stripPosition.outOfCanvas = true;
    }
    return stripPosition;
  }

  _getStripGraphicAttributes(fromPoint: number, toPoint: number): { x: number; y: number; width: number; height: number } {
    let x;
    let y;
    let width;
    let height;
    const orthogonalPositions = this._orthogonalPositions;
    const positionFrom = orthogonalPositions.start;
    const positionTo = orthogonalPositions.end;

    if (this._isHorizontal) {
      x = fromPoint;
      y = _min(positionFrom, positionTo);
      width = toPoint - fromPoint;
      height = _abs(positionFrom - positionTo);
    } else {
      x = _min(positionFrom, positionTo);
      y = fromPoint;
      width = _abs(positionFrom - positionTo);
      height = _abs(fromPoint - toPoint);
    }

    return {
      x,
      y,
      width,
      height,
    };
  }

  _createStrip(attrs: ThemeValue): ThemeValue {
    return this._renderer.rect(attrs.x, attrs.y, attrs.width, attrs.height);
  }

  _adjustStripLabels(): void {
    this._strips.forEach((strip) => {
      if (strip.label) {
        strip.label.attr(this._getAdjustedStripLabelCoords(strip));
      }
    });
  }

  _adjustLabelsCoord(offset: number, maxWidth: number, checkCanvas?: boolean): void {
    const getContainerAttrs = (tick: ThemeValue): LabelTranslation => this._getLabelAdjustedCoord(tick, offset + (tick.labelOffset || 0), maxWidth, checkCanvas);
    this._majorTicks.forEach((tick) => {
      if (tick.label) {
        tick.updateMultilineTextAlignment();
        tick.label.attr(getContainerAttrs(tick));
      } else {
        tick.templateContainer && tick.templateContainer.attr(getContainerAttrs(tick));
      }
    });
  }

  _adjustLabels(offset: number): number {
    const options = this.getOptions();
    const positionsAreConsistent = options.position === options.label.position;
    const maxSize = this._majorTicks.reduce((size, tick) => {
      if (!tick.getContentContainer()) return size;
      const bBox = tick.labelRotationAngle ? rotateBBox(tick.labelBBox, [tick.labelCoords.x, tick.labelCoords.y], -tick.labelRotationAngle) : tick.labelBBox;
      return {
        width: _max(size.width || 0, bBox.width),
        height: _max(size.height || 0, bBox.height),
        offset: _max(size.offset || 0, tick.labelOffset || 0),
      };
    }, {});
    const additionalOffset = positionsAreConsistent ? this._isHorizontal ? maxSize.height : maxSize.width : 0;

    this._adjustLabelsCoord(offset, maxSize.width);

    return offset + additionalOffset + (additionalOffset && this._options.label.indentFromAxis) + (positionsAreConsistent ? maxSize.offset : 0);
  }

  _getLabelAdjustedCoord(tick: ThemeValue, offset: number, maxWidth: number, checkCanvas?: boolean): LabelTranslation;

  _getLabelAdjustedCoord(tick: ThemeValue, offset: number, maxWidth: number): LabelTranslation {
    offset = offset || 0;
    const options = this._options;
    const templateBox = tick.templateContainer && tick.templateContainer.getBBox();
    const box = templateBox || rotateBBox(tick.labelBBox, [tick.labelCoords.x, tick.labelCoords.y], -tick.labelRotationAngle || 0);
    const textAlign = tick.labelAlignment || options.label.alignment;
    const isDiscrete = this._options.type === 'discrete';
    const isFlatLabel = tick.labelRotationAngle % 90 === 0;
    const indentFromAxis = options.label.indentFromAxis;
    const labelPosition = options.label.position;
    const axisPosition = this._axisPosition;
    const labelCoords = tick.labelCoords;
    const labelX = labelCoords.x;
    let translateX;
    let translateY;

    if (this._isHorizontal) {
      if (labelPosition === BOTTOM) {
        translateY = axisPosition + indentFromAxis - box.y + offset;
      } else {
        translateY = axisPosition - indentFromAxis - (box.y + box.height) - offset;
      }

      if (textAlign === RIGHT) {
        translateX = isDiscrete && isFlatLabel ? tick.coords.x - (box.x + box.width) : labelX - box.x - box.width;
      } else if (textAlign === LEFT) {
        translateX = isDiscrete && isFlatLabel ? labelX - box.x - (tick.coords.x - labelX) : labelX - box.x;
      } else {
        translateX = labelX - box.x - box.width / 2;
      }
    } else {
      translateY = labelCoords.y - box.y - box.height / 2;
      if (labelPosition === LEFT) {
        if (textAlign === LEFT) {
          translateX = axisPosition - indentFromAxis - maxWidth - box.x;
        } else if (textAlign === CENTER) {
          translateX = axisPosition - indentFromAxis - maxWidth / 2 - box.x - box.width / 2;
        } else {
          translateX = axisPosition - indentFromAxis - box.x - box.width;
        }
        translateX -= offset;
      } else {
        if (textAlign === RIGHT) {
          translateX = axisPosition + indentFromAxis + maxWidth - box.x - box.width;
        } else if (textAlign === CENTER) {
          translateX = axisPosition + indentFromAxis + maxWidth / 2 - box.x - box.width / 2;
        } else {
          translateX = axisPosition + indentFromAxis - box.x;
        }
        translateX += offset;
      }
    }

    return {
      translateX,
      translateY,
    };
  }

  _createAxisConstantLineGroups(): ConstantLineGroups {
    const renderer = this._renderer;
    const classSelector = this._axisCssPrefix;
    const constantLinesClass = `${classSelector}constant-lines`;

    const insideGroup = renderer.g().attr({ class: constantLinesClass });
    const outsideGroup1 = renderer.g().attr({ class: constantLinesClass });
    const outsideGroup2 = renderer.g().attr({ class: constantLinesClass });

    return {
      inside: insideGroup,
      outside1: outsideGroup1,
      left: outsideGroup1,
      top: outsideGroup1,
      outside2: outsideGroup2,
      right: outsideGroup2,
      bottom: outsideGroup2,
      remove(): void {
        this.inside.remove();
        this.outside1.remove();
        this.outside2.remove();
      },
      clear(): void {
        this.inside.clear();
        this.outside1.clear();
        this.outside2.clear();
      },
    };
  }

  _createAxisGroups(): void {
    const renderer = this._renderer;
    const classSelector = this._axisCssPrefix;

    this._axisGroup = renderer.g().attr({ class: `${classSelector}axis` }).enableLinks();
    this._axisStripGroup = renderer.g().attr({ class: `${classSelector}strips` });
    this._axisGridGroup = renderer.g().attr({ class: `${classSelector}grid` });
    this._axisElementsGroup = renderer.g().attr({ class: `${classSelector}elements` });
    this._axisLineGroup = renderer.g().attr({ class: `${classSelector}line` }).linkOn(this._axisGroup, 'axisLine').linkAppend();
    this._axisTitleGroup = renderer.g().attr({ class: `${classSelector}title` }).append(this._axisGroup);

    this._axisConstantLineGroups = {
      above: this._createAxisConstantLineGroups(),
      under: this._createAxisConstantLineGroups(),
    };

    this._axisStripLabelGroup = renderer.g().attr({ class: `${classSelector}axis-labels` });
  }

  _clearAxisGroups(): void {
    this._axisGroup.remove();
    this._axisStripGroup.remove();
    this._axisStripLabelGroup.remove();
    this._axisConstantLineGroups.above.remove();
    this._axisConstantLineGroups.under.remove();
    this._axisGridGroup.remove();

    this._axisTitleGroup.clear();
    if (!this._options.label.template || !this.isRendered()) { // for react async templates
      this._axisElementsGroup.remove();
      this._axisElementsGroup.clear();
    }

    this._axisLineGroup && this._axisLineGroup.clear();
    this._axisStripGroup && this._axisStripGroup.clear();
    this._axisGridGroup && this._axisGridGroup.clear();
    this._axisConstantLineGroups.above.clear();
    this._axisConstantLineGroups.under.clear();
    this._axisStripLabelGroup && this._axisStripLabelGroup.clear();
  }

  _getLabelFormatObject(value: ThemeValue, labelOptions: ThemeValue, range?: ThemeValue, point?: ThemeValue, tickInterval?: ThemeValue, ticks?: ThemeValue[]): LabelFormatObject {
    range = range || this._getViewportRange();

    const formatObject: LabelFormatObject = {
      value,
      valueText: _format(value, {
        labelOptions,
        ticks: ticks || convertTicksToValues(this._majorTicks),
        tickInterval: tickInterval ?? this._tickInterval,
        dataType: this._options.dataType,
        logarithmBase: this._options.logarithmBase,
        type: this._options.type,
        showTransition: !this._options.marker.visible,
        point,
      }) || '',

      // B252346
      min: range.minVisible,
      max: range.maxVisible,
    };

    // for crosshair's customizeText
    if (point) {
      formatObject.point = point;
    }

    return formatObject;
  }

  formatLabel(value: ThemeValue, labelOptions: ThemeValue, range?: ThemeValue, point?: ThemeValue, tickInterval?: ThemeValue, ticks?: ThemeValue[]): string {
    const formatObject = this._getLabelFormatObject(value, labelOptions, range, point, tickInterval, ticks);

    return isFunction(labelOptions.customizeText) ? labelOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText;
  }

  formatHint(value: ThemeValue, labelOptions: ThemeValue, range?: ThemeValue): string | undefined {
    const formatObject = this._getLabelFormatObject(value, labelOptions, range);

    return isFunction(labelOptions.customizeHint) ? labelOptions.customizeHint.call(formatObject, formatObject) : undefined;
  }

  formatRange(startValue: ThemeValue, endValue: ThemeValue, interval: ThemeValue, argumentFormat: ThemeValue): string {
    return formatRange({
      startValue, endValue, tickInterval: interval, argumentFormat, axisOptions: this.getOptions(),
    });
  }

  _setTickOffset(): void {
    const options = this._options;
    const discreteAxisDivisionMode = options.discreteAxisDivisionMode;
    this._tickOffset = +(discreteAxisDivisionMode !== 'crossLabels' || !discreteAxisDivisionMode);
  }

  // T1068023,T948359
  aggregatedPointBetweenTicks(): boolean {
    return this._options.aggregatedPointsPosition === 'crossTicks';
  }

  resetApplyingAnimation(isFirstDrawing?: boolean): void {
    this._resetApplyingAnimation = true;
    if (isFirstDrawing) {
      this._firstDrawing = true;
    }
  }

  isFirstDrawing(): boolean {
    return this._firstDrawing;
  }

  getMargins(): Margins {
    const that = this;
    const {
      position, offset, customPosition, placeholderSize, grid, tick, crosshairMargin,
    } = that._options;
    const isDefinedCustomPositionOption = isDefined(customPosition);
    const boundaryPosition = that.getResolvedBoundaryPosition();
    const canvas = that.getCanvas();
    const cLeft = canvas.left;
    const cTop = canvas.top;
    const cRight = canvas.width - canvas.right;
    const cBottom = canvas.height - canvas.bottom;
    const edgeMarginCorrection = _max(grid.visible && grid.width || 0, tick.visible && tick.width || 0);
    const constantLineAboveSeries = that._axisConstantLineGroups.above;
    const constantLineUnderSeries = that._axisConstantLineGroups.under;
    const boxes = [that._axisElementsGroup,
      constantLineAboveSeries.outside1, constantLineAboveSeries.outside2,
      constantLineUnderSeries.outside1, constantLineUnderSeries.outside2,
      that._axisLineGroup,
    ]
      .map((group) => group && group.getBBox())
      .concat((function (group: ThemeValue): ThemeValue {
        const box = group && group.getBBox();

        if (!box || box.isEmpty) {
          return box;
        }
        if (that._isHorizontal) {
          box.x = cLeft;
          box.width = cRight - cLeft;
        } else {
          box.y = cTop;
          box.height = cBottom - cTop;
        }
        return box;
      })(that._axisTitleGroup));

    const margins = calculateCanvasMargins(boxes, canvas);

    margins[position] += crosshairMargin;

    if (that.hasNonBoundaryPosition() && isDefinedCustomPositionOption) {
      margins[boundaryPosition] = 0;
    }
    if (placeholderSize) {
      margins[position] = placeholderSize;
    }

    if (edgeMarginCorrection) {
      if (that._isHorizontal && canvas.right < edgeMarginCorrection && margins.right < edgeMarginCorrection) {
        margins.right = edgeMarginCorrection;
      }
      if (!that._isHorizontal && canvas.bottom < edgeMarginCorrection && margins.bottom < edgeMarginCorrection) {
        margins.bottom = edgeMarginCorrection;
      }
    }

    if (!isDefinedCustomPositionOption && isDefined(offset)) {
      const moveByOffset = that.customPositionIsBoundary()
                && ((offset > 0 && (boundaryPosition === LEFT || boundaryPosition === TOP))
                || (offset < 0 && (boundaryPosition === RIGHT || boundaryPosition === BOTTOM)));
      margins[boundaryPosition] -= moveByOffset ? offset : 0;
    }

    return margins;
  }

  validateUnit(unit: ThemeValue, idError?: string, parameters?: string): ThemeValue {
    unit = this.parser(unit);
    if (unit === undefined && idError) {
      this._incidentOccurred(idError, [parameters]);
    }
    return unit;
  }

  _setType(axisType: string, drawingType: string): void {
    let axisTypeMethods;

    switch (axisType) {
      case 'xyAxes':
        axisTypeMethods = xyMethods;
        break;
      case 'polarAxes':
        axisTypeMethods = polarMethods;
        break;
    }

    extend(this, axisTypeMethods[drawingType]);
  }

  _getSharpParam(opposite?: boolean): boolean;

  _getSharpParam(): boolean {
    return true;
  }

  // public
  dispose(): void {
    [this._axisElementsGroup, this._axisStripGroup, this._axisGroup].forEach((g) => { g.dispose(); });

    this._strips = this._title = null;

    this._axisStripGroup = this._axisConstantLineGroups = this._axisStripLabelGroup = this._axisBreaksGroup = null;
    this._axisLineGroup = this._axisElementsGroup = this._axisGridGroup = null;
    this._axisGroup = this._axisTitleGroup = null;
    this._axesContainerGroup = this._stripsGroup = this._constantLinesGroup = this._labelsAxesGroup = null;

    this._renderer = this._options = this._textOptions = this._textFontStyles = null;
    // @ts-expect-error the disposed axis drops its translator
    this._translator = null;
    this._majorTicks = this._minorTicks = null;
    this._disposeBreaksGroup();
    this._templatesRendered && this._templatesRendered.reject();
  }

  getOptions(): ThemeValue {
    return this._options;
  }

  setPane(pane: string): void {
    this.pane = pane;
    this._options.pane = pane;
  }

  setTypes(type: string, axisType: string, typeSelector: string): void {
    this._options.type = type || this._options.type;
    this._options[typeSelector] = axisType || this._options[typeSelector];

    this._updateTranslator();
  }

  resetTypes(typeSelector: string): void {
    this._options.type = this._initTypes.type;
    this._options[typeSelector] = this._initTypes[typeSelector];
  }

  getTranslator(): Translator2DInstance {
    return this._translator;
  }

  updateOptions(options: ThemeValue): void {
    const labelOpt = options.label;

    validateAxisOptions(options);
    this._options = options;

    options.tick = options.tick || {};
    options.minorTick = options.minorTick || {};
    options.grid = options.grid || {};
    options.minorGrid = options.minorGrid || {};
    options.title = options.title || {};
    options.marker = options.marker || {};

    this._initTypes = {
      type: options.type,
      argumentType: options.argumentType,
      valueType: options.valueType,
    };
    this._setTickOffset();

    this._isHorizontal = options.isHorizontal;
    this.pane = options.pane ?? this.pane;
    this.name = options.name;
    this.priority = options.priority;

    this._hasLabelFormat = labelOpt.format !== '' && isDefined(labelOpt.format);
    this._textOptions = {
      opacity: labelOpt.opacity,
      align: 'center',
      class: labelOpt.cssClass,
    };
    this._textFontStyles = patchFontOptions(labelOpt.font);

    if (options.type === constants.logarithmic) {
      if (options.logarithmBaseError) {
        this._incidentOccurred('E2104');
        delete options.logarithmBaseError;
      }
    }

    this._updateTranslator();
    this._createConstantLines();
    this._strips = (options.strips || []).map((o) => createStrip(this, o));
    this._majorTicks = this._minorTicks = null;
    this._firstDrawing = true;
  }

  calculateInterval(value: ThemeValue, prevValue: ThemeValue): number {
    const options = this._options;

    if (!options || (options.type !== constants.logarithmic)) {
      return _abs(value - prevValue);
    }
    const { allowNegatives, linearThreshold } = new Range(this.getTranslator().getBusinessRange());
    return _abs(getLog(value, options.logarithmBase, allowNegatives, linearThreshold) - getLog(prevValue, options.logarithmBase, allowNegatives, linearThreshold));
  }

  getCanvasRange(): { startValue: ThemeValue; endValue: ThemeValue } {
    const translator = this._translator;
    return {
      startValue: translator.from(translator.translate('canvas_position_start')),
      endValue: translator.from(translator.translate('canvas_position_end')),
    };
  }

  _processCanvas(canvas: ThemeValue): ThemeValue {
    return canvas;
  }

  updateCanvas(canvas: ThemeValue, canvasRedesign?: boolean): void {
    if (!canvasRedesign) {
      const positions: OrthogonalPositions = this._orthogonalPositions = {
        start: !this._isHorizontal ? canvas.left : canvas.top,
        end: !this._isHorizontal ? canvas.width - canvas.right : canvas.height - canvas.bottom,
      };
      positions.center = positions.start + (positions.end - positions.start) / 2;
    } else {
      this._orthogonalPositions = null;
    }

    this._canvas = canvas;
    this._translator.updateCanvas(this._processCanvas(canvas));

    this._initAxisPositions();
  }

  getCanvas(): ThemeValue {
    return this._canvas;
  }

  getAxisShift(): number {
    return this._axisShift || 0;
  }

  hideTitle(): void {
    if (this._options.title.text) {
      this._incidentOccurred('W2105', [this._isHorizontal ? 'horizontal' : 'vertical']);
      this._axisTitleGroup.clear();
    }
  }

  getTitle(): ThemeValue {
    return this._title;
  }

  hideOuterElements(): void {
    const options = this._options;

    if ((options.label.visible || this._outsideConstantLines.length) && !this._translator.getBusinessRange().isEmpty()) {
      this._incidentOccurred('W2106', [this._isHorizontal ? 'horizontal' : 'vertical']);
      this._axisElementsGroup.clear();
      callAction(this._outsideConstantLines, 'removeLabel');
    }
  }

  _resolveLogarithmicOptionsForRange(range: RangeInstance): void {
    const options = this._options;
    if (options.type === constants.logarithmic) {
      range.addRange({
        allowNegatives: options.allowNegatives !== undefined ? options.allowNegatives : range.min <= 0,
      });
      if (!isNaN(options.linearThreshold)) {
        range.linearThreshold = options.linearThreshold;
      }
    }
  }

  adjustViewport(businessRange: RangeData): RangeInstance {
    const options = this._options;
    const isDiscrete = options.type === constants.discrete;
    let categories = this._seriesData && this._seriesData.categories || [];
    const wholeRange = this.adjustRange(getVizRangeObject(options.wholeRange));
    const visualRange = this.getViewport() || {};

    const result = new Range(businessRange);
    this._addConstantLinesToRange(result);

    let minDefined = isDefined(visualRange.startValue);
    let maxDefined = isDefined(visualRange.endValue);

    if (!isDiscrete) {
      minDefined = minDefined && (!isDefined(wholeRange.endValue) || visualRange.startValue < wholeRange.endValue);
      maxDefined = maxDefined && (!isDefined(wholeRange.startValue) || visualRange.endValue > wholeRange.startValue);
    }

    const minVisible = minDefined ? visualRange.startValue : result.minVisible;
    const maxVisible = maxDefined ? visualRange.endValue : result.maxVisible;

    if (!isDiscrete) {
      result.min = wholeRange.startValue ?? result.min;
      result.max = wholeRange.endValue ?? result.max;
    } else {
      const categoriesInfo = getCategoriesInfo(categories, wholeRange.startValue, wholeRange.endValue);

      categories = categoriesInfo.categories;
      result.categories = categories;
    }

    const adjustedVisualRange = adjustVisualRange({
      axisType: options.type,
      dataType: options.dataType,
      base: options.logarithmBase,
    }, {
      startValue: minDefined ? visualRange.startValue : undefined,
      endValue: maxDefined ? visualRange.endValue : undefined,
      length: visualRange.length,
    }, {
      categories,
      min: wholeRange.startValue,
      max: wholeRange.endValue,
    }, {
      categories,
      min: minVisible,
      max: maxVisible,
    });

    result.minVisible = adjustedVisualRange.startValue;
    result.maxVisible = adjustedVisualRange.endValue;

    !isDefined(result.min) && (result.min = result.minVisible);
    !isDefined(result.max) && (result.max = result.maxVisible);
    result.addRange({}); // controlValuesByVisibleBounds
    this._resolveLogarithmicOptionsForRange(result);

    return result;
  }

  adjustRange(range?: ThemeValue): ThemeValue {
    range = range || {};
    const isDiscrete = this._options.type === constants.discrete;
    const isLogarithmic = this._options.type === constants.logarithmic;

    const disabledNegatives = this._options.allowNegatives === false;
    if (isLogarithmic) {
      range.startValue = disabledNegatives && range.startValue <= 0 ? null : range.startValue;
      range.endValue = disabledNegatives && range.endValue <= 0 ? null : range.endValue;
    }
    if (!isDiscrete && isDefined(range.startValue) && isDefined(range.endValue) && range.startValue > range.endValue) {
      const tmp = range.endValue;
      range.endValue = range.startValue;
      range.startValue = tmp;
    }

    return range;
  }

  _getVisualRangeUpdateMode(viewport: ThemeValue, newRange: ThemeValue, oppositeValue?: string): string {
    let value = this._options.visualRangeUpdateMode;
    const translator = this._translator;
    const range = this._seriesData;
    const prevDataInfo = this._prevDataInfo;

    if (prevDataInfo.isEmpty && !prevDataInfo.containsConstantLine) {
      return KEEP;
    }

    if (!this.isArgumentAxis) {
      const viewport = this.getViewport();
      const isViewportNotDefined = !isDefined(viewport.startValue) && !isDefined(viewport.endValue) && !isDefined(viewport.length);

      if (isViewportNotDefined) {
        const visualRange = this.visualRange();
        const isVisualRangeNotDefined = !isDefined(visualRange.startValue) && !isDefined(visualRange.endValue);

        if (isVisualRangeNotDefined) {
          return RESET;
        }
      }
    }

    if (this.isArgumentAxis) {
      if (![SHIFT, KEEP, RESET].includes(value)) {
        if (range.axisType === constants.discrete) {
          const categories = range.categories;
          const newCategories = newRange.categories;
          const visualRange = this.visualRange();
          if (categories
                        && newCategories
                        && categories.length
                        && newCategories.map((c) => c.valueOf()).join(',').indexOf(categories.map((c) => c.valueOf()).join(',')) !== -1
                        && (visualRange.startValue.valueOf() !== categories[0].valueOf()
                            || visualRange.endValue.valueOf() !== categories[categories.length - 1].valueOf())
          ) {
            value = KEEP;
          } else {
            value = RESET;
          }
        } else {
          const minPoint = translator.translate(range.min);
          const minVisiblePoint = translator.translate(viewport.startValue);

          const maxPoint = translator.translate(range.max);
          const maxVisiblePoint = translator.translate(viewport.endValue);

          if (minPoint === minVisiblePoint && maxPoint === maxVisiblePoint) {
            value = RESET;
          } else if (minPoint !== minVisiblePoint && maxPoint === maxVisiblePoint) {
            value = SHIFT;
          } else {
            value = KEEP;
          }
        }

        if (value === KEEP && prevDataInfo.isEmpty && prevDataInfo.containsConstantLine) {
          value = RESET;
        }
      }
    } else if (![KEEP, RESET].includes(value)) {
      if (oppositeValue === KEEP) {
        value = KEEP;
      } else {
        value = RESET;
      }
    }

    return value;
  }

  _handleBusinessRangeChanged(oppositeVisualRangeUpdateMode: string | undefined, axisReinitialized: boolean | undefined, newRange: ThemeValue): void {
    const visualRange = this.visualRange();

    if (axisReinitialized || this._translator.getBusinessRange().isEmpty()) {
      return;
    }

    const visualRangeUpdateMode = this._lastVisualRangeUpdateMode = this._getVisualRangeUpdateMode(visualRange, newRange, oppositeVisualRangeUpdateMode);

    if (visualRangeUpdateMode === KEEP) {
      this._setVisualRange([visualRange.startValue, visualRange.endValue]);
    } else if (visualRangeUpdateMode === RESET) {
      this._setVisualRange([null, null]);
    } else if (visualRangeUpdateMode === SHIFT) {
      this._setVisualRange({ length: this.getVisualRangeLength() });
    }
  }

  getVisualRangeLength(range?: ThemeValue): number {
    const currentBusinessRange = range || this._translator.getBusinessRange();
    const { type } = this._options;
    let length;
    if (type === constants.logarithmic) {
      length = adjust(this.calculateInterval(currentBusinessRange.maxVisible, currentBusinessRange.minVisible));
    } else if (type === constants.discrete) {
      const categoriesInfo = getCategoriesInfo(currentBusinessRange.categories, currentBusinessRange.minVisible, currentBusinessRange.maxVisible);
      length = categoriesInfo.categories.length;
    } else {
      length = currentBusinessRange.maxVisible - currentBusinessRange.minVisible;
    }
    return length;
  }

  _getTickIntervalValue(): number {
    const tickInterval = this.getTickInterval();

    if (!isDefined(tickInterval)) {
      return 0;
    }

    return this._options.dataType === 'datetime' ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval;
  }

  getWholeRangeBreaks(): ThemeValue[] {
    const businessRange = this._translator.getBusinessRange();
    const { type } = this._options;

    if (type === constants.discrete
      || !isDefined(businessRange.min) || !isDefined(businessRange.max)) {
      return [];
    }

    const interval = this._getTickIntervalValue();

    return this._getBreaksForRange(businessRange.min, businessRange.max)
      .reduce((result, scaleBreak) => {
        const hidden = this._getHiddenDuration(scaleBreak, interval);
        const shift = (this.calculateInterval(scaleBreak.to, scaleBreak.from) - hidden) / 2;

        return hidden ? result.concat(extend({}, scaleBreak, {
          from: this._addToValue(scaleBreak.from, shift),
          to: this._addToValue(scaleBreak.to, -shift),
          cumulativeWidth: 0,
        })) : result;
      }, []);
  }

  _getBreaksForRange(minVisible: ThemeValue, maxVisible: ThemeValue): ThemeValue[] {
    const viewport = minVisible > maxVisible
      ? { minVisible: maxVisible, maxVisible: minVisible }
      : { minVisible, maxVisible };
    const breaks = this._getScaleBreaks(this._options, viewport, this._series, this.isArgumentAxis);

    return this._filterBreaks(breaks, viewport, this._options.breakStyle);
  }

  _getHiddenDuration(scaleBreak: ThemeValue, tickInterval: number): number {
    const duration = this.calculateInterval(scaleBreak.to, scaleBreak.from);

    return scaleBreak.gapSize ? duration : Math.max(duration - tickInterval, 0);
  }

  getVisualRangeLengthWithoutBreaks(range?: ThemeValue): number {
    const businessRange = range || this._translator.getBusinessRange();
    const length = this.getVisualRangeLength(businessRange);
    const options = this._options;

    if (options.type === constants.discrete
      || !isDefined(businessRange.minVisible) || !isDefined(businessRange.maxVisible)) {
      return length;
    }

    const interval = this._getTickIntervalValue();

    return this._getBreaksForRange(businessRange.minVisible, businessRange.maxVisible)
      .reduce((result, scaleBreak) => result - this._getHiddenDuration(scaleBreak, interval), length);
  }

  _addToValue(value: ThemeValue, diff: number): ThemeValue {
    if (this._options.type === constants.logarithmic) {
      const translator = this.getTranslator();

      return translator.toValue(translator.fromValue(value) + diff);
    }

    return isDate(value) ? new Date(value.getTime() + diff) : value + diff;
  }

  adjustPannedRange(range: ThemeValue, anchor?: 'start' | 'end'): ThemeValue {
    const storedParams = this._storedZoomEndParams;
    const { type } = this._options;

    if (!storedParams || type === constants.discrete) {
      return range;
    }

    const { startRange } = storedParams;

    if (!this._getBreaksForRange(range.startValue, range.endValue).length
      && !this._getBreaksForRange(startRange.startValue, startRange.endValue).length) {
      return range;
    }

    const isReversed = range.startValue > range.endValue;

    if (isReversed) {
      const reordered = this.adjustPannedRange({ startValue: range.endValue, endValue: range.startValue }, anchor);

      return { startValue: reordered.endValue, endValue: reordered.startValue };
    }

    const targetLength = this.getVisualRangeLengthWithoutBreaks({
      minVisible: startRange.startValue,
      maxVisible: startRange.endValue,
    });

    if (!targetLength) {
      return range;
    }

    const tolerance = targetLength * PANNING_CORRECTION_PRECISION;
    const bounds = this.getZoomBounds();
    const keepsEndValue = anchor
      ? anchor === 'end'
      : range.startValue > startRange.startValue || range.endValue > startRange.endValue;
    let result = range;
    let current = range;
    let bestDeviation = Infinity;

    for (let i = 0; i < PANNING_CORRECTION_ITERATION_COUNT; i += 1) {
      const delta = this.getVisualRangeLengthWithoutBreaks({
        minVisible: current.startValue,
        maxVisible: current.endValue,
      }) - targetLength;
      const deviation = Math.abs(delta);

      if (deviation < bestDeviation) {
        bestDeviation = deviation;
        result = current;
      }

      if (deviation <= tolerance) {
        break;
      }

      const shifted = keepsEndValue
        ? { startValue: this._addToValue(current.startValue, delta), endValue: current.endValue }
        : { startValue: current.startValue, endValue: this._addToValue(current.endValue, -delta) };

      current = {
        startValue: shifted.startValue < bounds.startValue ? bounds.startValue : shifted.startValue,
        endValue: shifted.endValue > bounds.endValue ? bounds.endValue : shifted.endValue,
      };

      if (current.startValue >= current.endValue) {
        break;
      }
    }

    return result;
  }

  getVisualRangeCenter(range?: ThemeValue, useMerge?: boolean): ThemeValue {
    const translator = this.getTranslator();
    const businessRange = translator.getBusinessRange();
    const currentBusinessRange = useMerge ? extend(true, {}, businessRange, range || {}) : range || businessRange;
    const { type, logarithmBase } = this._options;
    let center;

    if (!isDefined(currentBusinessRange.minVisible) || !isDefined(currentBusinessRange.maxVisible)) {
      return;
    }

    if (type === constants.logarithmic) {
      const {
        allowNegatives, linearThreshold, minVisible, maxVisible,
      } = currentBusinessRange;
      center = raiseTo(adjust(getLog(maxVisible, logarithmBase, allowNegatives, linearThreshold) + getLog(minVisible, logarithmBase, allowNegatives, linearThreshold)) / 2, logarithmBase, allowNegatives, linearThreshold);
    } else if (type === constants.discrete) {
      const categoriesInfo = getCategoriesInfo(currentBusinessRange.categories, currentBusinessRange.minVisible, currentBusinessRange.maxVisible);
      const index = Math.ceil(categoriesInfo.categories.length / 2) - 1;
      // @ts-expect-error a discrete range always has categories
      center = businessRange.categories.indexOf(categoriesInfo.categories[index]);
    } else {
      center = translator.toValue((currentBusinessRange.maxVisible.valueOf() + currentBusinessRange.minVisible.valueOf()) / 2);
    }
    return center;
  }

  setBusinessRange(range: RangeData, axisReinitialized?: boolean, oppositeVisualRangeUpdateMode?: string, argCategories?: ThemeValue): void {
    const options = this._options;
    const isDiscrete = options.type === constants.discrete;

    this._handleBusinessRangeChanged(oppositeVisualRangeUpdateMode, axisReinitialized, range);
    this._seriesData = new Range(range);
    const dataIsEmpty = this._seriesData.isEmpty();

    const rangeWithConstantLines = new Range(this._seriesData);

    this._addConstantLinesToRange(rangeWithConstantLines);
    this._prevDataInfo = {
      isEmpty: dataIsEmpty,
      containsConstantLine: rangeWithConstantLines.containsConstantLine,
    };

    this._seriesData.addRange({
      categories: options.categories,
      dataType: options.dataType,
      axisType: options.type,
      base: options.logarithmBase,
      invert: options.inverted,
    });

    this._resolveLogarithmicOptionsForRange(this._seriesData);

    if (!isDiscrete) {
      if (!isDefined(this._seriesData.min) && !isDefined(this._seriesData.max)) {
        const visualRange = this.getViewport();
        visualRange && this._seriesData.addRange({
          min: visualRange.startValue,
          max: visualRange.endValue,
        });
      }
      const synchronizedValue = options.synchronizedValue;
      if (isDefined(synchronizedValue)) {
        this._seriesData.addRange({
          min: synchronizedValue,
          max: synchronizedValue,
        });
      }
    }

    this._seriesData.minVisible = this._seriesData.minVisible ?? this._seriesData.min;
    this._seriesData.maxVisible = this._seriesData.maxVisible ?? this._seriesData.max;

    if (!this.isArgumentAxis && options.showZero) {
      this._seriesData.correctValueZeroLevel();
    }
    this._seriesData.sortCategories(this.getCategoriesSorter(argCategories));

    this._seriesData.userBreaks = this._seriesData.isEmpty() ? [] : this._getScaleBreaks(options, this._seriesData, this._series, this.isArgumentAxis);

    this._translator.updateBusinessRange(this._getViewportRange());
  }

  _addConstantLinesToRange(dataRange: RangeInstance): void {
    this._outsideConstantLines.concat(this._insideConstantLines || []).forEach((cl) => {
      if (cl.options.extendAxis) {
        const value = cl.getParsedValue();
        dataRange.addRange({
          containsConstantLine: true,
          minVisible: value,
          maxVisible: value,
          min: !isDefined(dataRange.min) ? value : dataRange.min,
          max: !isDefined(dataRange.max) ? value : dataRange.max,
        });
      }
    });
  }

  setGroupSeries(series: ThemeValue[]): void {
    this._series = series;
  }

  getLabelsPosition(): number {
    const options = this._options;
    const position = options.position;
    const labelShift = options.label.indentFromAxis + (this._axisShift || 0) + this._constantLabelOffset;
    const axisPosition = this._axisPosition;

    return position === TOP || position === LEFT ? axisPosition - labelShift : axisPosition + labelShift;
  }

  getFormattedValue(value: ThemeValue, options: ThemeValue, point?: ThemeValue): string | null {
    const labelOptions = this._options.label;

    return isDefined(value) ? this.formatLabel(value, extend(true, {}, labelOptions, options), undefined, point) : null;
  }

  _getBoundaryTicks(majors: ThemeValue[], viewPort: ThemeValue): ThemeValue[] {
    const length = majors.length;
    const options = this._options;
    const customBounds = options.customBoundTicks;
    const min = viewPort.minVisible;
    const max = viewPort.maxVisible;
    const addMinMax = options.showCustomBoundaryTicks ? this._boundaryTicksVisibility : {};
    let boundaryTicks: ThemeValue[] = [];

    if (options.type === constants.discrete) {
      if (this._tickOffset && majors.length !== 0) {
        boundaryTicks = [majors[0], majors[majors.length - 1]];
      }
    } else if (customBounds) {
      if (addMinMax.min && isDefined(customBounds[0])) {
        boundaryTicks.push(customBounds[0]);
      }

      if (addMinMax.max && isDefined(customBounds[1])) {
        boundaryTicks.push(customBounds[1]);
      }
    } else {
      if (addMinMax.min && (length === 0 || majors[0] > min)) {
        boundaryTicks.push(min);
      }

      if (addMinMax.max && (length === 0 || majors[length - 1] < max)) {
        boundaryTicks.push(max);
      }
    }
    return boundaryTicks;
  }

  setPercentLabelFormat(): void {
    if (!this._hasLabelFormat) {
      this._options.label.format = 'percent';
    }
  }

  resetAutoLabelFormat(): void {
    if (!this._hasLabelFormat) {
      delete this._options.label.format;
    }
  }

  getMultipleAxesSpacing(): number {
    return this._options.multipleAxesSpacing || 0;
  }

  getTicksValues(): { majorTicksValues: ThemeValue[]; minorTicksValues: ThemeValue[] } {
    return {
      majorTicksValues: convertTicksToValues(this._majorTicks),
      minorTicksValues: convertTicksToValues(this._minorTicks),
    };
  }

  estimateTickInterval(canvas: ThemeValue): boolean {
    this.updateCanvas(canvas);
    return this._tickInterval !== this._getTicks(this._getViewportRange(), _noop, true).tickInterval;
  }

  setTicks(ticks: ThemeValue): void {
    const majors = ticks.majorTicks || [];
    this._majorTicks = majors.map(createMajorTick(this, this._renderer, this._getSkippedCategory(majors)));
    this._minorTicks = (ticks.minorTicks || []).map(createMinorTick(this, this._renderer));
    this._isSynchronized = true;
  }

  _adjustDivisionFactor(val: number): number {
    return val;
  }

  _getTicks(viewPort: ThemeValue, incidentOccurred?: IncidentOccurred, skipTickGeneration?: boolean): ThemeValue {
    const options = this._options;
    const customTicks = options.customTicks;
    const customMinorTicks = options.customMinorTicks;

    return getTickGenerator(options, incidentOccurred || this._incidentOccurred, skipTickGeneration, this._translator.getBusinessRange().isEmpty(), this._adjustDivisionFactor.bind(this), viewPort)(
      {
        min: viewPort.minVisible,
        max: viewPort.maxVisible,
        categories: viewPort.categories,
        isSpacedMargin: viewPort.isSpacedMargin,
      },
      this._getScreenDelta(),
      options.tickInterval,
      options.label.overlappingBehavior === 'ignore' || options.forceUserTickInterval,
      {
        majors: customTicks,
        minors: customMinorTicks,
      },
      options.minorTickInterval,
      options.minorTickCount,
      this._initialBreaks,
    );
  }

  _createTicksAndLabelFormat(range: RangeInstance, incidentOccurred?: IncidentOccurred): ThemeValue {
    const options = this._options;
    const ticks = this._getTicks(range, incidentOccurred, false);

    if (!range.isEmpty() && options.type === constants.discrete && options.dataType === 'datetime' && !this._hasLabelFormat && ticks.ticks.length) {
      // @ts-expect-error getDateFormatByTicks is not in the FormatHelper typings
      options.label.format = formatHelper.getDateFormatByTicks(ticks.ticks);
    }

    return ticks;
  }

  getAggregationInfo(useAllAggregatedPoints: boolean, range: ThemeValue): { interval: ThemeValue; ticks: ThemeValue[] } {
    const options = this._options;

    const businessRange = new Range(this.getTranslator().getBusinessRange()).addRange(range);
    const visualRange = this.getViewport();

    const minVisible = visualRange?.startValue ?? businessRange.minVisible;
    const maxVisible = visualRange?.endValue ?? businessRange.maxVisible;

    const aggregationInterval = options.aggregationInterval;
    const aggregationGroupWidth = this._getAggregationGroupWidth();

    const minInterval = !options.aggregationGroupWidth && !aggregationInterval && range.interval;
    const generateTicks = configureGenerator(options, aggregationGroupWidth, businessRange, this._getScreenDelta(), minInterval);

    const tickInterval = generateTicks(aggregationInterval, true, minVisible, maxVisible, this._seriesData?.breaks).tickInterval;
    const ticks = this._generateTick(useAllAggregatedPoints, businessRange, minVisible, maxVisible, tickInterval, generateTicks);

    this._aggregationInterval = tickInterval;

    return {
      interval: tickInterval,
      ticks,
    };
  }

  _getAggregationGroupWidth(): number | undefined {
    const { checkInterval, sizePointNormalState } = this._marginOptions || {};
    const { aggregationGroupWidth, axisDivisionFactor } = this._options;

    if (aggregationGroupWidth) {
      return aggregationGroupWidth;
    }

    if (sizePointNormalState) {
      return Math.min(sizePointNormalState, axisDivisionFactor);
    }

    if (checkInterval) {
      return axisDivisionFactor;
    }

    return aggregationGroupWidth;
  }

  _generateTick(useAllAggregatedPoints: boolean, businessRange: RangeInstance, minVisible: ThemeValue, maxVisible: ThemeValue, tickInterval: ThemeValue, generateTicks: TicksGenerator): ThemeValue[] {
    const min = useAllAggregatedPoints ? businessRange.min : minVisible;
    const max = useAllAggregatedPoints ? businessRange.max : maxVisible;

    if (!isDefined(min) || !isDefined(max)) {
      return [];
    }

    const options = this._options;

    const add = getAddFunction({
      base: options.logarithmBase,
      axisType: options.type,
      dataType: options.dataType,
    }, false);

    let start = min;
    let end = max;

    if (!useAllAggregatedPoints && isDefined(tickInterval)) {
      const maxMinDistance = Math.max(this.calculateInterval(max, min), options.dataType === 'datetime' ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval);
      start = add(min, maxMinDistance, -1);
      end = add(max, maxMinDistance);
    }

    start = start < businessRange.min ? businessRange.min : start;
    end = end > businessRange.max ? businessRange.max : end;

    const breaks = this._getScaleBreaks(options, {
      minVisible: start,
      maxVisible: end,
    }, this._series, this.isArgumentAxis);

    const filteredBreaks = this._filterBreaks(breaks, {
      minVisible: start,
      maxVisible: end,
    }, options.breakStyle);

    return generateTicks(tickInterval, false, start, end, filteredBreaks).ticks;
  }

  getTickInterval(): ThemeValue {
    return this._tickInterval;
  }

  getAggregationInterval(): ThemeValue {
    return this._aggregationInterval;
  }

  createTicks(canvas: ThemeValue): void {
    const renderer = this._renderer;
    const options = this._options;

    if (!canvas) {
      return;
    }

    this._isSynchronized = false;
    this.updateCanvas(canvas);

    const range = this._getViewportRange();
    // @ts-expect-error setBusinessRange() sets userBreaks before the ticks are created
    this._initialBreaks = range.breaks = this._seriesData.breaks = this._filterBreaks(this._seriesData.userBreaks, range, options.breakStyle);

    this._estimatedTickInterval = this._getTicks(this.adjustViewport(this._seriesData), _noop, true).tickInterval; // tickInterval calculation

    const margins = this._calculateValueMargins();

    range.addRange({
      minVisible: margins.minValue,
      maxVisible: margins.maxValue,
      isSpacedMargin: margins.isSpacedMargin,
    });

    const ticks = this._createTicksAndLabelFormat(range);

    const boundaryTicks = this._getBoundaryTicks(ticks.ticks, this._getViewportRange());
    if (options.showCustomBoundaryTicks && boundaryTicks.length) {
      this._boundaryTicks = [boundaryTicks[0]].map(createBoundaryTick(this, renderer, true));
      if (boundaryTicks.length > 1) {
        this._boundaryTicks = this._boundaryTicks.concat([boundaryTicks[1]].map(createBoundaryTick(this, renderer, false)));
      }
    } else {
      this._boundaryTicks = [];
    }

    const minors = (ticks.minorTicks || []).filter((minor) => !boundaryTicks.some((boundary) => valueOf(boundary) === valueOf(minor)));

    this._tickInterval = ticks.tickInterval;
    this._minorTickInterval = ticks.minorTickInterval;

    const oldMajorTicks = this._majorTicks || [];
    const majorTicksByValues = oldMajorTicks.reduce((r, t) => {
      r[t.value.valueOf()] = t;
      return r;
    }, {});

    const sameType = type(ticks.ticks[0]) === type(oldMajorTicks[0] && oldMajorTicks[0].value);
    const skippedCategory = this._getSkippedCategory(ticks.ticks);
    const majorTicks = ticks.ticks.map((v) => {
      const tick = majorTicksByValues[v.valueOf()];
      if (tick && sameType) {
        delete majorTicksByValues[v.valueOf()];
        tick.setSkippedCategory(skippedCategory);
        return tick;
      } else {
        return createMajorTick(this, renderer, skippedCategory)(v);
      }
    });

    this._majorTicks = majorTicks;

    const oldMinorTicks = this._minorTicks || [];

    this._minorTicks = minors.map((v, i) => {
      const minorTick = oldMinorTicks[i];
      if (minorTick) {
        minorTick.updateValue(v);
        return minorTick;
      }
      return createMinorTick(this, renderer)(v);
    });

    this._ticksToRemove = Object.keys(majorTicksByValues)
      .map((k) => majorTicksByValues[k]).concat(oldMinorTicks.slice(this._minorTicks.length, oldMinorTicks.length));
    this._ticksToRemove.forEach((t) => t.label?.removeTitle());

    if (ticks.breaks) {
      this._seriesData.breaks = ticks.breaks;
    }
    this._reinitTranslator(this._getViewportRange());
  }

  _reinitTranslator(range: RangeData): void {
    const translator = this._translator;

    if (this._isSynchronized) {
      return;
    }

    translator.updateBusinessRange(range);
  }

  _getViewportRange(): RangeInstance {
    return this.adjustViewport(this._seriesData);
  }

  setMarginOptions(options: ThemeValue): void {
    this._marginOptions = options;
  }

  getMarginOptions(): ThemeValue {
    return this._marginOptions ?? {};
  }

  _calculateRangeInterval(interval: ThemeValue): number {
    const isDateTime = this._options.dataType === 'datetime';
    const minArgs: number[] = [];
    const addToArgs = function (value: ThemeValue): void {
      isDefined(value) && minArgs.push(isDateTime ? dateUtils.dateToMilliseconds(value) : value);
    };

    addToArgs(this._tickInterval);
    addToArgs(this._estimatedTickInterval);
    isDefined(interval) && minArgs.push(interval);
    addToArgs(this._aggregationInterval);

    return this._calculateWorkWeekInterval(_min.apply(this, minArgs));
  }

  _calculateWorkWeekInterval(businessInterval: number): number {
    const options = this._options;
    if (options.dataType === 'datetime' && options.workdaysOnly && businessInterval) {
      const workWeek = options.workWeek.length * dateIntervals.day;
      const weekend = dateIntervals.week - workWeek;
      if (workWeek !== businessInterval && weekend < businessInterval) {
        const weekendsCount = Math.ceil(businessInterval / dateIntervals.week);
        businessInterval -= weekend * weekendsCount;
      } else if (weekend >= businessInterval && businessInterval > dateIntervals.day) {
        businessInterval = dateIntervals.day;
      }
    }
    return businessInterval;
  }

  _getConvertIntervalCoefficient(intervalInPx: number, screenDelta: number): number {
    const ratioOfCanvasRange = this._translator.ratioOfCanvasRange();
    return ratioOfCanvasRange / (ratioOfCanvasRange * screenDelta / (intervalInPx + screenDelta));
  }

  _calculateValueMargins(ticks?: ThemeValue[]): ValueMargins {
    this._resetMargins();
    const margins = this.getMarginOptions();
    const marginSize = (margins.size || 0) / 2;
    const options = this._options;
    const dataRange = this._getViewportRange();
    const viewPort = this.getViewport();
    const screenDelta = this._getScreenDelta();
    const isDiscrete = (options.type || '').indexOf(constants.discrete) !== -1;
    const valueMarginsEnabled = options.valueMarginsEnabled && !isDiscrete && !this.customPositionIsBoundaryOrthogonalAxis();

    const translator = this._translator;

    const minValueMargin = options.minValueMargin;
    const maxValueMargin = options.maxValueMargin;

    let minPadding = 0;
    let maxPadding = 0;
    let interval = 0;
    let rangeInterval;

    if (!screenDelta) {
      return {
        startPadding: 0,
        endPadding: 0,
      };
    }

    if (this.isArgumentAxis && margins.checkInterval) {
      rangeInterval = this._calculateRangeInterval(dataRange.interval);
      const pxInterval = translator.getInterval(rangeInterval);
      if (isFinite(pxInterval)) {
        interval = Math.ceil(pxInterval / (2 * this._getConvertIntervalCoefficient(pxInterval, screenDelta)));
      } else {
        rangeInterval = 0;
      }
    }

    let minPercentPadding;
    let maxPercentPadding;

    const maxPaddingValue = (screenDelta * MAX_MARGIN_VALUE) / 2;

    if (valueMarginsEnabled) {
      if (isDefined(minValueMargin)) {
        minPercentPadding = isFinite(minValueMargin) ? minValueMargin : 0;
      } else if (!this.isArgumentAxis && margins.checkInterval && valueOf(dataRange.minVisible) > 0 && valueOf(dataRange.minVisible) === valueOf(dataRange.min)) {
        minPadding = MIN_BAR_MARGIN;
      } else {
        minPadding = Math.max(marginSize, interval);
        minPadding = Math.min(maxPaddingValue, minPadding);
      }

      if (isDefined(maxValueMargin)) {
        maxPercentPadding = isFinite(maxValueMargin) ? maxValueMargin : 0;
      } else if (!this.isArgumentAxis && margins.checkInterval && valueOf(dataRange.maxVisible) < 0 && valueOf(dataRange.maxVisible) === valueOf(dataRange.max)) {
        maxPadding = MIN_BAR_MARGIN;
      } else {
        maxPadding = Math.max(marginSize, interval);
        maxPadding = Math.min(maxPaddingValue, maxPadding);
      }
    }

    const percentStick = margins.percentStick && !this.isArgumentAxis;

    if (percentStick) {
      if (_abs(dataRange.max) === 1) {
        maxPadding = 0;
      }

      if (_abs(dataRange.min) === 1) {
        minPadding = 0;
      }
    }

    const canvasStartEnd = this._getCanvasStartEnd();

    const commonMargin = 1 + (minPercentPadding || 0) + (maxPercentPadding || 0);
    const screenDeltaWithMargins = ((screenDelta - minPadding - maxPadding) / commonMargin) || screenDelta;

    if (minPercentPadding !== undefined || maxPercentPadding !== undefined) {
      if (minPercentPadding !== undefined) {
        minPadding = screenDeltaWithMargins * minPercentPadding;
      }
      if (maxPercentPadding !== undefined) {
        maxPadding = screenDeltaWithMargins * maxPercentPadding;
      }
    }

    let minValue;
    let maxValue;

    if (options.type !== constants.discrete
            && ticks && ticks.length > 1
            && !options.skipViewportExtending
            && !viewPort.action
            && options.endOnTick !== false) {
      const length = ticks.length;
      const firstTickPosition = translator.translate(ticks[0].value);
      const lastTickPosition = translator.translate(ticks[length - 1].value);

      const invertMultiplier = firstTickPosition > lastTickPosition ? -1 : 1;

      const minTickPadding = _max(invertMultiplier * (canvasStartEnd.start - firstTickPosition), 0);
      const maxTickPadding = _max(invertMultiplier * (lastTickPosition - canvasStartEnd.end), 0);

      if (minTickPadding > minPadding || maxTickPadding > maxPadding) {
        const commonPadding = maxTickPadding + minTickPadding;
        const coeff = this._getConvertIntervalCoefficient(commonPadding, screenDelta);
        if (minTickPadding >= minPadding) {
          minValue = ticks[0].value;
        }
        if (maxTickPadding >= maxPadding) {
          maxValue = ticks[length - 1].value;
        }
        minPadding = _max(minTickPadding, minPadding) / coeff;
        maxPadding = _max(maxTickPadding, maxPadding) / coeff;
      }
    }

    minPercentPadding = minPercentPadding === undefined ? minPadding / screenDeltaWithMargins : minPercentPadding;
    maxPercentPadding = maxPercentPadding === undefined ? maxPadding / screenDeltaWithMargins : maxPercentPadding;

    if (!isDiscrete) {
      if (this._translator.isInverted()) {
        minValue = minValue ?? translator.from(canvasStartEnd.start + screenDelta * minPercentPadding, -1);
        maxValue = maxValue ?? translator.from(canvasStartEnd.end - screenDelta * maxPercentPadding, 1);
      } else {
        minValue = minValue ?? translator.from(canvasStartEnd.start - screenDelta * minPercentPadding, -1);
        maxValue = maxValue ?? translator.from(canvasStartEnd.end + screenDelta * maxPercentPadding, 1);
      }
    }

    const {
      correctedMin, correctedMax, start, end,
    } = this.getCorrectedValuesToZero(minValue, maxValue);
    minPadding = start ?? minPadding;
    maxPadding = end ?? maxPadding;

    return {
      startPadding: translator.isInverted() ? maxPadding : minPadding,
      endPadding: translator.isInverted() ? minPadding : maxPadding,

      minValue: correctedMin ?? minValue,
      maxValue: correctedMax ?? maxValue,

      interval: rangeInterval,
      isSpacedMargin: minPadding === maxPadding && minPadding !== 0,
    };
  }

  _shouldCorrectValuesToZero(minValue: ThemeValue, maxValue: ThemeValue): boolean {
    if (this.isArgumentAxis || this._options.dataType === 'datetime') {
      return false;
    }

    const dataRange = this._getViewportRange();

    if (minValue > dataRange.max || minValue > dataRange.maxVisible) {
      return false;
    }

    if (maxValue < dataRange.min || maxValue < dataRange.minVisible) {
      return false;
    }

    return true;
  }

  getCorrectedValuesToZero(minValue: ThemeValue, maxValue: ThemeValue): CorrectedValuesToZero {
    const translator = this._translator;
    const canvasStartEnd = this._getCanvasStartEnd();
    const dataRange = this._getViewportRange();
    const screenDelta = this._getScreenDelta();

    let start;
    let end;
    let correctedMin;
    let correctedMax;

    const correctZeroLevel = (minPoint: number, maxPoint: number): void => {
      const minExpectedPadding = _abs(canvasStartEnd.start - minPoint);
      const maxExpectedPadding = _abs(canvasStartEnd.end - maxPoint);

      const coeff = this._getConvertIntervalCoefficient(minExpectedPadding + maxExpectedPadding, screenDelta);

      start = minExpectedPadding / coeff;
      end = maxExpectedPadding / coeff;
    };

    if (this._shouldCorrectValuesToZero(minValue, maxValue)) {
      if (minValue * dataRange.min <= 0 && minValue * dataRange.minVisible <= 0) {
        correctZeroLevel(translator.translate(0), translator.translate(maxValue));
        correctedMin = 0;
      }

      if (maxValue * dataRange.max <= 0 && maxValue * dataRange.maxVisible <= 0) {
        correctZeroLevel(translator.translate(minValue), translator.translate(0));
        correctedMax = 0;
      }
    }

    return {
      start: isFinite(start) ? start : null,
      end: isFinite(end) ? end : null,
      correctedMin,
      correctedMax,
    };
  }

  applyMargins(): void {
    if (this._isSynchronized) {
      return;
    }
    const margins = this._calculateValueMargins(this._majorTicks);

    const canvas = extend({}, this._canvas, {
      startPadding: margins.startPadding,
      endPadding: margins.endPadding,
    });

    this._translator.updateCanvas(this._processCanvas(canvas));

    if (isFinite(margins.interval)) {
      const br = this._translator.getBusinessRange();
      br.addRange({ interval: margins.interval });
      this._translator.updateBusinessRange(br);
    }
  }

  _resetMargins(): void {
    this._reinitTranslator(this._getViewportRange());
    if (this._canvas) {
      this._translator.updateCanvas(this._processCanvas(this._canvas));
    }
  }

  _createConstantLines(): void {
    const constantLines = (this._options.constantLines || []).map((o) => createConstantLine(this, o));

    this._outsideConstantLines = constantLines.filter((l) => l.labelPosition === 'outside');
    this._insideConstantLines = constantLines.filter((l) => l.labelPosition === 'inside');
  }

  draw(canvas: ThemeValue, borderOptions?: ThemeValue): void {
    const options = this._options;
    this.borderOptions = borderOptions || { visible: false };

    this._resetMargins();
    this.createTicks(canvas);

    this.applyMargins();

    this._clearAxisGroups();

    initTickCoords(this._majorTicks);
    initTickCoords(this._minorTicks);
    initTickCoords(this._boundaryTicks);

    this._axisGroup.append(this._axesContainerGroup);

    this._drawAxis();
    this._drawTitle();
    drawTickMarks(this._majorTicks, options.tick);
    drawTickMarks(this._minorTicks, options.minorTick);
    drawTickMarks(this._boundaryTicks, options.tick);

    const drawGridLine = this._getGridLineDrawer();
    drawGrids(this._majorTicks, drawGridLine);
    drawGrids(this._minorTicks, drawGridLine);

    callAction(this._majorTicks, 'drawLabel', this._getViewportRange(), this._getTemplate(options.label.template));

    this._templatesRendered && this._templatesRendered.reject();
    this._templatesRendered = Deferred();

    this._majorTicks.forEach((tick) => {
      tick.labelRotationAngle = 0;
      tick.labelAlignment = undefined;
      tick.labelOffset = 0;
    });

    callAction(this._outsideConstantLines.concat(this._insideConstantLines), 'draw');

    callAction(this._strips, 'draw');

    this._dateMarkers = this._drawDateMarkers() || [];

    this._stripLabelAxesGroup && this._axisStripLabelGroup.append(this._stripLabelAxesGroup);
    this._gridContainerGroup && this._axisGridGroup.append(this._gridContainerGroup);
    this._stripsGroup && this._axisStripGroup.append(this._stripsGroup);
    this._labelsAxesGroup && this._axisElementsGroup.append(this._labelsAxesGroup);

    if (this._constantLinesGroup) {
      this._axisConstantLineGroups.above.inside.append(this._constantLinesGroup.above);
      this._axisConstantLineGroups.above.outside1.append(this._constantLinesGroup.above);
      this._axisConstantLineGroups.above.outside2.append(this._constantLinesGroup.above);

      this._axisConstantLineGroups.under.inside.append(this._constantLinesGroup.under);
      this._axisConstantLineGroups.under.outside1.append(this._constantLinesGroup.under);
      this._axisConstantLineGroups.under.outside2.append(this._constantLinesGroup.under);
    }

    this._measureTitle();
    measureLabels(this._majorTicks);

    !options.label.template && this._applyWordWrap();

    measureLabels(this._outsideConstantLines);
    measureLabels(this._insideConstantLines);
    measureLabels(this._strips);
    measureLabels(this._dateMarkers);

    this._adjustConstantLineLabels(this._insideConstantLines);
    this._adjustStripLabels();

    let offset = this._constantLabelOffset = this._adjustConstantLineLabels(this._outsideConstantLines);

    if (!this._translator.getBusinessRange().isEmpty()) {
      this._setLabelsPlacement();
      offset = this._adjustLabels(offset);
    }

    when.apply(this, this._majorTicks.map((tick) => tick.getTemplateDeferred())).done(() => {
      this._templatesRendered.resolve();
    });

    offset = this._adjustDateMarkers(offset);
    this._adjustTitle(offset);
  }

  getTemplatesDef(): ThemeValue {
    return this._templatesRendered;
  }

  setRenderedState(state: boolean): void {
    this._drawn = state;
  }

  isRendered(): boolean {
    return this._drawn;
  }

  _applyWordWrap(): void {
    let convertedTickInterval;
    let textWidth;
    let textHeight;
    const options = this._options;
    const tickInterval = this._tickInterval;
    if (isDefined(tickInterval)) {
      convertedTickInterval = this.getTranslator().getInterval(options.dataType === 'datetime' ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval);
    }

    const displayMode = this._validateDisplayMode(options.label.displayMode);
    const overlappingMode = this._validateOverlappingMode(options.label.overlappingBehavior, displayMode);
    const wordWrapMode = options.label.wordWrap || 'none';
    const overflowMode = options.label.textOverflow || 'none';

    if ((wordWrapMode !== 'none' || overflowMode !== 'none') && displayMode !== ROTATE && overlappingMode !== ROTATE && overlappingMode !== 'auto') {
      const usefulSpace = isDefined(options.placeholderSize) ? options.placeholderSize - options.label.indentFromAxis : undefined;
      if (this._isHorizontal) {
        textWidth = convertedTickInterval;
        textHeight = usefulSpace;
      } else {
        textWidth = usefulSpace;
        textHeight = convertedTickInterval;
      }
      let correctByWidth = false;
      let correctByHeight = false;
      if (textWidth) {
        if (this._majorTicks.some((tick) => tick.labelBBox.width > textWidth)) {
          correctByWidth = true;
        }
      }
      if (textHeight) {
        if (this._majorTicks.some((tick) => tick.labelBBox.height > textHeight)) {
          correctByHeight = true;
        }
      }
      if (correctByWidth || correctByHeight) {
        this._majorTicks.forEach((tick) => {
          tick.label && tick.label.setMaxSize(textWidth, textHeight, options.label);
        });
        measureLabels(this._majorTicks);
      }
    }
  }

  animate(): void {
    callAction(this._majorTicks, 'animateLabels');
  }

  updateSize(canvas: ThemeValue, animate?: boolean, updateTitle = true): void {
    this.updateCanvas(canvas);

    if (updateTitle) {
      this._checkTitleOverflow();
      this._measureTitle();
      this._updateTitleCoords();
    }

    this._reinitTranslator(this._getViewportRange());
    this.applyMargins();

    const animationEnabled = !this._firstDrawing && animate;
    const options = this._options;

    initTickCoords(this._majorTicks);
    initTickCoords(this._minorTicks);
    initTickCoords(this._boundaryTicks);

    if (this._resetApplyingAnimation && !this._firstDrawing) {
      this._resetStartCoordinates();
    }

    cleanUpInvalidTicks(this._majorTicks);
    cleanUpInvalidTicks(this._minorTicks);
    cleanUpInvalidTicks(this._boundaryTicks);

    if (this._axisElement) {
      this._updateAxisElementPosition();
    }

    updateTicksPosition(this._majorTicks, options.tick, animationEnabled);
    updateTicksPosition(this._minorTicks, options.minorTick, animationEnabled);
    updateTicksPosition(this._boundaryTicks, options.tick);

    callAction(this._majorTicks, 'updateLabelPosition', animationEnabled);

    this._outsideConstantLines.concat(this._insideConstantLines || []).forEach((l) => l.updatePosition(animationEnabled));

    callAction(this._strips, 'updatePosition', animationEnabled);

    updateGridsPosition(this._majorTicks, animationEnabled);
    updateGridsPosition(this._minorTicks, animationEnabled);

    if (animationEnabled) {
      callAction(this._ticksToRemove || [], 'fadeOutElements');
    }

    this.prepareAnimation();

    this._ticksToRemove = null;

    if (!this._translator.getBusinessRange().isEmpty()) {
      this._firstDrawing = false;
    }
    this._resetApplyingAnimation = false;
    this._updateLabelsPosition();
  }

  prepareAnimation(): void {
    const action = 'saveCoords';
    callAction(this._majorTicks, action);
    callAction(this._minorTicks, action);
    callAction(this._insideConstantLines, action);
    callAction(this._outsideConstantLines, action);
    callAction(this._strips, action);
  }

  _resetStartCoordinates(): void {
    const action = 'resetCoordinates';
    callAction(this._majorTicks, action);
    callAction(this._minorTicks, action);
    callAction(this._insideConstantLines, action);
    callAction(this._outsideConstantLines, action);
    callAction(this._strips, action);
  }

  applyClipRects(elementsClipID: string, canvasClipID: string): void {
    this._axisGroup.attr({ 'clip-path': canvasClipID });
    this._axisStripGroup.attr({ 'clip-path': elementsClipID });
    this._axisElementsGroup.attr({ 'clip-path': canvasClipID });
  }

  _validateVisualRange(optionValue: ThemeValue): ThemeValue {
    const range = getVizRangeObject(optionValue);
    if (range.startValue !== undefined) {
      range.startValue = this.validateUnit(range.startValue);
    }

    if (range.endValue !== undefined) {
      range.endValue = this.validateUnit(range.endValue);
    }

    return convertVisualRangeObject(range, !_isArray(optionValue));
  }

  _validateOptions(options: ThemeValue): void {
    options.wholeRange = this._validateVisualRange(options.wholeRange);
    options.visualRange = options._customVisualRange = this._validateVisualRange(options._customVisualRange);

    this._setVisualRange(options._customVisualRange);
  }

  validate(): void {
    const options = this._options;
    const dataType = this.isArgumentAxis ? options.argumentType : options.valueType;
    const parser = dataType ? getParser(dataType) : function (unit: ThemeValue): ThemeValue { return unit; };

    this.parser = parser;
    options.dataType = dataType;

    this._validateOptions(options);
  }

  resetVisualRange(isSilent?: boolean): void {
    this._seriesData.minVisible = this._seriesData.min;
    this._seriesData.maxVisible = this._seriesData.max;
    this.handleZooming([null, null], { start: !!isSilent, end: !!isSilent });
  }

  _setVisualRange(visualRange: ThemeValue, allowPartialUpdate?: boolean): void {
    const range = this.adjustRange(getVizRangeObject(visualRange));
    if (allowPartialUpdate) {
      isDefined(range.startValue) && (this._viewport.startValue = range.startValue);
      isDefined(range.endValue) && (this._viewport.endValue = range.endValue);
    } else {
      this._viewport = range;
    }
  }

  _applyZooming(visualRange: ThemeValue, allowPartialUpdate?: boolean): void {
    this._resetVisualRangeOption();
    this._setVisualRange(visualRange, allowPartialUpdate);

    const viewPort = this.getViewport();

    this._seriesData.userBreaks = this._getScaleBreaks(this._options, {
      minVisible: viewPort.startValue,
      maxVisible: viewPort.endValue,
    }, this._series, this.isArgumentAxis);

    this._translator.updateBusinessRange(this._getViewportRange());
  }

  getZoomStartEventArg(event: ThemeValue, actionType: string | undefined): ThemeValue {
    return {
      axis: this,
      range: this.visualRange(),
      cancel: false,
      event,
      actionType,
    };
  }

  _getZoomEndEventArg(previousRange: ThemeValue, event: ThemeValue, actionType: string | undefined, zoomFactor: number, shift: number): ThemeValue {
    const newRange = this.visualRange();
    return {
      axis: this,
      previousRange,
      range: newRange,
      cancel: false,
      event,
      actionType,
      zoomFactor,
      shift,
      // backwards
      rangeStart: newRange.startValue,
      rangeEnd: newRange.endValue,
    };
  }

  getZoomBounds(): { startValue: ThemeValue; endValue: ThemeValue } {
    const wholeRange = getVizRangeObject(this._options.wholeRange);
    const range = this.getTranslator().getBusinessRange();
    const secondPriorityRange = {
      startValue: getZoomBoundValue(this._initRange.startValue, range.min),
      endValue: getZoomBoundValue(this._initRange.endValue, range.max),
    };

    return {
      startValue: getZoomBoundValue(wholeRange.startValue, secondPriorityRange.startValue),
      endValue: getZoomBoundValue(wholeRange.endValue, secondPriorityRange.endValue),
    };
  }

  setInitRange(): void {
    this._initRange = {};
    if (Object.keys(this._options.wholeRange || {}).length === 0) {
      this._initRange = this.getZoomBounds();
    }
  }

  _resetVisualRangeOption(): void {
    this._options._customVisualRange = {};
  }

  getTemplatesGroups(): ThemeValue[] {
    const ticks = this._majorTicks;
    if (ticks) {
      return this._majorTicks.map((tick) => tick.templateContainer).filter((item) => isDefined(item));
    } else {
      return [];
    }
  }

  setCustomVisualRange(range: ThemeValue): void {
    this._options._customVisualRange = range;
  }

  // API
  visualRange(): ThemeValue {
    const args = arguments;
    let visualRange;

    if (args.length === 0) {
      const adjustedRange = this._getAdjustedBusinessRange();
      let startValue = adjustedRange.minVisible;
      let endValue = adjustedRange.maxVisible;
      if (this._options.type === constants.discrete) {
        // @ts-expect-error a discrete range always has categories
        startValue = startValue ?? adjustedRange.categories[0];
        // @ts-expect-error a discrete range always has categories
        endValue = endValue ?? adjustedRange.categories[adjustedRange.categories.length - 1];
        return {
          startValue,
          endValue,
          categories: getCategoriesInfo(adjustedRange.categories, startValue, endValue).categories,
        };
      }
      return {
        startValue,
        endValue,
      };
    } else if (_isArray(args[0])) {
      visualRange = args[0];
    } else if (isPlainObject(args[0])) {
      visualRange = extend({}, args[0]);
    } else {
      visualRange = [args[0], args[1]];
    }

    const zoomResults = this.handleZooming(visualRange, args[1]);
    if (!zoomResults.isPrevented) {
      this._visualRange(this, zoomResults);
    }
  }

  handleZooming(visualRange: ThemeValue, preventEvents?: ThemeValue, domEvent?: ThemeValue, action?: string): ZoomResults {
    preventEvents = preventEvents || {};

    if (isDefined(visualRange)) {
      visualRange = this._validateVisualRange(visualRange);
      visualRange.action = action;
    }

    const zoomStartEvent = this.getZoomStartEventArg(domEvent, action);
    const previousRange = zoomStartEvent.range;

    !preventEvents.start && this._eventTrigger('zoomStart', zoomStartEvent);
    const zoomResults = {
      isPrevented: zoomStartEvent.cancel,
      skipEventRising: preventEvents.skipEventRising,
      range: visualRange || zoomStartEvent.range,
    };

    if (!zoomStartEvent.cancel) {
      isDefined(visualRange) && this._applyZooming(visualRange, preventEvents.allowPartialUpdate);
      if (!isDefined(this._storedZoomEndParams)) {
        this._storedZoomEndParams = {
          startRange: previousRange,
          type: this.getOptions().type,
        };
      }
      this._storedZoomEndParams.event = domEvent;
      this._storedZoomEndParams.action = action;
      this._storedZoomEndParams.prevent = !!preventEvents.end;
    }

    return zoomResults;
  }

  handleZoomEnd(): void {
    if (isDefined(this._storedZoomEndParams) && !this._storedZoomEndParams.prevent) {
      const previousRange = this._storedZoomEndParams.startRange;
      const domEvent = this._storedZoomEndParams.event;
      const action = this._storedZoomEndParams.action;
      const previousBusinessRange = {
        minVisible: previousRange.startValue,
        maxVisible: previousRange.endValue,
        categories: previousRange.categories,
      };
      const typeIsNotChanged = this.getOptions().type === this._storedZoomEndParams.type;
      const shift = typeIsNotChanged ? adjust(this.getVisualRangeCenter() - this.getVisualRangeCenter(previousBusinessRange, false)) : NaN;
      const calcZoomFactor = (): number => {
        if (action === 'pan') {
          return 1;
        }

        const currentLength = this.getVisualRangeLength() || 1;
        const ratio = this.getVisualRangeLength(previousBusinessRange) / currentLength;

        return Math.round(multiplyInExponentialForm(ratio, ZOOM_FACTOR_PRECISION)) / ZOOM_FACTOR_MULTIPLIER;
      };
      const zoomFactor = typeIsNotChanged ? calcZoomFactor() : NaN;
      const zoomEndEvent = this._getZoomEndEventArg(previousRange, domEvent, action, zoomFactor, shift);

      zoomEndEvent.cancel = this.checkZoomingLowerLimitOvercome(zoomFactor === 1 ? 'pan' : 'zoom', zoomFactor).stopInteraction;
      this._eventTrigger('zoomEnd', zoomEndEvent);

      if (zoomEndEvent.cancel) {
        this._restorePreviousVisualRange(previousRange);
      }
      this._storedZoomEndParams = null;
    }
  }

  _restorePreviousVisualRange(previousRange: ThemeValue): void {
    this._storedZoomEndParams = null;
    this._applyZooming(previousRange);
    this._visualRange(this, previousRange);
  }

  checkZoomingLowerLimitOvercome(actionType: string, zoomFactor: number, range?: ThemeValue): { stopInteraction: boolean; correctedRange: ThemeValue } {
    const options = this._options;
    const translator = this._translator;
    let minZoom = options.minVisualRangeLength;
    let correctedRange = range;
    let visualRange;

    let isOvercoming = actionType === 'zoom' && zoomFactor >= 1;
    const businessRange = translator.getBusinessRange();

    if (range) {
      visualRange = this.adjustRange(getVizRangeObject(range));
      visualRange = {
        minVisible: visualRange.startValue,
        maxVisible: visualRange.endValue,
        categories: businessRange.categories,
      };
    }

    const beforeVisualRangeLength = this.getVisualRangeLength(businessRange);
    const afterVisualRangeLength = this.getVisualRangeLength(visualRange);

    if (isDefined(minZoom) || options.type === 'discrete') {
      minZoom = translator.convert(minZoom);
      if (visualRange && (minZoom < beforeVisualRangeLength) && (minZoom >= afterVisualRangeLength)) {
        correctedRange = getVizRangeObject(translator.getRangeByMinZoomValue(minZoom, visualRange));
        isOvercoming = false;
      } else {
        // @ts-expect-error boolean bitwise AND
        isOvercoming &= minZoom > afterVisualRangeLength;
      }
    } else {
      const canvasLength = this._translator.canvasLength;
      const fullRange = {
        minVisible: businessRange.min,
        maxVisible: businessRange.max,
        categories: businessRange.categories,
      };
      // @ts-expect-error boolean bitwise AND
      isOvercoming &= this.getVisualRangeLength(fullRange) / canvasLength >= afterVisualRangeLength;
    }

    return { stopInteraction: !!isOvercoming, correctedRange };
  }

  isExtremePosition(isMax: boolean): boolean {
    let extremeDataValue;
    let seriesData;

    if (this._options.type === 'discrete') {
      seriesData = this._translator.getBusinessRange();
      extremeDataValue = isMax ? seriesData.categories[seriesData.categories.length - 1] : seriesData.categories[0];
    } else {
      seriesData = this.getZoomBounds(); // T702708
      extremeDataValue = isMax ? seriesData.endValue : seriesData.startValue;
    }

    const translator = this.getTranslator();
    const extremePoint = translator.translate(extremeDataValue);
    const visualRange = this.visualRange();
    const visualRangePoint = isMax ? translator.translate(visualRange.endValue) : translator.translate(visualRange.startValue);

    return _abs(visualRangePoint - extremePoint) < SCROLL_THRESHOLD;
  }

  getViewport(): ThemeValue {
    return this._viewport;
  }

  getFullTicks(): ThemeValue[] {
    const majors = this._majorTicks || [];
    if (this._options.type === constants.discrete) {
      return convertTicksToValues(majors);
    } else {
      return convertTicksToValues(majors.concat(this._minorTicks, this._boundaryTicks))
        .sort((a, b) => valueOf(a) - valueOf(b));
    }
  }

  measureLabels(canvas: ThemeValue, withIndents?: boolean): { x: number; y: number; width: number; height: number } {
    const options = this._options;
    const widthAxis = options.visible ? options.width : 0;
    let ticks;
    const indent = withIndents ? options.label.indentFromAxis + (options.tick.length * 0.5) : 0;
    let tickInterval;
    const viewportRange = this._getViewportRange();

    if (viewportRange.isEmpty() || !options.label.visible || !this._axisElementsGroup) {
      return {
        height: widthAxis, width: widthAxis, x: 0, y: 0,
      };
    }

    if (this._majorTicks) {
      ticks = convertTicksToValues(this._majorTicks);
    } else {
      this.updateCanvas(canvas);
      ticks = this._createTicksAndLabelFormat(viewportRange, _noop);
      tickInterval = ticks.tickInterval;
      ticks = ticks.ticks;
    }

    const maxText = ticks.reduce((prevLabel, tick, index) => {
      const label = this.formatLabel(tick, options.label, viewportRange, undefined, tickInterval, ticks);
      if (prevLabel.length < label.length) {
        return label;
      } else {
        return prevLabel;
      }
    }, this.formatLabel(ticks[0], options.label, viewportRange, undefined, tickInterval, ticks));

    const text = this._renderer.text(maxText, 0, 0).css(this._textFontStyles).attr(this._textOptions).append(this._renderer.root);
    const box = text.getBBox();

    text.remove();
    return {
      x: box.x, y: box.y, width: box.width + indent, height: box.height + indent,
    };
  }

  _setLabelsPlacement(): void {
    if (!this._options.label.visible) {
      return;
    }
    const labelOpt = this._options.label;
    const displayMode = this._validateDisplayMode(labelOpt.displayMode);
    const overlappingMode = this._validateOverlappingMode(labelOpt.overlappingBehavior, displayMode);
    const ignoreOverlapping = overlappingMode === 'none' || overlappingMode === 'ignore';
    const behavior = {
      rotationAngle: labelOpt.rotationAngle,
      staggeringSpacing: labelOpt.staggeringSpacing,
    };
    let notRecastStep;
    const boxes = this._majorTicks.map((tick) => tick.labelBBox);
    let step = this._getStep(boxes);
    switch (displayMode) {
      case ROTATE:
        if (ignoreOverlapping) {
          notRecastStep = true;
          step = 1;
        }
        this._applyLabelMode(displayMode, step, boxes, labelOpt, notRecastStep);
        break;
      case 'stagger':
        if (ignoreOverlapping) {
          step = 2;
        }
        this._applyLabelMode(displayMode, _max(step, 2), boxes, labelOpt);
        break;
      default:
        this._applyLabelOverlapping(boxes, overlappingMode, step, behavior);
    }
  }

  _applyLabelOverlapping(boxes: ThemeValue[], mode: string, step: number, behavior: ThemeValue): void {
    const labelOpt = this._options.label;
    const majorTicks = this._majorTicks;

    if (mode === 'none' || mode === 'ignore') {
      return;
    }
    const checkLabels = function (box: ThemeValue, index: number, array: ThemeValue[]): boolean {
      if (index === 0) {
        return false;
      }
      return constants.areLabelsOverlap(box, array[index - 1], labelOpt.minSpacing, labelOpt.alignment);
    };
    if (step > 1 && boxes.some(checkLabels)) {
      this._applyLabelMode(mode, step, boxes, behavior);
    }
    this._checkBoundedLabelsOverlapping(majorTicks, boxes, mode);
    this._checkShiftedLabels(majorTicks, boxes, labelOpt.minSpacing, labelOpt.alignment);
  }

  _applyLabelMode(mode: string, step: number, boxes: ThemeValue[], behavior: ThemeValue, notRecastStep?: boolean): void {
    const majorTicks = this._majorTicks;
    const labelOpt = this._options.label;
    const angle = behavior.rotationAngle;
    let labelHeight;
    let alignment;
    let func;
    switch (mode) {
      case ROTATE:
        if (!labelOpt.userAlignment) {
          alignment = angle < 0 ? RIGHT : LEFT;
          if (angle % 90 === 0) {
            alignment = CENTER;
          }
        }
        step = notRecastStep ? step : this._getStep(boxes, angle);
        func = function (tick: ThemeValue): void {
          const contentContainer = tick.getContentContainer();
          if (!contentContainer) {
            return;
          }
          contentContainer.rotate(angle);
          tick.labelRotationAngle = angle;
          alignment && (tick.labelAlignment = alignment);
        };
        updateLabels(majorTicks, step, func);
        break;
      case 'stagger':
        labelHeight = this._getMaxLabelHeight(boxes, behavior.staggeringSpacing);

        func = function (tick: ThemeValue, index: number): void {
          if ((index / (step - 1)) % 2 !== 0) {
            tick.labelOffset = labelHeight;
          }
        };
        updateLabels(majorTicks, step - 1, func);
        break;
      case 'auto':
      case '_auto':
        if (step === 2) {
          this._applyLabelMode('stagger', step, boxes, behavior);
        } else {
          this._applyLabelMode(ROTATE, step, boxes, { rotationAngle: getOptimalAngle(boxes, labelOpt) });
        }
        break;
      default:
        updateLabels(majorTicks, step);
        break;
    }
  }

  _createTranslator(): Translator2DInstance {
    return new Translator2D({}, {}, {});
  }

  _updateTranslator(): void {
    const translator = this._translator;
    translator.update(translator.getBusinessRange(), this._canvas || {}, this._getTranslatorOptions());
  }

  _getTranslatorOptions(): Translator2DOptions {
    const options = this._options;
    return {
      isHorizontal: this._isHorizontal,
      shiftZeroValue: !this.isArgumentAxis,
      interval: options.semiDiscreteInterval,
      firstDayOfWeek: options.workWeek?.[0],
      stick: this._getStick(),
      breaksSize: options.breakStyle?.width ?? 0,
    };
  }

  getVisibleArea(): number[] {
    const canvas = this._getCanvasStartEnd();
    return [canvas.start, canvas.end].sort((a, b) => a - b);
  }

  _getCanvasStartEnd(): { start: number; end: number } {
    const isHorizontal = this._isHorizontal;
    const canvas = this._canvas || {};
    const invert = this._translator.getBusinessRange().invert;
    const coords = isHorizontal ? [canvas.left, canvas.width - canvas.right] : [canvas.height - canvas.bottom, canvas.top];

    invert && coords.reverse();

    return {
      start: coords[0],
      end: coords[1],
    };
  }

  _getScreenDelta(): number {
    const canvas = this._getCanvasStartEnd();
    const breaks = this._seriesData ? this._seriesData.breaks || [] : [];
    const breaksLength = breaks.length;
    const screenDelta = _abs(canvas.start - canvas.end);

    return screenDelta - (breaksLength ? breaks[breaksLength - 1].cumulativeWidth : 0);
  }

  _getScaleBreaks(axisOptions: ThemeValue, viewport: ThemeValue, series: ThemeValue[], isArgumentAxis?: boolean): ThemeValue[];

  _getScaleBreaks(): ThemeValue[] { return []; }

  _filterBreaks(breaks: ThemeValue[], viewport: ThemeValue, breakStyle: ThemeValue): ThemeValue[];

  _filterBreaks(): ThemeValue[] { return []; }

  applyVisualRangeSetter(visualRangeSetter: VisualRangeSetter): void {
    this._visualRange = visualRangeSetter;
  }

  // T642779, T714928, T810801
  getCategoriesSorter(argCategories?: ThemeValue): ThemeValue {
    let sort;
    if (this.isArgumentAxis) {
      sort = argCategories;
    } else {
      const categoriesSortingMethod = this._options.categoriesSortingMethod;
      sort = categoriesSortingMethod ?? this._options.categories;
    }

    return sort;
  }

  _getAdjustedBusinessRange(): RangeInstance {
    return this.adjustViewport(this._translator.getBusinessRange());
  }
};

Object.assign(Axis.prototype, {
  getOrthogonalAxis: _noop,
  getCustomPosition: _noop,
  getCustomBoundaryPosition: _noop,
  resolveOverlappingForCustomPositioning: _noop,
  _disposeBreaksGroup: _noop,
  _measureTitle: _noop,
  _updateLabelsPosition: _noop,
  getMarkerTrackers: _noop,
  _drawDateMarkers: _noop,
  _adjustDateMarkers: _noop,
  coordsIn: _noop,
  areCoordsOutsideAxis: _noop,
  _getSkippedCategory: _noop,
  _initAxisPositions: _noop,
  _drawTitle: _noop,
  _updateTitleCoords: _noop,
  _adjustConstantLineLabels: _noop,
  _adjustTitle: _noop,
  _checkTitleOverflow: _noop,
  getSpiderTicks: _noop,
  setSpiderTicks: _noop,
  _checkBoundedLabelsOverlapping: _noop,
  _checkShiftedLabels: _noop,
  drawScaleBreaks: _noop,
  _visualRange: _noop,
  _rotateConstantLine: _noop,
  /// #DEBUG
  _getTickMarkPoints: _noop,
  _validateOverlappingMode: _noop,
  _getStep: _noop,
  _validateDisplayMode: _noop,
  shift: _noop,
  /// #ENDDEBUG
});

/// #DEBUG
export function DEBUG_set_Axis(value: typeof Axis): void {
  Axis = value;
}
/// #ENDDEBUG
