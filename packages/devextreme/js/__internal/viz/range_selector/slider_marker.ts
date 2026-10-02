/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { patchFontOptions } from '@ts/viz/core/utils';
import { consts, isFirefoxOnAndroid } from '@ts/viz/range_selector/common';

const POINTER_SIZE = consts.pointerSize;
const SLIDER_MARKER_UPDATE_DELAY = 75;

interface TextSize {
  width: number;
  height: number;
  y: number;
}

interface RectSize {
  width: number;
  height: number;
}

interface AreaPointsInfo {
  offset: number;
  isCut: boolean;
  points: number[];
}

class SliderMarker {
  declare _isLeftPointer: boolean;

  declare _isOverlapped: boolean;

  declare _group: ThemeValue;

  declare _area: ThemeValue;

  declare _label: ThemeValue;

  declare _tracker: ThemeValue;

  declare _border: ThemeValue;

  declare _paddingLeftRight: number;

  declare _paddingTopBottom: number;

  declare _textHeight: number | null;

  declare _textSize?: TextSize;

  declare _text?: string;

  declare _position: number;

  declare _range: number[];

  declare _borderPosition: number;

  declare _timeout?: ReturnType<typeof setTimeout>;

  declare _colors: string[];

  constructor(renderer: ThemeValue, root: ThemeValue, isLeftPointer: boolean) {
    this._isLeftPointer = isLeftPointer;
    this._isOverlapped = false;

    this._group = renderer.g().attr({ class: 'slider-marker' }).append(root);
    this._area = renderer.path(null, 'area').append(this._group);
    this._label = renderer.text().append(this._group);
    this._tracker = renderer.rect().attr({ class: 'slider-marker-tracker', fill: '#000000', opacity: 0.0001 }).css({ cursor: 'pointer' }).append(this._group);
    this._border = renderer.rect(0, 0, 1, 0);
  }

  _getRectSize(textSize: TextSize): RectSize {
    return {
      width: Math.round(2 * this._paddingLeftRight + textSize.width),
      height: Math.round(2 * this._paddingTopBottom + textSize.height),
    };
  }

  _getTextSize(): TextSize {
    const textSize = this._label.getBBox();
    if (!this._textHeight && isFinite(textSize.height)) {
      this._textHeight = textSize.height;
    }
    return {
      width: textSize.width,
      // @ts-expect-error null while the label has no finite height; the size arithmetic treats it as 0
      height: this._textHeight,
      y: textSize.y,
    };
  }

  _getAreaPointsInfo(textSize: TextSize): AreaPointsInfo {
    const rectSize = this._getRectSize(textSize);
    const rectWidth = rectSize.width;
    const rectHeight = rectSize.height;
    let rectLeftBorder = -rectWidth;
    let rectRightBorder = 0;
    let pointerRightPoint = POINTER_SIZE;
    let pointerCenterPoint = 0;
    let pointerLeftPoint = -POINTER_SIZE;
    const position = this._position;
    const isLeft = this._isLeftPointer;
    const correctCloudBorders = function (): void {
      rectLeftBorder++;
      rectRightBorder++;
      pointerRightPoint++;
      pointerCenterPoint++;
      pointerLeftPoint++;
    };
    const checkPointerBorders = function (): void {
      if (pointerRightPoint > rectRightBorder) {
        pointerRightPoint = rectRightBorder;
      } else if (pointerLeftPoint < rectLeftBorder) {
        pointerLeftPoint = rectLeftBorder;
      }

      isLeft && correctCloudBorders();
    };
    let borderPosition = position;

    if (isLeft) {
      if (position > this._range[1] - rectWidth) {
        rectRightBorder = -position + this._range[1];
        rectLeftBorder = rectRightBorder - rectWidth;
        checkPointerBorders();
        borderPosition += rectLeftBorder;
      } else {
        rectLeftBorder = pointerLeftPoint = 0;
        rectRightBorder = rectWidth;
      }
    } else if (position - this._range[0] < rectWidth) {
      rectLeftBorder = -(position - this._range[0]);
      rectRightBorder = rectLeftBorder + rectWidth;
      checkPointerBorders();
      borderPosition += rectRightBorder;
    } else {
      pointerRightPoint = 0;
      correctCloudBorders();
    }

    this._borderPosition = borderPosition;

    return {
      offset: rectLeftBorder,
      isCut: (!isLeft || pointerCenterPoint !== pointerLeftPoint) && (isLeft || pointerCenterPoint !== pointerRightPoint),
      points: [
        rectLeftBorder, 0,
        rectRightBorder, 0,
        rectRightBorder, rectHeight,
        pointerRightPoint, rectHeight,
        pointerCenterPoint, rectHeight + POINTER_SIZE,
        pointerLeftPoint, rectHeight,
        rectLeftBorder, rectHeight,
      ],
    };
  }

