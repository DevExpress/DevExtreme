"use strict";

var $ = require("jquery"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    errors = require("../widget/ui.errors"),
    positionUtils = require("../../animation/position"),
    messageLocalization = require("../../localization/message"),
    Button = require("../button"),
    eventUtils = require("../../events/utils"),
    TextBox = require("../text_box"),
    clickEvent = require("../../events/click"),
    Popup = require("../popup");

var DROP_DOWN_EDITOR_CLASS = "dx-dropdowneditor",
    DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS = "dx-dropdowneditor-input-wrapper",
    DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button",
    DROP_DOWN_EDITOR_BUTTON_ICON = "dx-dropdowneditor-icon",
    DROP_DOWN_EDITOR_OVERLAY = "dx-dropdowneditor-overlay",
    DROP_DOWN_EDITOR_OVERLAY_FLIPPED = "dx-dropdowneditor-overlay-flipped",
    DROP_DOWN_EDITOR_ACTIVE = "dx-dropdowneditor-active",
    DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible",
    DROP_DOWN_EDITOR_FIELD_CLICKABLE = "dx-dropdowneditor-field-clickable";

/**
* @name dxDropDownEditor
* @publicName dxDropDownEditor
* @inherits dxTextBox
* @module ui/drop_down_editor/ui.drop_down_editor
* @export default
* @hidden
*/
var DropDownEditor = TextBox.inherit({

    _supportedKeys: function() {
        return $.extend({}, this.callBase(), {
            tab: function(e) {
                if(!this.option("opened")) {
                    return;
                }

                if(this.option("applyValueMode") === "instantly") {
                    this.close();
                    return;
                }

                var $focusableElement = e.shiftKey
                    ? this._getLastPopupElement()
                    : this._getFirstPopupElement();

                $focusableElement && $focusableElement.focus();
                e.preventDefault();
            },
            escape: function(e) {
                if(this.option("opened")) {
                    e.preventDefault();
                }
                this.close();
            },
            upArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.altKey) {
                    this.close();
                    return false;
                }
                return true;
            },
            downArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.altKey) {
                    this._validatedOpening();
                    return false;
                }
                return true;
            },
            enter: function(e) {
                if(this.option("opened")) {
                    e.preventDefault();
                    this._valueChangeEventHandler(e);
                }
                return true;
            }
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        $.extend(this._deprecatedOptions, {
            /**
             * @name dxDropDownEditorOptions_fieldEditEnabled
             * @publicName fieldEditEnabled
             * @deprecated dxDropDownEditorOptions_acceptCustomValue
             * @extend_doc
             */
            "fieldEditEnabled": { since: "16.1", alias: "acceptCustomValue" }
        });
    },

    _getDefaultOptions: function() {
        return $.extend(this.callBase(), {
            /**
            * @name dxDropDownEditorOptions_value
            * @publicName value
            * @type any
            * @default null
            */
            value: null,

            /**
            * @name dxDropDownEditorOptions_onOpened
            * @publicName onOpened
            * @extends Action
            * @action
            */
            onOpened: null,

            /**
            * @name dxDropDownEditorOptions_onClosed
            * @publicName onClosed
            * @extends Action
            * @action
            */
            onClosed: null,

            /**
            * @name dxDropDownEditorOptions_opened
            * @publicName opened
            * @type boolean
            * @default false
            */
            opened: false,

            /**
            * @name dxDropDownEditorOptions_acceptCustomValue
            * @publicName acceptCustomValue
            * @type boolean
            * @default true
            */
            acceptCustomValue: true,

            /**
            * @name dxDropDownEditorOptions_applyValueMode
            * @publicName applyValueMode
            * @type string
            * @default "instantly"
            * @acceptValues 'useButtons'|'instantly'
            */
            applyValueMode: "instantly",

            /**
            * @name dxDropDownEditorOptions_deferRendering
            * @publicName deferRendering
            * @type boolean
            * @default true
            */
            deferRendering: true,

            /**
            * @name dxDropDownEditorOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default true
            * @extend_doc
            */
            activeStateEnabled: true,

            fieldTemplate: null,
            contentTemplate: null,

            openOnFieldClick: false,

            showDropButton: true,
            popupPosition: this._getDefaultPopupPosition(),
            onPopupInitialized: null,
            applyButtonText: messageLocalization.format("OK"),
            cancelButtonText: messageLocalization.format("Cancel"),
            buttonsLocation: "default",
            showPopupTitle: false

            /**
            * @name dxDropDownEditorOptions_mask
            * @publicName mask
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxDropDownEditorOptions_maskChar
            * @publicName maskChar
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxDropDownEditorOptions_maskRules
            * @publicName maskRules
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxDropDownEditorOptions_maskInvalidMessage
            * @publicName maskInvalidMessage
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxDropDownEditorOptions_useMaskedValue
            * @publicName useMaskedValue
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxDropDownEditorOptions_mode
            * @publicName mode
            * @hidden
            * @extend_doc
            */
        });
    },

    _getDefaultPopupPosition: function() {
        var position = commonUtils.getDefaultAlignment(this.option("rtlEnabled"));

        return {
            offset: { h: 0, v: -1 },
            my: position + " top",
            at: position + " bottom",
            collision: "flip flip"
        };
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    var isGeneric = device.platform === "generic",
                        isWin10 = device.platform === "win" && device.version && device.version[0] === 10;
                    return isGeneric || isWin10;
                },
                options: {
                    popupPosition: { offset: { v: 0 } }
                }
            }
        ]);
    },

    _inputWrapper: function() {
        return this.element().find("." + DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS);
    },

    _init: function() {
        this.callBase();
        this._initVisibilityActions();
        this._initPopupInitializedAction();
    },

    _initVisibilityActions: function() {
        this._openAction = this._createActionByOption("onOpened", {
            excludeValidators: ["disabled", "readOnly"]
        });

        this._closeAction = this._createActionByOption("onClosed", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _initPopupInitializedAction: function() {
        this._popupInitializedAction = this._createActionByOption("onPopupInitialized", {
            excludeValidators: ["disabled", "readOnly", "designMode"]
        });
    },

    _render: function() {
        this.callBase();

        this._renderOpenHandler();

        this.element()
            .addClass(DROP_DOWN_EDITOR_CLASS);
        this._renderOpenedState();

        this.setAria("role", "combobox");
    },

    _renderContentImpl: function() {
        if(!this.option("deferRendering")) {
            this._createPopup();
        }
    },

    _renderInput: function() {
        this.callBase();

        this.element().wrapInner($("<div>").addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS));
        this._$container = this.element().children().eq(0);

        this.setAria({
            "haspopup": "true",
            "autocomplete": "list"
        });
    },

    _readOnlyPropValue: function() {
        return !this.option("acceptCustomValue") || this.callBase();
    },

    _cleanFocusState: function() {
        this.callBase();

        if(this.option("fieldTemplate")) {
            this._input().off("focusin focusout beforeactivate");
        }
    },

    _renderField: function() {
        var fieldTemplate = this._getTemplateByOption("fieldTemplate");

        if(!(fieldTemplate && this.option("fieldTemplate"))) {
            return;
        }

        this._renderTemplatedField(fieldTemplate, this._fieldRenderData());
    },

    _renderTemplatedField: function(fieldTemplate, data) {
        var isFocused = this._input().is(":focus");

        this._resetFocus(isFocused);

        var $container = this._$container;

        $container.empty();
        this._$dropButton = null;
        this._$clearButton = null;

        fieldTemplate.render({
            model: data,
            container: $container
        });

        if(!this._input().length) {
            throw errors.Error("E1010");
        }

        this._refreshEvents();
        this._refreshValueChangeEvent();
        isFocused && this._input().focus();

        this._renderFocusState();
    },

    _resetFocus: function(isFocused) {
        this._cleanFocusState();
        isFocused && this._input().focusout();
    },


    _fieldRenderData: function() {
        return this.option("value");
    },

    _renderInputAddons: function() {
        this._renderField();
        this.callBase();
        this._renderDropButton();
    },

    _renderDropButton: function() {
        var dropButtonVisible = this.option("showDropButton");

        this.element().toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, dropButtonVisible);

        if(!dropButtonVisible) {
            this._$dropButton && this._$dropButton.remove();
            this._$dropButton = null;
            return;
        }

        if(!this._$dropButton) {
            this._$dropButton = this._createDropButton()
                .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
        }

        this._attachDropButtonClickHandler();
        this._$dropButton.prependTo(this._buttonsContainer());
    },

    _attachDropButtonClickHandler: function() {
        if(this.option("showDropButton") && !this.option("openOnFieldClick")) {
            this._$dropButton.dxButton("option", "onClick", $.proxy(this._openHandler, this));
        }
    },


    // TODO: get rid of hacks for button styling
    _createDropButton: function() {
        var $button = $("<div>");

        this._createComponent($button, Button, {
            focusStateEnabled: false,
            disabled: this.option("readOnly"),
            integrationOptions: {},
            useInkRipple: false
        });

        var $buttonIcon = $("<div>").addClass(DROP_DOWN_EDITOR_BUTTON_ICON);

        $button
            .append($buttonIcon)
            .removeClass("dx-button")
            .on("mousedown", function(e) {
                e.preventDefault();
            });

        $button.find(".dx-button-content").remove();

        return $button;
    },

    _renderOpenHandler: function() {
        var that = this,
            $inputWrapper = that.element().find("." + DROP_DOWN_EDITOR_INPUT_WRAPPER_CLASS),
            eventName = eventUtils.addNamespace(clickEvent.name, that.NAME),
            openOnFieldClick = that.option("openOnFieldClick");

        $inputWrapper.off(eventName);
        that.element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);

        if(openOnFieldClick) {
            that._openOnFieldClickAction = that._createAction($.proxy(that._openHandler, that));
            $inputWrapper.on(eventName, function(e) { that._executeOpenAction(e); });
            return;
        }
    },

    _openHandler: function() {
        this._toggleOpenState();
    },

    _executeOpenAction: function(e) {
        this._openOnFieldClickAction({ jQueryEvent: e });
    },

    _keyboardEventBindingTarget: function() {
        return this._input();
    },

    _toggleOpenState: function(isVisible) {
        if(this.option("disabled")) {
            return;
        }

        this._input().focus();

        if(!this.option("readOnly")) {
            isVisible = arguments.length ? isVisible : !this.option("opened");
            this.option("opened", isVisible);
        }
    },

    _renderOpenedState: function() {
        var opened = this.option("opened");
        if(opened) {
            this._createPopup();
        }

        this.element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
        this._setPopupOption("visible", opened);

        this.setAria({
            "expanded": opened,
            "owns": (opened || undefined) && this._popupContentId
        });
    },

    _createPopup: function() {
        if(this._$popup) {
            return;
        }

        this._$popup = $("<div>").addClass(DROP_DOWN_EDITOR_OVERLAY)
            .addClass(this.option("customOverlayCssClass"))
            .appendTo(this.element());

        this._renderPopup();
        this._renderPopupContent();
    },

    _renderPopup: function() {
        this._popup = this._createComponent(this._$popup, Popup, this._popupConfig());

        this._popup.on({
            "showing": $.proxy(this._popupShowingHandler, this),
            "shown": $.proxy(this._popupShownHandler, this),
            "hiding": $.proxy(this._popupHidingHandler, this),
            "hidden": $.proxy(this._popupHiddenHandler, this)
        });

        this._popup.option("onContentReady", $.proxy(this._contentReadyHandler, this));
        this._contentReadyHandler();

        this._popupContentId = new Guid();
        this.setAria("id", this._popupContentId, this._popup.content());
    },

    _contentReadyHandler: $.noop,

    _popupConfig: function() {
        return {
            onInitialized: this._popupInitializedHandler(),
            position: $.extend(this.option("popupPosition"), {
                of: this.element()
            }),
            showTitle: this.option("showPopupTitle"),
            width: "auto",
            height: "auto",
            shading: false,
            closeOnTargetScroll: true,
            closeOnOutsideClick: $.proxy(this._closeOutsideDropDownHandler, this),
            animation: {
                show: { type: "fade", duration: 0, from: 0, to: 1 },
                hide: { type: "fade", duration: 400, from: 1, to: 0 }
            },
            deferRendering: false,
            focusStateEnabled: false,
            showCloseButton: false,
            toolbarItems: this._getPopupToolbarItems(),
            onPositioned: $.proxy(this._popupPositionedHandler, this),
            fullScreen: false
        };
    },

    _popupInitializedHandler: function() {
        if(!this.option("onPopupInitialized")) {
            return;
        }

        return $.proxy(function(e) {
            this._popupInitializedAction({ popup: e.component });
        }, this);
    },

    _popupPositionedHandler: function(e) {
        this._popup.overlayContent().toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, e.position.v.flip);
    },

    _popupShowingHandler: $.noop,

    _popupHidingHandler: function() {
        this.option("opened", false);
    },

    _popupShownHandler: function() {
        this._openAction();

        if(this._$validationMessage) {
            this._$validationMessage.dxOverlay("option", "position", this._getValidationMessagePosition());
        }
    },

    _popupHiddenHandler: function() {
        this._closeAction();
        if(this._$validationMessage) {
            this._$validationMessage.dxOverlay("option", "position", this._getValidationMessagePosition());
        }
    },

    _getValidationMessagePosition: function() {
        var positionRequest = "below";

        if(this._popup && this._popup.option("visible")) {
            var myTop = positionUtils.setup(this.element()).top,
                popupTop = positionUtils.setup(this._popup.content()).top;

            positionRequest = (myTop + this.option("popupPosition").offset.v) > popupTop ? "below" : "above";
        }

        return this.callBase(positionRequest);
    },

    _renderPopupContent: function() {
        var contentTemplate = this._getTemplateByOption("contentTemplate");

        if(!(contentTemplate && this.option("contentTemplate"))) {
            return;
        }

        var $popupContent = this._popup.content();
        $popupContent.empty();

        contentTemplate.render({
            container: $popupContent
        });
    },

    _closeOutsideDropDownHandler: function(e) {
        var $target = $(e.target);
        var isInputClicked = !!$target.closest(this.element()).length;
        var isDropButtonClicked = !!$target.closest(this._$dropButton).length;
        var isOutsideClick = !isInputClicked && !isDropButtonClicked;

        return isOutsideClick;
    },

    _clean: function() {
        delete this._$dropButton;
        delete this._openOnFieldClickAction;

        if(this._$popup) {
            this._$popup.remove();
            delete this._$popup;
            delete this._popup;
        }
        this.callBase();
    },

    _setPopupOption: function(optionName, value) {
        this._setWidgetOption("_popup", arguments);
    },

    _validatedOpening: function() {
        if(!this.option("readOnly")) {
            this._toggleOpenState(true);
        }
    },

    _getPopupToolbarItems: function() {
        return this.option("applyValueMode") === "useButtons"
            ? this._popupToolbarItemsConfig()
            : [];
    },

    _getFirstPopupElement: function() {
        return this._popup._wrapper().find(".dx-popup-done.dx-button");
    },

    _getLastPopupElement: function() {
        return this._popup._wrapper().find(".dx-popup-cancel.dx-button");
    },

    _popupElementTabHandler: function(e) {
        var $element = $(e.currentTarget);

        if((e.shiftKey && $element.is(this._getFirstPopupElement()))
            || (!e.shiftKey && $element.is(this._getLastPopupElement()))) {

            this._input().focus();
            e.preventDefault();
        }
    },

    _popupElementEscHandler: function() {
        this._input().focus();
        this.close();
    },

    _popupButtonInitializedHandler: function(e) {
        e.component.registerKeyHandler("tab", $.proxy(this._popupElementTabHandler, this));
        e.component.registerKeyHandler("escape", $.proxy(this._popupElementEscHandler, this));
    },

    _popupToolbarItemsConfig: function() {
        var buttonsConfig = [
            {
                shortcut: "done",
                options: {
                    onClick: $.proxy(this._applyButtonHandler, this),
                    text: this.option("applyButtonText"),
                    onInitialized: $.proxy(this._popupButtonInitializedHandler, this)
                }
            },
            {
                shortcut: "cancel",
                options: {
                    onClick: $.proxy(this._cancelButtonHandler, this),
                    text: this.option("cancelButtonText"),
                    onInitialized: $.proxy(this._popupButtonInitializedHandler, this)
                }
            }
        ];

        return this._applyButtonsLocation(buttonsConfig);
    },

    _applyButtonsLocation: function(buttonsConfig) {
        var buttonsLocation = this.option("buttonsLocation"),
            resultConfig = buttonsConfig;

        if(buttonsLocation !== "default") {
            var position = commonUtils.splitPair(buttonsLocation);

            $.each(resultConfig, function(_, element) {
                $.extend(element, {
                    toolbar: position[0],
                    location: position[1]
                });
            });
        }

        return resultConfig;
    },

    _applyButtonHandler: function() {
        this.close();
        this.option("focusStateEnabled") && this.focus();
    },

    _cancelButtonHandler: function() {
        this.close();
        this.option("focusStateEnabled") && this.focus();
    },

    _toggleReadOnlyState: function() {
        this.callBase();
        this._$dropButton && this._$dropButton.dxButton("option", "disabled", this.option("readOnly"));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "opened":
                this._renderOpenedState();
                break;
            case "onOpened":
            case "onClosed":
                this._initVisibilityActions();
                break;
            case "onPopupInitialized":
                this._initPopupInitializedAction();
                break;
            case "fieldTemplate":
                this._renderInputAddons();
                break;
            case "showDropButton":
            case "contentTemplate":
            case "acceptCustomValue":
            case "openOnFieldClick":
                this._invalidate();
                break;
            case "popupPosition":
            case "deferRendering":
                break;
            case "applyValueMode":
            case "applyButtonText":
            case "cancelButtonText":
            case "buttonsLocation":
                this._setPopupOption("toolbarItems", this._getPopupToolbarItems());
                break;
            case "showPopupTitle":
                this._setPopupOption("showTitle", args.value);
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxDropDownEditorMethods_open
    * @publicName open()
    */
    open: function() {
        this.option("opened", true);
    },

    /**
    * @name dxDropDownEditorMethods_close
    * @publicName close()
    */
    close: function() {
        this.option("opened", false);
    },

    /**
    * @name dxDropDownEditorMethods_reset
    * @publicName reset()
    */
    reset: function() {
        this.option("value", null);
    },

    /**
    * @name dxDropDownEditorMethods_field
    * @publicName field()
    * @return jQuery
    */
    field: function() {
        return this._input();
    },

    /**
    * @name dxDropDownEditorMethods_content
    * @publicName content()
    * @return jQuery
    */
    content: function() {
        return this._popup ? this._popup.content() : null;
    }
});

registerComponent("dxDropDownEditor", DropDownEditor);

module.exports = DropDownEditor;
