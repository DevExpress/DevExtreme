import $ from "../../core/renderer";
import domAdapter from "../../core/dom_adapter";
import eventsEngine from "../../events/core/events_engine";
import domUtils from "../../core/utils/dom";
import { focused } from "../widget/selectors";
import { isDefined } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { inArray } from "../../core/utils/array";
import { each } from "../../core/utils/iterator";
import themes from "../themes";
import Editor from "../editor/editor";
import eventUtils from "../../events/utils";
import pointerEvents from "../../events/pointer";
import ClearButton from "./ui.text_editor.clear";
import TextEditorButtonCollection from "./texteditor_button_collection/index";
import config from "../../core/config";
import errors from "../widget/ui.errors";
import { Deferred } from "../../core/utils/deferred";
import LoadIndicator from "../load_indicator";

const TEXTEDITOR_CLASS = "dx-texteditor",
    TEXTEDITOR_INPUT_CONTAINER_CLASS = "dx-texteditor-input-container",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",
    TEXTEDITOR_INPUT_SELECTOR = "." + TEXTEDITOR_INPUT_CLASS,
    TEXTEDITOR_CONTAINER_CLASS = "dx-texteditor-container",
    TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container",
    TEXTEDITOR_PLACEHOLDER_CLASS = "dx-placeholder",
    TEXTEDITOR_EMPTY_INPUT_CLASS = "dx-texteditor-empty",
    TEXTEDITOR_STYLING_MODE_PREFIX = "dx-editor-",
    ALLOWED_STYLE_CLASSES = [
        TEXTEDITOR_STYLING_MODE_PREFIX + "outlined",
        TEXTEDITOR_STYLING_MODE_PREFIX + "filled",
        TEXTEDITOR_STYLING_MODE_PREFIX + "underlined"
    ],

    STATE_INVISIBLE_CLASS = "dx-state-invisible",
    TEXTEDITOR_PENDING_INDICATOR_CLASS = "dx-pending-indicator",
    TEXTEDITOR_VALIDATION_PENDING_CLASS = "dx-validation-pending",
    TEXTEDITOR_VALID_CLASS = "dx-valid";

const EVENTS_LIST = [
    "KeyDown", "KeyPress", "KeyUp",
    "Change", "Cut", "Copy", "Paste", "Input"
];

const CONTROL_KEYS = [
    "tab",
    "enter",
    "shift",
    "control",
    "alt",
    "escape",
    "pageUp",
    "pageDown",
    "end",
    "home",
    "leftArrow",
    "upArrow",
    "rightArrow",
    "downArrow",
];

function checkButtonsOptionType(buttons) {
    if(isDefined(buttons) && !Array.isArray(buttons)) {
        throw errors.Error("E1053");
    }
}

