/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import formatHelper from '@ts/core/format_helper';
import { extend } from '@ts/core/utils/m_extend';
import { each } from '@ts/core/utils/m_iterator';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { BBox, Coords } from '@ts/viz/core/types';
import {
  degreesToRadians as _degreesToRadians,
  getCosAndSin as _getCosAndSin,
  patchFontOptions as _patchFontOptions,
  rotateBBox as _rotateBBox,
} from '@ts/viz/core/utils';
import { processDisplayFormat } from '@ts/viz/series/helpers/display_format_parser';

type LabelRect = BBox | Record<string, never>;

interface LabelStrategy {
  isLabelInside: (bBox: LabelRect, figure: ThemeValue, isOutside: boolean) => boolean;
  prepareLabelPoints: (bBox: LabelRect, rotatedBBox: LabelRect, isHorizontal: boolean, angle: number, figureCenter: number[]) => ThemeValue;
  isHorizontal: (bBox: LabelRect, figure: ThemeValue) => boolean;
  getFigureCenter: (figure: ThemeValue) => number[];
  findFigurePoint: (figure: ThemeValue, labelPoint: number[], isHorizontal: boolean) => number[];
  adjustPoints: (points: number[]) => number[];
}

interface LabelPoint {
  hasValue: () => boolean;
  correctLabelPosition: (label: InstanceType<typeof Label>) => void;
  hideInsideLabel: (label: InstanceType<typeof Label>, coords: Coords) => boolean;
}

interface LabelLayoutOptions {
  alignment: ThemeValue;
  background: boolean;
  horizontalOffset: number;
  verticalOffset: number;
  radialOffset: number;
  position: string;
  connectorOffset: number;
}

interface LabelRenderSettings {
  renderer: ThemeValue;
  labelsGroup: ThemeValue;
  point?: LabelPoint;
  strategy?: LabelStrategy;
}

const _format = formatHelper.format;
const _math = Math;
const _round = _math.round;
const _floor = _math.floor;
const _abs = _math.abs;

const CONNECTOR_LENGTH = 12;
const LABEL_BACKGROUND_PADDING_X = 8;
const LABEL_BACKGROUND_PADDING_Y = 4;

function getClosestCoord(point: number[], coords: number[][]): number[] {
  let closestDistance = Infinity;
  let closestCoord;
  each(coords, (_, coord) => {
    const x = point[0] - coord[0];
    const y = point[1] - coord[1];
    const distance = x * x + y * y;
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCoord = coord;
    }
  });

  return [_floor(closestCoord[0]), _floor(closestCoord[1])];
}

function getCrossCoord(rect: number[], coord: number, indexOffset: number): number {
  return (coord - rect[0 + indexOffset]) / (rect[2 + indexOffset] - rect[0 + indexOffset])
        * (rect[3 - indexOffset] - rect[1 - indexOffset])
        + rect[1 - indexOffset];
}

// We could always conside center of label as label point (with appropriate connector path clipping). In that case we do not depend neither on background nor on rotation.

