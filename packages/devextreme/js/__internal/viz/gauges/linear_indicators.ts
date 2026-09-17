/* eslint-disable max-classes-per-file */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum } from '@ts/viz/core/utils';
import type {
  IndicatorMeasure,
  Point,
  RangeBarPositions,
  Size,
  TextCloudOptions,
  TooltipParameters,
  TrackerSettings,
} from '@ts/viz/gauges/base_indicators';
import { BaseIndicator, BaseRangeBar, BaseTextCloudMarker } from '@ts/viz/gauges/base_indicators';

export interface LinearLayout {
  x: number;
  y: number;
}

function isInverted(options: ThemeValue): boolean {
  return options.vertical
    ? normalizeEnum(options.horizontalOrientation) === 'right'
    : normalizeEnum(options.verticalOrientation) === 'bottom';
}

function getVerticalLinePoints(
  lineStart: number,
  lineEnd: number,
  basePosition: number,
  actualPosition: number,
): number[] {
  const [side1, side2] = basePosition >= actualPosition
    ? [actualPosition, actualPosition + 2]
    : [actualPosition - 2, actualPosition];
  return [lineStart, side1, lineStart, side2, lineEnd, side2, lineEnd, side1];
}

function getHorizontalLinePoints(
  lineStart: number,
  lineEnd: number,
  basePosition: number,
  actualPosition: number,
): number[] {
  const [side1, side2] = basePosition <= actualPosition
    ? [actualPosition - 2, actualPosition]
    : [actualPosition, actualPosition + 2];
  return [side1, lineStart, side1, lineEnd, side2, lineEnd, side2, lineStart];
}

class SimpleIndicator extends BaseIndicator {
  _element;

  vertical?: boolean;

  _zeroPosition!: number;

  _move(): void {
    const delta = this._actualPosition - this._zeroPosition;
    this._rootElement.move(this.vertical ? 0 : delta, this.vertical ? delta : 0);
    if (this._trackerElement) {
      this._trackerElement.move(this.vertical ? 0 : delta, this.vertical ? delta : 0);
    }
  }

  _isEnabled(): boolean {
    this.vertical = this._options.vertical;
    return this._options.length > 0 && this._options.width > 0;
  }

  _isVisible(): boolean {
    return true;
  }

  _getTrackerSettings(): TrackerSettings {
    const options = this._options;
    let width = options.width / 2;
    let length = options.length / 2;
    const p = this._zeroPosition;

    if (!(width > 10)) {
      width = 10;
    }
    if (!(length > 10)) {
      length = 10;
    }
    const {
      x1, x2, y1, y2,
    } = this.vertical
      ? {
        x1: options.x - length, x2: options.x + length, y1: p + width, y2: p - width,
      }
      : {
        x1: p - width, x2: p + width, y1: options.y + length, y2: options.y - length,
      };
    return { points: [x1, y1, x1, y2, x2, y2, x2, y1] };
  }

  _render(): void {
    this._zeroPosition = this._translator.getCodomainStart();
  }

  _clear(): void {
    delete this._element;
  }

  measure(layout: LinearLayout): IndicatorMeasure {
    const p = this.vertical ? layout.x : layout.y;
    return {
      min: p - this._options.length / 2,
      max: p + this._options.length / 2,
    };
  }

  getTooltipParameters(): TooltipParameters {
    const options = this._options;
    const p = this._actualPosition;
    const parameters: TooltipParameters = {
      x: p, y: p, value: this._currentValue, color: options.color, offset: options.width / 2,
    };
    if (this.vertical) {
      parameters.x = options.x;
    } else {
      parameters.y = options.y;
    }
    return parameters;
  }
}

class Rectangle extends SimpleIndicator {
  _render(): void {
    const options = this._options;

    super._render();
    const p = this._zeroPosition;
    const {
      x1, x2, y1, y2,
    } = this.vertical
      ? {
        x1: options.x - options.length / 2,
        x2: options.x + options.length / 2,
        y1: p + options.width / 2,
        y2: p - options.width / 2,
      }
      : {
        x1: p - options.width / 2,
        x2: p + options.width / 2,
        y1: options.y + options.length / 2,
        y2: options.y - options.length / 2,
      };
    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    this._element.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
  }
}

class Rhombus extends SimpleIndicator {
  _render(): void {
    const options = this._options;

    super._render();
    const {
      x, y, dx, dy,
    } = this.vertical
      ? {
        x: options.x,
        y: this._zeroPosition,
        dx: options.length / 2 || 0,
        dy: options.width / 2 || 0,
      }
      : {
        x: this._zeroPosition,
        y: options.y,
        dx: options.width / 2 || 0,
        dy: options.length / 2 || 0,
      };
    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    this._element.attr({ points: [x - dx, y, x, y - dy, x + dx, y, x, y + dy] });
  }
}

class Circle extends SimpleIndicator {
  _render(): void {
    const options = this._options;

    super._render();
    const { x, y } = this.vertical
      ? { x: options.x, y: this._zeroPosition }
      : { x: this._zeroPosition, y: options.y };
    const r = options.length / 2 || 0;
    this._element = this._element || this._renderer.circle().append(this._rootElement);
    this._element.attr({ cx: x, cy: y, r });
  }
}

