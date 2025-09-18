/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { extend } from '@js/core/utils/extend';
import { isNumeric } from '@js/core/utils/type';
import candlestickPoint from '@ts/viz/series/points/candlestick_point';

const _extend = extend;
const _isNumeric = isNumeric;

export default _extend({}, candlestickPoint, {
  _getPoints() {
    const that = this;
    const createPoint = that._options.rotated ? function (x, y) { return [y, x]; } : function (x, y) { return [x, y]; };
    const openYExist = _isNumeric(that.openY);
    const closeYExist = _isNumeric(that.closeY);
    const x = that.x;
    const width = that.width;
    // @ts-expect-error
    let points = [].concat(createPoint(x, that.highY));
    // @ts-expect-error
    openYExist && (points = points.concat(createPoint(x, that.openY)));
    // @ts-expect-error
    openYExist && (points = points.concat(createPoint(x - width / 2, that.openY)));
    // @ts-expect-error
    openYExist && (points = points.concat(createPoint(x, that.openY)));
    // @ts-expect-error
    closeYExist && (points = points.concat(createPoint(x, that.closeY)));
    // @ts-expect-error
    closeYExist && (points = points.concat(createPoint(x + width / 2, that.closeY)));
    // @ts-expect-error
    closeYExist && (points = points.concat(createPoint(x, that.closeY)));
    // @ts-expect-error
    points = points.concat(createPoint(x, that.lowY));
    return points;
  },

  _drawMarkerInGroup(group, attributes, renderer) {
    this.graphic = renderer.path(this._getPoints(), 'line').attr({ 'stroke-linecap': 'square' }).attr(attributes).data({ 'chart-data-point': this })
      .sharp()
      .append(group);
  },

  _getMinTrackerWidth() {
    const width = 2 + this._styles.normal['stroke-width'];
    return width + width % 2;
  },
});
