const noop = require('../../core/utils/common').noop;
const commonModule = require('./common');
const animationSettings = commonModule.utils.animationSettings;
const emptySliderMarkerText = commonModule.consts.emptySliderMarkerText;
const Slider = require('./slider');
const _normalizeEnum = require('../core/utils').normalizeEnum;
const typeUtils = require('../../core/utils/type');
const isNumeric = typeUtils.isNumeric;
const vizUtils = require('../core/utils');
const adjust = require('../../core/utils/math').adjust;

function buildRectPoints(left, top, right, bottom) {
    return [left, top, right, top, right, bottom, left, bottom];
}

function valueOf(value) {
    return value && value.valueOf();
}

function isLess(a, b) {
    return a < b;
}

function isGreater(a, b) {
    return a > b;
}

function selectClosestValue(target, values) {
    let start = 0;
    let end = values ? values.length - 1 : 0;
    let middle;
    let val = target;
    while(end - start > 1) {
        middle = (start + end) >> 1;
        val = values[middle];
        if(val === target) {
            return target;
        } else if(target < val) {
            end = middle;
        } else {
            start = middle;
        }
    }
    if(values) {
        val = values[target - values[start] <= values[end] - target ? start : end];
    }
    return val;
}

function dummyProcessSelectionChanged() {
    this._lastSelectedRange = this.getSelectedRange();
    delete this._processSelectionChanged;
}

// See tests in "rangeSelectorWithAssertion.html", "'onSelectedRangeChanged' event" module
function suppressSetSelectedRange(controller) {
    controller.setSelectedRange = noop;
    if(controller._processSelectionChanged === dummyProcessSelectionChanged) {
        controller._processSelectionChanged();
    }
}

function restoreSetSelectedRange(controller) {
    delete controller.setSelectedRange;
}

function SlidersController(params) {
    const that = this;
    const sliderParams = { renderer: params.renderer, root: params.root, trackersGroup: params.trackersGroup, translator: params.translator };
    that._params = params;
    that._areaTracker = params.renderer.path(null, 'area').attr({ 'class': 'area-tracker', fill: '#000000', opacity: 0.0001 }).append(params.trackersGroup);
    that._selectedAreaTracker = params.renderer.path(null, 'area').attr({ 'class': 'selected-area-tracker', fill: '#000000', opacity: 0.0001 }).append(params.trackersGroup);
    // Shutter is appended before sliders because later (when they will be foregrounded) it will be at any case located before them.
    that._shutter = params.renderer.path(null, 'area').append(params.root);
    that._sliders = [new Slider(sliderParams, 0), new Slider(sliderParams, 1)];
    // It seems that there is no special reasons to suppress first event - it was accidentally suppressed.
    // Let it stay so for now.
    that._processSelectionChanged = dummyProcessSelectionChanged;
}

