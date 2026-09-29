/* eslint-disable max-classes-per-file */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { convertAngleToRendererSpace, getCosAndSin, normalizeAngle } from '@ts/viz/core/utils';
import type {
  IndicatorMeasure,
  Point,
  RangeBarPositions,
  TextCloudOptions,
  TooltipParameters,
  TrackerSettings,
} from '@ts/viz/gauges/base_indicators';
import { BaseIndicator, BaseRangeBar, BaseTextCloudMarker } from '@ts/viz/gauges/base_indicators';

export interface CircularLayout {
  x: number;
  y: number;
  radius: number;
}

function correctRadius(
  layout: CircularLayout | undefined,
  size: number,
): CircularLayout | undefined {
  if (layout && layout.radius - size <= 0) {
    layout.radius = size + 1;
  }
  return layout;
}

function getTextCloudType(angle: number): string {
  if (angle > 270) {
    return 'left-top';
  }
  if (angle > 180) {
    return 'top-right';
  }
  if (angle > 90) {
    return 'right-bottom';
  }
  return 'bottom-left';
}

//  B253863
function getTwoColorBounds(
  fraction: number,
  y1: number,
  y4: number,
  space: number,
): [number, number] {
  if (fraction >= 1) {
    return [y1, y1];
  }
  if (fraction <= 0) {
    return [y4, y4];
  }
  const y3 = y4 + (y1 - y4) * fraction;
  return [y3 + space, y3];
}

function getLineSides(x: number, basePosition: number, actualPosition: number): [number, number] {
  if (basePosition > actualPosition) {
    return [x - 2, x];
  }
  if (basePosition < actualPosition) {
    return [x, x + 2];
  }
  return [x - 1, x + 1];
}

abstract class SimpleIndicator extends BaseIndicator {
  _element;

  _move(): void {
    const options = this._options;
    const angle = convertAngleToRendererSpace(this._actualPosition);
    this._rootElement.rotate(angle, options.x, options.y);
    if (this._trackerElement) {
      this._trackerElement.rotate(angle, options.x, options.y);
    }
  }

  _isEnabled(): boolean {
    return this._options.width > 0;
  }

  _isVisible(layout: CircularLayout): boolean {
    return layout.radius - Number(this._options.indentFromCenter) > 0;
  }

  _getTrackerSettings(): TrackerSettings {
    const options = this._options;
    const radius = this._getRadius();
    const indentFromCenter = this._getIndentFromCenter();
    const { x } = options;
    const y = options.y - (radius + indentFromCenter) / 2;
    let width = options.width / 2;
    let length = (radius - indentFromCenter) / 2;
    if (!(width > 10)) {
      width = 10;
    }
    if (!(length > 10)) {
      length = 10;
    }
    return {
      points: [
        x - width, y - length, x - width, y + length, x + width, y + length, x + width, y - length,
      ],
    };
  }

  _clearPointer(): void {
    delete this._element;
  }

  _clear(): void {
    this._clearPointer();
  }

  _getIndentFromCenter(): number {
    return Number(this._options.indentFromCenter) || 0;
  }

  _getRadius(): number {
    return 0;
  }

  measure(layout: CircularLayout): IndicatorMeasure {
    const result: IndicatorMeasure = { max: layout.radius };
    if (this._options.indentFromCenter < 0) {
      result.inverseVerticalOffset = -Number(this._options.indentFromCenter);
      result.inverseHorizontalOffset = result.inverseVerticalOffset;
    }
    return result;
  }

  getTooltipParameters(): TooltipParameters {
    const options = this._options;
    const cosSin = getCosAndSin(this._actualPosition);
    const r = (this._getRadius() + this._getIndentFromCenter()) / 2;
    return {
      x: options.x + cosSin.cos * r,
      y: options.y - cosSin.sin * r,
      value: this._currentValue,
      color: options.color,
      offset: options.width / 2,
    };
  }
}