/**
* @name dxTextEditor
* @inherits Editor
* @hidden
*/
const TextEditorBase = Editor.inherit({
    ctor: function(_, options) {
        if(options) {
            checkButtonsOptionType(options.buttons);
        }

        this._buttonCollection = new TextEditorButtonCollection(this, this._getDefaultButtons());

        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;

        this.callBase.apply(this, arguments);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTextEditorButton
            * @type object
            */
            /**
            * @name dxTextEditorButton.name
            * @type string
            * @default undefined
            */
            /**
            /**
            * @name dxTextEditorButton.location
            * @type Enums.TextEditorButtonLocation
            * @default "after"
            */
            /**
            * @name dxTextEditorButton.options
            * @type dxButtonOptions
            * @default undefined
            */

            /**
            * @name dxTextEditorOptions.buttons
            * @type Array<string, Enums.TextBoxButtonName, dxTextEditorButton>
            * @default undefined
            */
            buttons: void 0,

            /**
            * @name dxTextEditorOptions.value
            * @type any
            * @default ""
            */
            value: "",

            /**
            * @name dxTextEditorOptions.spellcheck
            * @type boolean
            * @default false
            */
            spellcheck: false,

            /**
            * @name dxTextEditorOptions.showClearButton
            * @type boolean
            * @default false
            */
            showClearButton: false,

            /**
            * @name dxTextEditorOptions.valueChangeEvent
            * @type string
            * @default "change"
            */
            valueChangeEvent: "change",

            /**
            * @name dxTextEditorOptions.placeholder
            * @type string
            * @default ""
            */
            placeholder: "",

            /**
            * @name dxTextEditorOptions.inputAttr
            * @type object
            * @default {}
            */
            inputAttr: {},

            /**
            * @name dxTextEditorOptions.onFocusIn
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onFocusIn: null,

            /**
            * @name dxTextEditorOptions.onFocusOut
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onFocusOut: null,

            /**
            * @name dxTextEditorOptions.onKeyDown
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @default null
            * @action
            */
            onKeyDown: null,

            /**
            * @name dxTextEditorOptions.onKeyPress
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @deprecated
            * @action
            */
            onKeyPress: null,

            /**
            * @name dxTextEditorOptions.onKeyUp
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onKeyUp: null,

            /**
            * @name dxTextEditorOptions.onChange
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onChange: null,

            /**
            * @name dxTextEditorOptions.onInput
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onInput: null,

            /**
            * @name dxTextEditorOptions.onCut
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onCut: null,

            /**
            * @name dxTextEditorOptions.onCopy
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onCopy: null,

            /**
            * @name dxTextEditorOptions.onPaste
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onPaste: null,

            /**
            * @name dxTextEditorOptions.onEnterKey
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onEnterKey: null,

            mode: "text",

            /**
             * @name dxTextEditorOptions.hoverStateEnabled
             * @type boolean
             * @default true
             */
            hoverStateEnabled: true,

            /**
             * @name dxTextEditorOptions.focusStateEnabled
             * @type boolean
             * @default true
             */
            focusStateEnabled: true,

            /**
            * @name dxTextEditorOptions.text
            * @type string
            * @readonly
            */
            text: undefined,

            displayValueFormatter: function(value) {
                return isDefined(value) && value !== false ? value : "";
            },

            /**
            * @name dxTextEditorOptions.name
            * @type string
            * @hidden false
            */

            /**
            * @name dxTextEditorOptions.stylingMode
            * @type Enums.EditorStylingMode
            * @default 'outlined'
            */
            stylingMode: config().editorStylingMode || "outlined"
        });
    },

    _defaultOptionsRules: function() {
        var themeName = themes.current();

        return this.callBase().concat([
            {
                device: function() {
                    return themes.isMaterial(themeName);
                },
                options: {
                    /**
                    * @name dxTextEditorOptions.stylingMode
                    * @default 'underlined' @for Material
                    */
                    stylingMode: config().editorStylingMode || "underlined"
                }
            }
        ]);
    },

    _getDefaultButtons: function() {
        return [{ name: "clear", Ctor: ClearButton }];
    },

    _isClearButtonVisible: function() {
        return this.option("showClearButton") && !this.option("readOnly");
    },

    _input: function() {
        return this.$element().find(TEXTEDITOR_INPUT_SELECTOR).first();
    },

    _isFocused: function() {
        return focused(this._input()) || this.callBase();
    },

    _inputWrapper: function() {
        return this.$element();
    },

    _buttonsContainer: function() {
        return this._inputWrapper().find("." + TEXTEDITOR_BUTTONS_CONTAINER_CLASS).eq(0);
    },

    _isControlKey: function(key) {
        return CONTROL_KEYS.indexOf(key) !== -1;
    },

    _renderStylingMode: function() {
        const optionName = "stylingMode";
        const optionValue = this.option(optionName);
        ALLOWED_STYLE_CLASSES.forEach(className => this.$element().removeClass(className));

        let stylingModeClass = TEXTEDITOR_STYLING_MODE_PREFIX + optionValue;

        if(ALLOWED_STYLE_CLASSES.indexOf(stylingModeClass) === -1) {
            const defaultOptionValue = this._getDefaultOptions()[optionName];
            const platformOptionValue = this._convertRulesToOptions(this._defaultOptionsRules())[optionName];
            stylingModeClass = TEXTEDITOR_STYLING_MODE_PREFIX + (platformOptionValue || defaultOptionValue);
        }

        this.$element().addClass(stylingModeClass);

        this._updateButtonsStyling(optionValue);
    },

    _initMarkup: function() {
        this.$element()
            .addClass(TEXTEDITOR_CLASS);

        this._renderInput();
        this._renderStylingMode();
        this._renderInputType();
        this._renderPlaceholder();

        this._renderProps();

        this.callBase();

        this._renderValue();
    },

    _render: function() {
        this._renderPlaceholder();
        this._refreshValueChangeEvent();
        this._renderEvents();

        this._renderEnterKeyAction();
        this._renderEmptinessEvent();
        this._checkKeyPressSubscriptions();
        this.callBase();
    },

    _renderInput: function() {
        this._$textEditorContainer = $("<div>")
            .addClass(TEXTEDITOR_CONTAINER_CLASS)
            .appendTo(this.$element());

        this._$textEditorInputContainer = $("<div>")
            .addClass(TEXTEDITOR_INPUT_CONTAINER_CLASS)
            .appendTo(this._$textEditorContainer);
        this._$textEditorInputContainer.append(this._createInput());

        this._renderButtonContainers();
    },

    _getInputContainer() {
        return this._$textEditorInputContainer;
    },

    _renderPendingIndicator: function() {
        this.$element().addClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
        const $inputContainer = this._getInputContainer(),
            $indicatorElement = $("<div>")
                .addClass(TEXTEDITOR_PENDING_INDICATOR_CLASS)
                .appendTo($inputContainer);
        this._pendingIndicator = this._createComponent($indicatorElement, LoadIndicator);
    },

    _disposePendingIndicator: function() {
        if(!this._pendingIndicator) {
            return;
        }
        this._pendingIndicator.dispose();
        this._pendingIndicator.$element().remove();
        this._pendingIndicator = null;
        this.$element().removeClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
    },

    _renderValidationState: function() {
        this.callBase();
        const isPending = this.option("validationStatus") === "pending",
            $element = this.$element();

        if(isPending) {
            !this._pendingIndicator && this._renderPendingIndicator();
            this._showValidMark = false;
        } else {
            if(this.option("validationStatus") === "invalid") {
                this._showValidMark = false;
            }
            if(!this._showValidMark) {
                this._showValidMark = this.option("validationStatus") === "valid" && !!this._pendingIndicator;
            }
            this._disposePendingIndicator();
        }

        $element.toggleClass(TEXTEDITOR_VALID_CLASS, this._showValidMark);
    },

    _renderButtonContainers: function() {
        const buttons = this.option("buttons");

        this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, this._$textEditorContainer);
        this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, this._$textEditorContainer);
    },

    _clean() {
        this._buttonCollection.clean();
        this._disposePendingIndicator();
        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;
        this._$textEditorContainer = null;
        this.callBase();
    },

    _createInput: function() {
        var $input = $("<input>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        return $input;
    },

    _setSubmitElementName: function(name) {
        var inputAttrName = this.option("inputAttr.name");
        return this.callBase(name || inputAttrName || "");
    },

    _applyInputAttributes: function($input, customAttributes) {
        $input.attr("autocomplete", "off")
            .attr(customAttributes)
            .addClass(TEXTEDITOR_INPUT_CLASS)
            .css("minHeight", this.option("height") ? "0" : "");
    },

    _updateButtons: function(names) {
        this._buttonCollection.updateButtons(names);
    },

    _updateButtonsStyling: function(editorStylingMode) {
        var that = this;

        each(this.option("buttons"), function(_, buttonOptions) {
            if(buttonOptions.options && !buttonOptions.options.stylingMode) {
                var buttonInstance = that.getButton(buttonOptions.name);
                buttonInstance.option && buttonInstance.option("stylingMode", editorStylingMode === "underlined" ? "text" : "contained");
            }
        });
    },

    _renderValue: function() {
        var renderInputPromise = this._renderInputValue();
        return renderInputPromise.promise();
    },

    _renderInputValue: function(value) {
        value = value || this.option("value");

        var text = this.option("text"),
            displayValue = this.option("displayValue"),
            displayValueFormatter = this.option("displayValueFormatter");

        if(displayValue !== undefined && value !== null) {
            text = displayValueFormatter(displayValue);
        } else if(!isDefined(text)) {
            text = displayValueFormatter(value);
        }

        this.option("text", text);

        // fallback to empty string is required to support WebKit native date picker in some basic scenarios
        // can not be covered by QUnit
        if(this._input().val() !== (isDefined(text) ? text : "")) {
            this._renderDisplayText(text);
        } else {
            this._toggleEmptinessEventHandler();
        }

        return new Deferred().resolve();
    },

    _renderDisplayText: function(text) {
        this._input().val(text);
        this._toggleEmptinessEventHandler();
    },

    _isValueValid: function() {
        if(this._input().length) {
            var validity = this._input().get(0).validity;

            if(validity) {
                return validity.valid;
            }
        }

        return true;
    },

    _toggleEmptiness: function(isEmpty) {
        this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
        this._togglePlaceholder(isEmpty);
    },

    _togglePlaceholder: function(isEmpty) {
        if(!this._$placeholder) {
            return;
        }

        this._$placeholder.toggleClass(STATE_INVISIBLE_CLASS, !isEmpty);
    },

    _renderProps: function() {
        this._toggleReadOnlyState();
        this._toggleSpellcheckState();
        this._toggleTabIndex();
    },

    _toggleDisabledState: function(value) {
        this.callBase.apply(this, arguments);

        var $input = this._input();
        if(value) {
            $input.attr("disabled", true);
        } else {
            $input.removeAttr("disabled");
        }
    },

    _toggleTabIndex: function() {
        var $input = this._input(),
            disabled = this.option("disabled"),
            focusStateEnabled = this.option("focusStateEnabled");

        if(disabled || !focusStateEnabled) {
            $input.attr("tabIndex", -1);
        } else {
            $input.removeAttr("tabIndex");
        }
    },

    _toggleReadOnlyState: function() {
        this._input().prop("readOnly", this._readOnlyPropValue());
        this.callBase();
    },

    _readOnlyPropValue: function() {
        return this.option("readOnly");
    },

    _toggleSpellcheckState: function() {
        this._input().prop("spellcheck", this.option("spellcheck"));
    },

    _renderPlaceholder: function() {
        this._renderPlaceholderMarkup();
        this._attachPlaceholderEvents();
    },

    _renderPlaceholderMarkup: function() {
        if(this._$placeholder) {
            this._$placeholder.remove();
            this._$placeholder = null;
        }

        var $input = this._input(),
            placeholderText = this.option("placeholder"),
            $placeholder = this._$placeholder = $("<div>")
                .attr("data-dx_placeholder", placeholderText);

        $placeholder.insertAfter($input);
        $placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
    },

    _attachPlaceholderEvents: function() {
        var that = this,
            startEvent = eventUtils.addNamespace(pointerEvents.up, that.NAME);

        eventsEngine.on(that._$placeholder, startEvent, function() {
            eventsEngine.trigger(that._input(), "focus");
        });
        that._toggleEmptinessEventHandler();
    },

    _placeholder: function() {
        return this._$placeholder || $();
    },

    _clearValueHandler: function(e) {
        var $input = this._input();
        e.stopPropagation();

        this._saveValueChangeEvent(e);
        this._clearValue();

        !this._isFocused() && eventsEngine.trigger($input, "focus");
        eventsEngine.trigger($input, "input");
    },

    _clearValue: function() {
        this.reset();
    },

    _renderEvents: function() {
        var that = this,
            $input = that._input();

        each(EVENTS_LIST, function(_, event) {
            if(that.hasActionSubscription("on" + event)) {

                var action = that._createActionByOption("on" + event, { excludeValidators: ["readOnly"] });

                eventsEngine.on($input, eventUtils.addNamespace(event.toLowerCase(), that.NAME), function(e) {
                    if(that._disposed) {
                        return;
                    }

                    action({ event: e });
                });
            }
        });
    },

    _refreshEvents: function() {
        var that = this,
            $input = this._input();

        each(EVENTS_LIST, function(_, event) {
            eventsEngine.off($input, eventUtils.addNamespace(event.toLowerCase(), that.NAME));
        });

        this._renderEvents();
    },

    _keyPressHandler: function() {
        this.option("text", this._input().val());
    },

    _renderValueChangeEvent: function() {
        var keyPressEvent = eventUtils.addNamespace(this._renderValueEventName(), this.NAME + "TextChange"),
            valueChangeEvent = eventUtils.addNamespace(this.option("valueChangeEvent"), this.NAME + "ValueChange");

        eventsEngine.on(this._input(), keyPressEvent, this._keyPressHandler.bind(this));
        eventsEngine.on(this._input(), valueChangeEvent, this._valueChangeEventHandler.bind(this));
    },

    _cleanValueChangeEvent: function() {
        var eventNamespace = this.NAME + "ValueChange",
            keyPressEvent = eventUtils.addNamespace(this._renderValueEventName(), this.NAME + "TextChange");

        eventsEngine.off(this._input(), "." + eventNamespace);
        eventsEngine.off(this._input(), keyPressEvent);
    },

    _refreshValueChangeEvent: function() {
        this._cleanValueChangeEvent();
        this._renderValueChangeEvent();
    },

    _renderValueEventName: function() {
        return "input change keypress";
    },

    _focusTarget: function() {
        return this._input();
    },

    _focusEventTarget: function() {
        return this.element();
    },

    _preventNestedFocusEvent: function(event) {
        if(event.isDefaultPrevented()) {
            return true;
        }

        var result = this._isNestedTarget(event.relatedTarget);

        if(event.type === "focusin") {
            result = result && this._isNestedTarget(event.target);
        }

        result && event.preventDefault();
        return result;
    },

    _isNestedTarget: function(target) {
        return !!this.$element().find(target).length;
    },

    _focusClassTarget: function() {
        return this.$element();
    },

    _focusInHandler: function(event) {
        this._preventNestedFocusEvent(event);

        this.callBase.apply(this, arguments);
    },

    _focusOutHandler: function(event) {
        this._preventNestedFocusEvent(event);

        this.callBase.apply(this, arguments);
    },

    _toggleFocusClass: function(isFocused, $element) {
        this.callBase(isFocused, this._focusClassTarget($element));
    },

    _hasFocusClass: function(element) {
        return this.callBase($(element || this.$element()));
    },

    _renderEmptinessEvent: function() {
        var $input = this._input();

        eventsEngine.on($input, "input blur", this._toggleEmptinessEventHandler.bind(this));
    },

    _toggleEmptinessEventHandler: function() {
        var text = this._input().val(),
            isEmpty = (text === "" || text === null) && this._isValueValid();

        this._toggleEmptiness(isEmpty);
    },

    _valueChangeEventHandler: function(e, formattedValue) {
        this._saveValueChangeEvent(e);
        this.option("value", arguments.length > 1 ? formattedValue : this._input().val());
        this._saveValueChangeEvent(undefined);
    },

    _renderEnterKeyAction: function() {
        this._enterKeyAction = this._createActionByOption("onEnterKey", {
            excludeValidators: ["readOnly"]
        });

        eventsEngine.off(this._input(), "keyup.onEnterKey.dxTextEditor");
        eventsEngine.on(this._input(), "keyup.onEnterKey.dxTextEditor", this._enterKeyHandlerUp.bind(this));
    },

    _enterKeyHandlerUp: function(e) {
        if(this._disposed) {
            return;
        }

        if(eventUtils.normalizeKeyName(e) === "enter") {
            this._enterKeyAction({ event: e });
        }
    },

    _updateValue: function() {
        this.option("text", undefined);
        this._renderValue();
    },

    _dispose: function() {
        this._enterKeyAction = undefined;
        this.callBase();
    },

    _getSubmitElement: function() {
        return this._input();
    },

    _checkKeyPressSubscriptions: function() {
        if(this.option("onKeyPress")) {
            errors.log("W0001", this.NAME, "onKeyPress", "20.1", "This event is removed from the web standards and will be deprecated in modern browsers soon.");
        }
    },

    _optionChanged: function(args) {
        var name = args.name;

        if(name === "onKeyPress") {
            this._checkKeyPressSubscriptions();
        }

        if(inArray(name.replace("on", ""), EVENTS_LIST) > -1) {
            this._refreshEvents();
            return;
        }

        switch(name) {
            case "valueChangeEvent":
                this._refreshValueChangeEvent();
                this._refreshFocusEvent();
                this._refreshEvents();
                break;
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            case "focusStateEnabled":
                this.callBase(args);
                this._toggleTabIndex();
                break;
            case "spellcheck":
                this._toggleSpellcheckState();
                break;
            case "mode":
                this._renderInputType();
                break;
            case "onEnterKey":
                this._renderEnterKeyAction();
                break;
            case "placeholder":
                this._renderPlaceholder();
                break;
            case "readOnly":
            case "disabled":
                this._updateButtons();
                this.callBase(args);
                break;
            case "showClearButton":
                this._updateButtons(["clear"]);
                break;
            case "text":
                break;
            case "value":
                this._updateValue();
                this.callBase(args);
                break;
            case "inputAttr":
                this._applyInputAttributes(this._input(), args.value);
                break;
            case "stylingMode":
                this._renderStylingMode();
                break;
            case "buttons":
                if(args.fullName === args.name) {
                    checkButtonsOptionType(args.value);
                }
                this._$beforeButtonsContainer && this._$beforeButtonsContainer.remove();
                this._$afterButtonsContainer && this._$afterButtonsContainer.remove();
                this._buttonCollection.clean();
                this._renderButtonContainers();
                break;
            case "displayValueFormatter":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _renderInputType: function() {
        // B218621, B231875
        this._setInputType(this.option("mode"));
    },

    _setInputType: function(type) {
        var input = this._input();

        if(type === "search") {
            type = "text";
        }

        try {
            input.prop("type", type);
        } catch(e) {
            input.prop("type", "text");
        }
    },

    /**
    * @name dxTextEditorMethods.getButton
    * @publicName getButton(name)
    * @param1 name:string
    * @return dxButton | undefined
    */
    getButton(name) {
        return this._buttonCollection.getButton(name);
    },

    /**
    * @name dxTextEditorMethods.focus
    * @publicName focus()
    */
    focus: function() {
        eventsEngine.trigger(this._input(), "focus");
    },

    /**
    * @name dxTextEditorMethods.blur
    * @publicName blur()
    */
    blur: function() {
        if(this._input().is(domAdapter.getActiveElement())) {
            domUtils.resetActiveElement();
        }
    },

    reset: function() {
        if(this._showValidMark) {
            this._showValidMark = false;
            this._renderValidationState();
        }

        const defaultOptions = this._getDefaultOptions();
        if(this.option("value") === defaultOptions.value) {
            this.option("text", "");
            this._renderValue();
        } else {
            this.option("value", defaultOptions.value);
        }
    },

    on: function(eventName, eventHandler) {
        var result = this.callBase(eventName, eventHandler),
            event = eventName.charAt(0).toUpperCase() + eventName.substr(1);

        if(EVENTS_LIST.indexOf(event) >= 0) {
            this._refreshEvents();
        }
        return result;
    }
});

module.exports = TextEditorBase;
