"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    commonUtils = require("../../core/utils/common"),
    mathUtils = require("../../core/utils/math"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    devices = require("../../core/devices"),
    registerComponent = require("../../core/component_registrator"),
    TextEditor = require("../text_box/ui.text_editor"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    wheelEvent = require("../../events/core/wheel"),
    SpinButton = require("./number_box.spin"),
    messageLocalization = require("../../localization/message");

var math = Math;

var WIDGET_CLASS = "dx-numberbox",
    SPIN_CLASS = "dx-numberbox-spin",
    SPIN_CONTAINER_CLASS = "dx-numberbox-spin-container",
    SPIN_TOUCH_FRIENDLY_CLASS = "dx-numberbox-spin-touch-friendly";

var FIREFOX_CONTROL_KEYS = ["Tab", "Del", "Delete", "Backspace", "Left", "ArrowLeft", "Right", "ArrowRight", "Home", "End", "Enter"];

var NumberBox = TextEditor.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), {
            upArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this._spinUpChangeHandler(e);
            },
            downArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this._spinDownChangeHandler(e);
            },
            enter: function() {}
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxNumberBoxOptions_value
            * @publicName value
            * @type number
            * @default 0
            */
            value: 0,

            /**
            * @name dxNumberBoxOptions_min
            * @publicName min
            * @type number
            * @default undefined
            */
            min: undefined,

            /**
            * @name dxNumberBoxOptions_max
            * @publicName max
            * @type number
            * @default undefined
            */
            max: undefined,

            /**
            * @name dxNumberBoxOptions_step
            * @publicName step
            * @type number
            * @default 1
            */
            step: 1,

            /**
            * @name dxNumberBoxOptions_showSpinButtons
            * @publicName showSpinButtons
            * @type boolean
            * @default false
            */
            showSpinButtons: false,

            /**
            * @name dxNumberBoxOptions_useLargeSpinButtons
            * @publicName useLargeSpinButtons
            * @type boolean
            * @default true
            * @custom_default_for_desktop false
            */
            useLargeSpinButtons: true,

            /**
            * @name dxNumberBoxOptions_mode
            * @publicName mode
            * @type string
            * @default "text"
            * @acceptValues 'text'|'number'
            */
            mode: "text",

            /**
             * @name dxNumberBoxOptions_invalidValueMessage
             * @publicName invalidValueMessage
             * @type string
             * @default "Value must be a number"
             */
            invalidValueMessage: messageLocalization.format("dxNumberBox-invalidValueMessage")

            /**
            * @name dxNumberBoxOptions_mask
            * @publicName mask
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_maskChar
            * @publicName maskChar
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_maskRules
            * @publicName maskRules
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_maskInvalidMessage
            * @publicName maskInvalidMessage
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_useMaskedValue
            * @publicName useMaskedValue
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_showMaskMode
            * @publicName showMaskMode
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxNumberBoxOptions_spellcheck
            * @publicName spellcheck
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().generic && !devices.isSimulator();
                },
                options: {
                    useLargeSpinButtons: false
                }
            },
            {
                device: function() {
                    return devices.real().platform !== "generic";
                },
                options: {
                    /**
                    * @name dxNumberBoxOptions_mode
                    * @publicName mode
                    * @custom_default_for_mobile_devices "number"
                    */
                    mode: "number"
                }
            }
        ]);
    },

    _render: function() {
        this._renderSubmitElement();
        this._setSubmitValue(this.option("value"));
        this.callBase();

        this.option("isValid") && this._validateValue(this.option("value"));
        this.$element().addClass(WIDGET_CLASS);
        this.setAria("role", "spinbutton");
        this._renderMouseWheelHandler();
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.$element());
    },

    _setSubmitValue: function(value) {
        this._$submitElement.val(commonUtils.applyServerDecimalSeparator(value));
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _keyPressHandler: function(e) {
        this.callBase(e);

        var ch = String.fromCharCode(e.which),
            validCharRegExp = /[\d.,eE\-+]/,
            isInputCharValid = validCharRegExp.test(ch);

        if(!isInputCharValid) {
            // NOTE: Additional check for Firefox control keys
            if(e.metaKey || e.ctrlKey || e.key && (inArray(e.key, FIREFOX_CONTROL_KEYS) >= 0)) {
                return;
            }

            e.preventDefault();
            return false;
        }

        this._keyPressed = true;
    },

    _renderMouseWheelHandler: function() {
        var eventName = eventUtils.addNamespace(wheelEvent.name, this.NAME);

        var mouseWheelAction = this._createAction((function(e) {
            this._mouseWheelHandler(e.jQueryEvent);
        }).bind(this));

        eventsEngine.off(this._input(), eventName);
        eventsEngine.on(this._input(), eventName, function(e) {
            mouseWheelAction({ jQueryEvent: e });
        });
    },

    _mouseWheelHandler: function(jQueryEvent) {
        if(!this._input().is(":focus")) {
            return;
        }

        jQueryEvent.delta > 0 ? this._spinValueChange(1, jQueryEvent) : this._spinValueChange(-1, jQueryEvent);
        jQueryEvent.preventDefault();
        jQueryEvent.stopPropagation();
    },

    _renderValue: function() {
        var inputValue = this._input().val();

        if(!inputValue.length || Number(inputValue) !== this.option("value")) {
            this._forceValueRender();
            this._toggleEmptinessEventHandler();
        }

        var value = this.option("value");

        this._renderInputAddons();
        this.setAria("valuenow", value);
    },

    _renderValueEventName: function() {
        return this.callBase() + " keypress";
    },

    _toggleDisabledState: function(value) {
        if(this._$spinUp) {
            SpinButton.getInstance(this._$spinUp).option("disabled", value);
        }

        if(this._$spinDown) {
            SpinButton.getInstance(this._$spinDown).option("disabled", value);
        }

        this.callBase.apply(this, arguments);
    },

    _forceValueRender: function() {
        var value = this.option("value"),
            number = Number(value),
            valueFormat = this.option("valueFormat"),
            formattedValue = isNaN(number) ? "" : valueFormat(value);

        this._renderDisplayText(formattedValue);
    },

    _renderProps: function() {
        this.callBase();

        this._input().prop({
            "min": this.option("min"),
            "max": this.option("max"),
            "step": this.option("step")
        });

        this.setAria({
            "valuemin": this.option("min") || "undefined",
            "valuemax": this.option("max") || "undefined"
        });
    },

    _renderInputAddons: function() {
        this.callBase();
        this._renderSpinButtons();
    },

    _renderSpinButtons: function() {
        var spinButtonsVisible = this.option("showSpinButtons");

        this.$element().toggleClass(SPIN_CLASS, spinButtonsVisible);
        this._toggleTouchFriendlyClass();

        if(!spinButtonsVisible) {
            this._$spinContainer && this._$spinContainer.remove();
            this._$spinContainer = null;
            return;
        }

        if(!this._$spinContainer) {
            this._$spinContainer = this._createSpinButtons();
        }

        this._$spinContainer.prependTo(this._buttonsContainer());
    },

    _toggleTouchFriendlyClass: function() {
        this.$element().toggleClass(SPIN_TOUCH_FRIENDLY_CLASS, this.option("showSpinButtons") && this.option("useLargeSpinButtons"));
    },

    _createSpinButtons: function() {
        var eventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);
        var pointerDownAction = this._createAction(this._spinButtonsPointerDownHandler.bind(this));

        var $spinContainer = $("<div>").addClass(SPIN_CONTAINER_CLASS);

        eventsEngine.off($spinContainer, eventName);
        eventsEngine.on($spinContainer, eventName, function(e) {
            pointerDownAction({ jQueryEvent: e });
        });

        this._$spinUp = $("<div>").appendTo($spinContainer);
        this._createComponent(this._$spinUp, SpinButton, { direction: "up", onChange: this._spinUpChangeHandler.bind(this) });

        this._$spinDown = $("<div>").appendTo($spinContainer);
        this._createComponent(this._$spinDown, SpinButton, { direction: "down", onChange: this._spinDownChangeHandler.bind(this) });

        return $spinContainer;
    },

    _spinButtonsPointerDownHandler: function() {
        var $input = this._input();
        if(!this.option("useLargeSpinButtons") && document.activeElement !== $input[0]) {
            eventsEngine.trigger($input, "focus");
        }
    },

    _spinUpChangeHandler: function(e) {
        if(!this.option("readOnly")) {
            this._spinValueChange(1, e.jQueryEvent || e);
        }
    },

    _spinDownChangeHandler: function(e) {
        if(!this.option("readOnly")) {
            this._spinValueChange(-1, e.jQueryEvent || e);
        }
    },

    _spinValueChange: function(sign, jQueryEvent) {
        var value = parseFloat(this._normalizeInputValue()) || 0,
            step = parseFloat(this.option("step"));

        value = this._correctRounding(value, step * sign);

        var min = this.option("min"),
            max = this.option("max");

        if(min !== undefined) {
            value = Math.max(min, value);
        }

        if(max !== undefined) {
            value = Math.min(max, value);
        }

        this._saveValueChangeEvent(jQueryEvent);
        this.option("value", value);
    },

    _correctRounding: function(value, step) {
        var regex = /[,.](.*)/;
        var isFloatValue = regex.test(value),
            isFloatStep = regex.test(step);

        if(isFloatValue || isFloatStep) {
            var valueAccuracy = (isFloatValue) ? regex.exec(value)[0].length : 0,
                stepAccuracy = (isFloatStep) ? regex.exec(step)[0].length : 0,
                accuracy = math.max(valueAccuracy, stepAccuracy);

            value = this._round(value + step, accuracy);

            return value;
        }

        return value + step;
    },

    _round: function(value, precision) {
        precision = precision || 0;

        var multiplier = Math.pow(10, precision);

        value *= multiplier;
        value = Math.round(value) / multiplier;

        return value;
    },

    _renderValueChangeEvent: function() {
        this.callBase();
        eventsEngine.on(this._input(), "focusout", this._forceRefreshInputValue.bind(this));
    },

    _forceRefreshInputValue: function() {
        if(this.option("mode") === "number") {
            return;
        }

        var $input = this._input(),
            valueFormat = this.option("valueFormat");

        $input.val(null);
        $input.val(valueFormat(this.option("value")));
    },

    _valueChangeEventHandler: function(e) {
        var $input = this._input(),
            inputValue = this._normalizeText(),
            valueFormat = this.option("valueFormat"),
            value = this._parseValue(inputValue),
            valueHasDigits = inputValue !== "." && inputValue !== "-",
            isValueIncomplete = this._isValueIncomplete(inputValue),
            isValueCorrect = this._isValueInRange(inputValue);

        if(this._isValueValid() && !this._validateValue(value)) {
            $input.val(valueFormat(value));
            return;
        }

        if(valueHasDigits) {
            this.callBase(e, isNaN(value) ? null : value);
        }

        if(!isValueIncomplete && !isValueCorrect && value !== null) {
            if(Number(inputValue) !== value) {
                $input.val(valueFormat(value));
            }
        }

        this.validationRequest.fire({
            value: value,
            editor: this
        });
    },

    _replaceCommaWithPoint: function(value) {
        return value.replace(",", ".");
    },

    _inputIsInvalid: function() {
        var isNumberMode = this.option("mode") === "number";
        var validityState = this._input().get(0).validity;

        return isNumberMode && validityState && validityState.badInput;
    },

    _renderDisplayText: function(text) {
        if(this._inputIsInvalid()) {
            return;
        }

        this.callBase(text);
    },

    _isValueIncomplete: function(value) {
        var incompleteRegex = /(^-$)|(^-?\d*\.$)|(\d+e-?$)/i;
        return incompleteRegex.test(value);
    },

    _isValueInRange: function(value) {
        return mathUtils.inRange(value, this.option("min"), this.option("max"));
    },

    _isNumber: function(value) {
        return this._parseValue(value) !== null;
    },

    _validateValue: function(value) {
        var inputValue = this._normalizeText(),
            isValueValid = this._isValueValid(),
            isValid = true,
            isNumber = this._isNumber(inputValue);

        if(isNaN(Number(value))) {
            isValid = false;
        }

        if(!value && isValueValid) {
            isValid = true;
        } else if(!isNumber && !isValueValid) {
            isValid = false;
        }

        this.option({
            isValid: isValid,
            validationError: isValid ? null : {
                editorSpecific: true,
                message: this.option("invalidValueMessage")
            }
        });

        return isValid;
    },

    _normalizeInputValue: function() {
        return this._parseValue(this._normalizeText());
    },

    _normalizeText: function() {
        var value = this._input().val().trim();

        return this._replaceCommaWithPoint(value);
    },

    _parseValue: function(value) {
        var number = parseFloat(value);

        if(isNaN(number)) {
            return null;
        }

        return mathUtils.fitIntoRange(number, this.option("min"), this.option("max"));
    },

    _clean: function() {
        delete this._$spinContainer;
        delete this._$spinUp;
        delete this._$spinDown;
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                this._validateValue(args.value);
                this._setSubmitValue(args.value);
                this.callBase(args);
                this._resumeValueChangeAction();
                break;
            case "step":
            case "min":
            case "max":
                this._renderProps();
                break;
            case "showSpinButtons":
                this._renderInputAddons();
                break;
            case "useLargeSpinButtons":
                this._toggleTouchFriendlyClass();
                break;
            case "invalidValueMessage":
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxNumberBox", NumberBox);

module.exports = NumberBox;