abstract class NeedleIndicator extends SimpleIndicator {
  _spindleOuter;

  _spindleInner;

  _isVisible(layout: CircularLayout): boolean {
    const indentFromCenter = this._adjustOffset(
      Number(this._options.indentFromCenter),
      layout.radius,
    );
    const offset = this._adjustOffset(Number(this._options.offset), layout.radius);

    return layout.radius - indentFromCenter - offset > 0;
  }

  getOffset(): number {
    return 0;
  }

  _adjustOffset(value: number, radius: number): number {
    const minRadius = Number(this._options.beginAdaptingAtRadius);
    const diff = radius / minRadius;
    let result = value;

    if (diff < 1) {
      result = Math.floor(value * diff);
    }

    return result || 0;
  }

  _getIndentFromCenter(): number {
    return this._adjustOffset(Number(this._options.indentFromCenter), this._options.radius);
  }

  _getRadius(): number {
    const options = this._options;
    return options.radius - this._adjustOffset(Number(options.offset), options.radius);
  }

  _renderSpindle(): void {
    const options = this._options;
    const { radius } = options;
    const spindleSize = this._adjustOffset(Number(options.spindleSize) / 2, radius) * 2;
    let gapSize = this._adjustOffset(Number(options.spindleGapSize) / 2, radius) * 2 || 0;
    if (gapSize > 0) {
      gapSize = gapSize <= spindleSize ? gapSize : spindleSize;
    }

    if (spindleSize > 0) {
      this._spindleOuter = this._spindleOuter || this._renderer.circle().append(this._rootElement);
      this._spindleInner = this._spindleInner || this._renderer.circle().append(this._rootElement);
      this._spindleOuter.attr({
        class: 'dxg-spindle-border', cx: options.x, cy: options.y, r: spindleSize / 2,
      });
      this._spindleInner.attr({
        class: 'dxg-spindle-hole',
        cx: options.x,
        cy: options.y,
        r: gapSize / 2,
        fill: options.containerBackgroundColor,
      });
    }
  }

  _render(): void {
    this._renderPointer();
    this._renderSpindle();
  }

  _clear(): void {
    super._clear();
    delete this._spindleOuter;
    delete this._spindleInner;
  }

  abstract _renderPointer(): void;
}

class RectangleNeedle extends NeedleIndicator {
  _renderPointer(): void {
    const options = this._options;
    const y2 = options.y - this._getRadius();
    const y1 = options.y - this._getIndentFromCenter();
    const x1 = options.x - options.width / 2;
    const x2 = x1 + Number(options.width);

    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    this._element.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
  }
}

class TriangleNeedle extends NeedleIndicator {
  _renderPointer(): void {
    const options = this._options;
    const y2 = options.y - this._getRadius();
    const y1 = options.y - this._getIndentFromCenter();
    const x1 = options.x - options.width / 2;
    const x2 = options.x + options.width / 2;

    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    this._element.attr({ points: [x1, y1, options.x, y2, x2, y1] });
  }
}

class TwoColorNeedle extends NeedleIndicator {
  _firstElement;

  _spaceElement;

  _secondElement;

  _renderPointer(): void {
    const options = this._options;
    const x1 = options.x - options.width / 2;
    const x2 = options.x + options.width / 2;
    const y4 = options.y - this._getRadius();
    const y1 = options.y - this._getIndentFromCenter();
    const fraction = Number(options.secondFraction) || 0;
    const [y2, y3] = getTwoColorBounds(fraction, y1, y4, Number(options.space));
    this._firstElement = this._firstElement || this._renderer.path([], 'area').append(this._rootElement);
    this._spaceElement = this._spaceElement || this._renderer.path([], 'area').append(this._rootElement);
    this._secondElement = this._secondElement || this._renderer.path([], 'area').append(this._rootElement);
    this._firstElement.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
    this._spaceElement.attr({
      points: [x1, y2, x1, y3, x2, y3, x2, y2], class: 'dxg-hole', fill: options.containerBackgroundColor,
    });
    this._secondElement.attr({
      points: [x1, y3, x1, y4, x2, y4, x2, y3], class: 'dxg-part', fill: options.secondColor,
    });
  }

