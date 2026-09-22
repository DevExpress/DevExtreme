import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { clone } from '@js/core/utils/object';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { plugins as centerTemplatePlugins } from '@ts/viz/core/center_template';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { getCosAndSin, normalizeAngle } from '@ts/viz/core/utils';
import type { Rect } from '@ts/viz/gauges/base_gauge';
import { BaseGauge } from '@ts/viz/gauges/base_gauge';
import * as circularIndicators from '@ts/viz/gauges/circular_indicators';
import CircularRangeContainer from '@ts/viz/gauges/circular_range_container';
import type { ScaleMeasure, TicksCoefficients } from '@ts/viz/gauges/common';
import { createIndicatorCreator, dxGauge } from '@ts/viz/gauges/common';

const { PI } = Math;

interface Sides {
  left: number;
  right: number;
  up: number;
  down: number;
}

export interface CircularArea {
  x: number;
  y: number;
  radius: number;
  startCoord: number;
  endCoord: number;
  sides: Sides;
  totalRadius?: number;
}

interface Margins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface CircularLayoutMeasurements {
  maxRadius: number;
  horizontalMargin?: number;
  verticalMargin?: number;
  inverseHorizontalMargin?: number;
  inverseVerticalMargin?: number;
}

interface MainElementsMeasurements extends CircularLayoutMeasurements {
  minRadius: number;
  horizontalMargin: number;
  verticalMargin: number;
  inverseHorizontalMargin: number;
  inverseVerticalMargin: number;
}

function getSides(startAngle: number, endAngle: number): Sides {
  const startCosSin = getCosAndSin(startAngle);
  const endCosSin = getCosAndSin(endAngle);
  const startCos = startCosSin.cos;
  const startSin = startCosSin.sin;
  const endCos = endCosSin.cos;
  const endSin = endCosSin.sin;
  return {
    left: (startSin <= 0 && endSin >= 0)
      || (startSin <= 0 && endSin <= 0 && startCos <= endCos)
      || (startSin >= 0 && endSin >= 0 && startCos >= endCos) ? -1 : Math.min(startCos, endCos, 0),
    right: (startSin >= 0 && endSin <= 0)
      || (startSin >= 0 && endSin >= 0 && startCos >= endCos)
      || (startSin <= 0 && endSin <= 0 && startCos <= endCos) ? 1 : Math.max(startCos, endCos, 0),
    up: (startCos <= 0 && endCos >= 0)
      || (startCos <= 0 && endCos <= 0 && startSin >= endSin)
      || (startCos >= 0 && endCos >= 0 && startSin <= endSin) ? -1 : -Math.max(startSin, endSin, 0),
    down: (startCos >= 0 && endCos <= 0)
      || (startCos >= 0 && endCos >= 0 && startSin <= endSin)
      || (startCos <= 0 && endCos <= 0 && startSin >= endSin) ? 1 : -Math.min(startSin, endSin, 0),
  };
}

function getWidth(rect: Rect): number {
  return rect.right - rect.left;
}

function getHeight(rect: Rect): number {
  return rect.bottom - rect.top;
}

function selectRectByAspectRatio(srcRect: Rect, aspectRatio: number, margins?: Margins): Rect {
  const rect: Rect = extend({}, srcRect);
  const currentMargins = margins || {};
  let width = 0;
  let height = 0;
  if (aspectRatio > 0) {
    rect.left += currentMargins.left || 0;
    rect.right -= currentMargins.right || 0;
    rect.top += currentMargins.top || 0;
    rect.bottom -= currentMargins.bottom || 0;

    if (getWidth(rect) > 0 && getHeight(rect) > 0) {
      const selfAspectRatio = getHeight(rect) / getWidth(rect);
      const fitByWidth = selfAspectRatio > 1
        ? aspectRatio < selfAspectRatio
        : aspectRatio <= selfAspectRatio;
      if (fitByWidth) {
        width = getWidth(rect);
      } else {
        height = getHeight(rect);
      }
      if (!(width > 0)) {
        width = height / aspectRatio;
      }
      if (!(height > 0)) {
        height = width * aspectRatio;
      }
      width = (getWidth(rect) - width) / 2;
      height = (getHeight(rect) - height) / 2;
      rect.left += width;
      rect.right -= width;
      rect.top += height;
      rect.bottom -= height;
    } else {
      rect.right = (rect.left + rect.right) / 2;
      rect.left = rect.right;
      rect.bottom = (rect.top + rect.bottom) / 2;
      rect.top = rect.bottom;
    }
  }
  return rect;
}

