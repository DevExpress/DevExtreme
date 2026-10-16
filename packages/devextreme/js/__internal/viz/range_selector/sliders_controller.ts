/* eslint-disable max-depth */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */

import { noop } from '@ts/core/utils/m_common';
import { adjust } from '@ts/core/utils/m_math';
import { isDefined, isNumeric } from '@ts/core/utils/m_type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { adjustVisualRange, normalizeEnum as _normalizeEnum, rangesAreEqual } from '@ts/viz/core/utils';
import { consts, isFirefoxOnAndroid, utils } from '@ts/viz/range_selector/common';
import Slider from '@ts/viz/range_selector/slider';

const animationSettings = utils.animationSettings;
const emptySliderMarkerText = consts.emptySliderMarkerText;

interface SelectedRange {
  startValue: ThemeValue;
  endValue: ThemeValue;
}

interface VisualRangeInput {
  startValue?: ThemeValue;
  endValue?: ThemeValue;
  length?: ThemeValue;
}

export interface MovingHandler {
  (position: number, e?: ThemeValue): void;
  complete: (e: ThemeValue) => void;
}

interface SlidersControllerParams {
  renderer: ThemeValue;
  root: ThemeValue;
  trackersGroup: ThemeValue;
  translator: ThemeValue;
  axis: { getVisibleArea: () => number[] };
  updateSelectedRange: (range: SelectedRange, lastSelectedRange: SelectedRange, e: ThemeValue) => void;
}

interface RangeBounds {
  minRange: ThemeValue;
  maxRange: ThemeValue;
}

interface ShutterSettings {
  fill: string | null;
  'fill-opacity': number | null;
  stroke: string | null;
  'stroke-width': number | null;
  sharp?: string;
}

interface SelectionState {
  _lastSelectedRange: SelectedRange;
  _processSelectionChanged?: (e?: ThemeValue) => void;
  setSelectedRange?: (visualRange?: VisualRangeInput | null, e?: ThemeValue) => void;
  getSelectedRange: () => SelectedRange;
}

function buildRectPoints(left: number, top: number, right: number, bottom: number): number[] {
  return [left, top, right, top, right, bottom, left, bottom];
}

function isLess(a: ThemeValue, b: ThemeValue): boolean {
  return a < b;
}

function isGreater(a: ThemeValue, b: ThemeValue): boolean {
  return a > b;
}

function selectClosestValue(target: ThemeValue, values: ThemeValue[] | null): ThemeValue {
  let start = 0;
  let end = values ? values.length - 1 : 0;
  let middle;
  let val = target;
  while (end - start > 1) {
    middle = (start + end) >> 1;
    // @ts-expect-error values is not null here: without values end is 0 and the loop does not run
    val = values[middle];
    if (val === target) {
      return target;
    } else if (target < val) {
      end = middle;
    } else {
      start = middle;
    }
  }
  if (values) {
    val = values[target - values[start] <= values[end] - target ? start : end];
  }
  return val;
}

function dummyProcessSelectionChanged(this: SelectionState): void {
  this._lastSelectedRange = this.getSelectedRange();
  delete this._processSelectionChanged;
}

function suppressSetSelectedRange(controller: SelectionState): void {
  controller.setSelectedRange = noop;
  if (controller._processSelectionChanged === dummyProcessSelectionChanged) {
    controller._processSelectionChanged();
  }
}

