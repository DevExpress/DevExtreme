/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import barPoint from '@ts/viz/series/points/bar_point';
import rangeSymbolPointMethods from '@ts/viz/series/points/range_symbol_point';

const _extend = extend;

export default _extend({}, barPoint, {
  deleteLabel: rangeSymbolPointMethods.deleteLabel,

  _getFormatObject: rangeSymbolPointMethods._getFormatObject,

  clearVisibility() {
    const graphic = this.graphic;

    if (graphic && graphic.attr('visibility')) {
      graphic.attr({ visibility: null });
    }
  },

  setInvisibility() {
    const graphic = this.graphic;

    if (graphic && graphic.attr('visibility') !== 'hidden') {
      graphic.attr({ visibility: 'hidden' });
    }
    this._topLabel.draw(false);
    this._bottomLabel.draw(false);
  },

  getTooltipParams(location) {
    const that = this;
    const edgeLocation = location === 'edge';
    let x;
    let y;

    if (that._options.rotated) {
      x = edgeLocation ? that.x + that.width : that.x + that.width / 2;
      y = that.y + that.height / 2;
    } else {
      x = that.x + that.width / 2;
      y = edgeLocation ? that.y : that.y + that.height / 2;
    }

    return { x, y, offset: 0 };
  },

  _translate() {
    const that = this;
    const barMethods = barPoint;
    barMethods._translate.call(that);

    if (that._options.rotated) {
      that.width = that.width || 1;
    } else {
      that.height = that.height || 1;
    }
  },

  hasCoords: rangeSymbolPointMethods.hasCoords,

  _updateData: rangeSymbolPointMethods._updateData,

  _getLabelPosition: rangeSymbolPointMethods._getLabelPosition,

  _getLabelMinFormatObject: rangeSymbolPointMethods._getLabelMinFormatObject,

  _updateLabelData: rangeSymbolPointMethods._updateLabelData,

  _updateLabelOptions: rangeSymbolPointMethods._updateLabelOptions,

  getCrosshairData: rangeSymbolPointMethods.getCrosshairData,

  _createLabel: rangeSymbolPointMethods._createLabel,

  _checkOverlay: rangeSymbolPointMethods._checkOverlay,

  _checkLabelsOverlay: rangeSymbolPointMethods._checkLabelsOverlay,

  _getOverlayCorrections: rangeSymbolPointMethods._getOverlayCorrections,

  _drawLabel: rangeSymbolPointMethods._drawLabel,

  _getLabelCoords: rangeSymbolPointMethods._getLabelCoords,

  getLabel: rangeSymbolPointMethods.getLabel,

  getLabels: rangeSymbolPointMethods.getLabels,

  getBoundingRect: noop,

  getMinValue: rangeSymbolPointMethods.getMinValue,

  getMaxValue: rangeSymbolPointMethods.getMaxValue,
});