// The following is from linearMarker.js

class TriangleMarker extends SimpleIndicator {
  _inverted?: boolean;

  _isEnabled(): boolean {
    this.vertical = this._options.vertical;
    this._inverted = isInverted(this._options);
    return this._options.length > 0 && this._options.width > 0;
  }

  _isVisible(): boolean {
    return true;
  }

  _render(): void {
    const options = this._options;
    const settings: ThemeValue = { stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square' };

    super._render();
    if (this.vertical) {
      const x1 = options.x;
      const y1 = this._zeroPosition;
      const x2 = x1 + Number(this._inverted ? options.length : -options.length);
      settings.points = [x1, y1, x2, y1 - options.width / 2, x2, y1 + options.width / 2];
    } else {
      const y1 = options.y;
      const x1 = this._zeroPosition;
      const y2 = y1 + Number(this._inverted ? options.length : -options.length);
      settings.points = [x1, y1, x1 - options.width / 2, y2, x1 + options.width / 2, y2];
    }

    if (options.space > 0) {
      settings['stroke-width'] = Math.min(options.space, options.width / 4) || 0;
      settings.stroke = settings['stroke-width'] > 0 ? options.containerBackgroundColor || 'none' : 'none';
    }
    this._element = this._element || this._renderer.path([], 'area').append(this._rootElement);
    this._element.attr(settings).sharp();
  }

  _getTrackerSettings(): TrackerSettings {
    const options = this._options;
    let width = options.width / 2;
    let length = Number(options.length);

    if (!(width > 10)) {
      width = 10;
    }
    if (!(length > 20)) {
      length = 20;
    }
    if (this.vertical) {
      const x1 = options.x;
      const x2 = x1 + (this._inverted ? length : -length);
      const y1 = this._zeroPosition + width;
      const y2 = this._zeroPosition - width;
      return { points: [x1, y1, x2, y1, x2, y2, x1, y2] };
    }
    const y1 = options.y;
    const y2 = y1 + (this._inverted ? length : -length);
    const x1 = this._zeroPosition - width;
    const x2 = this._zeroPosition + width;
    return { points: [x1, y1, x1, y2, x2, y2, x2, y1] };
  }

  measure(layout: LinearLayout): IndicatorMeasure {
    const length = Number(this._options.length);
    let minBound = this.vertical ? layout.x : layout.y;
    let maxBound = minBound;

    if (this._inverted) {
      maxBound = minBound + length;
    } else {
      minBound = maxBound - length;
    }
    return { min: minBound, max: maxBound };
  }

  getTooltipParameters(): TooltipParameters {
    const options = this._options;
    const s = (this._inverted ? options.length : -options.length) / 2;
    const parameters = super.getTooltipParameters();
    if (this.vertical) {
      parameters.x += s;
    } else {
      parameters.y += s;
    }
    parameters.offset = options.length / 2;
    return parameters;
  }
}

class TextCloud extends BaseTextCloudMarker {
  vertical?: boolean;

  _inverted?: boolean;

  _isEnabled(): boolean {
    this.vertical = this._options.vertical;
    this._inverted = isInverted(this._options);
    return true;
  }

  _isVisible(): boolean {
    return true;
  }

  _getTextCloudOptions(): TextCloudOptions {
    const position = this._actualPosition;
    if (this.vertical) {
      return { x: this._options.x, y: position, type: this._inverted ? 'top-left' : 'top-right' };
    }
    return { x: position, y: this._options.y, type: this._inverted ? 'right-top' : 'right-bottom' };
  }

  measure(layout: LinearLayout): IndicatorMeasure {
    const arrowLength = Number(this._options.arrowLength) || 0;

    this._measureText();
    const center = this.vertical ? layout.x : layout.y;
    const textSize = this.vertical ? this._textFullWidth : this._textFullHeight;
    if (this._inverted) {
      return { min: center, max: center + arrowLength + textSize, indent: 0 };
    }
    return { min: center - arrowLength - textSize, max: center, indent: 0 };
  }

  _correctCloudType(type: string, { x, y }: Point, { width, height }: Size): string {
    let result = type;
    if (type === 'right-top' || type === 'right-bottom') {
      if ((x - width) < this._translator.getCodomainStart()) {
        result = `left-${type.split('-')[1]}`;
      }
    } else if (type === 'top-left' || type === 'top-right') {
      if ((y + height) > this._translator.getCodomainStart()) {
        result = `bottom-${type.split('-')[1]}`;
      }
    }
    return result;
  }
}

// The following is from linearRangeBar.js

class RangeBar extends BaseRangeBar {
  vertical?: boolean;

  _inverted?: boolean;

  _minSide!: number;

  _maxSide!: number;

  _minBound!: number;

  _maxBound!: number;

  _lineStart!: number;

  _lineEnd!: number;

  _textPosition!: number;