const barPointStrategy = {
  isLabelInside(labelPoint, figure): boolean {
    const xc = labelPoint.x + labelPoint.width / 2;
    const yc = labelPoint.y + labelPoint.height / 2;
    return figure.x <= xc && xc <= figure.x + figure.width && figure.y <= yc && yc <= figure.y + figure.height;
  },

  prepareLabelPoints(bBox, rotatedBBox, isHorizontal, angle, figureCenter): number[][] {
    const x1 = rotatedBBox.x;
    const xc = x1 + rotatedBBox.width / 2;
    const x2 = x1 + rotatedBBox.width - 1;
    const y1 = rotatedBBox.y;
    const yc = y1 + rotatedBBox.height / 2;
    const y2 = y1 + rotatedBBox.height - 1;
    let labelPoints;
    const isRectangular = (_abs(angle) % 90) === 0;

    if (figureCenter[0] > x1 && figureCenter[0] < x2) {
      if (isRectangular) {
        labelPoints = [[figureCenter[0], _abs(figureCenter[1] - y1) < _abs(figureCenter[1] - y2) ? y1 : y2]];
      } else {
        labelPoints = [[figureCenter[0], getCrossCoord([x1, y1, x2, y2], figureCenter[0], 0)]];
      }
    } else if (figureCenter[1] > y1 && figureCenter[1] < y2) {
      if (isRectangular) {
        labelPoints = [[_abs(figureCenter[0] - x1) < _abs(figureCenter[0] - x2) ? x1 : x2, figureCenter[1]]];
      } else {
        labelPoints = [[getCrossCoord([x1, y1, x2, y2], figureCenter[1], 1), figureCenter[1]]];
      }
    } else if (isRectangular) {
      labelPoints = [
        [x1, y1],
        [isHorizontal ? x1 : xc, isHorizontal ? yc : y1],
        [x2, y1],

        [x1, y2],
        [isHorizontal ? x2 : xc, isHorizontal ? yc : y2],
        [x2, y2],
      ];
    } else {
      labelPoints = [[xc, yc]];
    }

    return labelPoints;
  },

  isHorizontal(bBox, figure): boolean {
    return (bBox.x > figure.x + figure.width) || (bBox.x + bBox.width < figure.x);
  },

  getFigureCenter(figure): number[] {
    return [_floor(figure.x + figure.width / 2), _floor(figure.y + figure.height / 2)];
  },

  findFigurePoint(figure, labelPoint): number[] {
    const figureCenter = barPointStrategy.getFigureCenter(figure);
    const point = getClosestCoord(labelPoint, [
      [figure.x, figureCenter[1]],
      [figureCenter[0], figure.y + figure.height],
      [figure.x + figure.width, figureCenter[1]],
      [figureCenter[0], figure.y],
    ]);
    return point;
  },

  adjustPoints(points): number[] {
    const lineIsVertical = _abs(points[1] - points[3]) <= 1;
    const lineIsHorizontal = _abs(points[0] - points[2]) <= 1;

    if (lineIsHorizontal) {
      points[0] = points[2];
    }
    if (lineIsVertical) {
      points[1] = points[3];
    }
    return points;
  },
};

const symbolPointStrategy = {
  isLabelInside(): boolean {
    return false;
  },

  prepareLabelPoints: barPointStrategy.prepareLabelPoints,

  isHorizontal(bBox, figure): boolean {
    return (bBox.x > figure.x + figure.r) || (bBox.x + bBox.width < figure.x - figure.r);
  },

  getFigureCenter(figure): number[] {
    return [figure.x, figure.y];
  },

  findFigurePoint(figure, labelPoint): number[] {
    const angle = Math.atan2(figure.y - labelPoint[1], labelPoint[0] - figure.x);
    return [_round(figure.x + figure.r * Math.cos(angle)), _round(figure.y - figure.r * Math.sin(angle))];
  },

  adjustPoints: barPointStrategy.adjustPoints,
};