export function setupCircularCodomain(gauge: BaseGauge): void {
  const geometry = gauge.option('geometry') || {};
  const startAngle = isFinite(geometry.startAngle) ? normalizeAngle(geometry.startAngle) : 225;
  let endAngle = isFinite(geometry.endAngle) ? normalizeAngle(geometry.endAngle) : -45;
  const isFullCircle = Math.abs(startAngle - endAngle) < 1;
  if (isFullCircle || startAngle < endAngle) {
    endAngle -= 360;
  }
  const area: CircularArea = {
    x: 0,
    y: 0,
    radius: 100,
    startCoord: startAngle,
    endCoord: endAngle,
    sides: isFullCircle
      ? {
        left: -1, up: -1, right: 1, down: 1,
      }
      : getSides(startAngle, endAngle),
  };
  gauge._area = area;
  gauge._translator.setCodomain(startAngle, endAngle);
}

export function applyCircularMainLayout(
  gauge: BaseGauge,
  measurements: CircularLayoutMeasurements,
): void {
  const area: CircularArea = gauge._area;
  const { sides } = area;
  const margins = {
    left: (sides.left < -0.1
      ? measurements.horizontalMargin
      : measurements.inverseHorizontalMargin) || 0,
    right: (sides.right > 0.1
      ? measurements.horizontalMargin
      : measurements.inverseHorizontalMargin) || 0,
    top: (sides.up < -0.1
      ? measurements.verticalMargin
      : measurements.inverseVerticalMargin) || 0,
    bottom: (sides.down > 0.1
      ? measurements.verticalMargin
      : measurements.inverseVerticalMargin) || 0,
  };
  const rect = selectRectByAspectRatio(
    gauge._innerRect,
    (sides.down - sides.up) / (sides.right - sides.left),
    margins,
  );
  const fittedRadius = Math.min(
    getWidth(rect) / (sides.right - sides.left),
    getHeight(rect) / (sides.down - sides.up),
  );
  const x = rect.left - (getWidth(rect) * sides.left) / (sides.right - sides.left);
  const y = rect.top - (getHeight(rect) * sides.up) / (sides.down - sides.up);
  area.x = Math.round(x);
  area.y = Math.round(y);
  area.radius = fittedRadius - measurements.maxRadius + area.radius;
  rect.left -= margins.left;
  rect.right += margins.right;
  rect.top -= margins.top;
  rect.bottom += margins.bottom;
  gauge._innerRect = rect;
}

class CircularGauge extends dxGauge {
  static _TESTS_selectRectByAspectRatio: typeof selectRectByAspectRatio;

  _area!: CircularArea;

  _getThemeManagerOptions(): ThemeValue {
    const options = super._getThemeManagerOptions();

    options.subTheme = '_circular';
    return options;
  }

  _updateScaleTickIndent(scaleOptions: ThemeValue): void {
    const { indentFromTick } = scaleOptions.label;
    const length = scaleOptions.tick.visible ? scaleOptions.tick.length : 0;
    const textParams = this._scale.measureLabels(extend({}, this._canvas));
    const scaleOrientation = scaleOptions.orientation;
    const tickCorrection = length;

    let indentFromAxis = indentFromTick;

    if (indentFromTick >= 0) {
      if (scaleOrientation === 'outside') {
        indentFromAxis += tickCorrection;
      } else if (scaleOrientation === 'center') {
        indentFromAxis += tickCorrection / 2;
      }
    } else {
      const labelCorrection = Math.max(textParams.width, textParams.height);
      indentFromAxis -= labelCorrection;
      if (scaleOrientation === 'inside') {
        indentFromAxis -= tickCorrection;
      } else if (scaleOrientation === 'center') {
        indentFromAxis -= tickCorrection / 2;
      }
    }

    scaleOptions.label.indentFromAxis = indentFromAxis;

    this._scale.updateOptions(scaleOptions);
  }

  _setupCodomain(): void {
    setupCircularCodomain(this);
  }

  _getCenter(): ThemeValue {
    return this._getElementLayout();
  }

  _shiftScale(layout: ThemeValue): void {
    const scale = this._scale;
    const canvas = scale.getCanvas();

    canvas.height = layout.radius * 2;
    canvas.width = canvas.height;

    scale.draw(canvas);
    const centerCoords = scale.getCenter();
    scale.shift({ right: layout.x - centerCoords.x, bottom: layout.y - centerCoords.y });
  }

  _getScaleLayoutValue(): number {
    return this._area.radius;
  }

