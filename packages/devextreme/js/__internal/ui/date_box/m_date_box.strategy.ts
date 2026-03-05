/* eslint-disable class-methods-use-this */
import eventsEngine from '@js/common/core/events/core/events_engine';
import dateLocalization from '@js/common/core/localization/date';
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent, InteractionEvent } from '@js/events';
import type { Format } from '@js/localization';
import type { ToolbarItem } from '@js/ui/popup';
import type Calendar from '@ts/ui/calendar/calendar';
import type List from '@ts/ui/list/list.edit.search';

import type { PopupProperties } from '../popup/m_popup';
import type Popup from '../popup/m_popup';
import type { DateBoxBaseProperties } from './date_box.base';
import type DateBox from './date_box.base';
import type DateView from './date_view';

// @ts-expect-error dxClass inheritance issue
class DateBoxStrategy extends (Class.inherit({}) as new() => {}) {
  public NAME!: string;

  dateBox!: DateBox;

  _widget!: Calendar | DateView | List | null;

  constructor(dateBox: DateBox) {
    super();
    this.dateBox = dateBox;
  }

  widgetOption(option?: unknown): unknown {
    return this._widget?.option(option);
  }

  getWidget(): Calendar | DateView | List | null {
    return this._widget;
  }

  _renderWidget(element = $('<div>')): void {
    this._widget = this._createWidget(element);
    this._widget?.$element().appendTo(this._getWidgetContainer());
  }

  _createWidget(element: dxElementWrapper | Element): Calendar | DateView | List {
    const widgetName = this._getWidgetName();
    const widgetOptions = this._getWidgetOptions();

    // @ts-expect-error _createComponent is not properly typed
    return this.dateBox._createComponent(element, widgetName, widgetOptions);
  }

  _getWidgetOptions(): Record<string, unknown> {
    return {};
  }

  _getWidgetName(): typeof Calendar | typeof DateView | typeof List | undefined {
    return undefined;
  }

  getDefaultOptions(): DateBoxBaseProperties {
    return { mode: 'text' };
  }

  getDisplayFormat(displayFormat: Format): Format {
    return displayFormat;
  }

  supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {};
  }

  getKeyboardListener(): List | Calendar | undefined {
    return undefined;
  }

  customizeButtons(): void {}

  getParsedText(text = '', format?: string): Date | undefined | null {
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

    const $popupContent = popup.$content()?.parent();
    eventsEngine.off($popupContent, 'mousedown');
    eventsEngine.on($popupContent, 'mousedown', (e: DxEvent<MouseEvent>) => this._preventFocusOnPopup(e));
  }

  _preventFocusOnPopup(e: DxEvent<MouseEvent>): void {
    e.preventDefault();
  }

  _getWidgetContainer(): dxElementWrapper {
    return this._getPopup().$content() as dxElementWrapper;
  }

  _getPopup(): Popup {
    return this.dateBox._popup as Popup;
  }

  _getPopupContent(): dxElementWrapper {
    return this._getPopup().$content() as dxElementWrapper;
  }

  _getPopupWrapper(): dxElementWrapper {
    return this._getPopup().$wrapper() as dxElementWrapper;
  }

  popupShowingHandler(): void {}

  popupHiddenHandler(): void {}

  _updateValue(): void {
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

  textChangedHandler(): void {}

  renderValue(): void {
    const { opened } = this.dateBox.option();

    if (opened) {
      this._updateValue();
    }
  }

  getValue(): Date {
    return this._widget?.option('value') as Date;
  }

  isAdaptivityChanged(): boolean {
    return false;
  }

  dispose(): void {
    const popup = this._getPopup();

    if (popup) {
      popup.$content()?.empty();
    }
  }

  dateBoxValue(
    value?: Date | null,
    event?: InteractionEvent | Event,
  ): Date | null | undefined {
    if (value !== undefined) {
      this.dateBox.dateValue(value, event);
    }
    return this.dateBox.getDateOption('value');
  }
}

export default DateBoxStrategy;