  _isEnabled(): boolean {
    this.vertical = this._options.vertical;
    this._inverted = isInverted(this._options);
    return this._options.size > 0;
  }

  _isVisible(): boolean {
    return true;
  }

  _createBarItem(): ThemeValue {
    return this._renderer.path([], 'area').append(this._rootElement);
  }

  _createTracker(): ThemeValue {
    return this._renderer.path([], 'area');
  }

  _setBarSides(): void {
    const options = this._options;
    const size = Number(options.size);
    const base = this.vertical ? options.x : options.y;
    const [minSide, maxSide] = this._inverted ? [base, base + size] : [base - size, base];
    this._minSide = minSide;
    this._maxSide = maxSide;
    this._minBound = minSide;
    this._maxBound = maxSide;
  }

  _getSpace(): number {
    const options = this._options;
    return options.space > 0 ? Number(options.space) : 0;
  }

  _isTextVisible(): boolean {
    const textOptions = this._options.text || {};
    return textOptions.indent > 0 || textOptions.indent < 0;
  }

  _getTextAlign(): string {
    if (!this.vertical) {
      return 'center';
    }
    return this._options.text.indent > 0 ? 'left' : 'right';
  }

  _setTextItemsSides(): void {
    const indent = Number(this._options.text.indent);

    if (indent > 0) {
      this._lineStart = this._maxSide;
      this._lineEnd = this._maxSide + indent;
      this._textPosition = this._lineEnd + (this.vertical ? 2 : this._textHeight / 2);
      this._maxBound = this._textPosition
        + (this.vertical ? this._textWidth : this._textHeight / 2);
    } else if (indent < 0) {
      this._lineStart = this._minSide;
      this._lineEnd = this._minSide + indent;
      this._textPosition = this._lineEnd - (this.vertical ? 2 : this._textHeight / 2);
      this._minBound = this._textPosition
        - (this.vertical ? this._textWidth : this._textHeight / 2);
    }
  }

  _getPositions(): RangeBarPositions {
    const startPosition = this._startPosition;
    const endPosition = this._endPosition;
    const space = this._space;
    const basePosition = this._basePosition;
    const actualPosition = this._actualPosition;
    const ascending = startPosition < endPosition;
    const baseFirst = ascending ? basePosition < actualPosition : basePosition > actualPosition;
    const [mainPosition1, mainPosition2] = baseFirst
      ? [basePosition, actualPosition]
      : [actualPosition, basePosition];
    const [backPosition1, backPosition2] = ascending
      ? [mainPosition1 - space, mainPosition2 + space]
      : [mainPosition1 + space, mainPosition2 - space];

    return {
      start: startPosition,
      end: endPosition,
      main1: mainPosition1,
      main2: mainPosition2,
      back1: backPosition1,
      back2: backPosition2,
    };
  }

  _buildItemSettings(from: number, to: number): ThemeValue {
    const side1 = this._minSide;
    const side2 = this._maxSide;
    const points = this.vertical
      ? [side1, from, side1, to, side2, to, side2, from]
      : [from, side1, from, side2, to, side2, to, side1];
    return { points };
  }

  _updateTextPosition(): void {
    this._text.attr(this.vertical ? {
      x: this._textPosition,
      y: this._actualPosition + this._textVerticalOffset,
    } : {
      x: this._actualPosition,
      y: this._textPosition + this._textVerticalOffset,
    });
  }

  _updateLinePosition(): void {
    const getPoints = this.vertical ? getVerticalLinePoints : getHorizontalLinePoints;
    const points = getPoints(
      this._lineStart,
      this._lineEnd,
      this._basePosition,
      this._actualPosition,
    );
    this._line.attr({ points }).sharp();
  }

  _getTooltipPosition(): Point {
    const crossCenter = (this._minSide + this._maxSide) / 2;
    const alongCenter = (this._basePosition + this._actualPosition) / 2;

    return this.vertical ? { x: crossCenter, y: alongCenter } : { x: alongCenter, y: crossCenter };
  }

  measure(layout: LinearLayout): IndicatorMeasure {
    const size = Number(this._options.size);
    const textIndent = Number(this._options.text.indent);
    let minBound = this.vertical ? layout.x : layout.y;
    let maxBound = minBound;

    this._measureText();
    if (this._inverted) {
      maxBound += size;
    } else {
      minBound -= size;
    }
    const textAlong = this.vertical ? this._textWidth : this._textHeight;
    const textCross = this.vertical ? this._textHeight : this._textWidth;
    const indent = this._hasText ? textCross / 2 : undefined;
    if (this._hasText) {
      if (textIndent > 0) {
        maxBound += textIndent + textAlong;
      }
      if (textIndent < 0) {
        minBound += textIndent - textAlong;
      }
    }
    return { min: minBound, max: maxBound, indent };
  }
}

/* eslint-disable spellcheck/spell-checker */

export {
  RangeBar as _default,
  Circle as circle,
  RangeBar as rangebar,
  Rectangle as rectangle,
  Rhombus as rhombus,
  TextCloud as textcloud,
  TriangleMarker as trianglemarker,
};
