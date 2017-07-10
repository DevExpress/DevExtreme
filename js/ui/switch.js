"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    devices = require("../core/devices"),
    extend = require("../core/utils/extend").extend,
    inkRipple = require("./widget/utils.ink_ripple"),
    registerComponent = require("../core/component_registrator"),
    Editor = require("./editor/editor"),
    eventUtils = require("../events/utils"),
    feedbackEvents = require("../events/core/emitter.feedback"),
    themes = require("./themes"),
    fx = require("../animation/fx"),
    messageLocalization = require("../localization/message"),
    clickEvent = require("../events/click"),
    Swipeable = require("../events/gesture/swipeable");

var SWITCH_CLASS = "dx-switch",
    SWITCH_WRAPPER_CLASS = SWITCH_CLASS + "-wrapper",
    SWITCH_CONTAINER_CLASS = SWITCH_CLASS + "-container",
    SWITCH_INNER_CLASS = SWITCH_CLASS + "-inner",
    SWITCH_HANDLE_CLASS = SWITCH_CLASS + "-handle",
    SWITCH_ON_VALUE_CLASS = SWITCH_CLASS + "-on-value",
    SWITCH_ON_CLASS = SWITCH_CLASS + "-on",
    SWITCH_OFF_CLASS = SWITCH_CLASS + "-off",

    SWITCH_ANIMATION_DURATION = 100;