  _clearPointer(): void {
    delete this._firstElement;
    delete this._secondElement;
    delete this._spaceElement;
  }
}

// The following is from circularMarker.js

class TriangleMarker extends SimpleIndicator {
  _isEnabled(): boolean {
    return this._options.length > 0 && this._options.width > 0;
  }

  _isVisible(): boolean {
    return true;
  }

  resize(layout?: CircularLayout): this {
    return super.resize(correctRadius(layout, 0));
  }

  _render(): void {
    const options = this._options;
    const { x } = options;
    const y1 = options.y - options.radius;
    const dx = options.width / 2 || 0;
    const y2 = y1 - Number(options.length);
    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    const settings: ThemeValue = {
      points: [x, y1, x - dx, y2, x + dx, y2], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square',
    };
    if (options.space > 0) {
      settings['stroke-width'] = Math.min(options.space, options.width / 4) || 0;
      settings.stroke = settings['stroke-width'] > 0 ? options.containerBackgroundColor || 'none' : 'none';
    }
    this._element.attr(settings).sharp();
  }

  _clear(): void {
    delete this._element;
  }

  _getTrackerSettings(): TrackerSettings {
    const options = this._options;
    const { x } = options;
    const y = options.y - options.radius - options.length / 2;
    let width = options.width / 2;
    let length = options.length / 2;
    if (!(width > 10)) {
      width = 10;
    }
    if (!(length > 10)) {
      length = 10;
    }
    return {
      points: [
        x - width, y - length, x - width, y + length, x + width, y + length, x + width, y - length,
      ],
    };
  }

  measure(layout: CircularLayout): IndicatorMeasure {
    return { min: layout.radius, max: layout.radius + Number(this._options.length) };
  }

  getTooltipParameters(): TooltipParameters {
    const options = this._options;
    const cosSin = getCosAndSin(this._actualPosition);
    const r = options.radius + options.length / 2;
    const parameters = super.getTooltipParameters();
    parameters.x = options.x + cosSin.cos * r;
    parameters.y = options.y - cosSin.sin * r;
    parameters.offset = options.length / 2;
    return parameters;
  }
}

class TextCloud extends BaseTextCloudMarker {
  _isEnabled(): boolean {
    return true;
  }

  _isVisible(): boolean {
    return true;
  }

  resize(layout?: CircularLayout): this {
    return super.resize(correctRadius(layout, 0));
  }

  _getTextCloudOptions(): TextCloudOptions {
    const cosSin = getCosAndSin(this._actualPosition);
    const nAngle = normalizeAngle(this._actualPosition);
    return {
      x: this._options.x + cosSin.cos * this._options.radius,
      y: this._options.y - cosSin.sin * this._options.radius,
      type: getTextCloudType(nAngle),
    };
  }

  _correctCloudType(type: string): string {
    return type;
  }

  measure(layout: CircularLayout): IndicatorMeasure {
    const arrowLength = Number(this._options.arrowLength) || 0;

    this._measureText();
    const verticalOffset = this._textFullHeight + arrowLength;
    const horizontalOffset = this._textFullWidth + arrowLength;

    return {
      min: layout.radius,
      max: layout.radius,
      horizontalOffset,
      verticalOffset,
      inverseHorizontalOffset: horizontalOffset,
      inverseVerticalOffset: verticalOffset,
    };
  }
}

// The following is from circularRangeBar.js

class RangeBar extends BaseRangeBar {
  _maxSide!: number;

  _minSide!: number;

  _lineFrom!: number;

  _lineTo!: number;

  _textRadius!: number;

