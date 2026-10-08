/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable prefer-destructuring */

import { extend } from '@ts/core/utils/m_extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type {
  BBox, Bounds, Canvas, Coords,
} from '@ts/viz/core/types';
import { patchFontOptions } from '@ts/viz/core/utils';

const math = Math;
const mathAbs = math.abs;
const mathMin = math.min;
const mathMax = math.max;
const mathFloor = math.floor;
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const LABEL_BACKGROUND_PADDING_X = 8;
const LABEL_BACKGROUND_PADDING_Y = 4;
const CENTER = 'center';
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';

type Direction = 'horizontal' | 'vertical';
type LabelSide = 'left' | 'right' | 'top' | 'bottom';
type CoordName = 'x' | 'y';
type SizeName = 'width' | 'height';

interface CrosshairPane {
  coords: Bounds;
  clipRect: { id: string | null };
}

interface CrosshairParams {
  canvas: Canvas;
  axes: ThemeValue[][];
  panes: CrosshairPane[];
}

interface CrosshairLineStyle {
  stroke: string;
  'stroke-width': number;
  dashStyle: string;
  opacity: number;
  'stroke-linecap': string;
}

interface CrosshairLineSettings {
  visible: boolean;
  line: CrosshairLineStyle;
  label: ThemeValue;
}

interface CrosshairLabel {
  text: ThemeValue;
  background: ThemeValue;
  axis: ThemeValue;
  options: ThemeValue;
  pos: { coord: number; side: LabelSide };
  startXY: Coords;
}

type LabelPositionChecker = (bBox: BBox, position: LabelSide, coord: Coords) => Coords;

export function getMargins(): Coords {
  return {
    x: LABEL_BACKGROUND_PADDING_X,
    y: LABEL_BACKGROUND_PADDING_Y,
  };
}

function getRectangleBBox(bBox: BBox): BBox {
  return {
    x: bBox.x - LABEL_BACKGROUND_PADDING_X,
    y: bBox.y - LABEL_BACKGROUND_PADDING_Y,
    width: bBox.width + LABEL_BACKGROUND_PADDING_X * 2,
    height: bBox.height + LABEL_BACKGROUND_PADDING_Y * 2,
  };
}

