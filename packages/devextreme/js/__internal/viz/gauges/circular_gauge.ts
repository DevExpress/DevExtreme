/* eslint-disable operator-assignment */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/no-mixed-operators */
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
/* eslint-disable @typescript-eslint/no-unused-expressions */

import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { clone } from '@js/core/utils/object';
import BaseGauge from '@js/viz/gauges/base_gauge';
import { plugins as centerTemplatePlugins } from '@ts/viz/core/center_template';
import { getCosAndSin, normalizeAngle } from '@ts/viz/core/utils';
import * as circularIndicators from '@ts/viz/gauges/circular_indicators';
import CircularRangeContainer from '@ts/viz/gauges/circular_range_container';
import { createIndicatorCreator, dxGauge } from '@ts/viz/gauges/common';

const _isFinite = isFinite;
const _normalizeAngle = normalizeAngle;
const _getCosAndSin = getCosAndSin;

const _abs = Math.abs;
const _max = Math.max;
const _min = Math.min;
const _round = Math.round;
const _each = each;

const PI = Math.PI;

function getSides(startAngle, endAngle) {
  const startCosSin = _getCosAndSin(startAngle);
  const endCosSin = _getCosAndSin(endAngle);
  const startCos = startCosSin.cos;
  const startSin = startCosSin.sin;
  const endCos = endCosSin.cos;
  const endSin = endCosSin.sin;
  return {
    left: (startSin <= 0 && endSin >= 0)
            || (startSin <= 0 && endSin <= 0 && startCos <= endCos)
            || (startSin >= 0 && endSin >= 0 && startCos >= endCos) ? -1 : _min(startCos, endCos, 0),
    right: (startSin >= 0 && endSin <= 0)
            || (startSin >= 0 && endSin >= 0 && startCos >= endCos)
            || (startSin <= 0 && endSin <= 0 && startCos <= endCos) ? 1 : _max(startCos, endCos, 0),
    up: (startCos <= 0 && endCos >= 0)
            || (startCos <= 0 && endCos <= 0 && startSin >= endSin)
            || (startCos >= 0 && endCos >= 0 && startSin <= endSin) ? -1 : -_max(startSin, endSin, 0),
    down: (startCos >= 0 && endCos <= 0)
            || (startCos >= 0 && endCos >= 0 && startSin <= endSin)
            || (startCos <= 0 && endCos <= 0 && startSin >= endSin) ? 1 : -_min(startSin, endSin, 0),
  };
}

