/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */

import supportUtils from '@ts/core/utils/m_support';
import { formatValue, isFirefoxOnAndroid, utils } from '@ts/viz/range_selector/common';
import SliderMarker from '@ts/viz/range_selector/slider_marker';

const animationSettings = utils.animationSettings;

const SPLITTER_WIDTH = 8;
const TOUCH_SPLITTER_WIDTH = 20;

function getSliderTrackerWidth(sliderHandleWidth) {
  return supportUtils.touchEvents || supportUtils.pointerEvents ? TOUCH_SPLITTER_WIDTH : SPLITTER_WIDTH < sliderHandleWidth ? sliderHandleWidth : SPLITTER_WIDTH;
}

function Slider(params, index) {
  const that = this;
  that._translator = params.translator;
  that._sliderGroup = params.renderer.g().attr({ class: 'slider' }).append(params.root);
  that._line = params.renderer.path(null, 'line').append(that._sliderGroup);
  that._marker = new SliderMarker(params.renderer, that._sliderGroup, index === 1);
  that._tracker = params.renderer.rect()
    .attr({
      class: 'slider-tracker',
      fill: '#000000',
      opacity: 0.0001,
    })
    .css({ cursor: 'w-resize' })
    .append(params.trackersGroup);
}

Slider.prototype = {
  constructor: Slider,

  cancelAnimation() {
    this._sliderGroup.stopAnimation();
    this._tracker.stopAnimation();
  },

  applyPosition(isAnimated) {
    const that = this;
    const slider = that._sliderGroup;
    const tracker = that._tracker;

    const sliderAttrs = { translateX: that._position };
    let trackerAttrs = { translateX: that._position };

    if (isFirefoxOnAndroid()) {
      // @ts-expect-error
      trackerAttrs = { x: that._position - (tracker._originalWidth / 2) };
    }

    that._marker.setPosition(that._position);

    if (isAnimated) {
      slider.animate(sliderAttrs, animationSettings);
      tracker.animate(trackerAttrs, animationSettings);
    } else {
      slider.attr(sliderAttrs);
      tracker.attr(trackerAttrs);
    }
  },

  _setValid(isValid) {
    this._marker.setValid(isValid);
    this._line.attr({ stroke: this._colors[Number(isValid)] });
  },

  _setText(text) {
    this._marker.setText(text);
  },

  update(verticalRange, sliderHandleOptions, sliderMarkerOptions) {
    const that = this;
    that._formatOptions = { format: sliderMarkerOptions.format, customizeText: sliderMarkerOptions.customizeText };
    that._marker.applyOptions(sliderMarkerOptions, that._translator.getScreenRange());
    that._colors = [sliderMarkerOptions.invalidRangeColor, sliderHandleOptions.color];
    that._sliderGroup.attr({ translateY: verticalRange[0] });
    that._line.attr({
      'stroke-width': sliderHandleOptions.width,
      stroke: sliderHandleOptions.color,
      'stroke-opacity': sliderHandleOptions.opacity,
      sharp: 'h',
      points: [0, 0, 0, verticalRange[1] - verticalRange[0]],
    });
    const trackerWidth = getSliderTrackerWidth(sliderHandleOptions.width);

    const trackerAttrs = {
      x: -trackerWidth / 2,
      width: trackerWidth,
      height: verticalRange[1] - verticalRange[0],
      y: isFirefoxOnAndroid() ? verticalRange[0] : 0,
      translateY: isFirefoxOnAndroid() ? undefined : verticalRange[0],
    };

    that._tracker.attr(trackerAttrs);
  },

  toForeground() {
    this._sliderGroup.toForeground();
  },

  getSliderTracker() {
    return this._tracker;
  },

  getPosition() {
    return this._position;
  },

  setDisplayValue(value) {
    this._value = value;
    this._setText(formatValue(value, this._formatOptions));
  },

  setOverlapped(isOverlapped) {
    this._marker.setOverlapped(isOverlapped);
  },

  getValue() {
    return this._value;
  },

  on(event, handler) {
    this._tracker.on(event, handler);
    this._marker.getTracker().on(event, handler);
  },

  getCloudBorder() {
    return this._marker.getBorderPosition();
  },

  dispose() {
    this._marker.dispose();
  },
};

export default Slider;
