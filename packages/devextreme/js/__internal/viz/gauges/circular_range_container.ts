import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { normalizeEnum } from '@ts/viz/core/utils';
import type { RangeContainerMeasure, RangeInfo } from '@ts/viz/gauges/base_range_container';
import BaseRangeContainer, { getMaxRangeWidth } from '@ts/viz/gauges/base_range_container';
import type { CircularLayout } from '@ts/viz/gauges/circular_indicators';

class CircularRangeContainer extends BaseRangeContainer {
  _inner!: number;

  _outer!: number;

  _processOptions(): void {
    this._inner = 0;
    this._outer = 0;
    switch (normalizeEnum(this._options.orientation)) {
      case 'inside':
        this._inner = 1;
        break;
      case 'center':
        this._inner = 0.5;
        this._outer = 0.5;
        break;
      default:
        this._outer = 1;
        break;
    }
  }

  _isVisible(layout: CircularLayout): boolean {
    const width = getMaxRangeWidth(this._options.width);
    return layout.radius - this._inner * width > 0;
  }

  _createRange(range: RangeInfo, layout: CircularLayout): ThemeValue {
    const width = ((range.startWidth as number) + (range.endWidth as number)) / 2;
    return this._renderer.arc(
      layout.x,
      layout.y,
      layout.radius - this._inner * width,
      layout.radius + this._outer * width,
      this._translator.translate(range.end),
      this._translator.translate(range.start),
    ).attr({ 'stroke-linejoin': 'round' });
  }

  measure(layout: CircularLayout): RangeContainerMeasure {
    const width = getMaxRangeWidth(this._options.width);
    return {
      min: layout.radius - this._inner * width,
      max: layout.radius + this._outer * width,
    };
  }
}

export default CircularRangeContainer;