  _getTicksOrientation(scaleOptions: ThemeValue): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return scaleOptions.orientation;
  }

  _getTicksCoefficients(options: ThemeValue): TicksCoefficients {
    const coefs: TicksCoefficients = { inner: 0, outer: 1 };

    if (options.orientation === 'inside') {
      coefs.inner = 1;
      coefs.outer = 0;
    } else if (options.orientation === 'center') {
      coefs.inner = 0.5;
      coefs.outer = 0.5;
    }

    return coefs;
  }

  _correctScaleIndents(
    result: ScaleMeasure,
    indentFromTick: number,
    textParams: ThemeValue,
  ): void {
    if (indentFromTick >= 0) {
      result.horizontalOffset = indentFromTick + textParams.width;
      result.verticalOffset = indentFromTick + textParams.height;
    } else {
      result.verticalOffset = 0;
      result.horizontalOffset = 0;
      result.min = (result.min as number)
        - (-indentFromTick + Math.max(textParams.width, textParams.height));
    }
    result.inverseHorizontalOffset = textParams.width / 2;
    result.inverseVerticalOffset = textParams.height / 2;
  }

  _measureMainElements(
    elements: ThemeValue[],
    scaleMeasurement: ScaleMeasure,
  ): MainElementsMeasurements {
    const { radius } = this._area;
    let maxRadius = 0;
    let minRadius = Infinity;
    let maxHorizontalOffset = 0;
    let maxVerticalOffset = 0;
    let maxInverseHorizontalOffset = 0;
    let maxInverseVerticalOffset = 0;
    const scale = this._scale;

    each(elements.concat(scale), (_, element) => {
      const bounds = element.measure
        ? element.measure({ radius: radius - element.getOffset() })
        : scaleMeasurement;
      if (bounds.min > 0) {
        minRadius = Math.min(minRadius, bounds.min);
      }
      if (bounds.max > 0) {
        maxRadius = Math.max(maxRadius, bounds.max);
      }
      if (bounds.horizontalOffset > 0) {
        maxHorizontalOffset = Math.max(
          maxHorizontalOffset,
          bounds.max + bounds.horizontalOffset,
        );
      }
      if (bounds.verticalOffset > 0) {
        maxVerticalOffset = Math.max(maxVerticalOffset, bounds.max + bounds.verticalOffset);
      }
      if (bounds.inverseHorizontalOffset > 0) {
        maxInverseHorizontalOffset = Math.max(
          maxInverseHorizontalOffset,
          bounds.inverseHorizontalOffset,
        );
      }
      if (bounds.inverseVerticalOffset > 0) {
        maxInverseVerticalOffset = Math.max(
          maxInverseVerticalOffset,
          bounds.inverseVerticalOffset,
        );
      }
    });

    maxHorizontalOffset = Math.max(maxHorizontalOffset - maxRadius, 0);
    maxVerticalOffset = Math.max(maxVerticalOffset - maxRadius, 0);
    return {
      minRadius,
      maxRadius,
      horizontalMargin: maxHorizontalOffset,
      verticalMargin: maxVerticalOffset,
      inverseHorizontalMargin: maxInverseHorizontalOffset,
      inverseVerticalMargin: maxInverseVerticalOffset,
    };
  }

  _applyMainLayout(elements: ThemeValue[], scaleMeasurement: ScaleMeasure): void {
    applyCircularMainLayout(this, this._measureMainElements(elements, scaleMeasurement));
  }

  _getElementLayout(offset = 0): ThemeValue {
    return { x: this._area.x, y: this._area.y, radius: Math.round(this._area.radius - offset) };
  }

  _getApproximateScreenRange(): number {
    const area = this._area;
    let r = Math.min(
      this._canvas.width / (area.sides.right - area.sides.left),
      this._canvas.height / (area.sides.down - area.sides.up),
    );

    if (area.totalRadius !== undefined && r > area.totalRadius) {
      r = area.totalRadius;
    }
    r *= 0.8;
    return (-this._translator.getCodomainRange() * r * PI) / 180;
  }

  _getDefaultSize(): { width: number; height: number } {
    return { width: 300, height: 300 };
  }
}

setupWidgetPrototype(CircularGauge, {
  _rootClass: 'dxg-circular-gauge',
  _factoryMethods: {
    rangeContainer: 'createCircularRangeContainer',
    indicator: 'createCircularIndicator',
  },
  _gridSpacingFactor: 17,
  _scaleTypes: {
    type: 'polarAxes',
    drawingType: 'circular',
  },
  _factory: clone(BaseGauge.prototype._factory),
});

/// #DEBUG
CircularGauge._TESTS_selectRectByAspectRatio = selectRectByAspectRatio;
/// #ENDDEBUG

const indicators: Record<string, ThemeValue> = {};
CircularGauge.prototype._factory.indicators = indicators;
CircularGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);
/* eslint-disable spellcheck/spell-checker */
indicators._default = circularIndicators._default;
indicators.rectangleneedle = circularIndicators.rectangleneedle;
indicators.triangleneedle = circularIndicators.triangleneedle;
indicators.twocolorneedle = circularIndicators.twocolorneedle;
indicators.trianglemarker = circularIndicators.trianglemarker;
indicators.textcloud = circularIndicators.textcloud;
indicators.rangebar = circularIndicators.rangebar;
/* eslint-enable spellcheck/spell-checker */

CircularGauge.prototype._factory.RangeContainer = CircularRangeContainer;

registerComponent('dxCircularGauge', CircularGauge);

CircularGauge.addPlugin(centerTemplatePlugins.gauge);

export default CircularGauge;
