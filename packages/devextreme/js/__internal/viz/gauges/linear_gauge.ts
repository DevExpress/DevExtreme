import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { clone } from '@js/core/utils/object';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { normalizeEnum } from '@ts/viz/core/utils';
import type { Rect } from '@ts/viz/gauges/base_gauge';
import { BaseGauge } from '@ts/viz/gauges/base_gauge';
import type { ScaleMeasure, TicksCoefficients } from '@ts/viz/gauges/common';
import { createIndicatorCreator, dxGauge } from '@ts/viz/gauges/common';
import * as linearIndicators from '@ts/viz/gauges/linear_indicators';
import LinearRangeContainer from '@ts/viz/gauges/linear_range_container';

interface Sizes {
  width?: number;
  height?: number;
}

interface Margins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface LinearArea {
  vertical: boolean;
  x: number;
  y: number;
  startCoord: number;
  endCoord: number;
  totalSize?: number;
}

interface MainElementsMeasurements {
  minBound: number;
  maxBound: number;
  indent: number;
}

function selectRectBySizes(srcRect: Rect, sizes: Sizes, margins?: Margins): Rect {
  const rect: Rect = extend({}, srcRect);
  const currentMargins = margins || {};
  if (sizes) {
    rect.left += currentMargins.left || 0;
    rect.right -= currentMargins.right || 0;
    rect.top += currentMargins.top || 0;
    rect.bottom -= currentMargins.bottom || 0;

    if ((sizes.width as number) > 0) {
      const step = (rect.right - rect.left - (sizes.width as number)) / 2;
      if (step > 0) {
        rect.left += step;
        rect.right -= step;
      }
    }
    if ((sizes.height as number) > 0) {
      const step = (rect.bottom - rect.top - (sizes.height as number)) / 2;
      if (step > 0) {
        rect.top += step;
        rect.bottom -= step;
      }
    }
  }
  return rect;
}

class LinearGauge extends dxGauge {
  static _TESTS_selectRectBySizes: typeof selectRectBySizes;

  _area!: LinearArea;

