import componentRegistrator from '@js/core/component_registrator';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import BaseSparkline from '@ts/viz/sparklines/base_sparkline';

const TARGET_MIN_Y = 0.02;
const TARGET_MAX_Y = 0.98;
const BAR_VALUE_MIN_Y = 0.1;
const BAR_VALUE_MAX_Y = 0.9;

const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 30;
const DEFAULT_HORIZONTAL_MARGIN = 1;
const DEFAULT_VERTICAL_MARGIN = 2;

interface BarBounds {
  x1: number;
  x2: number;
}

function getPositiveBarBounds(value: number, startLevel: number, endLevel: number): BarBounds {
  const x1 = startLevel <= 0 ? 0 : startLevel;
  let x2 = value;
  if (value >= endLevel) {
    x2 = endLevel;
  } else if (value < x1) {
    x2 = x1;
  }
  return { x1, x2 };
}

function getNegativeBarBounds(value: number, startLevel: number, endLevel: number): BarBounds {
  const x1 = endLevel >= 0 ? 0 : endLevel;
  let x2 = value;
  if (value < startLevel) {
    x2 = startLevel;
  } else if (value > x1) {
    x2 = x1;
  }
  return { x1, x2 };
}

class Bullet extends BaseSparkline {
  _zeroLevelPath;

  _targetPath;

  _barValuePath;

  _tooltipEnabled!: boolean;

  _disposeWidgetElements(): void {
    delete this._zeroLevelPath;
    delete this._targetPath;
    delete this._barValuePath;
  }

  _cleanWidgetElements(): void {
    this._zeroLevelPath.remove();
    this._targetPath.remove();
    this._barValuePath.remove();
  }

  _drawWidgetElements(): void {
    this._drawBullet();
    this._drawn();
  }

  _createHtmlElements(): void {
    const renderer = this._renderer;
    this._zeroLevelPath = renderer.path(undefined, 'line')
      .attr({ class: 'dxb-zero-level', 'stroke-linecap': 'square' });
    this._targetPath = renderer.path(undefined, 'line')
      .attr({ class: 'dxb-target', 'stroke-linecap': 'square' });
    this._barValuePath = renderer.path(undefined, 'line')
      .attr({ class: 'dxb-bar-value', 'stroke-linecap': 'square' });
  }

  _prepareOptions(): void {
    const options = super._prepareOptions();
    this._allOptions = options;
    const isValueUndefined = options.value === undefined;
    const isTargetUndefined = options.target === undefined;

    this._tooltipEnabled = !(isValueUndefined && isTargetUndefined);
    if (isValueUndefined) {
      options.value = 0;
    }
    if (isTargetUndefined) {
      options.target = 0;
    }

    const value = Number(options.value);
    const target = Number(options.target);
    options.value = value;
    options.target = target;

    if (options.startScaleValue === undefined) {
      options.startScaleValue = target < value ? target : value;
      options.startScaleValue = options.startScaleValue < 0 ? options.startScaleValue : 0;
    }
    if (options.endScaleValue === undefined) {
      options.endScaleValue = target > value ? target : value;
    }

    const startScaleValue = Number(options.startScaleValue);
    const endScaleValue = Number(options.endScaleValue);
    options.startScaleValue = startScaleValue;
    options.endScaleValue = endScaleValue;

    if (endScaleValue < startScaleValue) {
      options.endScaleValue = startScaleValue;
      options.startScaleValue = endScaleValue;
      options.inverted = true;
    }
  }

  _updateRange(): void {
    const options = this._allOptions;

    this._ranges = {
      arg: {
        invert: options.rtlEnabled ? !options.inverted : options.inverted,
        min: options.startScaleValue,
        max: options.endScaleValue,
        axisType: 'continuous',
        dataType: 'numeric',
      },
      val: {
        min: 0,
        max: 1,
        axisType: 'continuous',
        dataType: 'numeric',
      },
    };
  }

  _drawBullet(): void {
    const options = this._allOptions;
    const isValidBounds = options.startScaleValue !== options.endScaleValue;
    const isValidMin = isFinite(options.startScaleValue);
    const isValidMax = isFinite(options.endScaleValue);
    const isValidValue = isFinite(options.value);
    const isValidTarget = isFinite(options.target);

    if (isValidBounds && isValidMax && isValidMin && isValidTarget && isValidValue) {
      this._drawBarValue();
      this._drawTarget();
      this._drawZeroLevel();
    }
  }

