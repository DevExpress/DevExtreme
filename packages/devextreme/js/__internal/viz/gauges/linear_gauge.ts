/* eslint-disable spellcheck/spell-checker */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import { each as _each } from '@js/core/utils/iterator';
import { clone } from '@js/core/utils/object';
import BaseGauge from '@js/viz/gauges/base_gauge';
import { normalizeEnum as _normalizeEnum } from '@ts/viz/core/utils';
import { createIndicatorCreator, dxGauge } from '@ts/viz/gauges/common';
import * as linearIndicators from '@ts/viz/gauges/linear_indicators';
import LinearRangeContainer from '@ts/viz/gauges/linear_range_container';

const _max = Math.max;
const _min = Math.min;
const _round = Math.round;

const dxLinearGauge = dxGauge.inherit({
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

  _getTicksOrientation(scaleOptions) {
    return scaleOptions.isHorizontal ? scaleOptions.verticalOrientation : scaleOptions.horizontalOrientation;
  },

  _getThemeManagerOptions() {
    const options = this.callBase.apply(this, arguments);

    options.subTheme = '_linear';
    return options;
  },

  _getInvertedState() {
    return !this._area.vertical && this.option('rtlEnabled');
  },

  _prepareScaleSettings() {
    const scaleOptions = this.callBase();
    scaleOptions.inverted = this._getInvertedState();

    return scaleOptions;
  },

  _updateScaleTickIndent(scaleOptions) {
    const indentFromTick = scaleOptions.label.indentFromTick;
    const length = scaleOptions.tick.length;
    const textParams = this._scale.measureLabels(extend({}, this._canvas));
    const verticalTextCorrection = scaleOptions.isHorizontal ? textParams.height + textParams.y : 0;
    const isIndentPositive = indentFromTick > 0;
    let orientation;
    let textCorrection;
    let tickCorrection;

    if (scaleOptions.isHorizontal) {
      orientation = isIndentPositive ? { center: 0.5, top: 0, bottom: 1 } : { center: 0.5, top: 1, bottom: 0 };
      tickCorrection = length * orientation[scaleOptions.verticalOrientation];
      textCorrection = textParams.y;
    } else {
      orientation = isIndentPositive ? { center: 0.5, left: 0, right: 1 } : { center: 0.5, left: 1, right: 0 };
      tickCorrection = length * orientation[scaleOptions.horizontalOrientation];
      textCorrection = -textParams.width;
    }

    scaleOptions.label.indentFromAxis = -indentFromTick + (isIndentPositive ? -tickCorrection + textCorrection : tickCorrection - verticalTextCorrection);

    this._scale.updateOptions(scaleOptions);
  },

  _shiftScale(layout, scaleOptions) {
    const that = this;
    const canvas = extend({}, that._canvas);
    const isHorizontal = scaleOptions.isHorizontal;
    const scale = that._scale;

    canvas[isHorizontal ? 'left' : 'top'] = that._area[isHorizontal ? 'startCoord' : 'endCoord'];
    canvas[isHorizontal ? 'right' : 'bottom'] = canvas[isHorizontal ? 'width' : 'height'] - that._area[isHorizontal ? 'endCoord' : 'startCoord'];

    scale.draw(canvas);
    scale.shift({ left: -layout.x, top: -layout.y });
  },

  _setupCodomain() {
    const that = this;
    const geometry = that.option('geometry') || {};
    const vertical = _normalizeEnum(geometry.orientation) === 'vertical';
    const initialStartCoord = -100;
    const initialEndCoord = 100;

    that._area = {
      vertical,
      x: 0,
      y: 0,
      startCoord: initialStartCoord,
      endCoord: initialEndCoord,
    };
    that._rangeContainer.vertical = vertical;
    that._translator.setInverted(that._getInvertedState());
    that._translator.setCodomain(initialStartCoord, initialEndCoord);
  },

  _getScaleLayoutValue() {
    return this._area[this._area.vertical ? 'x' : 'y'];
  },

  _getTicksCoefficients(options) {
    const coefs = { inner: 0, outer: 1 };

    if (this._area.vertical) {
      if (options.horizontalOrientation === 'left') {
        coefs.inner = 1;
        coefs.outer = 0;
      } else if (options.horizontalOrientation === 'center') {
        coefs.inner = coefs.outer = 0.5;
      }
    } else if (options.verticalOrientation === 'top') {
      coefs.inner = 1;
      coefs.outer = 0;
    } else if (options.verticalOrientation === 'center') {
      coefs.inner = coefs.outer = 0.5;
    }

    return coefs;
  },

  _correctScaleIndents(result, indentFromTick, textParams) {
    const vertical = this._area.vertical;
    if (indentFromTick >= 0) {
      result.max += indentFromTick + textParams[vertical ? 'width' : 'height'];
    } else {
      result.min -= -indentFromTick + textParams[vertical ? 'width' : 'height'];
    }
    result.indent = textParams[vertical ? 'height' : 'width'] / 2;
  },

  _measureMainElements(elements, scaleMeasurement) {
    const that = this;
    const x = that._area.x;
    const y = that._area.y;
    let minBound = 1000;
    let maxBound = 0;
    let indent = 0;
    const scale = that._scale;

    _each(elements.concat(scale), (_, element) => {
      const bounds = element.measure ? element.measure({ x: x + element.getOffset(), y: y + element.getOffset() }) : scaleMeasurement;
      bounds.max !== undefined && (maxBound = _max(maxBound, bounds.max));
      bounds.min !== undefined && (minBound = _min(minBound, bounds.min));
      (bounds.indent > 0) && (indent = _max(indent, bounds.indent));
    });
    return { minBound, maxBound, indent };
  },

  _applyMainLayout(elements, scaleMeasurement) {
    const that = this;
    const measurements = that._measureMainElements(elements, scaleMeasurement);
    const area = that._area;
    let rect;
    let offset;

    if (area.vertical) {
      rect = selectRectBySizes(that._innerRect, { width: measurements.maxBound - measurements.minBound });
      offset = (rect.left + rect.right) / 2 - (measurements.minBound + measurements.maxBound) / 2;
      area.startCoord = rect.bottom - measurements.indent;
      area.endCoord = rect.top + measurements.indent;
      area.x = _round(area.x + offset);
    } else {
      rect = selectRectBySizes(that._innerRect, { height: measurements.maxBound - measurements.minBound });
      offset = (rect.top + rect.bottom) / 2 - (measurements.minBound + measurements.maxBound) / 2;
      area.startCoord = rect.left + measurements.indent;
      area.endCoord = rect.right - measurements.indent;
      area.y = _round(area.y + offset);
    }
    that._translator.setCodomain(area.startCoord, area.endCoord);
    that._innerRect = rect;
  },

  _getElementLayout(offset) {
    return { x: _round(this._area.x + offset), y: _round(this._area.y + offset) };
  },

  _getApproximateScreenRange() {
    const that = this;
    const area = that._area;
    let s = area.vertical ? that._canvas.height : that._canvas.width;

    s > area.totalSize && (s = area.totalSize);
    s *= 0.8;
    return s;
  },

  _getDefaultSize() {
    const geometry = this.option('geometry') || {};
    if (geometry.orientation === 'vertical') {
      return { width: 100, height: 300 };
    } else {
      return { width: 300, height: 100 };
    }
  },
  // @ts-expect-error
  _factory: clone(BaseGauge.prototype._factory),
});