const piePointStrategy = {
  isLabelInside(_0, _1, isOutside): boolean {
    return !isOutside;
  },

  prepareLabelPoints(bBox, rotatedBBox, isHorizontal, angle): ThemeValue {
    const xl = bBox.x;
    const xr = xl + bBox.width;
    const xc = xl + _round(bBox.width / 2);
    const yt = bBox.y;
    const yb = yt + bBox.height;
    const yc = yt + _round(bBox.height / 2);
    let points = [
      [[xl, yt], [xr, yt]],
      [[xr, yt], [xr, yb]],
      [[xr, yb], [xl, yb]],
      [[xl, yb], [xl, yt]],
    ];
    const cosSin = _getCosAndSin(angle);

    if (angle === 0) {
      points = isHorizontal ? [
        [xl, yc],
        [xr, yc],
      ] : [
        [xc, yt],
        [xc, yb],
      ];
    } else {
      // @ts-expect-error points switches from the rectangle sides to their crossing points
      points = points.map((pair) => pair.map((point) => [
        _round(((point[0] - xc) * cosSin.cos + (point[1] - yc) * cosSin.sin) + xc),
        _round((-(point[0] - xc) * cosSin.sin + (point[1] - yc) * cosSin.cos) + yc),
      ])).reduce((r, pair) => {
        const point1x = pair[0][0];
        const point1y = pair[0][1];
        const point2x = pair[1][0];
        const point2y = pair[1][1];

        if (isHorizontal) {
          if ((point1y >= yc && yc >= point2y) || (point1y <= yc && yc <= point2y)) {
            r.push([(yc - point1y) * (point2x - point1x) / (point2y - point1y) + point1x, yc]);
          }
        } else if ((point1x >= xc && xc >= point2x) || (point1x <= xc && xc <= point2x)) {
          r.push([xc, (xc - point1x) * (point2y - point1y) / (point2x - point1x) + point1y]);
        }
        return r;
      }, []);
    }
    return points;
  },

  isHorizontal(bBox, figure): boolean {
    return bBox.x > figure.x || figure.x > (bBox.x + bBox.width);
  },

  getFigureCenter: symbolPointStrategy.getFigureCenter,

  findFigurePoint(figure, labelPoint, isHorizontal): number[] {
    if (!isHorizontal) {
      return [figure.x, figure.y];
    }
    const labelX = labelPoint[0];
    const x = _round(figure.x + (figure.y - labelPoint[1]) / Math.tan(_degreesToRadians(figure.angle)));
    let points = [figure.x, figure.y, x, labelPoint[1]];

    if (!(figure.x <= x && x <= labelX) && !(labelX <= x && x <= figure.x)) {
      if (_abs(figure.x - labelX) < CONNECTOR_LENGTH) {
        points = [figure.x, figure.y];
      } else if (figure.x <= labelX) {
        points[2] = figure.x + CONNECTOR_LENGTH;
      } else {
        points[2] = figure.x - CONNECTOR_LENGTH;
      }
    }
    return points;
  },

  adjustPoints(points): number[] {
    return points;
  },
};

function selectStrategy(figure: ThemeValue): LabelStrategy {
  return (figure.angle !== undefined && piePointStrategy) || (figure.r !== undefined && symbolPointStrategy) || barPointStrategy;
}

function disposeItem(obj: ThemeValue, field: string): void {
  obj[field] && obj[field].dispose();
  obj[field] = null;
}

function checkBackground(background: ThemeValue): boolean {
  return background && ((background.fill && background.fill !== 'none') || (background['stroke-width'] > 0 && background.stroke && background.stroke !== 'none'));
}

function checkConnector(connector: ThemeValue): boolean {
  return connector && connector['stroke-width'] > 0 && connector.stroke && connector.stroke !== 'none';
}

