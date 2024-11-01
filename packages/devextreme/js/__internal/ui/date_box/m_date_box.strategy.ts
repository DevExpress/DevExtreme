import eventsEngine from '@js/common/core/events/core/events_engine';
import dateLocalization from '@js/common/core/localization/date';
import Class from '@js/core/class';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';

const { abstract } = Class;

const DateBoxStrategy = Class.inherit({
  ctor(dateBox) {
    this.dateBox = dateBox;
  },

  widgetOption() {
    return this._widget && this._widget.option.apply(this._widget, arguments);
  },

  _renderWidget(element) {
    element = element || $('<div>');
    this._widget = this._createWidget(element);
    this._widget.$element().appendTo(this._getWidgetContainer());
  },

  _createWidget(element) {
    const widgetName = this._getWidgetName();
    const widgetOptions = this._getWidgetOptions();

    return this.dateBox._createComponent(element, widgetName, widgetOptions);
  },

  _getWidgetOptions: abstract,

  _getWidgetName: abstract,

  getDefaultOptions() {
    return { mode: 'text' };
  },

  getDisplayFormat: abstract,

  supportedKeys: noop,

  getKeyboardListener: noop,

  customizeButtons: noop,

  getParsedText(text, format) {
    // @ts-expect-error
    const value = dateLocalization.parse(text, format);
    // @ts-expect-error
    return value || dateLocalization.parse(text);
  },

  renderInputMinMax: noop,

  renderOpenedState() {
    this._updateValue();
  },

  popupConfig: abstract,

  _dimensionChanged() {
    this._getPopup()?.repaint();
  },

  renderPopupContent() {
    const popup = this._getPopup();
    this._renderWidget();

    const $popupContent = popup.$content().parent();
    eventsEngine.off($popupContent, 'mousedown');
    eventsEngine.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
  },

  _preventFocusOnPopup(e) {
    e.preventDefault();
  },

  _getWidgetContainer() {
    return this._getPopup().$content();
  },

  _getPopup() {
    return this.dateBox._popup;
  },

  popupShowingHandler: noop,

  popupHiddenHandler: noop,

  _updateValue() {
    this._widget && this._widget.option('value', this.dateBoxValue());
  },

  useCurrentDateByDefault: noop,

  getDefaultDate() {
    return new Date();
  },

  textChangedHandler: noop,

  renderValue() {
    if (this.dateBox.option('opened')) {
      this._updateValue();
    }
  },

  getValue() {
    return this._widget.option('value');
  },

  isAdaptivityChanged() {
    return false;
  },

  dispose() {
    const popup = this._getPopup();

    if (popup) {
      popup.$content().empty();
    }
  },

  dateBoxValue() {
    if (arguments.length) {
      return this.dateBox.dateValue.apply(this.dateBox, arguments);
    }
    return this.dateBox.dateOption.apply(this.dateBox, ['value']);
  },
});

export default DateBoxStrategy;
