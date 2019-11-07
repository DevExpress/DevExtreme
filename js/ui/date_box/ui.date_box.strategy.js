var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    noop = require("../../core/utils/common").noop,
    Class = require("../../core/class"),
    dateLocalization = require("../../localization/date");

var abstract = Class.abstract;

var DateBoxStrategy = Class.inherit({
    ctor: function(dateBox) {
        this.dateBox = dateBox;
    },

    widgetOption: function() {
        return this._widget && this._widget.option.apply(this._widget, arguments);
    },

    _renderWidget: function(element) {
        element = element || $("<div>");
        this._widget = this._createWidget(element);
        this._widget.$element().appendTo(this._getWidgetContainer());
    },

    _createWidget: function(element) {
        var widgetName = this._getWidgetName();
        var widgetOptions = this._getWidgetOptions();

        return this.dateBox._createComponent(element, widgetName, widgetOptions);
    },

    _getWidgetOptions: abstract,

    _getWidgetName: abstract,

    getDefaultOptions: function() {
        return { mode: "text" };
    },

    getDisplayFormat: abstract,

    supportedKeys: noop,

    customizeButtons: noop,

    attachKeyboardEvents: function(keyboardProcessor) {
        this._widgetKeyboardProcessor = keyboardProcessor.attachChildProcessor();
    },

    getParsedText: function(text, format) {
        var value = dateLocalization.parse(text, format);
        return value ? value : dateLocalization.parse(text);
    },

    renderInputMinMax: noop,

    renderOpenedState: function() {
        this._updateValue();
    },

    popupConfig: abstract,

    renderPopupContent: function() {
        var popup = this._getPopup();
        this._renderWidget();

        var $popupContent = popup.$content().parent();
        eventsEngine.off($popupContent, "mousedown");
        eventsEngine.on($popupContent, "mousedown", this._preventFocusOnPopup.bind(this));
    },

    getFirstPopupElement: noop,

    getLastPopupElement: noop,

    _preventFocusOnPopup: function(e) {
        e.preventDefault();
    },

    _getWidgetContainer: function() {
        return this._getPopup().$content();
    },

    _getPopup: function() {
        return this.dateBox._popup;
    },

    popupShowingHandler: noop,

    popupHiddenHandler: noop,

    _updateValue: function() {
        this._widget && this._widget.option("value", this.dateBoxValue());
    },

    _valueChangedHandler: function(args) {
        if(this.dateBox.option("opened") && this.dateBox.option("applyValueMode") === "instantly") {
            this.dateBoxValue(args.value);
        }
    },

    useCurrentDateByDefault: noop,

    getDefaultDate: function() {
        return new Date();
    },

    textChangedHandler: noop,

    renderValue: function() {
        if(this.dateBox.option("opened")) {
            this._updateValue();
        }
    },

    getValue: function() {
        return this._widget.option("value");
    },

    isAdaptivityChanged: function() {
        return false;
    },

    dispose: function() {
        var popup = this._getPopup();

        if(popup) {
            popup.$content().empty();
        }
    },

    dateBoxValue: function() {
        if(arguments.length) {
            return this.dateBox.dateValue.apply(this.dateBox, arguments);
        } else {
            return this.dateBox.dateOption.apply(this.dateBox, ["value"]);
        }
    }
});

module.exports = DateBoxStrategy;