function formatText(data: ThemeValue, options: ThemeValue): string {
  const format = options.format;

  data.valueText = _format(data.value, format);
  data.argumentText = _format(data.argument, options.argumentFormat);
  if (data.percent !== undefined) {
    data.percentText = _format(data.percent, { type: 'percent', precision: format && format.percentPrecision });
  }
  if (data.total !== undefined) {
    data.totalText = _format(data.total, format);
  }
  if (data.openValue !== undefined) {
    data.openValueText = _format(data.openValue, format);
  }
  if (data.closeValue !== undefined) {
    data.closeValueText = _format(data.closeValue, format);
  }
  if (data.lowValue !== undefined) {
    data.lowValueText = _format(data.lowValue, format);
  }
  if (data.highValue !== undefined) {
    data.highValueText = _format(data.highValue, format);
  }
  if (data.reductionValue !== undefined) {
    data.reductionValueText = _format(data.reductionValue, format);
  }

  return options.customizeText ? options.customizeText.call(data, data) : options.displayFormat ? processDisplayFormat(options.displayFormat, data) : data.valueText;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Label = class Label {
  declare static _DEBUG_formatText: typeof formatText;

  declare _renderer: ThemeValue;

  declare _container: ThemeValue;

  declare _point?: LabelPoint;

  declare _strategy?: LabelStrategy;

  declare _rowCount: number;

  declare _color?: string;

  declare _options: ThemeValue;

  declare _data: ThemeValue;

  declare _figure: ThemeValue;

  declare _group: ThemeValue;

  declare _insideGroup: ThemeValue;

  declare _text: ThemeValue;

  declare _background: ThemeValue;

  declare _connector: ThemeValue;

  declare _textContent: string | null;

  declare _visible: boolean | null;

  declare _holdVisibility: boolean;

  declare _drawn: boolean;

  declare _bBoxWithoutRotation: BBox;

  declare _bBox: BBox;

  declare _x: number;

  declare _y: number;

  constructor(renderSettings: LabelRenderSettings) {
    this._renderer = renderSettings.renderer;
    this._container = renderSettings.labelsGroup;
    this._point = renderSettings.point;
    this._strategy = renderSettings.strategy;
    this._rowCount = 1;
  }

  setColor(color: string): void {
    this._color = color;
  }

  setOptions(options: ThemeValue): void {
    this._options = options;
  }

  setData(data: ThemeValue): void {
    this._data = data;
  }

  setDataField(fieldName: string, fieldValue: ThemeValue): void {
    // Is this laziness really required?
    this._data = this._data || {};
    this._data[fieldName] = fieldValue;
  }

  getData(): ThemeValue {
    return this._data;
  }

  setFigureToDrawConnector(figure: ThemeValue): void {
    this._figure = figure;
  }

  dispose(): void {
    disposeItem(this, '_group');
    this._data = this._options = this._textContent = this._visible = this._insideGroup = this._text = this._background = this._connector = this._figure = null;
  }

  // The following method is required because we support partial visibility for labels
  // entire labels group can be hidden and any particular label can be visible at the same time
  // in order to do that label must have visibility:"visible" attribute
  _setVisibility(value: string, state: boolean): void {
    this._group && this._group.attr({ visibility: value });
    this._visible = state;
  }

  isVisible(): boolean | null {
    return this._visible;
  }

  hide(holdInvisible?: boolean): void {
    this._holdVisibility = !!holdInvisible;
    this._hide();
  }

  _hide(): void {
    this._setVisibility('hidden', false);
  }

  show(this: Label & { _point: LabelPoint }, holdVisible?: boolean): void {
    const correctPosition = !this._drawn;
    if (this._point.hasValue()) {
      this._holdVisibility = !!holdVisible;
      this._show();
      correctPosition && this._point.correctLabelPosition(this);
    }
  }

  _show(): void {
    const renderer = this._renderer;
    const container = this._container;
    const options = this._options || {};
    const text = this._textContent = formatText(this._data, options) || null;

    if (text) {
      if (!this._group) {
        this._group = renderer.g().append(container);
        this._insideGroup = renderer.g().append(this._group);
        this._text = renderer.text('', 0, 0).append(this._insideGroup);
      }
      this._text.css(options.attributes ? _patchFontOptions(options.attributes.font) : {});

      if (checkBackground(options.background)) {
        this._background = this._background || renderer.rect().append(this._insideGroup).toBackground();
        this._background.attr(options.background);
        // The following is because "this._options" is shared between all labels and so cannot be modified
        this._color && this._background.attr({ fill: this._color });
      } else {
        disposeItem(this, '_background');
      }

      if (checkConnector(options.connector)) {
        this._connector = this._connector || renderer.path([], 'line').sharp().append(this._group).toBackground();
        this._connector.attr(options.connector);
        // The following is because "this._options" is shared between all labels and so cannot be modified
        this._color && this._connector.attr({ stroke: this._color });
      } else {
        disposeItem(this, '_connector');
      }

      this._text.attr({ text, align: options.textAlignment, class: options.cssClass });
      this._updateBackground(this._text.getBBox());
      this._setVisibility('visible', true);
      this._drawn = true;
    } else {
      this._hide();
    }
  }

  _getLabelVisibility(isVisible: boolean): boolean | null {
    return this._holdVisibility ? this.isVisible() : isVisible;
  }

  draw(isVisible: boolean): this {
    if (this._getLabelVisibility(isVisible)) {
      this._show();
      this._point && this._point.correctLabelPosition(this);
    } else {
      this._drawn = false;
      this._hide();
    }
    return this;
  }

  _updateBackground(bBox: BBox): void {
    if (this._background) {
      bBox.x -= LABEL_BACKGROUND_PADDING_X;
      bBox.y -= LABEL_BACKGROUND_PADDING_Y;
      bBox.width += 2 * LABEL_BACKGROUND_PADDING_X;
      bBox.height += 2 * LABEL_BACKGROUND_PADDING_Y;
      this._background.attr(bBox);
    }
    this._bBoxWithoutRotation = extend({}, bBox);

    const rotationAngle = this._options.rotationAngle || 0;

    this._insideGroup.rotate(rotationAngle, bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    // Angle is transformed from svg to right-handed cartesian space
    bBox = _rotateBBox(bBox, [bBox.x + bBox.width / 2, bBox.y + bBox.height / 2], -rotationAngle);

    this._bBox = bBox;
  }

  getFigureCenter(): number[] {
    const figure = this._figure;
    const strategy = this._strategy || selectStrategy(figure);
    return strategy.getFigureCenter(figure);
  }

  _getConnectorPoints(): number[] {
    const figure = this._figure;
    const options = this._options;
    const strategy = this._strategy || selectStrategy(figure);
    const bBox = this._shiftBBox(this._bBoxWithoutRotation);
    const rotatedBBox = this.getBoundingRect();
    let labelPoint;
    let points: ThemeValue = [];
    let isHorizontal;

    if (!strategy.isLabelInside(bBox, figure, options.position !== 'inside')) {
      isHorizontal = strategy.isHorizontal(bBox, figure);
      const figureCenter = this.getFigureCenter();
      points = strategy.prepareLabelPoints(bBox, rotatedBBox, isHorizontal, -options.rotationAngle || 0, figureCenter);
      labelPoint = getClosestCoord(figureCenter, points);
      points = strategy.findFigurePoint(figure, labelPoint, isHorizontal);
      points = points.concat(labelPoint);
    }
    return strategy.adjustPoints(points);
  }

  // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
  fit(maxWidth: number): boolean {
    const padding = this._background ? 2 * LABEL_BACKGROUND_PADDING_X : 0;
    let rowCountChanged = false;
    if (this._text) {
      const result = this._text.setMaxSize(maxWidth - padding, undefined, this._options);
      let rowCount = result.rowCount;
      if (rowCount === 0) {
        rowCount = 1;
      }
      if (rowCount !== this._rowCount) {
        rowCountChanged = true;
        this._rowCount = rowCount;
      }
      result.textIsEmpty && disposeItem(this, '_background');
    }
    this._updateBackground(this._text.getBBox());
    return rowCountChanged;
  }

  resetEllipsis(): void {
    this._text && this._text.restoreText();
    this._updateBackground(this._text.getBBox());
  }

  setTrackerData(point: ThemeValue): void {
    this._text.data({ 'chart-data-point': point });
    this._background && this._background.data({ 'chart-data-point': point });
  }

  hideInsideLabel(this: Label & { _point: LabelPoint }, coords: Coords): boolean {
    return this._point.hideInsideLabel(this, coords);
  }

  getPoint(): LabelPoint | undefined {
    return this._point;
  }

  // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
  shift(x: number, y: number): this {
    if (this._textContent) {
      this._insideGroup.attr({
        translateX: this._x = _round(x - this._bBox.x),
        translateY: this._y = _round(y - this._bBox.y),
      });
      if (this._connector) {
        this._connector.attr({ points: this._getConnectorPoints() });
      }
    }
    return this;
  }

  // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
  getBoundingRect(): LabelRect {
    return this._shiftBBox(this._bBox);
  }

  _shiftBBox(bBox: BBox): LabelRect {
    return this._textContent ? {
      x: bBox.x + this._x,
      y: bBox.y + this._y,
      width: bBox.width,
      height: bBox.height,
    } : {};
  }

  getLayoutOptions(): LabelLayoutOptions {
    const options = this._options;
    return {
      alignment: options.alignment,
      background: checkBackground(options.background),
      horizontalOffset: options.horizontalOffset,
      verticalOffset: options.verticalOffset,
      radialOffset: options.radialOffset,
      position: options.position,
      connectorOffset: (checkConnector(options.connector) ? CONNECTOR_LENGTH : 0) + (checkBackground(options.background) ? LABEL_BACKGROUND_PADDING_X : 0),
    };
  }
};

/// #DEBUG
Label._DEBUG_formatText = formatText;
/// #ENDDEBUG

/// #DEBUG
export function DEBUG_set_Label(value: typeof Label): void {
  Label = value;
}
/// #ENDDEBUG