  _update(): void {
    const that = this;
    let textSize: TextSize;

    clearTimeout(that._timeout);

    that._label.attr({ text: that._text || '' });

    const currentTextSize = that._getTextSize();
    const rectSize = that._getRectSize(currentTextSize);

    textSize = that._textSize || currentTextSize;
    textSize = that._textSize = currentTextSize.width > textSize.width || currentTextSize.height > textSize.height ? currentTextSize : textSize;
    that._timeout = setTimeout(() => {
      updateSliderMarker(currentTextSize, rectSize);
      that._textSize = currentTextSize;
    }, SLIDER_MARKER_UPDATE_DELAY);

    function updateSliderMarker(size: TextSize, rectSize?: RectSize): void {
      rectSize = rectSize || that._getRectSize(size);
      that._group.attr({ translateY: -(rectSize.height + POINTER_SIZE) });
      const pointsData = that._getAreaPointsInfo(size);
      const points = pointsData.points;
      const offset = pointsData.offset;
      that._area.attr({ points });
      that._border.attr({ x: that._isLeftPointer ? points[0] - 1 : points[2], height: pointsData.isCut ? rectSize.height : rectSize.height + POINTER_SIZE });

      const trackerAttrs: { translateX?: number; x?: number; width: number; height: number } = { translateX: offset, width: rectSize.width, height: rectSize.height + POINTER_SIZE };
      if (isFirefoxOnAndroid()) {
        trackerAttrs.x = offset;
        trackerAttrs.translateX = undefined;
      }
      that._tracker.attr(trackerAttrs);

      that._label.attr({ translateX: that._paddingLeftRight + offset, translateY: rectSize.height / 2 - (size.y + size.height / 2) });
    }

    updateSliderMarker(textSize);
  }

  setText(value: string): void {
    this._text = value;
  }

  setPosition(position: number): void {
    this._position = position;
    this._update();
  }

  applyOptions(options: ThemeValue, screenRange: number[]): void {
    this._range = screenRange;
    this._paddingLeftRight = options.paddingLeftRight;
    this._paddingTopBottom = options.paddingTopBottom;
    this._textHeight = null;
    this._colors = [options.invalidRangeColor, options.color];
    this._area.attr({ fill: options.color });
    this._border.attr({ fill: options.borderColor });
    this._label.attr({ align: 'left' }).css(patchFontOptions(options.font));
    this._update();
  }

  getTracker(): ThemeValue {
    return this._tracker;
  }

  setValid(isValid: boolean): void {
    this._area.attr({ fill: this._colors[Number(isValid)] });
  }

  setColor(color: string): void {
    this._area.attr({ fill: color });
  }

  dispose(): void {
    clearTimeout(this._timeout);
  }

  setOverlapped(isOverlapped: boolean): void {
    if (this._isOverlapped !== isOverlapped) {
      if (isOverlapped) {
        this._border.append(this._group);
      } else {
        this._isOverlapped && this._border.remove();
      }
      this._isOverlapped = isOverlapped;
    }
  }

  getBorderPosition(): number {
    return this._borderPosition;
  }
}

export default SliderMarker;
