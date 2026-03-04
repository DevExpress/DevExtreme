/* eslint-disable class-methods-use-this */
import eventsEngine from '@js/common/core/events/core/events_engine';
import dateLocalization from '@js/common/core/localization/date';
import Class from '@js/core/class';
import $ from '@js/core/renderer';
import type { ToolbarItem } from '@js/ui/popup';

import type { PopupProperties } from '../popup/m_popup';

// @ts-expect-error dxClass inheritance issue
class DateBoxStrategy extends (Class.inherit({}) as new() => {}) {
  public NAME!: string;

  dateBox?: any;

  _widget?: any;

  ctor(dateBox) {
    this.dateBox = dateBox;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  widgetOption(option?) {
    return this._widget?.option.apply(this._widget, arguments);
  }

  _renderWidget(element?) {
    element = element || $('<div>');
    this._widget = this._createWidget(element);
    this._widget.$element().appendTo(this._getWidgetContainer());
  }

  _createWidget(element) {
    const widgetName = this._getWidgetName();
    const widgetOptions = this._getWidgetOptions();

    return this.dateBox._createComponent(element, widgetName, widgetOptions);
  }

  _getWidgetOptions() {
    Class.abstract();
  }

  _getWidgetName() {
    Class.abstract();
  }

  getDefaultOptions() {
    return { mode: 'text' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDisplayFormat(displayFormat?) {
    Class.abstract();
  }

  supportedKeys() {}

  getKeyboardListener() {}

  customizeButtons() {}

  getParsedText(text, format) {
    const value = dateLocalization.parse(text, format);
    return value ?? dateLocalization.parse(text);
  }

  renderInputMinMax(): void {}

  renderOpenedState(): void {
    this._updateValue();
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return popupConfig;
  }

  _dimensionChanged(): void {
    this._getPopup()?.repaint();
  }

  renderPopupContent(): void {
    const popup = this._getPopup();
    this._renderWidget();

    const $popupContent = popup.$content().parent();
    eventsEngine.off($popupContent, 'mousedown');
    eventsEngine.on($popupContent, 'mousedown', this._preventFocusOnPopup.bind(this));
  }

  _preventFocusOnPopup(e) {
    e.preventDefault();
  }

  _getWidgetContainer() {
    return this._getPopup().$content();
  }

  _getPopup() {
    return this.dateBox._popup;
  }

  popupShowingHandler() {}

  popupHiddenHandler() {}

  _updateValue() {
    this._widget?.option('value', this.dateBoxValue());
  }

  _getPopupToolbarItems(toolbarItems: ToolbarItem[]): ToolbarItem[] {
    return toolbarItems;
  }

  useCurrentDateByDefault(): boolean {
    return false;
  }

  getDefaultDate(): Date {
    return new Date();
  }

  textChangedHandler() {}

  renderValue() {
    if (this.dateBox.option('opened')) {
      this._updateValue();
    }
  }

  getValue() {
    return this._widget.option('value');
  }

  isAdaptivityChanged() {
    return false;
  }

  dispose() {
    const popup = this._getPopup();

    if (popup) {
      popup.$content().empty();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dateBoxValue(value?, event?) {
    if (arguments.length) {
      return this.dateBox.dateValue.apply(this.dateBox, arguments);
    }
    return this.dateBox.getDateOption.apply(this.dateBox, ['value']);
  }
}

export default DateBoxStrategy;