function getLabelCheckerPosition(x: number, y: number, isHorizontal: boolean, canvas: Canvas): LabelPositionChecker {
  const params: [CoordName, SizeName, CoordName, SizeName, number, number] = isHorizontal ? ['x', 'width', 'y', 'height', y, 0] : ['y', 'height', 'x', 'width', x, 1];

  return function (bBox, position, coord) {
    const labelCoord = { x: coord.x, y: coord.y };
    const rectangleBBox = getRectangleBBox(bBox);
    const delta = isHorizontal ? coord.y - bBox.y - bBox.height / 2 : coord.y - bBox.y;

    labelCoord.y = isHorizontal || (!isHorizontal && position === BOTTOM) ? coord.y + delta : coord.y;

    if (rectangleBBox[params[0]] < 0) {
      labelCoord[params[0]] -= rectangleBBox[params[0]];
    } else if (rectangleBBox[params[0]] + rectangleBBox[params[1]] + delta * params[5] > canvas[params[1]]) {
      labelCoord[params[0]] -= rectangleBBox[params[0]] + rectangleBBox[params[1]] + delta * params[5] - canvas[params[1]];
    }
    if (params[4] - rectangleBBox[params[3]] / 2 < 0) {
      labelCoord[params[2]] -= params[4] - rectangleBBox[params[3]] / 2;
    } else if (params[4] + rectangleBBox[params[3]] / 2 > canvas[params[3]]) {
      labelCoord[params[2]] -= params[4] + rectangleBBox[params[3]] / 2 - canvas[params[3]];
    }

    return labelCoord;
  };
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Crosshair = class Crosshair {
  declare _renderer: ThemeValue;

  declare _crosshairGroup: ThemeValue;

  declare _options: Record<string, CrosshairLineSettings>;

  declare _canvas: Canvas;

  declare _axes: ThemeValue[][];

  declare _panes: CrosshairPane[];

  declare _horizontal: ThemeValue;

  declare _vertical: ThemeValue;

  declare _horizontalGroup: ThemeValue;

  declare _verticalGroup: ThemeValue;

  declare _circle: ThemeValue;

  declare _linesCanvas: Bounds;

  constructor(renderer: ThemeValue, options: ThemeValue, params: CrosshairParams, group: ThemeValue) {
    this._renderer = renderer;
    this._crosshairGroup = group;
    this._options = {};
    this.update(options, params);
  }

  update(options: ThemeValue, params: CrosshairParams): void {
    const canvas = params.canvas;
    this._canvas = {
      top: canvas.top,
      bottom: canvas.height - canvas.bottom,
      left: canvas.left,
      right: canvas.width - canvas.right,
      width: canvas.width,
      height: canvas.height,
    };
    this._axes = params.axes;
    this._panes = params.panes;
    this._prepareOptions(options, HORIZONTAL);
    this._prepareOptions(options, VERTICAL);
  }

  dispose(): void {
    // @ts-expect-error dispose drops the references kept in non-nullable fields
    this._renderer = this._crosshairGroup = this._options = this._axes = this._canvas = this._horizontalGroup = this._verticalGroup = this._horizontal = this._vertical = this._circle = this._panes = null;
  }

  _prepareOptions(options: ThemeValue, direction: Direction): void {
    const lineOptions = options[`${direction}Line`];
    this._options[direction] = {
      visible: lineOptions.visible,
      line: {
        stroke: lineOptions.color || options.color,
        'stroke-width': lineOptions.width || options.width,
        dashStyle: lineOptions.dashStyle || options.dashStyle,
        opacity: lineOptions.opacity || options.opacity,
        'stroke-linecap': 'butt',
      },
      label: extend(true, {}, options.label, lineOptions.label),
    };
  }

  _createLines(options: CrosshairLineStyle, sharpParam: string, group: ThemeValue): ThemeValue[] {
    const lines: ThemeValue[] = [];
    const canvas = this._canvas;
    const points = [canvas.left, canvas.top, canvas.left, canvas.top];
    for (let i = 0; i < 2; i++) {
      lines.push(this._renderer.path(points, 'line').attr(options).sharp(sharpParam).append(group));
    }
    return lines;
  }

  render(): void {
    const renderer = this._renderer;
    const options = this._options;
    const verticalOptions = options.vertical;
    const horizontalOptions = options.horizontal;
    const extraOptions = horizontalOptions.visible ? horizontalOptions.line : verticalOptions.line;
    const circleOptions = {
      stroke: extraOptions.stroke, 'stroke-width': extraOptions['stroke-width'], dashStyle: extraOptions.dashStyle, opacity: extraOptions.opacity,
    };
    const canvas = this._canvas;

    this._horizontal = {};
    this._vertical = {};

    this._circle = renderer.circle(canvas.left, canvas.top, 0).attr(circleOptions).append(this._crosshairGroup);
    this._horizontalGroup = renderer.g().append(this._crosshairGroup);
    this._verticalGroup = renderer.g().append(this._crosshairGroup);

    if (verticalOptions.visible) {
      this._vertical.lines = this._createLines(verticalOptions.line, 'h', this._verticalGroup);
      this._vertical.labels = this._createLabels(this._axes[0], verticalOptions, false, this._verticalGroup);
    }
    if (horizontalOptions.visible) {
      this._horizontal.lines = this._createLines(horizontalOptions.line, 'v', this._horizontalGroup);
      this._horizontal.labels = this._createLabels(this._axes[1], horizontalOptions, true, this._horizontalGroup);
    }

    this.hide();
  }

  _createLabels(axes: ThemeValue[], options: CrosshairLineSettings, isHorizontal: boolean, group: ThemeValue): CrosshairLabel[] {
    const canvas = this._canvas;
    const renderer = this._renderer;
    let x;
    let y;
    let text;
    const labels: CrosshairLabel[] = [];
    let background;
    let currentLabelPos;
    const labelOptions = options.label;

    if (labelOptions.visible) {
      axes.forEach((axis) => {
        const position = axis.getOptions().position;
        if (axis.getTranslator().getBusinessRange().isEmpty()) {
          return;
        }

        currentLabelPos = axis.getLabelsPosition();
        if (isHorizontal) {
          y = canvas.top;
          x = currentLabelPos;
        } else {
          x = canvas.left;
          y = currentLabelPos;
        }
        const align = position === TOP || position === BOTTOM ? CENTER : position === RIGHT ? LEFT : RIGHT;
        background = renderer.rect(0, 0, 0, 0).attr({ fill: labelOptions.backgroundColor || options.line.stroke }).append(group);
        text = renderer.text('0', 0, 0).css(patchFontOptions(options.label.font)).attr({
          align,
          class: labelOptions.cssClass,
        }).append(group);
        labels.push({
          text, background, axis, options: labelOptions, pos: { coord: currentLabelPos, side: position }, startXY: { x, y },
        });
      });
    }

    return labels;
  }

  _updateText(value: ThemeValue, axisName: ThemeValue, labels: CrosshairLabel[], point: ThemeValue, func: LabelPositionChecker): void {
    labels.forEach((label) => {
      const axis = label.axis;
      const coord = label.startXY;
      const textElement = label.text;
      const backgroundElement = label.background;
      let text = '';

      if (!axis.name || axis.name === axisName) {
        text = axis.getFormattedValue(value, label.options, point);
      }

      if (text) {
        textElement.attr({ text, x: coord.x, y: coord.y });
        textElement.attr(func(textElement.getBBox(), label.pos.side, coord));

        this._updateLinesCanvas(label);
        backgroundElement.attr(getRectangleBBox(textElement.getBBox()));
      } else {
        textElement.attr({ text: '' });
        backgroundElement.attr({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      }
    });
  }

  hide(): void {
    this._crosshairGroup.attr({ visibility: 'hidden' });
  }

  _updateLinesCanvas(label: CrosshairLabel): void {
    const position = label.pos.side;
    const labelCoord = label.pos.coord;
    const coords = this._linesCanvas;
    const canvas = this._canvas;

    coords[position] = coords[position] !== canvas[position] && mathAbs(coords[position] - canvas[position]) < mathAbs(labelCoord - canvas[position]) ? coords[position] : labelCoord;
  }

  _updateLines(lines: ThemeValue[], x: number, y: number, r: number, isHorizontal: boolean): void {
    const coords = this._linesCanvas;
    const canvas = this._canvas;
    const points = isHorizontal
      ? [
        [mathMin(x - r, coords.left), canvas.top, x - r, canvas.top],
        [x + r, canvas.top, mathMax(coords.right, x + r), canvas.top],
      ]
      : [
        [canvas.left, mathMin(coords.top, y - r), canvas.left, y - r],
        [canvas.left, y + r, canvas.left, mathMax(coords.bottom, y + r)],
      ];
    for (let i = 0; i < 2; i++) {
      lines[i].attr({ points: points[i] }).sharp(isHorizontal ? 'v' : 'h', isHorizontal ? y === canvas.bottom ? -1 : 1 : x === canvas.right ? -1 : 1);
    }
  }

  _resetLinesCanvas(): void {
    const canvas = this._canvas;
    this._linesCanvas = {
      left: canvas.left,
      right: canvas.right,
      top: canvas.top,
      bottom: canvas.bottom,
    };
  }

  _getClipRectForPane(x: number, y: number): { id: string | null } {
    const panes = this._panes;
    let i;
    let coords;
    for (i = 0; i < panes.length; i++) {
      coords = panes[i].coords;
      if (coords.left <= x && coords.right >= x && coords.top <= y && coords.bottom >= y) {
        return panes[i].clipRect;
      }
    }
    return { id: null };
  }

  show(data: { point: ThemeValue; x: number; y: number }): void {
    const point = data.point;
    const pointData = point.getCrosshairData(data.x, data.y);
    const r = point.getPointRadius();
    const horizontal = this._horizontal;
    const vertical = this._vertical;
    const rad = !r ? 0 : r + 3;
    const canvas = this._canvas;
    const x = mathFloor(pointData.x);
    const y = mathFloor(pointData.y);

    if (x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom) {
      this._crosshairGroup.attr({ visibility: 'visible' });
      this._resetLinesCanvas();
      this._circle.attr({
        cx: x, cy: y, r: rad, 'clip-path': this._getClipRectForPane(x, y).id,
      });

      if (horizontal.lines) {
        this._updateText(pointData.yValue, pointData.axis, horizontal.labels, point, getLabelCheckerPosition(x, y, true, canvas));
        this._updateLines(horizontal.lines, x, y, rad, true);
        this._horizontalGroup.attr({ translateY: y - canvas.top });
      }

      if (vertical.lines) {
        this._updateText(pointData.xValue, pointData.axis, vertical.labels, point, getLabelCheckerPosition(x, y, false, canvas));
        this._updateLines(vertical.lines, x, y, rad, false);
        this._verticalGroup.attr({ translateX: x - canvas.left });
      }
    } else {
      this.hide();
    }
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_Crosshair(value: typeof Crosshair): void {
  Crosshair = value;
}
/// #ENDDEBUG