const dxCircularGauge = dxGauge.inherit({
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

  _getThemeManagerOptions() {
    const options = this.callBase.apply(this, arguments);

    options.subTheme = '_circular';
    return options;
  },

  _updateScaleTickIndent(scaleOptions) {
    const indentFromTick = scaleOptions.label.indentFromTick;
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
      const labelCorrection = _max(textParams.width, textParams.height);
      indentFromAxis -= labelCorrection;
      if (scaleOrientation === 'inside') {
        indentFromAxis -= tickCorrection;
      } else if (scaleOrientation === 'center') {
        indentFromAxis -= tickCorrection / 2;
      }
    }

    scaleOptions.label.indentFromAxis = indentFromAxis;

    this._scale.updateOptions(scaleOptions);
  },

  _setupCodomain() {
    const that = this;
    const geometry = that.option('geometry') || {};
    let startAngle = geometry.startAngle;
    let endAngle = geometry.endAngle;
    let sides;
    startAngle = _isFinite(startAngle) ? _normalizeAngle(startAngle) : 225;
    endAngle = _isFinite(endAngle) ? _normalizeAngle(endAngle) : -45;
    if (_abs(startAngle - endAngle) < 1) {
      endAngle -= 360;
      sides = {
        left: -1, up: -1, right: 1, down: 1,
      };
    } else {
      (startAngle < endAngle) && (endAngle -= 360);
      sides = getSides(startAngle, endAngle);
    }
    that._area = {
      x: 0,
      y: 0,
      radius: 100,
      startCoord: startAngle,
      endCoord: endAngle,
      sides,
    };
    that._translator.setCodomain(startAngle, endAngle);
  },

  _getCenter() {
    return this._getElementLayout();
  },

  _shiftScale(layout) {
    const scale = this._scale;
    const canvas = scale.getCanvas();

    canvas.width = canvas.height = layout.radius * 2;

    scale.draw(canvas);
    const centerCoords = scale.getCenter();
    scale.shift({ right: layout.x - centerCoords.x, bottom: layout.y - centerCoords.y });
  },

  _getScaleLayoutValue() {
    return this._area.radius;
  },

  _getTicksOrientation(scaleOptions) {
    return scaleOptions.orientation;
  },

  _getTicksCoefficients(options) {
    const coefs = { inner: 0, outer: 1 };

    if (options.orientation === 'inside') {
      coefs.inner = 1;
      coefs.outer = 0;
    } else if (options.orientation === 'center') {
      coefs.inner = coefs.outer = 0.5;
    }

    return coefs;
  },

  _correctScaleIndents(result, indentFromTick, textParams) {
    if (indentFromTick >= 0) {
      result.horizontalOffset = indentFromTick + textParams.width;
      result.verticalOffset = indentFromTick + textParams.height;
    } else {
      result.horizontalOffset = result.verticalOffset = 0;
      result.min -= -indentFromTick + _max(textParams.width, textParams.height);
    }
    result.inverseHorizontalOffset = textParams.width / 2;
    result.inverseVerticalOffset = textParams.height / 2;
  },

  _measureMainElements(elements, scaleMeasurement) {
    const that = this;
    const radius = that._area.radius;
    let maxRadius = 0;
    let minRadius = Infinity;
    let maxHorizontalOffset = 0;
    let maxVerticalOffset = 0;
    let maxInverseHorizontalOffset = 0;
    let maxInverseVerticalOffset = 0;
    const scale = that._scale;

    _each(elements.concat(scale), (_, element) => {
      const bounds = element.measure ? element.measure({ radius: radius - element.getOffset() }) : scaleMeasurement;
      (bounds.min > 0) && (minRadius = _min(minRadius, bounds.min));
      (bounds.max > 0) && (maxRadius = _max(maxRadius, bounds.max));
      (bounds.horizontalOffset > 0) && (maxHorizontalOffset = _max(maxHorizontalOffset, bounds.max + bounds.horizontalOffset));
      (bounds.verticalOffset > 0) && (maxVerticalOffset = _max(maxVerticalOffset, bounds.max + bounds.verticalOffset));
      (bounds.inverseHorizontalOffset > 0) && (maxInverseHorizontalOffset = _max(maxInverseHorizontalOffset, bounds.inverseHorizontalOffset));
      (bounds.inverseVerticalOffset > 0) && (maxInverseVerticalOffset = _max(maxInverseVerticalOffset, bounds.inverseVerticalOffset));
    });

    maxHorizontalOffset = _max(maxHorizontalOffset - maxRadius, 0);
    maxVerticalOffset = _max(maxVerticalOffset - maxRadius, 0);
    return {
      minRadius,
      maxRadius,
      horizontalMargin: maxHorizontalOffset,
      verticalMargin: maxVerticalOffset,
      inverseHorizontalMargin: maxInverseHorizontalOffset,
      inverseVerticalMargin: maxInverseVerticalOffset,
    };
  },

  _applyMainLayout(elements, scaleMeasurement) {
    const measurements = this._measureMainElements(elements, scaleMeasurement);
    const area = this._area;
    const sides = area.sides;
    const margins = {
      left: (sides.left < -0.1 ? measurements.horizontalMargin : measurements.inverseHorizontalMargin) || 0,
      right: (sides.right > 0.1 ? measurements.horizontalMargin : measurements.inverseHorizontalMargin) || 0,
      top: (sides.up < -0.1 ? measurements.verticalMargin : measurements.inverseVerticalMargin) || 0,
      bottom: (sides.down > 0.1 ? measurements.verticalMargin : measurements.inverseVerticalMargin) || 0,
    };
    const rect = selectRectByAspectRatio(this._innerRect, (sides.down - sides.up) / (sides.right - sides.left), margins);
    let radius = _min(getWidth(rect) / (sides.right - sides.left), getHeight(rect) / (sides.down - sides.up));

    radius = radius - measurements.maxRadius + area.radius;
    const x = rect.left - getWidth(rect) * sides.left / (sides.right - sides.left);
    const y = rect.top - getHeight(rect) * sides.up / (sides.down - sides.up);
    area.x = _round(x);
    area.y = _round(y);
    area.radius = radius;
    rect.left -= margins.left;
    rect.right += margins.right;
    rect.top -= margins.top;
    rect.bottom += margins.bottom;
    this._innerRect = rect;
  },

  _getElementLayout(offset = 0) {
    return { x: this._area.x, y: this._area.y, radius: _round(this._area.radius - offset) };
  },

  _getApproximateScreenRange() {
    const that = this;
    const area = that._area;
    let r = _min(that._canvas.width / (area.sides.right - area.sides.left), that._canvas.height / (area.sides.down - area.sides.up));

    r > area.totalRadius && (r = area.totalRadius);
    r = 0.8 * r;
    return -that._translator.getCodomainRange() * r * PI / 180;
  },

  _getDefaultSize() {
    return { width: 300, height: 300 };
  },
  // @ts-expect-error
  _factory: clone(BaseGauge.prototype._factory),
});

