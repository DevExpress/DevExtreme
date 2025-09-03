/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */

import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import BaseRangeContainer from '@ts/viz/gauges/base_range_container';

const _Number = Number;
const _max = Math.max;

const CircularRangeContainer = BaseRangeContainer.inherit({
  _processOptions() {
    const that = this;
    that._inner = that._outer = 0;
    switch (_normalizeEnum(that._options.orientation)) {
      case 'inside':
        that._inner = 1;
        break;
      case 'center':
        that._inner = that._outer = 0.5;
        break;
      default:
        that._outer = 1;
        break;
    }
  },

  _isVisible(layout) {
    let width = this._options.width;
    width = _Number(width) || _max(_Number(width.start), _Number(width.end));
    return layout.radius - this._inner * width > 0;
  },

  _createRange(range, layout) {
    const that = this;
    const width = (range.startWidth + range.endWidth) / 2;
    return that._renderer.arc(layout.x, layout.y, layout.radius - that._inner * width, layout.radius + that._outer * width, that._translator.translate(range.end), that._translator.translate(range.start)).attr({ 'stroke-linejoin': 'round' });
  },

  measure(layout) {
    let width = this._options.width;
    width = _Number(width) || _max(_Number(width.start), _Number(width.end));
    return {
      min: layout.radius - this._inner * width,
      max: layout.radius + this._outer * width,
    };
  },
});

export default CircularRangeContainer;
