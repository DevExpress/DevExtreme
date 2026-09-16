/* eslint-disable max-classes-per-file */

import type { Font } from '@js/common/charts';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { extractColor, patchFontOptions } from '@ts/viz/core/utils';
import { formatValue, getSampleText } from '@ts/viz/gauges/base_gauge';

export interface IndicatorLayout {
  x?: number;
  y?: number;
  radius?: number;
}

export interface IndicatorMeasure {
  min?: number;
  max?: number;
  indent?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  inverseHorizontalOffset?: number;
  inverseVerticalOffset?: number;
}

export interface TooltipParameters {
  x: number;
  y: number;
  value: ThemeValue;
  color: ThemeValue;
  offset?: number;
}

export interface TrackerSettings {
  points: number[];
}

export interface TextCloudOptions {
  x: number;
  y: number;
  type: string;
}

export interface TextCloudInfo {
  cx: number;
  cy: number;
  points: number[];
}

interface IndicatorAnimation {
  step: (pos: number) => void;
  duration: number;
  easing: ThemeValue;
  start?: number;
  delta?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export abstract class BaseElement {
  _renderer;

  _translator;

  _options: ThemeValue;

  constructor(parameters: Record<string, unknown>) {
    each(parameters, (name, value) => {
      this[`_${name}`] = value;
    });
    this._init();
  }

  abstract _init(): void;

  abstract _dispose(): void;

  dispose(): this {
    this._dispose();
    each(this, (name) => {
      this[name] = null;
    });
    return this;
  }

  getOffset(): number {
    return Number(this._options.offset) || 0;
  }
}

export abstract class BaseIndicator extends BaseElement {
  _owner;

  _tracker;

  _className;

  _rootElement;

  _trackerElement;

  _trackerInfo;

  _animation?: IndicatorAnimation | null;

  _actualValue!: number;

  _actualPosition!: number;

  _currentValue?: number | null;

  type?: string;

  enabled?: boolean | null;

  visible?: boolean;

  _init(): void {
    this._rootElement = this._createRoot()
      .linkOn(this._owner, { name: 'value-indicator', after: 'core' });
    this._trackerElement = this._createTracker();
  }

  _dispose(): void {
    this._rootElement.linkOff();
  }

  _setupAnimation(): void {
    if (this._options.animation) {
      this._animation = {
        step: (pos: number): void => {
          const animation = this._animation as IndicatorAnimation;
          this._actualValue = (animation.start as number) + (animation.delta as number) * pos;
          this._actualPosition = this._translator.translate(this._actualValue);
          this._move();
        },
        duration: this._options.animation.duration > 0
          ? Number(this._options.animation.duration)
          : 0,
        easing: this._options.animation.easing,
      };
    }
  }

  _runAnimation(value: number): void {
    const animation = this._animation as IndicatorAnimation;
    animation.start = this._actualValue;
    animation.delta = value - this._actualValue;
    this._rootElement.animate({ _: 0 }, {
      step: animation.step,
      duration: animation.duration,
      easing: animation.easing,
    });
  }

  _createRoot(): ThemeValue {
    return this._renderer.g().attr({ class: this._className });
  }

  _createTracker(): ThemeValue {
    return this._renderer.path([], 'area');
  }

  _getTrackerSettings(): TrackerSettings | undefined {
    return undefined;
  }

  clean(): this {
    if (this._animation) {
      this._rootElement.stopAnimation();
    }
    this._rootElement.linkRemove().clear();
    this._clear();
    this._tracker.detach(this._trackerElement);
    this._animation = null;
    this.enabled = null;
    this._options = null;
    return this;
  }

  render(options: ThemeValue): this {
    this.type = options.type;
    this._options = options;
    const currentValue = this._translator.adjust(this._options.currentValue);
    this._currentValue = currentValue;
    this._actualValue = currentValue;
    this.enabled = this._isEnabled();
    if (this.enabled) {
      this._setupAnimation();
      this._rootElement.attr({ fill: extractColor(this._options.color) }).linkAppend();
      this._tracker.attach(this._trackerElement, this, this._trackerInfo);
    }
    return this;
  }

  resize(layout?: IndicatorLayout): this {
    this._rootElement.clear();
    this._clear();
    this.visible = this._isVisible(layout);
    if (this.visible) {
      extend(this._options, layout);
      this._actualPosition = this._translator.translate(this._actualValue);
      this._render();
      this._trackerElement.attr(this._getTrackerSettings());
      this._move();
    }
    return this;
  }

