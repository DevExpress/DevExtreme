const $ = require('../../core/renderer');
const eventsEngine = require('../../events/core/events_engine');
const noop = require('../../core/utils/common').noop;
const Class = require('../../core/class');
const dateLocalization = require('../../localization/date');

const abstract = Class.abstract;

const DateBoxStrategy = Class.inherit({
    ctor: function(dateBox) {
        this.dateBox = dateBox;
    },

    widgetOption: function() {
        return this._widget && this._widget.option.apply(this._widget, arguments);
    },

    _renderWidget: function(element) {
        element = element || $('<div>');
        this._widget = this._createWidget(element);
        this._widget.$element().appendTo(this._getWidgetContainer());
    },

    _createWidget: function(element) {
        const widgetName = this._getWidgetName();
        const widgetOptions = this._getWidgetOptions();

        return this.dateBox._createComponent(element, widgetName, widgetOptions);
    },

    _getWidgetOptions: abstract,

    _getWidgetName: abstract,

    getDefaultOptions: function() {
        return { mode: 'text' };
    },

    getDisplayFormat: abstract,

    supportedKeys: noop,

    getKeyboardListener: noop,

    customizeButtons: noop,

    getParsedText: function(text, format) {
        const value = dateLocalization.parse(text, format);
        return value ? value : dateLocalization.parse(text);
    },

    renderInputMinMax: noop,

    renderOpenedState: function() {
        this._updateValue();
    },

    popupConfig: abstract,

    renderPopupContent: function() {
        const popup = this._getPopup();
        this._renderWidget();

        const $popupContent = popup.$content().parent();
        eventsEngine.off($popupContent, 'mousedown');
        eventsEngine.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
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
        this._widget && this._widget.option('value', this.dateBoxValue());
    },

    _valueChangedHandler: function(args) {
        if(this.dateBox.option('opened') && this.dateBox.option('applyValueMode') === 'instantly') {
            this.dateBoxValue(args.value);
        }
    },

    useCurrentDateByDefault: noop,

    getDefaultDate: function() {
        return new Date();
    },

    textChangedHandler: noop,

    renderValue: function() {
        if(this.dateBox.option('opened')) {
            this._updateValue();
        }
    },

    getValue: function() {
        return this._widget.option('value');
    },

    isAdaptivityChanged: function() {
        return false;
    },

    dispose: function() {
        const popup = this._getPopup();

        if(popup) {
            popup.$content().empty();
        }
    },

    dateBoxValue: function() {
        if(arguments.length) {
            return this.dateBox.dateValue.apply(this.dateBox, arguments);
        } else {
            return this.dateBox.dateOption.apply(this.dateBox, ['value']);
        }
    }
});

module.exports = DateBoxStrategy;
