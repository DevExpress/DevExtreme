var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    Color = require("../../color"),
    ColorView = require("./color_view"),
    extend = require("../../core/utils/extend").extend,
    isFunction = require("../../core/utils/type").isFunction,
    registerComponent = require("../../core/component_registrator"),
    DropDownEditor = require("../drop_down_editor/ui.drop_down_editor");

var COLOR_BOX_CLASS = "dx-colorbox",
    COLOR_BOX_INPUT_CLASS = COLOR_BOX_CLASS + "-input",
    COLOR_BOX_INPUT_CONTAINER_CLASS = COLOR_BOX_INPUT_CLASS + "-container",
    COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS = COLOR_BOX_CLASS + "-color-result-preview",
    COLOR_BOX_COLOR_IS_NOT_DEFINED = COLOR_BOX_CLASS + "-color-is-not-defined",
    COLOR_BOX_OVERLAY_CLASS = COLOR_BOX_CLASS + "-overlay",

    COLOR_BOX_CONTAINER_CELL_CLASS = "dx-colorview-container-cell",
    COLOR_BOX_BUTTON_CELL_CLASS = "dx-colorview-button-cell",
    COLOR_BOX_BUTTONS_CONTAINER_CLASS = "dx-colorview-buttons-container",
    COLOR_BOX_APPLY_BUTTON_CLASS = "dx-colorview-apply-button",
    COLOR_BOX_CANCEL_BUTTON_CLASS = "dx-colorview-cancel-button";

var colorEditorPrototype = ColorView.prototype,
    colorUtils = {
        makeTransparentBackground: colorEditorPrototype._makeTransparentBackground.bind(colorEditorPrototype),
        makeRgba: colorEditorPrototype._makeRgba.bind(colorEditorPrototype)
    };

