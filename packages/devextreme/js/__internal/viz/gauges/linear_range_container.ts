import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { Coords } from '@ts/viz/core/types';
import { normalizeEnum } from '@ts/viz/core/utils';
import type { RangeContainerMeasure, RangeInfo } from '@ts/viz/gauges/base_range_container';
import BaseRangeContainer, { getMaxRangeWidth } from '@ts/viz/gauges/base_range_container';

class LinearRangeContainer extends BaseRangeContainer {
  vertical?: boolean;

  _inner!: number;

  _outer!: number;

  _processOptions(): void {
    this.vertical = this._options.vertical;
    this._inner = 0;
    this._outer = 0;
    if (this.vertical) {
      switch (normalizeEnum(this._options.horizontalOrientation)) {
        case 'left':
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
    } else {
      switch (normalizeEnum(this._options.verticalOrientation)) {
        case 'top':
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
  }

  _isVisible(): boolean {
    return true;
  }

  _createRange(range: RangeInfo, layout: Coords): ThemeValue {
    const inner = this._inner;
    const outer = this._outer;
    const startPosition = this._translator.translate(range.start);
    const endPosition = this._translator.translate(range.end);
    const { x, y } = layout;
    const startWidth = range.startWidth as number;
    const endWidth = range.endWidth as number;
    const points = this.vertical
      ? [
        x - startWidth * inner, startPosition,
        x - endWidth * inner, endPosition,
        x + endWidth * outer, endPosition,
        x + startWidth * outer, startPosition,
      ]
      : [
        startPosition, y + startWidth * outer,
        startPosition, y - startWidth * inner,
        endPosition, y - endWidth * inner,
        endPosition, y + endWidth * outer,
      ];
    return this._renderer.path(points, 'area');
  }

  measure(layout: Coords): RangeContainerMeasure {
    const center = layout[this.vertical ? 'x' : 'y'];
    const width = getMaxRangeWidth(this._options.width);
    return {
      min: center - this._inner * width,
      max: center + this._outer * width,
    };
  }
}

export default LinearRangeContainer;