  _isEnabled(): boolean {
    return this._options.size > 0;
  }

  _isVisible(): boolean {
    return true;
  }

  resize(layout?: CircularLayout): this {
    return super.resize(correctRadius(layout, Number(this._options.size)));
  }

  _createBarItem(): ThemeValue {
    return this._renderer.arc().attr({ 'stroke-linejoin': 'round' }).append(this._rootElement);
  }

  _createTracker(): ThemeValue {
    return this._renderer.arc().attr({ 'stroke-linejoin': 'round' });
  }

  _setBarSides(): void {
    this._maxSide = this._options.radius;
    this._minSide = this._maxSide - Number(this._options.size);
  }

  _getSpace(): number {
    const options = this._options;
    return options.space > 0 ? (options.space * 180) / options.radius / Math.PI : 0;
  }

  _isTextVisible(): boolean {
    const options = this._options.text || {};
    return options.indent > 0;
  }

  _setTextItemsSides(): void {
    const options = this._options;
    const indent = Number(options.text.indent);
    this._lineFrom = options.y - options.radius;
    this._lineTo = this._lineFrom - indent;
    this._textRadius = options.radius + indent;
  }

  _getPositions(): RangeBarPositions {
    const basePosition = this._basePosition;
    const actualPosition = this._actualPosition;
    const [mainPosition1, mainPosition2] = basePosition >= actualPosition
      ? [basePosition, actualPosition]
      : [actualPosition, basePosition];
    return {
      start: this._startPosition,
      end: this._endPosition,
      main1: mainPosition1,
      main2: mainPosition2,
      back1: Math.min(mainPosition1 + this._space, this._startPosition),
      back2: Math.max(mainPosition2 - this._space, this._endPosition),
    };
  }

  _buildItemSettings(from: number, to: number): ThemeValue {
    return {
      x: this._options.x,
      y: this._options.y,
      innerRadius: this._minSide,
      outerRadius: this._maxSide,
      startAngle: to,
      endAngle: from,
    };
  }

  _updateTextPosition(): void {
    const cosSin = getCosAndSin(this._actualPosition);
    let x = this._options.x + this._textRadius * cosSin.cos;
    let y = this._options.y - this._textRadius * cosSin.sin;
    x += cosSin.cos * this._textWidth * 0.6;
    y -= cosSin.sin * this._textHeight * 0.6;
    this._text.attr({ x, y: y + this._textVerticalOffset });
  }

  _updateLinePosition(): void {
    const { x } = this._options;
    const [x1, x2] = getLineSides(x, this._basePosition, this._actualPosition);
    const points = [x1, this._lineFrom, x1, this._lineTo, x2, this._lineTo, x2, this._lineFrom];
    this._line
      .attr({ points })
      .rotate(convertAngleToRendererSpace(this._actualPosition), x, this._options.y)
      .sharp();
  }

  _getTooltipPosition(): Point {
    const cosSin = getCosAndSin((this._basePosition + this._actualPosition) / 2);
    const r = (this._minSide + this._maxSide) / 2;
    return { x: this._options.x + cosSin.cos * r, y: this._options.y - cosSin.sin * r };
  }

  measure(layout: CircularLayout): IndicatorMeasure {
    const result: IndicatorMeasure = {
      min: layout.radius - Number(this._options.size),
      max: layout.radius,
    };

    this._measureText();
    if (this._hasText) {
      result.max = (result.max as number) + Number(this._options.text.indent);
      result.horizontalOffset = this._textWidth;
      result.verticalOffset = this._textHeight;
    }
    return result;
  }
}

/* eslint-disable spellcheck/spell-checker */

export {
  RectangleNeedle as _default,
  RangeBar as rangebar,
  RectangleNeedle as rectangleneedle,
  TextCloud as textcloud,
  TriangleMarker as trianglemarker,
  TriangleNeedle as triangleneedle,
  TwoColorNeedle as twocolorneedle,
};