var ColorBox = DropDownEditor.inherit({

    _supportedKeys: function() {
        var arrowHandler = function(e) {
            e.stopPropagation();
            if(this.option("opened")) {
                e.preventDefault();
                return true;
            }
        };

        var upArrowHandler = function(e) {
            if(!this.option("opened")) {
                e.preventDefault();
                return false;
            }
            if(e.altKey) {
                this.close();
                return false;
            }
            return true;
        };

        var downArrowHandler = function(e) {
            if(!this.option("opened") && !e.altKey) {
                e.preventDefault();
                return false;
            }
            if(!this.option("opened") && e.altKey) {
                this._validatedOpening();
                return false;
            }
            return true;
        };

        return extend(this.callBase(), {
            tab: function(e) {
                if(this.option("opened")) {
                    e.preventDefault();
                    this._colorView._rgbInputs[0].focus();
                }
            },
            enter: this._enterKeyHandler,
            leftArrow: arrowHandler,
            rightArrow: arrowHandler,
            upArrow: upArrowHandler,
            downArrow: downArrowHandler
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxColorBoxOptions.editAlphaChannel
            * @type boolean
            * @default false
            */
            editAlphaChannel: false,

            /**
            * @name dxColorBoxOptions.applyButtonText
            * @type string
            * @default "OK"
            */

            /**
            * @name dxColorBoxOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
             * @name dxColorBoxOptions.showDropDownButton
             * @hidden
             */

            /**
             * @name dxColorBoxOptions.openOnFieldClick
             * @hidden
             */

            /**
            * @name dxColorBoxOptions.cancelButtonText
            * @type string
            * @default "Cancel"
            */

            /**
            * @name dxColorBoxOptions.applyValueMode
            * @type Enums.EditorApplyValueMode
            * @default "useButtons"
            */
            applyValueMode: "useButtons",

            /**
            * @name dxColorBoxOptions.keyStep
            * @type number
            * @default 1
            */
            keyStep: 1,

            /**
             * @name dxColorBoxOptions.fieldTemplate
             * @type template|function
             * @default null
             * @type_function_param1 value:string
             * @type_function_param2 fieldElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            fieldTemplate: null,

            // TODO: convert these options to actions and publish them
            onApplyButtonClick: null,
            onCancelButtonClick: null,

            buttonsLocation: "bottom after"

            /**
            * @name dxColorBoxOptions.value
            * @type string
            */

            /**
            * @name dxColorBoxOptions.maxLength
            * @hidden
            */

            /**
            * @name dxColorBoxOptions.valueChangeEvent
            * @hidden
            */

            /**
            * @name dxColorBoxOptions.spellcheck
            * @hidden
            */
        });
    },

    _popupHidingHandler: function() {
        this.callBase();
        if(this.option("applyValueMode") === "useButtons") {
            this._updateColorViewValue(this.option("value"));
        }
    },

    _popupConfig: function() {
        return extend(this.callBase(), {
            height: "auto",
            width: ""
        });
    },

    _contentReadyHandler: function() {
        this._createColorView();
        this._addPopupBottomClasses();
    },

    _addPopupBottomClasses: function() {
        var $popupBottom = this._popup.bottomToolbar();
        if($popupBottom) {
            $popupBottom
                .addClass(COLOR_BOX_CONTAINER_CELL_CLASS)
                .addClass(COLOR_BOX_BUTTON_CELL_CLASS)
                .find(".dx-toolbar-items-container")
                .addClass(COLOR_BOX_BUTTONS_CONTAINER_CLASS);

            $popupBottom
                .find(".dx-popup-done")
                .addClass(COLOR_BOX_APPLY_BUTTON_CLASS);

            $popupBottom
                .find(".dx-popup-cancel")
                .addClass(COLOR_BOX_CANCEL_BUTTON_CLASS);
        }
    },

    _createColorView: function() {
        this._popup.overlayContent().addClass(COLOR_BOX_OVERLAY_CLASS);

        var $colorView = $("<div>").appendTo(this._popup.$content());

        this._colorView = this._createComponent($colorView, ColorView, this._colorViewConfig());

        eventsEngine.on($colorView, "focus", (function() {
            this.focus();
        }).bind(this));
    },

    _applyNewColor: function(value) {
        this.option("value", value);

        if(value) {
            colorUtils.makeTransparentBackground(this._$colorResultPreview, value);
        }

        if(this._colorViewEnterKeyPressed) {
            this.close();
            this._colorViewEnterKeyPressed = false;
        }
    },

    _colorViewConfig: function() {
        var that = this;

        return {
            value: that.option("value"),
            matchValue: that.option("value"),
            editAlphaChannel: that.option("editAlphaChannel"),
            applyValueMode: that.option("applyValueMode"),
            focusStateEnabled: that.option("focusStateEnabled"),
            stylingMode: this.option("stylingMode"),
            onEnterKeyPressed: function() {
                that._colorViewEnterKeyPressed = true;
                if(that._colorView.option("value") !== that.option("value")) {
                    that._applyNewColor(that._colorView.option("value"));
                    that.close();
                }
            },

            onValueChanged: function(args) {
                if(colorUtils.makeRgba(args.value) === args.previousValue) {
                    return;
                }

                var instantlyMode = that.option("applyValueMode") === "instantly";

                if(!instantlyMode && !that._colorViewEnterKeyPressed) {
                    return;
                }

                that._applyNewColor(args.value);
            },
            _keyboardProcessor: that._colorViewProcessor
        };
    },

    _enterKeyHandler: function() {
        var newValue = this._input().val(),
            value = this.option("value"),
            oldValue = this.option("editAlphaChannel") ? colorUtils.makeRgba(value) : value;

        if(!newValue) return false;

        var color = new Color(newValue);

        if(color.colorIsInvalid) {
            this._input().val(oldValue);
            return;
        }

        if(newValue !== oldValue) {
            this._applyColorFromInput(newValue);
            this.option("value", this.option("editAlphaChannel") ? colorUtils.makeRgba(newValue) : newValue);
        }

        if(this._colorView) {
            var colorViewValue = this._colorView.option("value");
            if(value !== colorViewValue) {
                this.option("value", colorViewValue);
            }
        }

        this.close();
        return false;
    },

    _applyButtonHandler: function() {
        this._applyNewColor(this._colorView.option("value"));

        if(isFunction(this.option("onApplyButtonClick"))) {
            this.option("onApplyButtonClick")();
        }

        this.callBase();
    },

    _cancelButtonHandler: function() {
        this._resetInputValue();

        if(isFunction(this.option("onCancelButtonClick"))) {
            this.option("onCancelButtonClick")();
        }

        this.callBase();
    },

    _attachChildKeyboardEvents: function() {
        this._colorViewProcessor = this._keyboardProcessor.attachChildProcessor();
        if(this._colorView) {
            this._colorView.option("_keyboardProcessor", this._colorViewProcessor);
            return;
        }
    },

    _init: function() {
        this.callBase();
    },

    _initMarkup: function() {
        this.$element().addClass(COLOR_BOX_CLASS);
        this.callBase();
    },

    _renderInput: function() {
        this.callBase();

        this._input().addClass(COLOR_BOX_INPUT_CLASS);
        this._renderColorPreview();
    },

    _renderColorPreview: function() {
        this.$element().wrapInner($("<div>").addClass(COLOR_BOX_INPUT_CONTAINER_CLASS));
        this._$colorBoxInputContainer = this.$element().children().eq(0);

        this._$colorResultPreview = $("<div>")
            .addClass(COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS)
            .appendTo(this._$textEditorInputContainer);

        if(!this.option("value")) {
            this._$colorBoxInputContainer.addClass(COLOR_BOX_COLOR_IS_NOT_DEFINED);
        } else {
            colorUtils.makeTransparentBackground(this._$colorResultPreview, this.option("value"));
        }
    },

    _renderValue: function() {
        var value = this.option("value");
        this.option("text", this.option("editAlphaChannel") ? colorUtils.makeRgba(value) : value);
        return this.callBase();
    },

    _resetInputValue: function() {
        var $input = this._input(),
            value = this.option("value");

        $input.val(value);
        this._updateColorViewValue(value);
    },

    _updateColorViewValue: function(value) {
        if(this._colorView) {
            this._colorView.option({
                "value": value,
                "matchValue": value
            });
        }
    },

    _valueChangeEventHandler: function(e) {
        var value = this._input().val();

        if(value) {
            value = this._applyColorFromInput(value);

            this._updateColorViewValue(value);
        }
        this.callBase(e, value);
    },

    _applyColorFromInput: function(value) {
        var newColor = new Color(value);

        if(newColor.colorIsInvalid) {
            this._resetInputValue();
            value = this.option("value");
        }

        return value;
    },

    _optionChanged: function(args) {
        var value = args.value,
            name = args.name;

        switch(name) {
            case "value":
                this._$colorBoxInputContainer.toggleClass(COLOR_BOX_COLOR_IS_NOT_DEFINED, !value);

                if(value) {
                    colorUtils.makeTransparentBackground(this._$colorResultPreview, value);
                } else {
                    this._$colorResultPreview.removeAttr("style");
                }

                this._updateColorViewValue(value);
                this.callBase(args);
                break;
            case "applyButtonText":
            case "cancelButtonText":
                this.callBase(args);
                this._popup && this._addPopupBottomClasses();
                break;
            case "editAlphaChannel":
            case "onCancelButtonClick":
            case "onApplyButtonClick":
            case "keyStep":
                if(this._colorView) {
                    this._colorView.option(name, value);
                }
                break;
            case "applyValueMode":
                this.callBase(args);
                break;
            case "rtlEnabled":
                if(this._colorView) {
                    this._colorView.option(name, value);
                }
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxColorBox", ColorBox);

module.exports = ColorBox;