  value(arg?: number | null, noAnimation?: boolean): this | number | null | undefined {
    const rootElement = this._rootElement;
    let visibility: string | null = null;

    if (arg === undefined) {
      return this._currentValue;
    }

    if (arg === null) {
      visibility = 'hidden';
      this._currentValue = arg;
    } else {
      const val = this._translator.adjust(arg);
      if (this._currentValue !== val && Number.isFinite(val)) {
        this._currentValue = val;
        if (this.visible) {
          this._applyValue(val, noAnimation);
        }
      }
    }

    rootElement.attr({ visibility });
    return this;
  }

  _applyValue(value: number, noAnimation?: boolean): void {
    if (this._animation && !noAnimation) {
      this._runAnimation(value);
    } else {
      this._actualValue = value;
      this._actualPosition = this._translator.translate(value);
      this._move();
    }
  }

  abstract _isEnabled(): boolean;

  abstract _isVisible(layout?: IndicatorLayout): boolean;

  abstract _render(): void;

  abstract _clear(): void;

  abstract _move(): void;
}

// The following is from baseMarker.js

const RIGHT_BOTTOM = [0, -1, -1, 0, 0, 1, 1, 0];
const BOTTOM_RIGHT = [-1, 0, 0, -1, 1, 0, 0, 1];
const LEFT_BOTTOM = [0, -1, 1, 0, 0, 1, -1, 0];
const BOTTOM_LEFT = [1, 0, 0, -1, -1, 0, 0, 1];
const LEFT_TOP = [0, 1, 1, 0, 0, -1, -1, 0];
const TOP_LEFT = [1, 0, 0, 1, -1, 0, 0, -1];
const RIGHT_TOP = [0, 1, -1, 0, 0, -1, 1, 0];
const TOP_RIGHT = [-1, 0, 0, 1, 1, 0, 0, -1];

const COEFFICIENTS_MAP: Record<string, number[]> = {
  'right-bottom': RIGHT_BOTTOM,
  rb: RIGHT_BOTTOM,
  'bottom-right': BOTTOM_RIGHT,
  br: BOTTOM_RIGHT,
  'left-bottom': LEFT_BOTTOM,
  lb: LEFT_BOTTOM,
  'bottom-left': BOTTOM_LEFT,
  bl: BOTTOM_LEFT,
  'left-top': LEFT_TOP,
  lt: LEFT_TOP,
  'top-left': TOP_LEFT,
  tl: TOP_LEFT,
  'right-top': RIGHT_TOP,
  rt: RIGHT_TOP,
  'top-right': TOP_RIGHT,
  tr: TOP_RIGHT,
};

interface TextCloudGeometry {
  x: number;
  y: number;
  type: string;
  cloudWidth: number;
  cloudHeight: number;
  tailLength: number;
}

function getTextCloudInfo(options: TextCloudGeometry): TextCloudInfo {
  let { x, y } = options;
  const type = COEFFICIENTS_MAP[options.type];
  const { cloudWidth, cloudHeight } = options;
  let tailWidth = options.tailLength;
  let tailHeight = options.tailLength;
  const cx = x;
  const cy = y;

  if (type[0] !== 0) {
    tailHeight = Math.min(tailHeight, cloudHeight / 3);
  } else {
    tailWidth = Math.min(tailWidth, cloudWidth / 3);
  }

  const points = [Math.round(x), Math.round(y)];
  x += type[0] * (cloudWidth + tailWidth);
  y += type[1] * (cloudHeight + tailHeight);
  points.push(Math.round(x), Math.round(y));
  x += type[2] * cloudWidth;
  y += type[3] * cloudHeight;
  points.push(Math.round(x), Math.round(y));
  x += type[4] * cloudWidth;
  y += type[5] * cloudHeight;
  points.push(Math.round(x), Math.round(y));
  x += type[6] * (cloudWidth - tailWidth);
  y += type[7] * (cloudHeight - tailHeight);
  points.push(Math.round(x), Math.round(y));

  return {
    cx: Math.round(cx + type[0] * tailWidth + ((type[0] + type[2]) * cloudWidth) / 2),
    cy: Math.round(cy + type[1] * tailHeight + ((type[1] + type[3]) * cloudHeight) / 2),
    points,
  };
}

export abstract class BaseTextCloudMarker extends BaseIndicator {
  _text;