  _getTicksOrientation(scaleOptions: ThemeValue): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return scaleOptions.isHorizontal
      ? scaleOptions.verticalOrientation
      : scaleOptions.horizontalOrientation;
  }

  _getThemeManagerOptions(): ThemeValue {
    const options = super._getThemeManagerOptions();

    options.subTheme = '_linear';
    return options;
  }

  _getInvertedState(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !this._area.vertical && this.option('rtlEnabled');
  }

  _prepareScaleSettings(): ThemeValue {
    const scaleOptions = super._prepareScaleSettings();
    scaleOptions.inverted = this._getInvertedState();

    return scaleOptions;
  }

  _updateScaleTickIndent(scaleOptions: ThemeValue): void {
    const { indentFromTick } = scaleOptions.label;
    const { length } = scaleOptions.tick;
    const textParams = this._scale.measureLabels(extend({}, this._canvas));
    const verticalTextCorrection = scaleOptions.isHorizontal ? textParams.height + textParams.y : 0;
    const isIndentPositive = indentFromTick > 0;
    const { tickCorrection, textCorrection } = scaleOptions.isHorizontal
      ? {
        tickCorrection: length * (isIndentPositive
          ? { center: 0.5, top: 0, bottom: 1 }
          : { center: 0.5, top: 1, bottom: 0 })[scaleOptions.verticalOrientation],
        textCorrection: textParams.y,
      }
      : {
        tickCorrection: length * (isIndentPositive
          ? { center: 0.5, left: 0, right: 1 }
          : { center: 0.5, left: 1, right: 0 })[scaleOptions.horizontalOrientation],
        textCorrection: -textParams.width,
      };

    scaleOptions.label.indentFromAxis = -indentFromTick + (isIndentPositive
      ? -tickCorrection + textCorrection
      : tickCorrection - verticalTextCorrection);

    this._scale.updateOptions(scaleOptions);
  }

  _shiftScale(layout: ThemeValue, scaleOptions: ThemeValue): void {
    const canvas = extend({}, this._canvas);
    const { isHorizontal } = scaleOptions;
    const scale = this._scale;

    canvas[isHorizontal ? 'left' : 'top'] = this._area[isHorizontal ? 'startCoord' : 'endCoord'];
    canvas[isHorizontal ? 'right' : 'bottom'] = canvas[isHorizontal ? 'width' : 'height']
      - this._area[isHorizontal ? 'endCoord' : 'startCoord'];

    scale.draw(canvas);
    scale.shift({ left: -layout.x, top: -layout.y });
  }

  _setupCodomain(): void {
    const geometry = this.option('geometry') || {};
    const vertical = normalizeEnum(geometry.orientation) === 'vertical';
    const initialStartCoord = -100;
    const initialEndCoord = 100;

    this._area = {
      vertical,
      x: 0,
      y: 0,
      startCoord: initialStartCoord,
      endCoord: initialEndCoord,
    };
    this._rangeContainer.vertical = vertical;
    this._translator.setInverted(this._getInvertedState());
    this._translator.setCodomain(initialStartCoord, initialEndCoord);
  }

  _getScaleLayoutValue(): number {
    return this._area[this._area.vertical ? 'x' : 'y'];
  }

  _getTicksCoefficients(options: ThemeValue): TicksCoefficients {
    const coefs: TicksCoefficients = { inner: 0, outer: 1 };

    if (this._area.vertical) {
      if (options.horizontalOrientation === 'left') {
        coefs.inner = 1;
        coefs.outer = 0;
      } else if (options.horizontalOrientation === 'center') {
        coefs.inner = 0.5;
        coefs.outer = 0.5;
      }
    } else if (options.verticalOrientation === 'top') {
      coefs.inner = 1;
      coefs.outer = 0;
    } else if (options.verticalOrientation === 'center') {
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
    const { vertical } = this._area;
    if (indentFromTick >= 0) {
      result.max = (result.max as number) + indentFromTick + textParams[vertical ? 'width' : 'height'];
    } else {
      result.min = (result.min as number)
        - (-indentFromTick + textParams[vertical ? 'width' : 'height']);
    }
    result.indent = textParams[vertical ? 'height' : 'width'] / 2;
  }

  _measureMainElements(
    elements: ThemeValue[],
    scaleMeasurement: ScaleMeasure,
  ): MainElementsMeasurements {
    const { x, y } = this._area;
    let minBound = 1000;
    let maxBound = 0;
    let indent = 0;
    const scale = this._scale;

    each(elements.concat(scale), (_, element) => {
      const bounds = element.measure
        ? element.measure({ x: x + element.getOffset(), y: y + element.getOffset() })
        : scaleMeasurement;
      if (bounds.max !== undefined) {
        maxBound = Math.max(maxBound, bounds.max);
      }
      if (bounds.min !== undefined) {
        minBound = Math.min(minBound, bounds.min);
      }
      if (bounds.indent > 0) {
        indent = Math.max(indent, bounds.indent);
      }
    });
    return { minBound, maxBound, indent };
  }

  _applyMainLayout(elements: ThemeValue[], scaleMeasurement: ScaleMeasure): void {
    const measurements = this._measureMainElements(elements, scaleMeasurement);
    const area = this._area;
    const rect = area.vertical
      ? selectRectBySizes(this._innerRect, {
        width: measurements.maxBound - measurements.minBound,
      })
      : selectRectBySizes(this._innerRect, {
        height: measurements.maxBound - measurements.minBound,
      });

    if (area.vertical) {
      const offset = (rect.left + rect.right) / 2
        - (measurements.minBound + measurements.maxBound) / 2;
      area.startCoord = rect.bottom - measurements.indent;
      area.endCoord = rect.top + measurements.indent;
      area.x = Math.round(area.x + offset);
    } else {
      const offset = (rect.top + rect.bottom) / 2
        - (measurements.minBound + measurements.maxBound) / 2;
      area.startCoord = rect.left + measurements.indent;
      area.endCoord = rect.right - measurements.indent;
      area.y = Math.round(area.y + offset);
    }
    this._translator.setCodomain(area.startCoord, area.endCoord);
    this._innerRect = rect;
  }

  _getElementLayout(offset: number): ThemeValue {
    return { x: Math.round(this._area.x + offset), y: Math.round(this._area.y + offset) };
  }

  _getApproximateScreenRange(): number {
    const area = this._area;
    let s: number = area.vertical ? this._canvas.height : this._canvas.width;

    if (area.totalSize !== undefined && s > area.totalSize) {
      s = area.totalSize;
    }
    s *= 0.8;
    return s;
  }

  _getDefaultSize(): { width: number; height: number } {
    const geometry = this.option('geometry') || {};
    if (geometry.orientation === 'vertical') {
      return { width: 100, height: 300 };
    }
    return { width: 300, height: 100 };
  }
}

setupWidgetPrototype(LinearGauge, {
  _rootClass: 'dxg-linear-gauge',
  _factoryMethods: {
    rangeContainer: 'createLinearRangeContainer',
    indicator: 'createLinearIndicator',
  },
  _gridSpacingFactor: 25,
  _scaleTypes: {
    type: 'xyAxes',
    drawingType: 'linear',
  },
  _factory: clone(BaseGauge.prototype._factory),
});

/// #DEBUG
LinearGauge._TESTS_selectRectBySizes = selectRectBySizes;
/// #ENDDEBUG

const indicators: Record<string, ThemeValue> = {};
LinearGauge.prototype._factory.indicators = indicators;
LinearGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);
/* eslint-disable spellcheck/spell-checker */
indicators._default = linearIndicators._default;
indicators.rectangle = linearIndicators.rectangle;
indicators.rhombus = linearIndicators.rhombus;
indicators.circle = linearIndicators.circle;
indicators.trianglemarker = linearIndicators.trianglemarker;
indicators.textcloud = linearIndicators.textcloud;
indicators.rangebar = linearIndicators.rangebar;
/* eslint-enable spellcheck/spell-checker */

LinearGauge.prototype._factory.RangeContainer = LinearRangeContainer;

registerComponent('dxLinearGauge', LinearGauge);

export default LinearGauge;
