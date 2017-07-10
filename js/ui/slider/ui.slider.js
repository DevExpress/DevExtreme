"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    domUtils = require("../../core/utils/dom"),
    numberLocalization = require("../../localization/number"),
    devices = require("../../core/devices"),
    extend = require("../../core/utils/extend").extend,
    applyServerDecimalSeparator = require("../../core/utils/common").applyServerDecimalSeparator,
    registerComponent = require("../../core/component_registrator"),
    TrackBar = require("../track_bar"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    feedbackEvents = require("../../events/core/emitter.feedback"),
    SliderHandle = require("./ui.slider_handle"),
    inkRipple = require("../widget/utils.ink_ripple"),
    clickEvent = require("../../events/click"),
    Swipeable = require("../../events/gesture/swipeable"),
    themes = require("../themes");

var SLIDER_CLASS = "dx-slider",
    SLIDER_WRAPPER_CLASS = "dx-slider-wrapper",
    SLIDER_HANDLE_SELECTOR = ".dx-slider-handle",
    SLIDER_BAR_CLASS = "dx-slider-bar",
    SLIDER_RANGE_CLASS = "dx-slider-range",
    SLIDER_RANGE_VISIBLE_CLASS = "dx-slider-range-visible",
    SLIDER_LABEL_CLASS = "dx-slider-label",
    SLIDER_LABEL_POSITION_CLASS_PREFIX = "dx-slider-label-position-",
    SLIDER_TOOLTIP_POSITION_CLASS_PREFIX = "dx-slider-tooltip-position-";

var Slider = TrackBar.inherit({

    _activeStateUnit: SLIDER_HANDLE_SELECTOR,

    _supportedKeys: function() {
        var isRTL = this.option("rtlEnabled");

        var that = this;
        var roundedValue = function(offset, isLeftDirection) {
            offset = that._valueStep(offset);
            var step = that.option("step");
            var value = that.option("value");

            var division = (value - that.option("min")) % step;
            var result = isLeftDirection
                ? value - offset + (division ? step - division : 0)
                : value + offset - division;

            var min = that.option("min"),
                max = that.option("max");

            if(result < min) {
                result = min;
            } else if(result > max) {
                result = max;
            }

            return result;
        };

        var moveHandleRight = function(offset) {
            that.option("value", roundedValue(offset, isRTL));
        };
        var moveHandleLeft = function(offset) {
            that.option("value", roundedValue(offset, !isRTL));
        };

        return extend(this.callBase(), {
            leftArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleLeft(this.option("step"));
            },
            rightArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleRight(this.option("step"));
            },
            pageUp: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleRight(this.option("step") * this.option("keyStep"));
            },
            pageDown: function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveHandleLeft(this.option("step") * this.option("keyStep"));
            },
            home: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var min = this.option("min");
                this.option("value", min);
            },
            end: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var max = this.option("max");
                this.option("value", max);
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name dxSliderOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxSliderOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default true
            * @extend_doc
            */

            activeStateEnabled: true,

            /**
            * @name dxSliderOptions_step
            * @publicName step
            * @type number
            * @default 1
            */
            step: 1,

            /**
            * @name dxSliderOptions_value
            * @publicName value
            * @type number
            * @default 50
            */
            value: 50,

            /**
            * @name dxSliderOptions_showRange
            * @publicName showRange
            * @type boolean
            * @default true
            */
            showRange: true,

            /**
            * @name dxSliderOptions_tooltip
            * @publicName tooltip
            * @type object
            */
            tooltip: {
                /**
                * @name dxSliderOptions_tooltip_enabled
                * @publicName enabled
                * @type boolean
                * @default false
                */
                enabled: false,

                /**
                * @name dxSliderOptions_tooltip_format
                * @publicName format
                * @type format
                * @default function(value) { return value }
                */
                format: function(value) {
                    return value;
                },

                /**
                * @name dxSliderOptions_tooltip_position
                * @publicName position
                * @type string
                * @acceptValues 'top'|'bottom'
                * @default 'top'
                */
                position: "top",

                /**
                * @name dxSliderOptions_tooltip_showMode
                * @publicName showMode
                * @type string
                * @acceptValues 'onHover'|'always'
                * @default 'onHover'
                */
                showMode: "onHover"
            },

            /**
            * @name dxSliderOptions_label
            * @publicName label
            * @type object
            */
            label: {
                /**
                * @name dxSliderOptions_label_visible
                * @publicName visible
                * @type boolean
                * @default false
                */
                visible: false,

                /**
                * @name dxSliderOptions_label_position
                * @publicName position
                * @type string
                * @acceptValues 'top'|'bottom'
                * @default 'bottom'
                */
                position: "bottom",

                /**
                * @name dxSliderOptions_label_format
                * @publicName format
                * @type format
                * @default function(value) { return value }
                */
                format: function(value) {
                    return value;
                }
            },

            /**
           * @name dxSliderOptions_keyStep
           * @publicName keyStep
           * @type number
           * @default 1
           */
            keyStep: 1,

            useInkRipple: false

            /**
            * @name dxSliderOptions_name
            * @publicName name
            * @type string
            * @hidden false
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxSliderOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _render: function() {
        this.element().addClass(SLIDER_CLASS);
        this._renderSubmitElement();

        this.callBase();

        this._renderLabels();
        this._renderStartHandler();
        this._renderAriaMinAndMax();

        this._repaintHandle();
        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.element());
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render({
            waveSizeCoefficient: 0.7,
            isCentered: true,
            wavesNumber: 2,
            useHoldAnimation: false
        });
    },

    _renderInkWave: function(element, jQueryEvent, doRender, waveIndex) {
        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: element,
            jQueryEvent: jQueryEvent,
            wave: waveIndex
        };

        if(doRender) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _visibilityChanged: function() {
        this.repaint();
    },

    _renderWrapper: function() {
        this.callBase();
        this._$wrapper.addClass(SLIDER_WRAPPER_CLASS);

        this._createComponent(this._$wrapper, Swipeable, {
            elastic: false,
            immediate: true,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._itemWidthFunc.bind(this)
        });
    },

    _renderContainer: function() {
        this.callBase();
        this._$bar.addClass(SLIDER_BAR_CLASS);
    },

    _renderRange: function() {
        this.callBase();
        this._$range.addClass(SLIDER_RANGE_CLASS);

        this._renderHandle();

        this._renderRangeVisibility();
    },

    _renderRangeVisibility: function() {
        this._$range.toggleClass(SLIDER_RANGE_VISIBLE_CLASS, Boolean(this.option("showRange")));
    },

    _renderHandle: function() {
        this._$handle = this._renderHandleImpl(this.option("value"), this._$handle);
    },

    _renderHandleImpl: function(value, $element) {
        var $handle = $element || $("<div>").appendTo(this._$range),
            format = this.option("tooltip.format"),
            tooltipEnabled = this.option("tooltip.enabled"),
            tooltipPosition = this.option("tooltip.position");

        this.element()
            .toggleClass(SLIDER_TOOLTIP_POSITION_CLASS_PREFIX + "bottom", tooltipEnabled && tooltipPosition === "bottom")
            .toggleClass(SLIDER_TOOLTIP_POSITION_CLASS_PREFIX + "top", tooltipEnabled && tooltipPosition === "top");

        this._createComponent($handle, SliderHandle, {
            value: value,
            tooltipEnabled: tooltipEnabled,
            tooltipPosition: tooltipPosition,
            tooltipFormat: format,
            tooltipShowMode: this.option("tooltip.showMode"),
            tooltipFitIn: this.element()
        });

        return $handle;
    },

    _renderAriaMinAndMax: function() {
        this.setAria({
            "valuemin": this.option("min"),
            "valuemax": this.option("max")
        }, this._$handle);
    },

    _hoverStartHandler: function(e) {
        SliderHandle.getInstance($(e.currentTarget)).updateTooltip();
    },

    _toggleActiveState: function($element, value) {
        this.callBase($element, value);

        if(value) {
            SliderHandle.getInstance($element).updateTooltip();
        }

        this._renderInkWave($element, null, !!value, 1);
    },

    _toggleFocusClass: function(isFocused, $element) {
        this.callBase(isFocused, $element);

        if(this._disposed) {
            return;
        }

        var $focusTarget = $($element || this._focusTarget());
        this._renderInkWave($focusTarget, null, isFocused, 0);
    },

    _renderLabels: function() {
        this.element()
            .removeClass(SLIDER_LABEL_POSITION_CLASS_PREFIX + "bottom")
            .removeClass(SLIDER_LABEL_POSITION_CLASS_PREFIX + "top");

        if(this.option("label.visible")) {
            var min = this.option("min"),
                max = this.option("max"),
                position = this.option("label.position"),
                labelFormat = this.option("label.format");

            if(!this._$minLabel) {
                this._$minLabel = $("<div>")
                    .addClass(SLIDER_LABEL_CLASS)
                    .appendTo(this._$wrapper);
            }

            this._$minLabel.html(numberLocalization.format(min, labelFormat));

            if(!this._$maxLabel) {
                this._$maxLabel = $("<div>")
                    .addClass(SLIDER_LABEL_CLASS)
                    .appendTo(this._$wrapper);
            }

            this._$maxLabel.html(numberLocalization.format(max, labelFormat));

            this.element().addClass(SLIDER_LABEL_POSITION_CLASS_PREFIX + position);

        } else {
            if(this._$minLabel) {
                this._$minLabel.remove();
                delete this._$minLabel;
            }

            if(this._$maxLabel) {
                this._$maxLabel.remove();
                delete this._$maxLabel;
            }
        }
    },

    _renderDimensions: function() {
        this.callBase();
        if(this._$bar) {
            var barMarginWidth = this._$bar.outerWidth(true) - this._$bar.outerWidth();
            this._$bar.width(this.option("width") - barMarginWidth);
        }
    },

    _renderStartHandler: function() {
        var pointerDownEventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);
        var clickEventName = eventUtils.addNamespace(clickEvent.name, this.NAME);
        var startAction = this._createAction(this._startHandler.bind(this));
        var $element = this.element();

        eventsEngine.off($element, pointerDownEventName);
        eventsEngine.on($element, pointerDownEventName, function(e) {
            if(eventUtils.isMouseEvent(e)) {
                startAction({ jQueryEvent: e });
            }
        });
        eventsEngine.off($element, clickEventName);
        eventsEngine.on($element, clickEventName, (function(e) {
            var handle = this._activeHandle();
            handle && handle.focusin() && handle.focus();
            startAction({ jQueryEvent: e });
        }).bind(this));
    },

    _itemWidthFunc: function() {
        return this._itemWidthRatio;
    },

    _swipeStartHandler: function(e) {
        var rtlEnabled = this.option("rtlEnabled"),
            startOffset,
            endOffset;

        if(eventUtils.isTouchEvent(e.jQueryEvent)) {
            this._createAction(this._startHandler.bind(this))({ jQueryEvent: e.jQueryEvent });
        }

        this._feedbackDeferred = $.Deferred();
        feedbackEvents.lock(this._feedbackDeferred);
        this._toggleActiveState(this._activeHandle(), this.option("activeStateEnabled"));

        this._startOffset = this._currentRatio;
        startOffset = this._startOffset * this._swipePixelRatio();
        endOffset = (1 - this._startOffset) * this._swipePixelRatio();
        e.jQueryEvent.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
        e.jQueryEvent.maxRightOffset = rtlEnabled ? startOffset : endOffset;

        this._itemWidthRatio = this.element().width() / this._swipePixelRatio();

        this._needPreventAnimation = true;
    },

    _swipeEndHandler: function(e) {
        this._feedbackDeferred.resolve();
        this._toggleActiveState(this._activeHandle(), false);

        var offsetDirection = this.option("rtlEnabled") ? -1 : 1;
        delete this._needPreventAnimation;
        this._changeValueOnSwipe(this._startOffset + offsetDirection * e.jQueryEvent.targetOffset / this._swipePixelRatio());
        delete this._startOffset;
        this._renderValue();
    },

    _activeHandle: function() {
        return this._$handle;
    },

    _swipeUpdateHandler: function(e) {
        this._saveValueChangeEvent(e);
        this._updateHandlePosition(e);
    },

    _updateHandlePosition: function(e) {
        var offsetDirection = this.option("rtlEnabled") ? -1 : 1;

        var newRatio = this._startOffset + offsetDirection * e.jQueryEvent.offset / this._swipePixelRatio();

        this._$range.width(newRatio * 100 + "%");

        SliderHandle.getInstance(this._activeHandle())["fitTooltipPosition"];

        this._changeValueOnSwipe(newRatio);
    },

    _swipePixelRatio: function() {
        var min = this.option("min"),
            max = this.option("max"),
            step = this._valueStep(this.option("step"));

        return (max - min) / step;
    },

    _valueStep: function(step) {
        if(!step || isNaN(step)) {
            step = 1;
        }

        step = parseFloat(step.toFixed(5));
        //TODO or exception?
        if(step === 0) {
            step = 0.00001;
        }

        return step;
    },

    _changeValueOnSwipe: function(ratio) {
        var min = this.option("min"),
            max = this.option("max"),
            step = this._valueStep(this.option("step")),
            newChange = ratio * (max - min),
            newValue = min + newChange;

        if(step < 0) {
            return;
        }

        if(newValue === max || newValue === min) {
            this._setValueOnSwipe(newValue);
        } else {
            var stepExponent = (step + "").split(".")[1];
            var minExponent = (min + "").split(".")[1];
            var exponentLength = Math.max(
                stepExponent && stepExponent.length || 0,
                minExponent && minExponent.length || 0
            );
            var stepCount = Math.round((newValue - min) / step);

            newValue = Number((stepCount * step + min).toFixed(exponentLength));
            this._setValueOnSwipe(Math.max(Math.min(newValue, max), min));
        }
    },

    _setValueOnSwipe: function(value) {
        this.option("value", value);
    },

    _startHandler: function(args) {
        var e = args.jQueryEvent;

        this._currentRatio = (eventUtils.eventData(e).x - this._$bar.offset().left) / this._$bar.width();

        if(this.option("rtlEnabled")) {
            this._currentRatio = 1 - this._currentRatio;
        }

        this._saveValueChangeEvent(e);
        this._changeValueOnSwipe(this._currentRatio);
    },

    _renderValue: function() {
        this.callBase();

        var value = this.option("value");

        this._$submitElement.val(applyServerDecimalSeparator(value));
        SliderHandle.getInstance(this._activeHandle()).option("value", value);
    },

    _setRangeStyles: function(options) {
        this._$range.css(options);
    },

    _callHandlerMethod: function(name, args) {
        SliderHandle.getInstance(this._$handle)[name](args);
    },

    _repaintHandle: function() {
        this._callHandlerMethod("repaint");
    },

    _fitTooltip: function() {
        this._callHandlerMethod("fitTooltipPosition");
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "visible":
                this.callBase(args);
                this._renderHandle();
                this._repaintHandle();
                domUtils.triggerShownEvent(this.element()); // TODO: move firing dxshown event to Widget
                break;
            case "min":
            case "max":
                this._renderLabels();
                this._renderAriaMinAndMax();
                this.callBase(args);
                this._fitTooltip();
                break;
            case "step":
                this._renderValue();
                break;
            case "keyStep":
                break;
            case "showRange":
                this._renderRangeVisibility();
                break;
            case "tooltip":
                this._renderHandle();
                break;
            case "label":
                this._renderLabels();
                break;
            case "rtlEnabled":
                this._toggleRTLDirection();
                this._renderValue();
                break;
            case "useInkRipple":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _refresh: function() {
        this._renderDimensions();
        this._renderValue();
        this._renderHandle();
        this._repaintHandle();
    }
});

registerComponent("dxSlider", Slider);

module.exports = Slider;
