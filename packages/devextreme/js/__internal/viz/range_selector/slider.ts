/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/max-len */
/* eslint-disable prefer-destructuring */

import supportUtils from '@ts/core/utils/m_support';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { formatValue, isFirefoxOnAndroid, utils } from '@ts/viz/range_selector/common';
import SliderMarker from '@ts/viz/range_selector/slider_marker';

const animationSettings = utils.animationSettings;

const SPLITTER_WIDTH = 8;
const TOUCH_SPLITTER_WIDTH = 20;

interface SliderParams {
  renderer: ThemeValue;
  root: ThemeValue;
  trackersGroup: ThemeValue;
  translator: ThemeValue;
}

type SliderEventHandler = (e: ThemeValue) => void;

function getSliderTrackerWidth(sliderHandleWidth: number): number {
  return supportUtils.touchEvents || supportUtils.pointerEvents ? TOUCH_SPLITTER_WIDTH : SPLITTER_WIDTH < sliderHandleWidth ? sliderHandleWidth : SPLITTER_WIDTH;
}

class Slider {
  declare _translator: ThemeValue;

  declare _sliderGroup: ThemeValue;

  declare _line: ThemeValue;

  declare _marker: SliderMarker;

  declare _tracker: ThemeValue;

  declare _position: number;

  declare _value: ThemeValue;

  declare _colors: string[];

  declare _formatOptions: { format: ThemeValue; customizeText: ThemeValue };

  constructor(params: SliderParams, index: number) {
    this._translator = params.translator;
    this._sliderGroup = params.renderer.g().attr({ class: 'slider' }).append(params.root);
    this._line = params.renderer.path(null, 'line').append(this._sliderGroup);
    this._marker = new SliderMarker(params.renderer, this._sliderGroup, index === 1);
    this._tracker = params.renderer.rect()
      .attr({
        class: 'slider-tracker',
        fill: '#000000',
        opacity: 0.0001,
      })
      .css({ cursor: 'w-resize' })
      .append(params.trackersGroup);
  }

  cancelAnimation(): void {
    this._sliderGroup.stopAnimation();
    this._tracker.stopAnimation();
  }

  applyPosition(isAnimated: boolean): void {
    const slider = this._sliderGroup;
    const tracker = this._tracker;

    const sliderAttrs = { translateX: this._position };
    let trackerAttrs: { translateX?: number; x?: number } = { translateX: this._position };

    if (isFirefoxOnAndroid()) {
      trackerAttrs = { x: this._position - (tracker._originalWidth / 2) };
    }

    this._marker.setPosition(this._position);

    if (isAnimated) {
      slider.animate(sliderAttrs, animationSettings);
      tracker.animate(trackerAttrs, animationSettings);
    } else {
      slider.attr(sliderAttrs);
      tracker.attr(trackerAttrs);
    }
  }

  _setValid(isValid: boolean): void {
    this._marker.setValid(isValid);
    this._line.attr({ stroke: this._colors[Number(isValid)] });
  }

  _setText(text: string): void {
    this._marker.setText(text);
  }

  update(verticalRange: number[], sliderHandleOptions: ThemeValue, sliderMarkerOptions: ThemeValue): void {
    this._formatOptions = { format: sliderMarkerOptions.format, customizeText: sliderMarkerOptions.customizeText };
    this._marker.applyOptions(sliderMarkerOptions, this._translator.getScreenRange());
    this._colors = [sliderMarkerOptions.invalidRangeColor, sliderHandleOptions.color];
    this._sliderGroup.attr({ translateY: verticalRange[0] });
    this._line.attr({
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

    this._tracker.attr(trackerAttrs);
  }

  toForeground(): void {
    this._sliderGroup.toForeground();
  }

  getSliderTracker(): ThemeValue {
    return this._tracker;
  }

  getPosition(): number {
    return this._position;
  }

  setDisplayValue(value: ThemeValue): void {
    this._value = value;
    this._setText(formatValue(value, this._formatOptions));
  }

  setOverlapped(isOverlapped: boolean): void {
    this._marker.setOverlapped(isOverlapped);
  }

  getValue(): ThemeValue {
    return this._value;
  }

  on(event: string | Record<string, SliderEventHandler>, handler?: SliderEventHandler): void {
    this._tracker.on(event, handler);
    this._marker.getTracker().on(event, handler);
  }

  getCloudBorder(): number {
    return this._marker.getBorderPosition();
  }

  dispose(): void {
    this._marker.dispose();
  }
}

export default Slider;