/**
* @name dxSwitch
* @isEditor
* @publicName dxSwitch
* @inherits Editor
* @groupName Editors
* @module ui/switch
* @export default
*/
var Switch = Editor.inherit({
    _supportedKeys: function() {
        var isRTL = this.option("rtlEnabled");

        var click = function(e) {
                e.preventDefault();
                this._clickAction({ jQueryEvent: e });
            },
            move = function(value, e) {
                e.preventDefault();
                e.stopPropagation();
                this._animateValue(value);
            };
        return extend(this.callBase(), {
            space: click,
            enter: click,
            leftArrow: move.bind(this, isRTL ? true : false),
            rightArrow: move.bind(this, isRTL ? false : true)
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxSwitchOptions_hoverStateEnabled
            * @publicName hoverStateEnabled
            * @type boolean
            * @default true
            * @extend_doc
            */
            hoverStateEnabled: true,

            /**
            * @name dxSwitchOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default true
            * @extend_doc
            */
            activeStateEnabled: true,

            /**
            * @name dxSwitchOptions_onText
            * @publicName onText
            * @type string
            * @default "ON"
            */
            onText: messageLocalization.format("dxSwitch-onText"),

            /**
            * @name dxSwitchOptions_offText
            * @publicName offText
            * @type string
            * @default "OFF"
            */
            offText: messageLocalization.format("dxSwitch-offText"),

            /**
            * @name dxSwitchOptions_value
            * @publicName value
            * @type boolean
            * @default false
            */
            value: false,

            useInkRipple: false,

            useOldRendering: false

                /**
                * @name dxSwitchOptions_name
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
                    * @name dxSwitchOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
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
            },
            {
                device: function() {
                    var device = devices.real();
                    return (device.platform === "android") && (device.version[0] < 4 || (device.version[0] === 4 && device.version[1] < 4));
                },
                options: {
                    useOldRendering: true
                }
            }
        ]);
    },

    _feedbackHideTimeout: 0,
    _animating: false,

    _render: function() {
        this._renderSwitchInner();
        this._renderLabels();
        this._renderContainers();
        this.option("useInkRipple") && this._renderInkRipple();

        this.element()
            .addClass(SWITCH_CLASS)
            .append(this._$switchWrapper);

        this.setAria("role", "button");

        this._renderSubmitElement();
        this._renderSwipeable();

        this.callBase();

        this._handleWidth = parseFloat(window.getComputedStyle(this._$handle.get(0)).width);
        this._getHandleOffset = this.option("useOldRendering") ? this._getPixelOffset : this._getCalcOffset;
        this._renderValue();
        this._renderClick();
    },

    _getCalcOffset: function(value, offset) {
        var ratio = offset - Number(!value);
        return "calc(" + 100 * ratio + "% + " + -this._handleWidth * ratio + "px)";
    },

    _getPixelOffset: function(value, offset) {
        return this._getMarginBound() * (offset - Number(!value));
    },

    _renderSwitchInner: function() {
        this._$switchInner = $("<div>").addClass(SWITCH_INNER_CLASS);
        this._$handle = $("<div>")
            .addClass(SWITCH_HANDLE_CLASS)
            .appendTo(this._$switchInner);
    },

    _renderLabels: function() {
        this._$labelOn = $("<div>")
            .addClass(SWITCH_ON_CLASS)
            .prependTo(this._$switchInner);

        this._$labelOff = $("<div>")
            .addClass(SWITCH_OFF_CLASS)
            .appendTo(this._$switchInner);

        this._setLabelsText();
    },

    _renderContainers: function() {
        this._$switchContainer = $("<div>")
            .addClass(SWITCH_CONTAINER_CLASS)
            .append(this._$switchInner);

        this._$switchWrapper = $("<div>")
            .addClass(SWITCH_WRAPPER_CLASS)
            .append(this._$switchContainer);
    },

    _renderSwipeable: function() {
        this._createComponent(this.element(), Swipeable, {
            elastic: false,
            immediate: true,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._getMarginBound.bind(this)
        });
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
            waveSizeCoefficient: 1.7,
            isCentered: true,
            useHoldAnimation: false,
            wavesNumber: 2
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

    _updateFocusState: function(e, value) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$handle, e, value, 0);
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$handle, e, value, 1);
    },

    _getMarginBound: function() {
        if(!this._marginBound) {
            this._marginBound = this._$switchContainer.outerWidth(true) - this._handleWidth;
        }
        return this._marginBound;
    },

    _marginDirection: function() {
        return this.option("rtlEnabled") ? "Right" : "Left";
    },

    _offsetDirection: function() {
        return this.option("rtlEnabled") ? -1 : 1;
    },

    _renderPosition: function(state, swipeOffset) {
        var marginDirection = this._marginDirection(),
            resetMarginDirection = marginDirection === "Left" ? "Right" : "Left";

        this._$switchInner.css("margin" + marginDirection, this._getHandleOffset(state, swipeOffset));
        this._$switchInner.css("margin" + resetMarginDirection, 0);
    },

    _validateValue: function() {
        var check = this.option("value");
        if(typeof check !== "boolean") {
            this._options["value"] = !!check;
        }
    },

    _renderClick: function() {
        var eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);
        var $element = this.element();
        this._clickAction = this._createAction(this._clickHandler.bind(this));

        eventsEngine.off($element, eventName);
        eventsEngine.on($element, eventName, (function(e) {
            this._clickAction({ jQueryEvent: e });
        }).bind(this));
    },

    _clickHandler: function(args) {
        var e = args.jQueryEvent;

        this._saveValueChangeEvent(e);

        if(this._animating || this._swiping) {
            return;
        }

        this._animateValue(!this.option("value"));
    },

    _animateValue: function(value) {
        var startValue = this.option("value"),
            endValue = value;

        if(startValue === endValue) {
            return;
        }

        this._animating = true;

        var that = this,
            marginDirection = this._marginDirection(),
            resetMarginDirection = marginDirection === "Left" ? "Right" : "Left",
            fromConfig = {},
            toConfig = {};

        this._$switchInner.css("margin" + resetMarginDirection, 0);
        fromConfig["margin" + marginDirection] = this._getHandleOffset(startValue, 0);
        toConfig["margin" + marginDirection] = this._getHandleOffset(endValue, 0);

        fx.animate(this._$switchInner, {
            from: fromConfig,
            to: toConfig,
            duration: SWITCH_ANIMATION_DURATION,
            complete: function() {
                that._animating = false;
                that.option("value", endValue);
            }
        });
    },

    _swipeStartHandler: function(e) {
        var state = this.option("value"),
            rtlEnabled = this.option("rtlEnabled"),
            maxOffOffset = rtlEnabled ? 0 : 1,
            maxOnOffset = rtlEnabled ? 1 : 0;

        e.jQueryEvent.maxLeftOffset = state ? maxOffOffset : maxOnOffset;
        e.jQueryEvent.maxRightOffset = state ? maxOnOffset : maxOffOffset;
        this._swiping = true;

        this._feedbackDeferred = $.Deferred();
        feedbackEvents.lock(this._feedbackDeferred);
        this._toggleActiveState(this.element(), this.option("activeStateEnabled"));
    },

    _swipeUpdateHandler: function(e) {
        this._renderPosition(this.option("value"), this._offsetDirection() * e.jQueryEvent.offset);
    },

    _swipeEndHandler: function(e) {
        var that = this,
            offsetDirection = this._offsetDirection(),
            toConfig = {};

        toConfig["margin" + this._marginDirection()] = this._getHandleOffset(that.option("value"), offsetDirection * e.jQueryEvent.targetOffset);

        fx.animate(this._$switchInner, {
            to: toConfig,
            duration: SWITCH_ANIMATION_DURATION,
            complete: function() {
                that._swiping = false;
                var pos = that.option("value") + offsetDirection * e.jQueryEvent.targetOffset;
                that.option("value", Boolean(pos));
                that._feedbackDeferred.resolve();
                that._toggleActiveState(that.element(), false);
            }
        });
    },

    _renderValue: function() {
        this._validateValue();

        var val = this.option("value");
        this._renderPosition(val, 0);

        this.element().toggleClass(SWITCH_ON_VALUE_CLASS, val);
        this._$submitElement.val(val);
        this.setAria({
            "pressed": val,
            "label": val ? this.option("onText") : this.option("offText")
        });
    },

    _setLabelsText: function() {
        this._$labelOn.text(this.option("onText"));
        this._$labelOff.text(this.option("offText"));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "useOldRendering":
            case "useInkRipple":
                this._invalidate();
                break;
            case "width":
                delete this._marginBound;
                this._refresh();
                break;
            case "onText":
            case "offText":
                this._setLabelsText();
                break;
            case "value":
                this._renderValue();
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxSwitch", Switch);

module.exports = Switch;