  _getTargetParams(): ThemeValue {
    const options = this._allOptions;
    const translatorY = this._valueAxis.getTranslator();
    const x = this._argumentAxis.getTranslator().translate(options.target);

    return {
      points: [x, translatorY.translate(TARGET_MIN_Y), x, translatorY.translate(TARGET_MAX_Y)],
      stroke: options.targetColor,
      'stroke-width': options.targetWidth,
    };
  }

  _getBarValueParams(): ThemeValue {
    const options = this._allOptions;
    const translatorX = this._argumentAxis.getTranslator();
    const translatorY = this._valueAxis.getTranslator();
    const startLevel = options.startScaleValue;
    const endLevel = options.endScaleValue;
    const { value } = options;
    const y2 = translatorY.translate(BAR_VALUE_MIN_Y);
    const y1 = translatorY.translate(BAR_VALUE_MAX_Y);
    const bounds = value > 0
      ? getPositiveBarBounds(value, startLevel, endLevel)
      : getNegativeBarBounds(value, startLevel, endLevel);
    const x1 = translatorX.translate(bounds.x1);
    const x2 = translatorX.translate(bounds.x2);

    return {
      points: [x1, y1, x2, y1, x2, y2, x1, y2],
      fill: options.color,
    };
  }

  _getCorrectCanvas(): ThemeValue {
    return this._canvas;
  }

  _getZeroLevelParams(): ThemeValue {
    const translatorY = this._valueAxis.getTranslator();
    const x = this._argumentAxis.getTranslator().translate(0);

    return {
      points: [x, translatorY.translate(TARGET_MIN_Y), x, translatorY.translate(TARGET_MAX_Y)],
      stroke: this._allOptions.targetColor,
      'stroke-width': 1,
    };
  }

  _drawZeroLevel(): void {
    const options = this._allOptions;

    if (options.endScaleValue < 0 || options.startScaleValue > 0 || !options.showZeroLevel) {
      return;
    }

    this._zeroLevelPath.attr(this._getZeroLevelParams()).sharp().append(this._renderer.root);
  }

  _drawTarget(): void {
    const options = this._allOptions;
    const { target } = options;

    if (target > options.endScaleValue || target < options.startScaleValue || !options.showTarget) {
      return;
    }

    this._targetPath.attr(this._getTargetParams()).sharp().append(this._renderer.root);
  }

  _drawBarValue(): void {
    this._barValuePath.attr(this._getBarValueParams()).append(this._renderer.root);
  }

  _getTooltipCoords(): { x: number; y: number } {
    const canvas = this._canvas;
    const rootOffset = this._renderer.getRootOffset();
    const bBox = this._barValuePath.getBBox();

    return {
      x: bBox.x + bBox.width / 2 + rootOffset.left,
      y: (canvas.height / 2) + rootOffset.top,
    };
  }

  _getTooltipData(): ThemeValue {
    const tooltip = this._tooltip;
    const options = this._allOptions;
    const { value, target } = options;
    const valueText = tooltip.formatValue(value);
    const targetText = tooltip.formatValue(target);

    return {
      originalValue: value,
      originalTarget: target,
      value: valueText,
      target: targetText,
      valueText: ['Actual Value:', valueText, 'Target Value:', targetText],
    };
  }

  _isTooltipEnabled(): boolean {
    return this._tooltipEnabled;
  }
}

setupWidgetPrototype(Bullet, {
  _rootClassPrefix: 'dxb',
  _rootClass: 'dxb-bullet',
  _themeSection: 'bullet',
  _defaultSize: {
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
    left: DEFAULT_HORIZONTAL_MARGIN,
    right: DEFAULT_HORIZONTAL_MARGIN,
    top: DEFAULT_VERTICAL_MARGIN,
    bottom: DEFAULT_VERTICAL_MARGIN,
  },
});

[
  'color', 'targetColor', 'targetWidth', 'showTarget', 'showZeroLevel',
  'value', 'target', 'startScaleValue', 'endScaleValue',
].forEach((name) => {
  Bullet.prototype._optionChangesMap[name] = 'OPTIONS';
});

componentRegistrator('dxBullet', Bullet);

export default Bullet;