function selectRectBySizes(srcRect, sizes, margins?) {
  const rect = extend({}, srcRect);
  let step;
  margins = margins || {};
  if (sizes) {
    rect.left += margins.left || 0;
    rect.right -= margins.right || 0;
    rect.top += margins.top || 0;
    rect.bottom -= margins.bottom || 0;

    if (sizes.width > 0) {
      step = (rect.right - rect.left - sizes.width) / 2;
      if (step > 0) {
        rect.left += step;
        rect.right -= step;
      }
    }
    if (sizes.height > 0) {
      step = (rect.bottom - rect.top - sizes.height) / 2;
      if (step > 0) {
        rect.top += step;
        rect.bottom -= step;
      }
    }
  }
  return rect;
}

/// #DEBUG
dxLinearGauge._TESTS_selectRectBySizes = selectRectBySizes;
/// #ENDDEBUG

const indicators = dxLinearGauge.prototype._factory.indicators = {};
dxLinearGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);
// @ts-expect-error
indicators._default = linearIndicators._default;
// @ts-expect-error
indicators.rectangle = linearIndicators.rectangle;
// @ts-expect-error
indicators.rhombus = linearIndicators.rhombus;
// @ts-expect-error
indicators.circle = linearIndicators.circle;
// @ts-expect-error
indicators.trianglemarker = linearIndicators.trianglemarker;
// @ts-expect-error
indicators.textcloud = linearIndicators.textcloud;
// @ts-expect-error
indicators.rangebar = linearIndicators.rangebar;

dxLinearGauge.prototype._factory.RangeContainer = LinearRangeContainer;

registerComponent('dxLinearGauge', dxLinearGauge);

export default dxLinearGauge;
