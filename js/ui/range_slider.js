import { getWidth } from '../core/utils/size';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import Slider from './slider';
import SliderHandle from './slider/ui.slider_handle';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { applyServerDecimalSeparator } from '../core/utils/common';
import { eventData } from '../events/utils/index';
import messageLocalization from '../localization/message';

// STYLE rangeSlider

const RANGE_SLIDER_CLASS = 'dx-rangeslider';
const RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle';
const RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle';

const RangeSlider = Slider.inherit({

    _supportedKeys: function() {
        const isRTL = this.option('rtlEnabled');

        const that = this;
        const _changeHandle = function(e, capturedHandle) {
            if(that.option('start') === that.option('end')) {
                that._capturedHandle = capturedHandle;
                e.target = that._capturedHandle;
                eventsEngine.trigger(that._capturedHandle, 'focus');
            }
        };

        const _setHandleValue = function(e, step, sign) {
            const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);

            const valueOption = isStart ? 'start' : 'end';
            let val = that.option(valueOption);

            step = that._valueStep(step);

            val += sign * (isRTL ? -step : step);
            that.option(valueOption, val);
        };

        const moveHandleRight = function(e, step) {
            _changeHandle(e, isRTL ? that._$handleStart : that._$handleEnd);
            _setHandleValue(e, step, 1);
        };

        const moveHandleLeft = function(e, step) {
            _changeHandle(e, isRTL ? that._$handleEnd : that._$handleStart);
            _setHandleValue(e, step, -1);
        };

        return extend(this.callBase(), {
            leftArrow: function(e) {
                this._processKeyboardEvent(e);

                moveHandleLeft(e, this.option('step'));
            },
            rightArrow: function(e) {
                this._processKeyboardEvent(e);

                moveHandleRight(e, this.option('step'));
            },
            pageUp: function(e) {
                this._processKeyboardEvent(e);

                moveHandleRight(e, this.option('step') * this.option('keyStep'));
            },
            pageDown: function(e) {
                this._processKeyboardEvent(e);

                moveHandleLeft(e, this.option('step') * this.option('keyStep'));
            },
            home: function(e) {
                this._processKeyboardEvent(e);
                const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
                const valueOption = isStart ? 'start' : 'end';
                const startOption = isStart ? 'min' : 'start';
                const val = this.option(startOption);

                this.option(valueOption, val);
            },
            end: function(e) {
                this._processKeyboardEvent(e);
                const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
                const valueOption = isStart ? 'start' : 'end';
                const endOption = isStart ? 'end' : 'max';
                const val = this.option(endOption);

                this.option(valueOption, val);
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            start: 40,

            end: 60,

            value: [40, 60],

            startName: '',

            endName: ''


            /**
            * @name dxRangeSliderOptions.name
            * @hidden
            */
        });
    },

    _renderSubmitElement: function() {
        const $element = this.$element();

        this._$submitStartElement = $('<input>')
            .attr('type', 'hidden')
            .attr('name', this.option('startName'))
            .appendTo($element);

        this._$submitEndElement = $('<input>')
            .attr('type', 'hidden')
            .attr('name', this.option('endName'))
            .appendTo($element);
    },

    _initOptions: function(options) {
        this.callBase(options);

        const initialValue = this.initialOption('value');
        const value = this.option('value');
        if(value[0] === initialValue[0] && value[1] === initialValue[1]) {
            this.option('value', [this.option('start'), this.option('end')]);
        } else {
            this.option({ start: value[0], end: value[1] });
        }
    },

    _initMarkup: function() {
        this.$element().addClass(RANGE_SLIDER_CLASS);
        this.callBase();
    },

    _renderContentImpl: function() {
        this._callHandlerMethod('repaint');
        this.callBase();
    },

    _renderHandle: function() {
        this._$handleStart = this._renderHandleImpl(this.option('start'), this._$handleStart).addClass(RANGE_SLIDER_START_HANDLE_CLASS);
        this._$handleEnd = this._renderHandleImpl(this.option('end'), this._$handleEnd).addClass(RANGE_SLIDER_END_HANDLE_CLASS);
        this._updateHandleAriaLabels();
    },

    _startHandler: function(args) {
        const e = args.event;
        const $range = this._$range;
        const rangeWidth = getWidth($range);
        const eventOffsetX = eventData(e).x - this._$bar.offset().left;
        const startHandleX = $range.position().left;
        const endHandleX = $range.position().left + rangeWidth;
        const rtlEnabled = this.option('rtlEnabled');
        const startHandleIsClosest = (rtlEnabled ? -1 : 1) * ((startHandleX + endHandleX) / 2 - eventOffsetX) > 0;

        this._capturedHandle = startHandleIsClosest ? this._$handleStart : this._$handleEnd;

        this.callBase(args);
    },

    _updateHandleAriaLabels: function() {
        this.setAria('label', messageLocalization.getFormatter('dxRangeSlider-ariaFrom')(this.option('dxRangeSlider-ariaFrom')), this._$handleStart);
        this.setAria('label', messageLocalization.getFormatter('dxRangeSlider-ariaTill')(this.option('dxRangeSlider-ariaTill')), this._$handleEnd);
    },

    _activeHandle: function() {
        return this._capturedHandle;
    },

    _updateHandlePosition: function(e) {
        const rtlEnabled = this.option('rtlEnabled');
        const offsetDirection = rtlEnabled ? -1 : 1;
        const max = this.option('max');
        const min = this.option('min');

        let newRatio = this._startOffset + offsetDirection * e.event.offset / this._swipePixelRatio();
        newRatio = newRatio.toPrecision(12); // NOTE: android 2.3 has problems with mathematics

        const newValue = newRatio * (max - min) + min;

        this._updateSelectedRangePosition(newRatio, newRatio);
        SliderHandle.getInstance(this._activeHandle())['fitTooltipPosition'];

        this._changeValueOnSwipe(newRatio);

        const [startValue, endValue] = this._getActualValue();

        let $nextHandle;

        if(startValue === endValue) {
            if(newValue < startValue) {
                $nextHandle = this._$handleStart;
            } else {
                $nextHandle = this._$handleEnd;
            }

            eventsEngine.trigger($nextHandle, 'focus');

            if($nextHandle && $nextHandle !== this._capturedHandle) {
                this._updateSelectedRangePosition((startValue - min) / (max - min), (endValue - min) / (max - min));
                this._toggleActiveState(this._activeHandle(), false);
                this._toggleActiveState($nextHandle, true);
                this._capturedHandle = $nextHandle;
            }

            this._updateSelectedRangePosition(newRatio, newRatio);
            this._changeValueOnSwipe(newRatio);
        }
    },

    _updateSelectedRangePosition: function(leftRatio, rightRatio) {
        const rtlEnabled = this.option('rtlEnabled');
        const moveRight = this._capturedHandle === this._$handleStart && rtlEnabled ||
                        this._capturedHandle === this._$handleEnd && !rtlEnabled;

        const prop = moveRight ? 'right' : 'left';

        if(rtlEnabled ^ moveRight) {
            this._$range.css(prop, (100 - rightRatio * 100) + '%');
        } else {
            this._$range.css(prop, leftRatio * 100 + '%');
        }
    },

    _setValueOnSwipe: function(value) {
        const option = this._capturedHandle === this._$handleStart ? 'start' : 'end';
        let [start, end] = this._getActualValue();
        const max = this.option('max');
        const min = this.option('min');

        start = Math.min(Math.max(start, min), max);
        end = Math.min(Math.max(end, min), max);

        if(option === 'start') {
            start = value > end ? end : value;
        } else {
            end = value < start ? start : value;
        }


        if(this.option('valueChangeMode') === 'onHandleMove') {
            this.option('value', [start, end]);
        } else {
            this._actualValue = [start, end];
            this._renderValue();
        }
    },

    _renderValue: function() {
        let [valStart, valEnd] = this._getActualValue();
        const min = this.option('min');
        const max = this.option('max');
        const rtlEnabled = this.option('rtlEnabled');

        valStart = Math.max(min, Math.min(valStart, max));
        valEnd = Math.max(valStart, Math.min(valEnd, max));

        if(this.option('valueChangeMode') === 'onHandleMove') {
            this._setOptionWithoutOptionChange('start', valStart);
            this._setOptionWithoutOptionChange('end', valEnd);
            this._setOptionWithoutOptionChange('value', [valStart, valEnd]);
        }


        this._$submitStartElement.val(applyServerDecimalSeparator(valStart));
        this._$submitEndElement.val(applyServerDecimalSeparator(valEnd));

        const ratio1 = (max === min) ? 0 : (valStart - min) / (max - min);
        const ratio2 = (max === min) ? 0 : (valEnd - min) / (max - min);

        const startOffset = parseFloat((ratio1 * 100).toPrecision(12)) + '%';
        const endOffset = parseFloat(((1 - ratio2) * 100).toPrecision(12)) + '%';

        !this._needPreventAnimation && this._setRangeStyles({
            right: rtlEnabled ? startOffset : endOffset,
            left: rtlEnabled ? endOffset : startOffset
        });

        SliderHandle.getInstance(this._$handleStart).option('value', valStart);
        SliderHandle.getInstance(this._$handleEnd).option('value', valEnd);
    },

    _callHandlerMethod: function(name, args) {
        SliderHandle.getInstance(this._$handleStart)[name](args);
        SliderHandle.getInstance(this._$handleEnd)[name](args);
    },

    _setValueOption: function() {
        const start = this.option('start');
        const end = this.option('end');

        this.option('value', [start, end]);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'value': {
                if(args.value[0] === args.previousValue[0] && args.value[1] === args.previousValue[1]) {
                    break;
                }

                this._setOptionWithoutOptionChange('start', args.value[0]);
                this._setOptionWithoutOptionChange('end', args.value[1]);

                this._renderValue();

                const start = this.option('start');
                const end = this.option('end');

                this._createActionByOption('onValueChanged', {
                    excludeValidators: ['disabled', 'readOnly']
                })({
                    start: start,
                    end: end,
                    value: [start, end],
                    event: this._valueChangeEventInstance,
                    previousValue: args.previousValue
                });

                this.validationRequest.fire({
                    value: [start, end],
                    editor: this
                });

                this._saveValueChangeEvent(undefined);
                break;
            }
            case 'start':
            case 'end':
                this._setValueOption();
                break;
            case 'startName':
                this._$submitStartElement.attr('name', args.value);
                break;
            case 'endName':
                this._$submitEndElement.attr('name', args.value);
                break;
            case 'name':
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxRangeSlider', RangeSlider);

export default RangeSlider;