function getWidth(rect) {
  return rect.right - rect.left;
}

function getHeight(rect) {
  return rect.bottom - rect.top;
}

function selectRectByAspectRatio(srcRect, aspectRatio, margins) {
  const rect = extend({}, srcRect);
  let selfAspectRatio;
  let width = 0;
  let height = 0;
  margins = margins || {};
  if (aspectRatio > 0) {
    rect.left += margins.left || 0;
    rect.right -= margins.right || 0;
    rect.top += margins.top || 0;
    rect.bottom -= margins.bottom || 0;

    if (getWidth(rect) > 0 && getHeight(rect) > 0) {
      selfAspectRatio = getHeight(rect) / getWidth(rect);
      if (selfAspectRatio > 1) {
        aspectRatio < selfAspectRatio ? width = getWidth(rect) : height = getHeight(rect);
      } else {
        aspectRatio > selfAspectRatio ? height = getHeight(rect) : width = getWidth(rect);
      }
      (width > 0) || (width = height / aspectRatio);
      (height > 0) || (height = width * aspectRatio);
      width = (getWidth(rect) - width) / 2;
      height = (getHeight(rect) - height) / 2;
      rect.left += width;
      rect.right -= width;
      rect.top += height;
      rect.bottom -= height;
    } else {
      rect.left = rect.right = (rect.left + rect.right) / 2;
      rect.top = rect.bottom = (rect.top + rect.bottom) / 2;
    }
  }
  return rect;
}

/// #DEBUG
dxCircularGauge._TESTS_selectRectByAspectRatio = selectRectByAspectRatio;
/// #ENDDEBUG

const indicators = dxCircularGauge.prototype._factory.indicators = {};
dxCircularGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);
// @ts-expect-error
indicators._default = circularIndicators._default;
// @ts-expect-error
indicators.rectangleneedle = circularIndicators.rectangleneedle;
// @ts-expect-error
indicators.triangleneedle = circularIndicators.triangleneedle;
// @ts-expect-error
indicators.twocolorneedle = circularIndicators.twocolorneedle;
// @ts-expect-error
indicators.trianglemarker = circularIndicators.trianglemarker;
// @ts-expect-error
indicators.textcloud = circularIndicators.textcloud;
// @ts-expect-error
indicators.rangebar = circularIndicators.rangebar;

dxCircularGauge.prototype._factory.RangeContainer = CircularRangeContainer;

registerComponent('dxCircularGauge', dxCircularGauge);

dxCircularGauge.addPlugin(centerTemplatePlugins.gauge);

export default dxCircularGauge;