SlidersController.prototype = {
    constructor: SlidersController,

    dispose: function() {
        this._sliders[0].dispose();
        this._sliders[1].dispose();
    },

    getTrackerTargets: function() {
        return {
            area: this._areaTracker,
            selectedArea: this._selectedAreaTracker,
            sliders: this._sliders
        };
    },

    _processSelectionChanged: function(e) {
        const that = this;
        const selectedRange = that.getSelectedRange();
        if(valueOf(selectedRange.startValue) !== valueOf(that._lastSelectedRange.startValue) || valueOf(selectedRange.endValue) !== valueOf(that._lastSelectedRange.endValue)) {
            that._params.updateSelectedRange(selectedRange, that._lastSelectedRange, e);
            that._lastSelectedRange = selectedRange;
        }
    },

    update: function(verticalRange, behavior, isCompactMode, sliderHandleOptions, sliderMarkerOptions, shutterOptions, rangeBounds, fullTicks, selectedRangeColor) {
        const that = this;
        const screenRange = that._params.translator.getScreenRange();

        that._verticalRange = verticalRange;
        that._minRange = rangeBounds.minRange;
        that._maxRange = rangeBounds.maxRange;
        // TODO: Investigate reasons of "renderer.animationEnabled" usage - it seems to be useless (if only for vml somehow)
        that._animationEnabled = behavior.animationEnabled && that._params.renderer.animationEnabled();
        that._allowSlidersSwap = behavior.allowSlidersSwap;
        that._sliders[0].update(verticalRange, sliderHandleOptions, sliderMarkerOptions);
        that._sliders[1].update(verticalRange, sliderHandleOptions, sliderMarkerOptions);
        // This is required for placing sliders and shutter into initial position from which initial animation will be going.
        that._sliders[0]._position = that._sliders[1]._position = screenRange[0];

        that._values = !that._params.translator.isValueProlonged && behavior.snapToTicks ? fullTicks : null;
        that._areaTracker.attr({ points: buildRectPoints(screenRange[0], verticalRange[0], screenRange[1], verticalRange[1]) });

        // SlidersContainer
        that._isCompactMode = isCompactMode;
        that._shutterOffset = sliderHandleOptions.width / 2;
        that._updateSelectedView(shutterOptions, selectedRangeColor);

        that._isOnMoving = _normalizeEnum(behavior.callValueChanged) === 'onmoving';

        that._updateSelectedRange();
        // This is placing sliders and shutter into initial position. They all will be animated from that position when "setSelectedRange" is called.
        that._applyTotalPosition(false);
    },

    _updateSelectedView: function(shutterOptions, selectedRangeColor) {
        const settings = { fill: null, 'fill-opacity': null, stroke: null, 'stroke-width': null };
        if(this._isCompactMode) {
            settings.stroke = selectedRangeColor;
            settings['stroke-width'] = 3;
            settings.sharp = 'v';
        } else {
            settings.fill = shutterOptions.color;
            settings['fill-opacity'] = shutterOptions.opacity;
        }
        this._shutter.attr(settings);
    },

    _updateSelectedRange: function() {
        const that = this;
        const sliders = that._sliders;
        sliders[0].cancelAnimation();
        sliders[1].cancelAnimation();
        that._shutter.stopAnimation();
        if(that._params.translator.getBusinessRange().isEmpty()) {
            sliders[0]._setText(emptySliderMarkerText);
            sliders[1]._setText(emptySliderMarkerText);
            sliders[0]._value = sliders[1]._value = undefined;
            sliders[0]._position = that._params.translator.getScreenRange()[0];
            sliders[1]._position = that._params.translator.getScreenRange()[1];
            that._applyTotalPosition(false);
            suppressSetSelectedRange(that);
        } else {
            restoreSetSelectedRange(that);
        }
    },

    _applyTotalPosition: function(isAnimated) {
        const sliders = this._sliders;
        let areOverlapped;
        isAnimated = this._animationEnabled && isAnimated;
        sliders[0].applyPosition(isAnimated);
        sliders[1].applyPosition(isAnimated);
        areOverlapped = sliders[0].getCloudBorder() > sliders[1].getCloudBorder();
        sliders[0].setOverlapped(areOverlapped);
        sliders[1].setOverlapped(areOverlapped);
        this._applyAreaTrackersPosition();
        this._applySelectedRangePosition(isAnimated);
    },

    _applyAreaTrackersPosition: function() {
        const that = this;
        const position1 = that._sliders[0].getPosition();
        const position2 = that._sliders[1].getPosition();
        that._selectedAreaTracker.attr({ points: buildRectPoints(position1, that._verticalRange[0], position2, that._verticalRange[1]) }).css({
            cursor: Math.abs(that._params.translator.getScreenRange()[1] - that._params.translator.getScreenRange()[0] - position2 + position1) < 0.001 ? 'default' : 'pointer'
        });
    },

    _applySelectedRangePosition: function(isAnimated) {
        const that = this;
        const verticalRange = that._verticalRange;
        const pos1 = that._sliders[0].getPosition();
        const pos2 = that._sliders[1].getPosition();
        let screenRange;
        let points;
        if(that._isCompactMode) {
            points = [pos1 + Math.ceil(that._shutterOffset), (verticalRange[0] + verticalRange[1]) / 2, pos2 - Math.floor(that._shutterOffset), (verticalRange[0] + verticalRange[1]) / 2];
        } else {
            screenRange = that._params.axis.getVisibleArea();
            points = [
                buildRectPoints(screenRange[0], verticalRange[0], Math.max(pos1 - Math.floor(that._shutterOffset), screenRange[0]), verticalRange[1]),
                buildRectPoints(screenRange[1], verticalRange[0], Math.min(pos2 + Math.ceil(that._shutterOffset), screenRange[1]), verticalRange[1])
            ];
        }
        if(isAnimated) {
            that._shutter.animate({ points: points }, animationSettings);
        } else {
            that._shutter.attr({ points: points });
        }
    },

    getSelectedRange: function() {
        return { startValue: this._sliders[0].getValue(), endValue: this._sliders[1].getValue() };
    },

    setSelectedRange: function(visualRange, e) {
        visualRange = visualRange || {};
        const that = this;
        const translator = that._params.translator;
        const businessRange = translator.getBusinessRange();
        const compare = businessRange.axisType === 'discrete' ? function(a, b) {
            return a < b;
        } : function(a, b) {
            return a <= b;
        };

        let { startValue, endValue } = vizUtils.adjustVisualRange({
            dataType: businessRange.dataType,
            axisType: businessRange.axisType,
            base: businessRange.base
        }, {
            startValue: translator.isValid(visualRange.startValue) ? translator.getCorrectValue(visualRange.startValue, +1) : undefined,
            endValue: translator.isValid(visualRange.endValue) ? translator.getCorrectValue(visualRange.endValue, -1) : undefined,
            length: visualRange.length
        }, {
            min: businessRange.minVisible,
            max: businessRange.maxVisible,
            categories: businessRange.categories
        });

        startValue = isNumeric(startValue) ? adjust(startValue) : startValue;
        endValue = isNumeric(endValue) ? adjust(endValue) : endValue;
        const values = compare(translator.to(startValue, -1), translator.to(endValue, +1)) ? [startValue, endValue] : [endValue, startValue];
        that._sliders[0].setDisplayValue(values[0]);
        that._sliders[1].setDisplayValue(values[1]);
        that._sliders[0]._position = translator.to(values[0], -1);
        that._sliders[1]._position = translator.to(values[1], +1);
        that._applyTotalPosition(true);
        that._processSelectionChanged(e);
    },

    beginSelectedAreaMoving: function(initialPosition) {
        const that = this;
        const sliders = that._sliders;
        const offset = (sliders[0].getPosition() + sliders[1].getPosition()) / 2 - initialPosition;
        let currentPosition = initialPosition;

        move.complete = function(e) {
            that._dockSelectedArea(e);
        };
        return move;

        function move(position, e) {
            if(position !== currentPosition && (position > currentPosition === position > (sliders[0].getPosition() + sliders[1].getPosition()) / 2 - offset)) {
                that._moveSelectedArea(position + offset, false, e);
            }
            currentPosition = position;
        }
    },

    _dockSelectedArea: function(e) {
        const translator = this._params.translator;
        const sliders = this._sliders;

        sliders[0]._position = translator.to(sliders[0].getValue(), -1);
        sliders[1]._position = translator.to(sliders[1].getValue(), +1);
        this._applyTotalPosition(true);
        this._processSelectionChanged(e);
    },

    moveSelectedArea: function(screenPosition, e) {
        this._moveSelectedArea(screenPosition, true, e);
        this._dockSelectedArea(e);
    },

    _moveSelectedArea: function(screenPosition, isAnimated, e) {
        const that = this;
        const translator = that._params.translator;
        const sliders = that._sliders;
        const interval = sliders[1].getPosition() - sliders[0].getPosition();
        let startPosition = screenPosition - interval / 2;
        let endPosition = screenPosition + interval / 2;
        let startValue;
        if(startPosition < translator.getScreenRange()[0]) {
            startPosition = translator.getScreenRange()[0];
            endPosition = startPosition + interval;
        }
        if(endPosition > translator.getScreenRange()[1]) {
            endPosition = translator.getScreenRange()[1];
            startPosition = endPosition - interval;
        }

        // Check for "minRange" and "maxRange" is not performed because it was not performed in the previous code, though I find it strange.
        startValue = selectClosestValue(translator.from(startPosition, -1), that._values);
        sliders[0].setDisplayValue(startValue);
        sliders[1].setDisplayValue(selectClosestValue(translator.from(translator.to(startValue, -1) + interval, +1), that._values));
        sliders[0]._position = startPosition;
        sliders[1]._position = endPosition;
        that._applyTotalPosition(isAnimated);
        if(that._isOnMoving) {
            that._processSelectionChanged(e);
        }
    },

    placeSliderAndBeginMoving: function(firstPosition, secondPosition, e) {
        const that = this;
        const translator = that._params.translator;
        const sliders = that._sliders;
        const index = firstPosition < secondPosition ? 0 : 1;
        const dir = index > 0 ? +1 : -1;
        const compare = index > 0 ? isGreater : isLess;
        const antiCompare = index > 0 ? isLess : isGreater;
        let thresholdPosition;
        const positions = [];
        const values = [];
        let handler;
        values[index] = translator.from(firstPosition, dir);
        values[1 - index] = translator.from(secondPosition, -dir);
        positions[1 - index] = secondPosition;
        if(translator.isValueProlonged) {
            // Ensure that first value is strictly to the outer side from the "firstPosition".
            if(compare(firstPosition, translator.to(values[index], dir))) {
                values[index] = translator.from(firstPosition, -dir);
            }
            // Check - if "secondPosition" is closer to "firstPosition" than a span of a single category.
            if(compare(secondPosition, translator.to(values[index], -dir))) {
                values[1 - index] = values[index];
            }
        }
        if(that._minRange) {
            thresholdPosition = translator.to(translator.add(selectClosestValue(values[index], that._values), that._minRange, -dir), -dir);
            // Check - if "secondPosition" is closer to "firstPosition" than it is allowed by "minRange".
            if(compare(secondPosition, thresholdPosition)) {
                values[1 - index] = translator.add(values[index], that._minRange, -dir);
            }
            thresholdPosition = translator.to(translator.add(translator.getRange()[1 - index], that._minRange, dir), -dir);
            // Check - if "firstPosition" is closer to an end than it is allowed by "minRange".
            // So there is definitely not enough space for both sliders - the first  (as the one which is farther from the end) has to be moved away by "minRange".
            if(antiCompare(firstPosition, thresholdPosition)) {
                values[1 - index] = translator.getRange()[1 - index];
                values[index] = translator.add(values[1 - index], that._minRange, dir);
                positions[1 - index] = firstPosition;
            }
        }
        values[0] = selectClosestValue(values[0], that._values);
        values[1] = selectClosestValue(values[1], that._values);
        positions[index] = translator.to(values[index], dir);
        sliders[0].setDisplayValue(values[0]);
        sliders[1].setDisplayValue(values[1]);
        sliders[0]._position = positions[0];
        sliders[1]._position = positions[1];
        that._applyTotalPosition(true);
        if(that._isOnMoving) {
            that._processSelectionChanged(e);
        }

        handler = that.beginSliderMoving(1 - index, secondPosition);
        sliders[1 - index]._sliderGroup.stopAnimation();
        that._shutter.stopAnimation();
        handler(secondPosition);
        return handler;
    },

    beginSliderMoving: function(initialIndex, initialPosition) {
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

        move.complete = function(e) {
            sliders[index]._setValid(true);
            that._dockSelectedArea(e);
        };
        return move;

        function move(position, e) {
            let isValid;
            let temp;
            let pos;
            let slider;
            let value;

            if(position !== currentPosition) {
                if(compareMin(position + swapOffset, staticPosition)) {
                    isValid = that._allowSlidersSwap;
                    // TODO: Validate "_minRange" so that for discrete translator it is always null - that will allow to split "isValueProlonged" and "_minRange" checks
                    if(isValid && !translator.isValueProlonged && that._minRange) {
                        isValid = translator.isValid(translator.add(sliders[1 - index].getValue(), that._minRange, -dir));
                    }
                    if(isValid) {
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
                if(compareMax(position + moveOffset, staticPosition)) {
                    isValid = true;
                    slider = sliders[index];
                    value = sliders[1 - index].getValue();
                    pos = Math.max(Math.min(position + moveOffset, maxPosition), minPosition);
                    // TODO: Write it as single operation (isValid = ... && ... && ...) when code is stable.
                    // Check - if moving slider is closer to static slider than a span of a single category.
                    if(isValid && translator.isValueProlonged) {
                        isValid = !compareMin(pos, translator.to(value, dir));
                    }
                    // Check - if moving slider is closer to static slider than it is allowed "minRange".
                    if(isValid && that._minRange) {
                        isValid = !compareMin(pos, translator.to(translator.add(value, that._minRange, dir), dir));
                    }
                    // Check - if moving slider is farther from static slider than it is allowed by "maxRange"
                    if(isValid && that._maxRange) {
                        isValid = !compareMax(pos, translator.to(translator.add(value, that._maxRange, dir), dir));
                    }
                    slider._setValid(isValid);
                    slider.setDisplayValue(isValid ? selectClosestValue(translator.from(pos, dir), that._values) : slider.getValue());
                    slider._position = pos;
                    that._applyTotalPosition(false);
                    slider.toForeground();
                    if(that._isOnMoving) {
                        that._processSelectionChanged(e);
                    }
                }
            }
            currentPosition = position;
        }
    },

    _changeMovingSlider: function(index) {
        const that = this;
        const translator = that._params.translator;
        const sliders = that._sliders;
        const position = sliders[1 - index].getPosition();
        const dir = index > 0 ? +1 : -1;
        let newValue;
        sliders[index].setDisplayValue(selectClosestValue(translator.from(position, dir), that._values));
        newValue = translator.from(position, -dir);
        if(translator.isValueProlonged) {
            newValue = translator.from(position, dir);
        } else if(that._minRange) {
            // TODO: Consider adding "translator.isValid" check - that will allow to split "if-else" into two "if"
            newValue = translator.add(newValue, that._minRange, -dir);
        }
        sliders[1 - index].setDisplayValue(selectClosestValue(newValue, that._values));
        sliders[index]._setValid(true);
        sliders[index]._marker._update(); // This is to update "text" element
        sliders[0]._position = sliders[1]._position = position;
    },

    foregroundSlider: function(index) {
        this._sliders[index].toForeground();
    }
};

exports.SlidersController = SlidersController;