  _cloud;

  _textVerticalOffset!: number;

  _textWidth!: number;

  _textHeight!: number;

  _textUnitWidth!: number;

  _textFullWidth!: number;

  _textFullHeight!: number;

  _move(): void {
    const options = this._options;
    const textCloudOptions = this._getTextCloudOptions();
    const text = formatValue(this._actualValue, options.text);
    this._text.attr({ text });
    const bBox = this._text.getBBox();
    const { x, y } = textCloudOptions;
    const cloudWidth = (bBox.width || text.length * this._textUnitWidth)
      + 2 * options.horizontalOffset;
    const cloudHeight = (bBox.height || this._textHeight) + 2 * options.verticalOffset;

    const info = getTextCloudInfo({
      x,
      y,
      cloudWidth,
      cloudHeight,
      tailLength: options.arrowLength,
      type: this._correctCloudType(
        textCloudOptions.type,
        { x, y },
        { width: cloudWidth, height: cloudHeight },
      ),
    });
    this._text.attr({ x: info.cx, y: info.cy + this._textVerticalOffset });
    this._cloud.attr({ points: info.points });
    if (this._trackerElement) {
      this._trackerElement.attr({ points: info.points });
    }
  }

  _measureText(): void {
    if (!this._textVerticalOffset) {
      const root = this._createRoot().append(this._owner);
      const sampleText = getSampleText(this._translator, this._options.text);
      const text = this._renderer.text(sampleText, 0, 0)
        .attr({ align: 'center' })
        .css(patchFontOptions(this._options.text.font))
        .append(root);
      const bBox = text.getBBox();
      root.remove();
      this._textVerticalOffset = -bBox.y - bBox.height / 2;
      this._textWidth = bBox.width;
      this._textHeight = bBox.height;
      this._textUnitWidth = this._textWidth / sampleText.length;
      this._textFullWidth = this._textWidth + 2 * this._options.horizontalOffset;
      this._textFullHeight = this._textHeight + 2 * this._options.verticalOffset;
    }
  }

  _render(): void {
    this._measureText();
    this._cloud = this._cloud || this._renderer.path([], 'area').append(this._rootElement);
    this._text = this._text || this._renderer.text().append(this._rootElement);
    this._text.attr({ align: 'center' }).css(patchFontOptions(this._options.text.font));
  }

  _clear(): void {
    delete this._cloud;
    delete this._text;
  }

  getTooltipParameters(): TooltipParameters {
    const position = this._getTextCloudOptions();
    return {
      x: position.x, y: position.y, value: this._currentValue, color: this._options.color,
    };
  }

  abstract _correctCloudType(type: string, position: Point, size: Size): string;

  abstract _getTextCloudOptions(): TextCloudOptions;
}

// The following is from baseRangeBar.js

export interface RangeBarPositions {
  start: number;
  end: number;
  main1: number;
  main2: number;
  back1: number;
  back2: number;
}

export abstract class BaseRangeBar extends BaseIndicator {
  _text;

  _line;

  _backItem1;

  _backItem2;

  _spaceItem1;

  _spaceItem2;

  _mainItem;

  _hasText?: boolean;

  _textVerticalOffset!: number;

  _textWidth!: number;

  _textHeight!: number;

  _startPosition!: number;

  _endPosition!: number;

  _basePosition!: number;

  _space!: number;

  _measureText(): void {
    this._hasText = this._isTextVisible();
    if (this._hasText && !this._textVerticalOffset) {
      const root = this._createRoot().append(this._owner);
      const text = this._renderer.text(getSampleText(this._translator, this._options.text), 0, 0)
        .attr({ class: 'dxg-text', align: 'center' })
        .css(patchFontOptions(this._options.text.font))
        .append(root);
      const bBox = text.getBBox();
      root.remove();
      this._textVerticalOffset = -bBox.y - bBox.height / 2;
      this._textWidth = bBox.width;
      this._textHeight = bBox.height;
    }
  }

  _move(): void {
    this._updateBarItemsPositions();
    if (this._hasText) {
      this._text.attr({ text: formatValue(this._actualValue, this._options.text) });
      this._updateTextPosition();
      this._updateLinePosition();
    }
  }

