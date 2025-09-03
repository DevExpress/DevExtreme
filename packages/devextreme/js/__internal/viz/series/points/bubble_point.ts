/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */

import { extend } from '@js/core/utils/extend';
import symbolPoint from '@ts/viz/series/points/symbol_point';

const _extend = extend;
const MIN_BUBBLE_HEIGHT = 20;

export default _extend({}, symbolPoint, {
  correctCoordinates(diameter) {
    this.bubbleSize = diameter / 2;
  },

  _drawMarker(renderer, group, animationEnabled) {
    const that = this;
    const attr = _extend({ translateX: that.x, translateY: that.y }, that._getStyle());

    that.graphic = renderer.circle(0, 0, animationEnabled ? 0 : that.bubbleSize)
      .smartAttr(attr)
      .data({ 'chart-data-point': that })
      .append(group);
  },

  getTooltipParams(location) {
    const that = this;
    const graphic = that.graphic;

    if (!graphic) {
      return;
    }

    const height = graphic.getBBox().height;
    return {
      x: that.x,
      y: that.y,
      offset: (height < MIN_BUBBLE_HEIGHT) || (location === 'edge') ? height / 2 : 0,
    };
  },

  _getLabelFormatObject() {
    const formatObject = symbolPoint._getLabelFormatObject.call(this);
    // @ts-expect-error
    formatObject.size = this.initialSize;

    return formatObject;
  },

  _updateData(data) {
    symbolPoint._updateData.call(this, data);
    this.size = this.initialSize = data.size;
  },

  _getGraphicBBox() {
    const that = this;
    return that._getSymbolBBox(that.x, that.y, that.bubbleSize);
  },

  _updateMarker(animationEnabled, style) {
    const that = this;
    if (!animationEnabled) {
      style = _extend({ r: that.bubbleSize, translateX: that.x, translateY: that.y }, style);
    }
    that.graphic.smartAttr(style);
  },

  _getFormatObject(tooltip) {
    const formatObject = symbolPoint._getFormatObject.call(this, tooltip);

    formatObject.sizeText = tooltip.formatValue(this.initialSize);

    return formatObject;
  },

  _storeTrackerR() {
    return this.bubbleSize;
  },

  _getLabelCoords(label) {
    let coords;

    if (label.getLayoutOptions().position === 'inside') {
      coords = this._getLabelCoordOfPosition(label, 'inside');
    } else {
      coords = symbolPoint._getLabelCoords.call(this, label);
    }

    return coords;
  },
});
