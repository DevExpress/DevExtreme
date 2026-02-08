/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { extend as _extend } from '@js/core/utils/extend';
import barPoint from '@ts/viz/series/points/bar_point';
import symbolPoint from '@ts/viz/series/points/symbol_point';

const _math = Math;
const _abs = _math.abs;
const _min = _math.min;
const _max = _math.max;
const _round = _math.round;

const DEFAULT_FINANCIAL_TRACKER_MARGIN = 2;

export default _extend({}, barPoint, {
  _getContinuousPoints(openCoord, closeCoord) {
    const that = this;
    const x = that.x;
    const createPoint = that._options.rotated ? function (x, y) { return [y, x]; } : function (x, y) { return [x, y]; };
    const width = that.width;
    const highCoord = that.highY;
    const max = _abs(highCoord - openCoord) < _abs(highCoord - closeCoord) ? openCoord : closeCoord;
    const min = max === closeCoord ? openCoord : closeCoord;
    let points;

    if (min === max) {
      // @ts-expect-error
      points = [].concat(createPoint(x, that.highY))
      // @ts-expect-error
        .concat(createPoint(x, that.lowY))
        // @ts-expect-error
        .concat(createPoint(x, that.closeY))
        // @ts-expect-error
        .concat(createPoint(x - width / 2, that.closeY))
        // @ts-expect-error
        .concat(createPoint(x + width / 2, that.closeY))
        // @ts-expect-error
        .concat(createPoint(x, that.closeY));
    } else {
      // @ts-expect-error
      points = [].concat(createPoint(x, that.highY))
      // @ts-expect-error
        .concat(createPoint(x, max))
        // @ts-expect-error
        .concat(createPoint(x + width / 2, max))
        // @ts-expect-error
        .concat(createPoint(x + width / 2, min))
        // @ts-expect-error
        .concat(createPoint(x, min))
        // @ts-expect-error
        .concat(createPoint(x, that.lowY))
        // @ts-expect-error
        .concat(createPoint(x, min))
        // @ts-expect-error
        .concat(createPoint(x - width / 2, min))
        // @ts-expect-error
        .concat(createPoint(x - width / 2, max))
        // @ts-expect-error
        .concat(createPoint(x, max));
    }

    return points;
  },

  _getCrockPoints(y) {
    const that = this;
    const x = that.x;
    const createPoint = that._options.rotated ? function (x, y) { return [y, x]; } : function (x, y) { return [x, y]; };
    // @ts-expect-error
    return [].concat(createPoint(x, that.highY))
    // @ts-expect-error
      .concat(createPoint(x, that.lowY))
      // @ts-expect-error
      .concat(createPoint(x, y))
      // @ts-expect-error
      .concat(createPoint(x - that.width / 2, y))
      // @ts-expect-error
      .concat(createPoint(x + that.width / 2, y))
      // @ts-expect-error
      .concat(createPoint(x, y));
  },

  _getPoints() {
    const that = this;
    let points;
    const closeCoord = that.closeY;
    const openCoord = that.openY;

    if (closeCoord !== null && openCoord !== null) {
      points = that._getContinuousPoints(openCoord, closeCoord);
    } else if (openCoord === closeCoord) {
      points = [that.x, that.highY, that.x, that.lowY];
    } else {
      points = that._getCrockPoints(openCoord !== null ? openCoord : closeCoord);
    }

    return points;
  },

  getColor() {
    const that = this;
    return that._isReduction ? that._options.reduction.color : that._styles.normal.stroke || that.series.getColor();
  },

  _drawMarkerInGroup(group, attributes, renderer) {
    const that = this;
    that.graphic = renderer.path(that._getPoints(), 'area').attr({ 'stroke-linecap': 'square' }).attr(attributes).data({ 'chart-data-point': that })
      .sharp()
      .append(group);
  },

  _fillStyle() {
    const that = this;
    const styles = that._options.styles;
    if (that._isReduction && that._isPositive) {
      that._styles = styles.reductionPositive;
    } else if (that._isReduction) {
      that._styles = styles.reduction;
    } else if (that._isPositive) {
      that._styles = styles.positive;
    } else {
      that._styles = styles;
    }
  },

  _getMinTrackerWidth() {
    return 2 + 2 * this._styles.normal['stroke-width'];
  },

  correctCoordinates(correctOptions) {
    const minWidth = this._getMinTrackerWidth();
    const maxWidth = 10;
    let width = correctOptions.width;
    width = width < minWidth ? minWidth : width > maxWidth ? maxWidth : width;

    this.width = width + width % 2;
    this.xCorrection = correctOptions.offset;
  },

  _getMarkerGroup(group) {
    const that = this;
    let markerGroup;

    if (that._isReduction && that._isPositive) {
      markerGroup = group.reductionPositiveMarkersGroup;
    } else if (that._isReduction) {
      markerGroup = group.reductionMarkersGroup;
    } else if (that._isPositive) {
      markerGroup = group.defaultPositiveMarkersGroup;
    } else {
      markerGroup = group.defaultMarkersGroup;
    }

    return markerGroup;
  },

  _drawMarker(renderer, group) {
    this._drawMarkerInGroup(this._getMarkerGroup(group), this._getStyle(), renderer);
  },

  _getSettingsForTracker() {
    const that = this;
    let highY = that.highY;
    let lowY = that.lowY;
    const rotated = that._options.rotated;
    let x;
    let y;
    let width;
    let height;

    if (highY === lowY) {
      highY = rotated ? highY + DEFAULT_FINANCIAL_TRACKER_MARGIN : highY - DEFAULT_FINANCIAL_TRACKER_MARGIN;
      lowY = rotated ? lowY - DEFAULT_FINANCIAL_TRACKER_MARGIN : lowY + DEFAULT_FINANCIAL_TRACKER_MARGIN;
    }

    if (rotated) {
      x = _min(lowY, highY);
      y = that.x - that.width / 2;
      width = _abs(lowY - highY);
      height = that.width;
    } else {
      x = that.x - that.width / 2;
      y = _min(lowY, highY);
      width = that.width;
      height = _abs(lowY - highY);
    }

    return {
      x,
      y,
      width,
      height,
    };
  },

  _getGraphicBBox(location) {
    const that = this;
    const rotated = that._options.rotated;
    const x = that.x;
    const width = that.width;
    let lowY = that.lowY;
    let highY = that.highY;

    if (location) {
      const valVisibleArea = that.series.getValueAxis().getVisibleArea();
      highY = that._truncateCoord(highY, valVisibleArea);
      lowY = that._truncateCoord(lowY, valVisibleArea);
    }
    const bBox = {
      x: !rotated ? x - _round(width / 2) : lowY,
      y: !rotated ? highY : x - _round(width / 2),
      width: !rotated ? width : highY - lowY,
      height: !rotated ? lowY - highY : width,
    };

    if (location) {
      const isTop = location === 'top';
      if (!this._options.rotated) {
        bBox.y = isTop ? bBox.y : bBox.y + bBox.height;
        bBox.height = 0;
      } else {
        bBox.x = isTop ? bBox.x + bBox.width : bBox.x;
        bBox.width = 0;
      }
    }

    return bBox;
  },

  getTooltipParams(location) {
    const that = this;
    if (that.graphic) {
      const minValue = _min(that.lowY, that.highY);
      const maxValue = _max(that.lowY, that.highY);
      const visibleArea = that._getVisibleArea();
      const rotated = that._options.rotated;
      const minVisible = rotated ? visibleArea.minX : visibleArea.minY;
      const maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY;
      const min = _max(minVisible, minValue);
      const max = _min(maxVisible, maxValue);

      const centerCoord = that.getCenterCoord();

      if (location === 'edge') {
        centerCoord[rotated ? 'x' : 'y'] = rotated ? max : min;
      }

      centerCoord.offset = 0;
      return centerCoord;
    }
  },
  // @ts-expect-error
  getCenterCoord() {
    if (this.graphic) {
      const that = this;
      let x;
      let y;
      const minValue = _min(that.lowY, that.highY);
      const maxValue = _max(that.lowY, that.highY);
      const visibleArea = that._getVisibleArea();
      const rotated = that._options.rotated;
      const minVisible = rotated ? visibleArea.minX : visibleArea.minY;
      const maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY;
      const min = _max(minVisible, minValue);
      const max = _min(maxVisible, maxValue);
      const center = min + (max - min) / 2;

      if (rotated) {
        y = that.x;
        x = center;
      } else {
        x = that.x;
        y = center;
      }

      return { x, y };
    }
  },

  hasValue() {
    return this.highValue !== null && this.lowValue !== null;
  },

  hasCoords() {
    return this.x !== null && this.lowY !== null && this.highY !== null;
  },

  _translate() {
    const valTranslator = this._getValTranslator();
    const x = this._getArgTranslator().translate(this.argument);

    this.vx = this.vy = this.x = x === null ? x : x + (this.xCorrection || 0);
    this.openY = this.openValue !== null ? valTranslator.translate(this.openValue) : null;
    this.highY = valTranslator.translate(this.highValue);
    this.lowY = valTranslator.translate(this.lowValue);
    this.closeY = this.closeValue !== null ? valTranslator.translate(this.closeValue) : null;

    const minValue = Math.min(this.lowY, this.highY);
    const height = Math.abs(this.lowY - this.highY);

    if (this._options.rotated) {
      this._calculateVisibility(minValue, this.x, height, 0);
    } else {
      this._calculateVisibility(this.x, minValue, 0, height);
    }
  },

  getCrosshairData(x, y) {
    const that = this;
    const rotated = that._options.rotated;
    const origY = rotated ? x : y;
    let yValue;
    const argument = that.argument;
    let coords;
    let coord = 'low';

    if (_abs(that.lowY - origY) < _abs(that.closeY - origY)) {
      yValue = that.lowY;
    } else {
      yValue = that.closeY;
      coord = 'close';
    }

    if (_abs(yValue - origY) >= _abs(that.openY - origY)) {
      yValue = that.openY;
      coord = 'open';
    }

    if (_abs(yValue - origY) >= _abs(that.highY - origY)) {
      yValue = that.highY;
      coord = 'high';
    }

    if (rotated) {
      coords = {
        y: that.vy,
        x: yValue,
        xValue: that[`${coord}Value`],
        yValue: argument,
      };
    } else {
      coords = {
        x: that.vx,
        y: yValue,
        xValue: argument,
        yValue: that[`${coord}Value`],
      };
    }

    coords.axis = that.series.axis;

    return coords;
  },

  _updateData(data) {
    const that = this;
    const label = that._label;
    const reductionColor = this._options.reduction.color;

    that.value = that.initialValue = data.reductionValue;
    that.originalValue = data.value;

    that.lowValue = that.originalLowValue = data.lowValue;

    that.highValue = that.originalHighValue = data.highValue;

    that.openValue = that.originalOpenValue = data.openValue;

    that.closeValue = that.originalCloseValue = data.closeValue;

    that._isPositive = data.openValue < data.closeValue;
    that._isReduction = data.isReduction;

    if (that._isReduction) {
      label.setColor(reductionColor);
    }
  },

  _updateMarker(animationEnabled, style, group) {
    const that = this;
    const graphic = that.graphic;

    graphic.attr({ points: that._getPoints() }).smartAttr(style).sharp();
    group && graphic.append(that._getMarkerGroup(group));
  },

  _getLabelFormatObject() {
    const that = this;
    return {
      openValue: that.openValue,
      highValue: that.highValue,
      lowValue: that.lowValue,
      closeValue: that.closeValue,
      reductionValue: that.initialValue,
      argument: that.initialArgument,
      value: that.initialValue,
      seriesName: that.series.name,
      originalOpenValue: that.originalOpenValue,
      originalCloseValue: that.originalCloseValue,
      originalLowValue: that.originalLowValue,
      originalHighValue: that.originalHighValue,
      originalArgument: that.originalArgument,
      point: that,
    };
  },

  _getFormatObject(tooltip) {
    const that = this;
    const highValue = tooltip.formatValue(that.highValue);
    const openValue = tooltip.formatValue(that.openValue);
    const closeValue = tooltip.formatValue(that.closeValue);
    const lowValue = tooltip.formatValue(that.lowValue);
    const symbolMethods = symbolPoint;
    const formatObject = symbolMethods._getFormatObject.call(that, tooltip);

    return _extend({}, formatObject, {
      valueText: `h: ${highValue}${openValue !== '' ? ` o: ${openValue}` : ''}${closeValue !== '' ? ` c: ${closeValue}` : ''} l: ${lowValue}`,
      highValueText: highValue,
      openValueText: openValue,
      closeValueText: closeValue,
      lowValueText: lowValue,
    });
  },

  getMaxValue() {
    return this.highValue;
  },

  getMinValue() {
    return this.lowValue;
  },
});
