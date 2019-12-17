const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const Slider = require('./slider');
const SliderHandle = require('./slider/ui.slider_handle');
const registerComponent = require('../core/component_registrator');
const extend = require('../core/utils/extend').extend;
const applyServerDecimalSeparator = require('../core/utils/common').applyServerDecimalSeparator;
const eventUtils = require('../events/utils');
const messageLocalization = require('../localization/message');

const RANGE_SLIDER_CLASS = 'dx-rangeslider';
const RANGE_SLIDER_START_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-start-handle';
const RANGE_SLIDER_END_HANDLE_CLASS = RANGE_SLIDER_CLASS + '-end-handle';

/**
* @name dxRangeSlider
* @isEditor
* @inherits dxSliderBase
* @module ui/range_slider
* @export default
*/
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
                e.preventDefault();
                e.stopPropagation();

                moveHandleLeft(e, this.option('step'));
            },
            rightArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleRight(e, this.option('step'));
            },
            pageUp: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleRight(e, this.option('step') * this.option('keyStep'));
            },
            pageDown: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleLeft(e, this.option('step') * this.option('keyStep'));
            },
            home: function(e) {
                e.preventDefault();
                e.stopPropagation();
                const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
                const valueOption = isStart ? 'start' : 'end';
                const startOption = isStart ? 'min' : 'start';
                const val = this.option(startOption);

                this.option(valueOption, val);
            },
            end: function(e) {
                e.preventDefault();
                e.stopPropagation();
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
            /**
            * @name dxRangeSliderOptions.start
            * @type number
            * @default 40
            */
            start: 40,

            /**
            * @name dxRangeSliderOptions.end
            * @type number
            * @default 60
            */
            end: 60,

            /**
            * @name dxRangeSliderOptions.value
            * @type Array<number>
            * @default [40, 60]
            */
            value: [40, 60],

            /**
            * @name dxRangeSliderOptions.startName
            * @type string
            * @default ""
            */
            startName: '',

            /**
            * @name dxRangeSliderOptions.endName
            * @type string
            * @default ""
            */
            endName: ''

            /**
            * @name dxRangeSliderOptions.onValueChanged
            * @action
            * @extends Action
            * @type_function_param1_field4 start:number
            * @type_function_param1_field5 end:number
            * @type_function_param1_field6 value:array<number>
            */

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
        const rangeWidth = $range.width();
        const eventOffsetX = eventUtils.eventData(e).x - this._$bar.offset().left;
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

        const startValue = this.option('start');
        const endValue = this.option('end');
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
        let start = this.option('start');
        let end = this.option('end');
        const max = this.option('max');
        const min = this.option('min');

        start = Math.min(Math.max(start, min), max);
        end = Math.min(Math.max(end, min), max);

        if(option === 'start') {
            start = value > end ? end : value;
        } else {
            end = value < start ? start : value;
        }

        this.option('value', [start, end]);
    },

    _renderValue: function() {
        let valStart = this.option('start');
        let valEnd = this.option('end');
        const min = this.option('min');
        const max = this.option('max');
        const rtlEnabled = this.option('rtlEnabled');

        valStart = Math.max(min, Math.min(valStart, max));
        valEnd = Math.max(valStart, Math.min(valEnd, max));

        this._setOptionWithoutOptionChange('start', valStart);
        this._setOptionWithoutOptionChange('end', valEnd);
        this._setOptionWithoutOptionChange('value', [valStart, valEnd]);

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
            case 'value':
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
                    event: this._valueChangeEventInstance
                });

                this.validationRequest.fire({
                    value: [start, end],
                    editor: this
                });

                this._saveValueChangeEvent(undefined);
                break;
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

module.exports = RangeSlider;
