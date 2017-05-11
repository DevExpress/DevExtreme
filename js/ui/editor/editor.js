"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    extend = require("../../core/utils/extend").extend,
    Widget = require("../widget/ui.widget"),
    ValidationMixin = require("../validation/validation_mixin"),
    Overlay = require("../overlay");

var READONLY_STATE_CLASS = "dx-state-readonly",
    INVALID_CLASS = "dx-invalid",
    INVALID_MESSAGE = "dx-invalid-message",
    INVALID_MESSAGE_AUTO = "dx-invalid-message-auto",
    INVALID_MESSAGE_ALWAYS = "dx-invalid-message-always",

    VALIDATION_TARGET = "dx-validation-target",

    VALIDATION_MESSAGE_MIN_WIDTH = 100;

/**
* @name Editor
* @publicName Editor
* @type object
* @inherits Widget
* @module ui/editor/editor
* @export default
* @hidden
*/
var Editor = Widget.inherit({

    _init: function() {
        this.callBase();
        this.validationRequest = $.Callbacks();

        var $element = this.element();

        if($element) {
            $.data($element[0], VALIDATION_TARGET, this);
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name EditorOptions_value
            * @publicName value
            * @type any
            * @default null
            */
            value: null,

            /**
            * @name EditorOptions_name
            * @publicName name
            * @type string
            * @default ""
            * @hidden
            */
            name: "",

                /**
            * @name EditorOptions_onValueChanged
            * @publicName onValueChanged
            * @extends Action
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @type_function_param1_field6 jQueryEvent:jQueryEvent
            * @action
            */
            onValueChanged: null,

            /**
             * @name EditorOptions_readOnly
             * @publicName readOnly
             * @type boolean
             * @default false
             */
            readOnly: false,

            /**
            * @name EditorOptions_isValid
            * @publicName isValid
            * @type boolean
            * @default true
            */
            isValid: true,

            /**
            * @name EditorOptions_validationError
            * @publicName validationError
            * @type object
            * @ref
            * @default undefined
            */
            validationError: null,

            /**
             * @name EditorOptions_validationMessageMode
             * @publicName validationMessageMode
             * @type String
             * @acceptValues 'auto'|'always'
             * @default "auto"
             */
            validationMessageMode: "auto",

            validationBoundary: undefined,

            validationMessageOffset: { h: 0, v: 0 }
        });
    },

    _attachKeyboardEvents: function() {
        if(this.option("readOnly")) {
            return;
        }

        this.callBase();
        this._attachChildKeyboardEvents();
    },

    _attachChildKeyboardEvents: commonUtils.noop,

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            validationError: true
        });
    },

    _createValueChangeAction: function() {
        this._valueChangeAction = this._createActionByOption("onValueChanged", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _suppressValueChangeAction: function() {
        this._valueChangeActionSuppressed = true;
    },

    _resumeValueChangeAction: function() {
        this._valueChangeActionSuppressed = false;
    },

    _render: function() {
        this.callBase();
        this._renderValidationState();
        this._toggleReadOnlyState();
        this._setSubmitElementName(this.option("name"));
    },

    _raiseValueChangeAction: function(value, previousValue) {
        if(!this._valueChangeAction) {
            this._createValueChangeAction();
        }
        this._valueChangeAction(this._valueChangeArgs(value, previousValue));
    },

    _valueChangeArgs: function(value, previousValue) {
        return {
            value: value,
            previousValue: previousValue,
            jQueryEvent: this._valueChangeEventInstance
        };
    },

    _saveValueChangeEvent: function(e) {
        this._valueChangeEventInstance = e;
    },

    _renderValidationState: function() {
        var isValid = this.option("isValid"),
            validationError = this.option("validationError"),
            validationMessageMode = this.option("validationMessageMode"),
            $element = this.element();

        $element.toggleClass(INVALID_CLASS, !isValid);
        this.setAria("invalid", !isValid || undefined);

        if(this._$validationMessage) {
            this._$validationMessage.remove();
            this._$validationMessage = null;
        }

        if(!isValid && validationError && validationError.message) {
            this._$validationMessage = $("<div/>", { "class": INVALID_MESSAGE })
                .html(validationError.message)
                .appendTo($element);

            this._validationMessage = this._createComponent(this._$validationMessage, Overlay, {
                templatesRenderAsynchronously: false,
                target: this._getValidationMessageTarget(),
                shading: false,
                width: 'auto',
                height: 'auto',
                container: $element,
                position: this._getValidationMessagePosition("below"),
                closeOnOutsideClick: false,
                closeOnTargetScroll: false,
                animation: null,
                visible: true,
                propagateOutsideClick: true,
                _checkParentVisibility: false
            });

            this._$validationMessage
                .toggleClass(INVALID_MESSAGE_AUTO, validationMessageMode === "auto")
                .toggleClass(INVALID_MESSAGE_ALWAYS, validationMessageMode === "always");

            this._setValidationMessageMaxWidth();
        }
    },

    _setValidationMessageMaxWidth: function() {
        if(!this._validationMessage) {
            return;
        }

        if(this._getValidationMessageTarget().outerWidth() === 0) {
            this._validationMessage.option("maxWidth", "100%");
            return;
        }

        var validationMessageMaxWidth = Math.max(VALIDATION_MESSAGE_MIN_WIDTH, this._getValidationMessageTarget().outerWidth());
        this._validationMessage.option("maxWidth", validationMessageMaxWidth);
    },

    _getValidationMessageTarget: function() {
        return this.element();
    },

    _getValidationMessagePosition: function(positionRequest) {
        var rtlEnabled = this.option("rtlEnabled"),
            messagePositionSide = getDefaultAlignment(rtlEnabled),
            messageOriginalOffset = this.option("validationMessageOffset"),
            messageOffset = { h: messageOriginalOffset.h, v: messageOriginalOffset.v },
            verticalPositions = positionRequest === "below" ? [" top", " bottom"] : [" bottom", " top"];

        if(rtlEnabled) messageOffset.h = -messageOffset.h;
        if(positionRequest !== "below") messageOffset.v = -messageOffset.v;

        return {
            offset: messageOffset,
            boundary: this.option("validationBoundary"),
            my: messagePositionSide + verticalPositions[0],
            at: messagePositionSide + verticalPositions[1],
            collision: "none flip"
        };
    },

    _toggleReadOnlyState: function() {
        this.element().toggleClass(READONLY_STATE_CLASS, !!this.option("readOnly"));
        this.setAria("readonly", this.option("readOnly") || undefined);
    },

    _dispose: function() {
        var element = this.element()[0];
        $.data(element, VALIDATION_TARGET, null);
        this.callBase();
    },

    _setSubmitElementName: function(name) {
        var $submitElement = this._getSubmitElement();

        if(!$submitElement) {
            return;
        }

        if(name.length > 0) {
            $submitElement.attr("name", name);
        } else {
            $submitElement.removeAttr("name");
        }
    },

    _getSubmitElement: function() {
        return null;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            case "isValid":
            case "validationError":
            case "validationBoundary":
            case "validationMessageMode":
                this._renderValidationState();
                break;
            case "readOnly":
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case "value":
                if(!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(args.value, args.previousValue);
                    this._saveValueChangeEvent(undefined);
                }
                if(args.value != args.previousValue) { // jshint ignore:line
                    this.validationRequest.fire({
                        value: args.value,
                        editor: this
                    });
                }
                break;
            case "width":
                this.callBase(args);
                this._setValidationMessageMaxWidth();
                break;
            case "name":
                this._setSubmitElementName(args.value);
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name EditorMethods_reset
    * @publicName reset()
    */
    reset: function() {
        this.option("value", null);
    }
}).include(ValidationMixin);

module.exports = Editor;
