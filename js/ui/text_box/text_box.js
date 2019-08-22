var $ = require("../../core/renderer"),
    windowUtils = require("../../core/utils/window"),
    window = windowUtils.getWindow(),
    navigator = windowUtils.getNavigator(),
    browser = require("../../core/utils/browser"),
    eventsEngine = require("../../events/core/events_engine"),
    devices = require("../../core/devices"),
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    TextEditor = require("./ui.text_editor"),
    eventUtils = require("../../events/utils");

var ua = navigator.userAgent,
    ignoreKeys = ["backspace", "tab", "enter", "pageUp", "pageDown", "end", "home", "leftArrow", "rightArrow", "downArrow", "upArrow", "del"],

    TEXTBOX_CLASS = "dx-textbox",
    SEARCHBOX_CLASS = "dx-searchbox",
    ICON_CLASS = "dx-icon",
    SEARCH_ICON_CLASS = "dx-icon-search";

var TextBox = TextEditor.inherit({

    ctor: function(element, options) {
        if(options) {
            this._showClearButton = options.showClearButton;
        }

        this.callBase.apply(this, arguments);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTextBoxOptions.value
            * @type string
            * @default ""
            */
            value: "",
            /**
            * @name dxTextBoxOptions.mode
            * @type Enums.TextBoxMode
            * @default "text"
            */
            mode: "text",

            /**
            * @name dxTextBoxOptions.maxLength
            * @type string|number
            * @default null
            */
            maxLength: null
        });
    },

    _initMarkup: function() {
        this.$element().addClass(TEXTBOX_CLASS);

        this.callBase();
        this.setAria("role", "textbox");
    },

    _renderContentImpl: function() {
        this._renderMaxLengthHandlers();
        this.callBase();
    },

    _renderInputType: function() {
        this.callBase();

        this._renderSearchMode();
    },

    _renderMaxLengthHandlers: function() {
        if(this._isAndroidOrIE()) {
            eventsEngine.on(this._input(), eventUtils.addNamespace("keydown", this.NAME), this._onKeyDownCutOffHandler.bind(this));
            eventsEngine.on(this._input(), eventUtils.addNamespace("change", this.NAME), this._onChangeCutOffHandler.bind(this));
        }
    },

    _renderProps: function() {
        this.callBase();
        this._toggleMaxLengthProp();
    },

    _toggleMaxLengthProp: function() {
        if(this._isAndroidOrIE()) {
            return;
        }

        var maxLength = this.option("maxLength");
        var isMaskSpecified = !!this.option("mask");
        if(maxLength > 0 && !isMaskSpecified) {
            this._input().attr("maxLength", maxLength);
        } else {
            this._input().removeAttr("maxLength");
        }
    },

    _renderSearchMode: function() {
        var $element = this._$element;

        if(this.option("mode") === "search") {
            $element.addClass(SEARCHBOX_CLASS);
            this._renderSearchIcon();

            if(this._showClearButton === undefined) {
                this._showClearButton = this.option("showClearButton");
                this.option("showClearButton", true);
            }
        } else {
            $element.removeClass(SEARCHBOX_CLASS);
            this._$searchIcon && this._$searchIcon.remove();
            this.option("showClearButton", this._showClearButton === undefined ? this.option("showClearButton") : this._showClearButton);
            delete this._showClearButton;
        }
    },

    _renderSearchIcon: function() {
        var $searchIcon = $("<div>")
            .addClass(ICON_CLASS)
            .addClass(SEARCH_ICON_CLASS);

        $searchIcon.prependTo(this._input().parent());
        this._$searchIcon = $searchIcon;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "maxLength":
                this._toggleMaxLengthProp();
                this._renderMaxLengthHandlers();
                break;
            case "mask":
                this.callBase(args);
                this._toggleMaxLengthProp();
                break;
            default:
                this.callBase(args);
        }
    },

    _onKeyDownCutOffHandler: function(e) {
        var maxLength = this.option("maxLength");
        if(maxLength) {
            var $input = $(e.target),
                key = eventUtils.normalizeKeyName(e);

            this._cutOffExtraChar($input);

            return ($input.val().length < maxLength
                    || inArray(key, ignoreKeys) !== -1
                    || window.getSelection().toString() !== "");
        } else {
            return true;
        }
    },

    _onChangeCutOffHandler: function(e) {
        var $input = $(e.target);
        if(this.option("maxLength")) {
            this._cutOffExtraChar($input);
        }
    },

    _cutOffExtraChar: function($input) {
        var maxLength = this.option("maxLength"),
            textInput = $input.val();
        if(textInput.length > maxLength) {
            $input.val(textInput.substr(0, maxLength));
        }
    },

    _isAndroidOrIE: function() {
        var realDevice = devices.real();
        var version = realDevice.version.join(".");
        return browser.msie || realDevice.platform === "android" && version && /^(2\.|4\.1)/.test(version) && !/chrome/i.test(ua);
    }
});

///#DEBUG

TextBox.__internals = {
    uaAccessor: function(value) {
        if(!arguments.length) {
            return window.DevExpress.ui;
        }
        ua = value;
    },
    SEARCHBOX_CLASS: SEARCHBOX_CLASS,
    SEARCH_ICON_CLASS: SEARCH_ICON_CLASS
};

///#ENDDEBUG
registerComponent("dxTextBox", TextBox);

module.exports = TextBox;