  _updateBarItems(): void {
    const options = this._options;
    const translator = this._translator;

    this._setBarSides();
    this._startPosition = translator.translate(translator.getDomainStart());
    this._endPosition = translator.translate(translator.getDomainEnd());
    this._basePosition = translator.translate(options.baseValue);
    this._space = this._getSpace();

    const backgroundColor = options.backgroundColor || 'none';
    const hasSpace = backgroundColor !== 'none' && this._space > 0;
    if (!hasSpace) {
      this._space = 0;
    }
    const spaceColor = hasSpace ? options.containerBackgroundColor || 'none' : 'none';

    this._backItem1.attr({ fill: backgroundColor });
    this._backItem2.attr({ fill: backgroundColor });
    this._spaceItem1.attr({ fill: spaceColor });
    this._spaceItem2.attr({ fill: spaceColor });
  }

  _getSpace(): number {
    return 0;
  }

  _updateTextItems(): void {
    if (this._hasText) {
      this._line = this._line || this._renderer.path([], 'line')
        .attr({ class: 'dxg-main-bar', 'stroke-linecap': 'square' })
        .append(this._rootElement);
      this._text = this._text || this._renderer.text('', 0, 0)
        .attr({ class: 'dxg-text' })
        .append(this._rootElement);
      this._text.attr({ align: this._getTextAlign() }).css(this._getFontOptions());
      this._setTextItemsSides();
    } else {
      if (this._line) {
        this._line.remove();
        delete this._line;
      }
      if (this._text) {
        this._text.remove();
        delete this._text;
      }
    }
  }

  _isTextVisible(): boolean {
    return false;
  }

  _getTextAlign(): string {
    return 'center';
  }

  _getFontOptions(): ThemeValue {
    const options = this._options;
    let { font }: { font: Font } = options.text;
    if (!font || !font.color) {
      font = extend({}, font, { color: options.color });
    }
    return patchFontOptions(font);
  }

  _updateBarItemsPositions(): void {
    const positions = this._getPositions();

    this._backItem1.attr(this._buildItemSettings(positions.start, positions.back1));
    this._backItem2.attr(this._buildItemSettings(positions.back2, positions.end));
    this._spaceItem1.attr(this._buildItemSettings(positions.back1, positions.main1));
    this._spaceItem2.attr(this._buildItemSettings(positions.main2, positions.back2));
    this._mainItem.attr(this._buildItemSettings(positions.main1, positions.main2));
    if (this._trackerElement) {
      this._trackerElement.attr(this._buildItemSettings(positions.main1, positions.main2));
    }
  }

  _render(): void {
    this._measureText();
    if (!this._backItem1) {
      this._backItem1 = this._createBarItem();
      this._backItem1.attr({ class: 'dxg-back-bar' });
    }
    if (!this._backItem2) {
      this._backItem2 = this._createBarItem();
      this._backItem2.attr({ class: 'dxg-back-bar' });
    }
    if (!this._spaceItem1) {
      this._spaceItem1 = this._createBarItem();
      this._spaceItem1.attr({ class: 'dxg-space-bar' });
    }
    if (!this._spaceItem2) {
      this._spaceItem2 = this._createBarItem();
      this._spaceItem2.attr({ class: 'dxg-space-bar' });
    }
    if (!this._mainItem) {
      this._mainItem = this._createBarItem();
      this._mainItem.attr({ class: 'dxg-main-bar' });
    }
    this._updateBarItems();
    this._updateTextItems();
  }

  _clear(): void {
    delete this._backItem1;
    delete this._backItem2;
    delete this._spaceItem1;
    delete this._spaceItem2;
    delete this._mainItem;
    delete this._hasText;
    delete this._line;
    delete this._text;
  }

  getTooltipParameters(): TooltipParameters {
    const position = this._getTooltipPosition();
    return {
      x: position.x,
      y: position.y,
      value: this._currentValue,
      color: this._options.color,
      offset: 0,
    };
  }

  abstract _createBarItem(): ThemeValue;

  abstract _setBarSides(): void;

  abstract _setTextItemsSides(): void;

  abstract _getPositions(): RangeBarPositions;

  abstract _buildItemSettings(from: number, to: number): ThemeValue;

  abstract _updateTextPosition(): void;

  abstract _updateLinePosition(): void;

  abstract _getTooltipPosition(): Point;
}

/// #DEBUG
export { getTextCloudInfo };
/// #ENDDEBUG