function restoreSetSelectedRange(controller: SelectionState): void {
  delete controller.setSelectedRange;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let SlidersController = class SlidersController {
  declare _params: SlidersControllerParams;

  declare _areaTracker: ThemeValue;

  declare _selectedAreaTracker: ThemeValue;

  declare _shutter: ThemeValue;

  declare _sliders: Slider[];

  declare _lastSelectedRange: SelectedRange;

  declare _verticalRange: number[];

  declare _minRange: ThemeValue;

  declare _maxRange: ThemeValue;

  declare _animationEnabled: boolean;

  declare _allowSlidersSwap: boolean;

  declare _values: ThemeValue[] | null;

  declare _isCompactMode: boolean;

  declare _shutterOffset: number;

  declare _isOnMoving: boolean;

  constructor(params: SlidersControllerParams) {
    const sliderParams = {
      renderer: params.renderer, root: params.root, trackersGroup: params.trackersGroup, translator: params.translator,
    };
    this._params = params;
    this._areaTracker = params.renderer.path(null, 'area').attr({ class: 'area-tracker', fill: '#000000', opacity: 0.0001 }).append(params.trackersGroup);
    this._selectedAreaTracker = params.renderer.path(null, 'area').attr({ class: 'selected-area-tracker', fill: '#000000', opacity: 0.0001 }).append(params.trackersGroup);
    // Shutter is appended before sliders because later (when they will be foregrounded) it will be at any case located before them.
    this._shutter = params.renderer.path(null, 'area').append(params.root);
    this._sliders = [new Slider(sliderParams, 0), new Slider(sliderParams, 1)];
    // It seems that there is no special reasons to suppress first event - it was accidentally suppressed.
    // Let it stay so for now.
    this._processSelectionChanged = dummyProcessSelectionChanged;
  }

  dispose(): void {
    this._sliders[0].dispose();
    this._sliders[1].dispose();
  }

  getTrackerTargets(): { area: ThemeValue; selectedArea: ThemeValue; sliders: Slider[] } {
    return {
      area: this._areaTracker,
      selectedArea: this._selectedAreaTracker,
      sliders: this._sliders,
    };
  }

  _processSelectionChanged(e?: ThemeValue): void {
    const selectedRange = this.getSelectedRange();
    if (!rangesAreEqual(selectedRange, this._lastSelectedRange)) {
      this._params.updateSelectedRange(selectedRange, this._lastSelectedRange, e);
      this._lastSelectedRange = selectedRange;
    }
  }

  update(verticalRange: number[], behavior: ThemeValue, isCompactMode: boolean, sliderHandleOptions: ThemeValue, sliderMarkerOptions: ThemeValue, shutterOptions: ThemeValue, rangeBounds: RangeBounds, fullTicks: ThemeValue[], selectedRangeColor: string): void {
    const screenRange = this._params.translator.getScreenRange();

    this._verticalRange = verticalRange;
    this._minRange = rangeBounds.minRange;
    this._maxRange = rangeBounds.maxRange;
    // TODO: Investigate reasons of "renderer.animationEnabled" usage - it seems to be useless (if only for vml somehow)
    this._animationEnabled = behavior.animationEnabled && this._params.renderer.animationEnabled();
    this._allowSlidersSwap = behavior.allowSlidersSwap;
    this._sliders[0].update(verticalRange, sliderHandleOptions, sliderMarkerOptions);
    this._sliders[1].update(verticalRange, sliderHandleOptions, sliderMarkerOptions);
    // This is required for placing sliders and shutter into initial position from which initial animation will be going.
    this._sliders[0]._position = this._sliders[1]._position = screenRange[0];

    this._values = !this._params.translator.isValueProlonged && behavior.snapToTicks ? fullTicks : null;
    this._areaTracker.attr({ points: buildRectPoints(screenRange[0], verticalRange[0], screenRange[1], verticalRange[1]) });

    // SlidersContainer
    this._isCompactMode = isCompactMode;
    this._shutterOffset = sliderHandleOptions.width / 2;
    this._updateSelectedView(shutterOptions, selectedRangeColor);

    this._isOnMoving = _normalizeEnum(behavior.valueChangeMode) === 'onhandlemove';

    this._updateSelectedRange();
    // This is placing sliders and shutter into initial position. They all will be animated from that position when "setSelectedRange" is called.
    this._applyTotalPosition(false);
  }

  _updateSelectedView(shutterOptions: ThemeValue, selectedRangeColor: string): void {
    const settings: ShutterSettings = {
      fill: null, 'fill-opacity': null, stroke: null, 'stroke-width': null,
    };
    if (this._isCompactMode) {
      settings.stroke = selectedRangeColor;
      settings['stroke-width'] = 3;
      settings.sharp = 'v';
    } else {
      settings.fill = shutterOptions.color;
      settings['fill-opacity'] = shutterOptions.opacity;
    }
    this._shutter.attr(settings);
  }

  _updateSelectedRange(): void {
    const sliders = this._sliders;
    sliders[0].cancelAnimation();
    sliders[1].cancelAnimation();
    this._shutter.stopAnimation();
    if (this._params.translator.getBusinessRange().isEmpty()) {
      sliders[0]._setText(emptySliderMarkerText);
      sliders[1]._setText(emptySliderMarkerText);
      sliders[0]._value = sliders[1]._value = undefined;
      sliders[0]._position = this._params.translator.getScreenRange()[0];
      sliders[1]._position = this._params.translator.getScreenRange()[1];
      this._applyTotalPosition(false);
      suppressSetSelectedRange(this);
    } else {
      restoreSetSelectedRange(this);
    }
  }

  _applyTotalPosition(isAnimated: boolean): void {
    const sliders = this._sliders;
    isAnimated = this._animationEnabled && isAnimated;
    sliders[0].applyPosition(isAnimated);
    sliders[1].applyPosition(isAnimated);
    const areOverlapped = sliders[0].getCloudBorder() > sliders[1].getCloudBorder();
    sliders[0].setOverlapped(areOverlapped);
    sliders[1].setOverlapped(areOverlapped);
    this._applyAreaTrackersPosition();
    this._applySelectedRangePosition(isAnimated);
    if (isFirefoxOnAndroid()) {
      this._areaTracker.attr({ transform: null });
      this._selectedAreaTracker.attr({ transform: null });
      this._sliders.forEach((slider) => {
        slider._tracker.attr({ transform: null });
      });
    }
  }

  _applyAreaTrackersPosition(): void {
    let position1 = this._sliders[0].getPosition();
    let position2 = this._sliders[1].getPosition();

    if (isFirefoxOnAndroid()) {
      position1 += this._sliders[0]._tracker._originalWidth / 2;
      position2 -= this._sliders[1]._tracker._originalWidth / 2;
    }

    this._selectedAreaTracker.attr({ points: buildRectPoints(position1, this._verticalRange[0], position2, this._verticalRange[1]) }).css({
      cursor: Math.abs(this._params.translator.getScreenRange()[1] - this._params.translator.getScreenRange()[0] - position2 + position1) < 0.001 ? 'default' : 'pointer',
    });
  }

  _applySelectedRangePosition(isAnimated: boolean): void {
    const verticalRange = this._verticalRange;
    const pos1 = this._sliders[0].getPosition();
    const pos2 = this._sliders[1].getPosition();
    let screenRange;
    let points;
    if (this._isCompactMode) {
      points = [pos1 + Math.ceil(this._shutterOffset), (verticalRange[0] + verticalRange[1]) / 2, pos2 - Math.floor(this._shutterOffset), (verticalRange[0] + verticalRange[1]) / 2];
    } else {
      screenRange = this._params.axis.getVisibleArea();
      points = [
        buildRectPoints(screenRange[0], verticalRange[0], Math.max(pos1 - Math.floor(this._shutterOffset), screenRange[0]), verticalRange[1]),
        buildRectPoints(screenRange[1], verticalRange[0], Math.min(pos2 + Math.ceil(this._shutterOffset), screenRange[1]), verticalRange[1]),
      ];
    }
    if (isAnimated) {
      this._shutter.animate({ points }, animationSettings);
    } else {
      this._shutter.attr({ points });
    }
  }

  getSelectedRange(): SelectedRange {
    return { startValue: this._sliders[0].getValue(), endValue: this._sliders[1].getValue() };
  }

  setSelectedRange(visualRange?: VisualRangeInput | null, e?: ThemeValue): void {
    visualRange = visualRange || {};
    const translator = this._params.translator;
    const businessRange = translator.getBusinessRange();
    const compare = businessRange.axisType === 'discrete' ? function (a: ThemeValue, b: ThemeValue): boolean {
      return a < b;
    } : function (a: ThemeValue, b: ThemeValue): boolean {
      return a <= b;
    };

    let { startValue, endValue } = adjustVisualRange({
      dataType: businessRange.dataType,
      axisType: businessRange.axisType,
      base: businessRange.base,
    }, {
      startValue: translator.isValid(visualRange.startValue) ? translator.getCorrectValue(visualRange.startValue, +1) : undefined,
      endValue: translator.isValid(visualRange.endValue) ? translator.getCorrectValue(visualRange.endValue, -1) : undefined,
      length: visualRange.length,
    }, {
      min: businessRange.minVisible,
      max: businessRange.maxVisible,
      categories: businessRange.categories,
    });

    startValue = isNumeric(startValue) ? adjust(startValue) : startValue;
    endValue = isNumeric(endValue) ? adjust(endValue) : endValue;
    const values = compare(translator.to(startValue, -1), translator.to(endValue, +1)) ? [startValue, endValue] : [endValue, startValue];
    this._sliders[0].setDisplayValue(values[0]);
    this._sliders[1].setDisplayValue(values[1]);
    this._sliders[0]._position = translator.to(values[0], -1);
    this._sliders[1]._position = translator.to(values[1], +1);
    this._applyTotalPosition(true);
    this._processSelectionChanged(e);
  }

  beginSelectedAreaMoving(initialPosition: number): MovingHandler {
    const that = this;
    const sliders = that._sliders;
    const offset = (sliders[0].getPosition() + sliders[1].getPosition()) / 2 - initialPosition;
    let currentPosition = initialPosition;

    move.complete = function (e: ThemeValue): void {
      that._dockSelectedArea(e);
    };
    return move;

    function move(position: number, e?: ThemeValue): void {
      if (position !== currentPosition && (position > currentPosition === position > (sliders[0].getPosition() + sliders[1].getPosition()) / 2 - offset)) {
        that._moveSelectedArea(position + offset, false, e);
      }
      currentPosition = position;
    }
  }

  _dockSelectedArea(e?: ThemeValue): void {
    const translator = this._params.translator;
    const sliders = this._sliders;

    sliders[0]._position = translator.to(sliders[0].getValue(), -1);
    sliders[1]._position = translator.to(sliders[1].getValue(), +1);
    this._applyTotalPosition(true);
    this._processSelectionChanged(e);
  }

  moveSelectedArea(screenPosition: number, e?: ThemeValue): void {
    this._moveSelectedArea(screenPosition, true, e);
    this._dockSelectedArea(e);
  }

  _moveSelectedArea(screenPosition: number, isAnimated: boolean, e?: ThemeValue): void {
    const translator = this._params.translator;
    const sliders = this._sliders;
    const interval = sliders[1].getPosition() - sliders[0].getPosition();
    let startPosition = screenPosition - interval / 2;
    let endPosition = screenPosition + interval / 2;
    if (startPosition < translator.getScreenRange()[0]) {
      startPosition = translator.getScreenRange()[0];
      endPosition = startPosition + interval;
    }
    if (endPosition > translator.getScreenRange()[1]) {
      endPosition = translator.getScreenRange()[1];
      startPosition = endPosition - interval;
    }

    // Check for "minRange" and "maxRange" is not performed because it was not performed in the previous code, though I find it strange.
    const startValue = selectClosestValue(translator.from(startPosition, -1), this._values);
    sliders[0].setDisplayValue(startValue);
    sliders[1].setDisplayValue(selectClosestValue(translator.from(translator.to(startValue, -1) + interval, +1), this._values));
    sliders[0]._position = startPosition;
    sliders[1]._position = endPosition;
    this._applyTotalPosition(isAnimated);
    if (this._isOnMoving) {
      this._processSelectionChanged(e);
    }
  }

  placeSliderAndBeginMoving(firstPosition: number, secondPosition: number, e?: ThemeValue): MovingHandler {
    const translator = this._params.translator;
    const sliders = this._sliders;
    const index = firstPosition < secondPosition ? 0 : 1;
    const dir = index > 0 ? +1 : -1;
    const compare = index > 0 ? isGreater : isLess;
    const antiCompare = index > 0 ? isLess : isGreater;
    let thresholdPosition;
    const positions: number[] = [];
    const values: ThemeValue[] = [];
    values[index] = translator.from(firstPosition, dir);
    values[1 - index] = translator.from(secondPosition, -dir);
    positions[1 - index] = secondPosition;
    if (translator.isValueProlonged) {
      // Ensure that first value is strictly to the outer side from the "firstPosition".
      if (compare(firstPosition, translator.to(values[index], dir))) {
        values[index] = translator.from(firstPosition, -dir);
      }
      // Check - if "secondPosition" is closer to "firstPosition" than a span of a single category.
      if (compare(secondPosition, translator.to(values[index], -dir))) {
        values[1 - index] = values[index];
      }
    }
    if (this._minRange) {
      thresholdPosition = translator.to(translator.add(selectClosestValue(values[index], this._values), this._minRange, -dir), -dir);
      // Check - if "secondPosition" is closer to "firstPosition" than it is allowed by "minRange".
      if (compare(secondPosition, thresholdPosition)) {
        values[1 - index] = translator.add(values[index], this._minRange, -dir);
      }
      thresholdPosition = translator.to(translator.add(translator.getRange()[1 - index], this._minRange, dir), -dir);
      // Check - if "firstPosition" is closer to an end than it is allowed by "minRange".
      // So there is definitely not enough space for both sliders - the first  (as the one which is farther from the end) has to be moved away by "minRange".
      if (antiCompare(firstPosition, thresholdPosition)) {
        values[1 - index] = translator.getRange()[1 - index];
        values[index] = translator.add(values[1 - index], this._minRange, dir);
        positions[1 - index] = firstPosition;
      }
    }
    values[0] = selectClosestValue(values[0], this._values);
    values[1] = selectClosestValue(values[1], this._values);
    positions[index] = translator.to(values[index], dir);
    sliders[0].setDisplayValue(values[0]);
    sliders[1].setDisplayValue(values[1]);
    sliders[0]._position = positions[0];
    sliders[1]._position = positions[1];
    this._applyTotalPosition(true);
    if (this._isOnMoving) {
      this._processSelectionChanged(e);
    }

    const handler = this.beginSliderMoving(1 - index, secondPosition);
    sliders[1 - index]._sliderGroup.stopAnimation();
    this._shutter.stopAnimation();
    handler(secondPosition);
    return handler;
  }

  beginSliderMoving(initialIndex: number, initialPosition: number): MovingHandler {
    const that = this;
    const translator = that._params.translator;
    const sliders = that._sliders;
    const minPosition = translator.getScreenRange()[0];
    const maxPosition = translator.getScreenRange()[1];
    let index = initialIndex;
    const staticPosition = sliders[1 - index].getPosition();
    let currentPosition = initialPosition;
    let dir = index > 0 ? +1 : -1;
    let compareMin = index > 0 ? isLess : isGreater;
    let compareMax = index > 0 ? isGreater : isLess;
    let moveOffset = sliders[index].getPosition() - initialPosition;
    let swapOffset = compareMin(sliders[index].getPosition(), initialPosition) ? -moveOffset : moveOffset;

    move.complete = function (e: ThemeValue): void {
      sliders[index]._setValid(true);
      that._dockSelectedArea(e);
    };
    return move;

    function move(position: number, e?: ThemeValue): void {
      let isValid;
      let temp;
      let pos;
      let slider;
      let value;

      if (position !== currentPosition) {
        if (compareMin(position + swapOffset, staticPosition)) {
          isValid = that._allowSlidersSwap;
          // TODO: Validate "_minRange" so that for discrete translator it is always null - that will allow to split "isValueProlonged" and "_minRange" checks
          if (isValid && !translator.isValueProlonged && that._minRange) {
            isValid = translator.isValid(translator.add(sliders[1 - index].getValue(), that._minRange, -dir));
          }
          if (isValid) {
            that._changeMovingSlider(index);
            index = 1 - index;
            dir = -dir;
            temp = compareMin;
            compareMin = compareMax;
            compareMax = temp;
            moveOffset = -dir * Math.abs(moveOffset);
            swapOffset = -moveOffset;
          }
        }
        if (compareMax(position + moveOffset, staticPosition)) {
          slider = sliders[index];
          value = sliders[1 - index].getValue();
          pos = Math.max(Math.min(position + moveOffset, maxPosition), minPosition);
          // TODO: Write it as single operation (isValid = ... && ... && ...) when code is stable.
          // Check - if moving slider is closer to static slider than a span of a single category.
          isValid = translator.isValueProlonged ? !compareMin(pos, translator.to(value, dir)) : true;
          let invalidStateValue;
          // Check - if moving slider is closer to static slider than it is allowed "minRange".
          if (isValid && that._minRange) {
            isValid = !compareMin(pos, translator.to(translator.add(value, that._minRange, dir), dir));
            if (!isValid) {
              invalidStateValue = translator.add(value, that._minRange, dir);
            }
          }
          // Check - if moving slider is farther from static slider than it is allowed by "maxRange"
          if (isValid && that._maxRange) {
            isValid = !compareMax(pos, translator.to(translator.add(value, that._maxRange, dir), dir));
            if (!isValid) {
              invalidStateValue = translator.add(value, that._maxRange, dir);
            }
          }
          slider._setValid(isValid);
          slider.setDisplayValue(isValid
            ? selectClosestValue(translator.from(pos, dir), that._values)
            : isDefined(invalidStateValue) ? invalidStateValue : slider.getValue());
          slider._position = pos;
          that._applyTotalPosition(false);
          slider.toForeground();
          if (that._isOnMoving) {
            that._processSelectionChanged(e);
          }
        }
      }
      currentPosition = position;
    }
  }

  _changeMovingSlider(index: number): void {
    const translator = this._params.translator;
    const sliders = this._sliders;
    const position = sliders[1 - index].getPosition();
    const dir = index > 0 ? +1 : -1;
    let newValue;
    sliders[index].setDisplayValue(selectClosestValue(translator.from(position, dir), this._values));
    newValue = translator.from(position, -dir);
    if (translator.isValueProlonged) {
      newValue = translator.from(position, dir);
    } else if (this._minRange) {
      // TODO: Consider adding "translator.isValid" check - that will allow to split "if-else" into two "if"
      newValue = translator.add(newValue, this._minRange, -dir);
    }
    sliders[1 - index].setDisplayValue(selectClosestValue(newValue, this._values));
    sliders[index]._setValid(true);
    sliders[index]._marker._update(); // This is to update "text" element
    sliders[0]._position = sliders[1]._position = position;
  }

  foregroundSlider(index: number): void {
    this._sliders[index].toForeground();
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_SlidersController(value: typeof SlidersController): void {
  SlidersController = value;
}
/// #ENDDEBUG
