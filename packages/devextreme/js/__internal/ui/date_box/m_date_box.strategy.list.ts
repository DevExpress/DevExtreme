/* eslint-disable class-methods-use-this */
import '@ts/ui/list/modules/selection';

import dateLocalization from '@js/common/core/localization/date';
import { ensureDefined, noop } from '@js/core/utils/common';
import dateSerialization from '@js/core/utils/date_serialization';
import { getHeight, getOuterHeight } from '@js/core/utils/size';
import { isDate } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { Format } from '@js/localization';
import type { ItemClickEvent } from '@js/ui/list';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';
import { getSizeValue } from '@ts/ui/drop_down_editor/utils';
import List from '@ts/ui/list/list.edit.search';

import type { PopupProperties } from '../popup/m_popup';
import type { DateBoxBaseProperties } from './date_box.base';
import type DateBox from './date_box.base';
import dateUtils from './date_utils';
import DateBoxStrategy from './m_date_box.strategy';

const window = getWindow();

const DATE_FORMAT = 'date';

const BOUNDARY_VALUES = {
  min: new Date(0, 0, 0, 0, 0),
  max: new Date(0, 0, 0, 23, 59),
};

class ListStrategy extends DateBoxStrategy {
  _asyncScrollTimeout?: ReturnType<typeof setTimeout>;

  _widgetItems!: Date[];

  constructor(dateBox: DateBox) {
    super(dateBox);

    this.NAME = 'List';
  }

  getWidget(): List {
    return this._widget as List;
  }

  supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {
      space: noop,
      home: noop,
      end: noop,
    };
  }

  getDefaultOptions(): DateBoxBaseProperties {
    return {
      ...super.getDefaultOptions(),
      applyValueMode: 'instantly',
    };
  }

  getDisplayFormat(displayFormat?: Format): Format {
    const globalTimeFormat = getGlobalFormatByDataType('time');
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || globalTimeFormat || 'shorttime';
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return popupConfig;
  }

  getValue(): Date {
    const { selectedIndex = -1 } = this.getWidget().option();

    if (selectedIndex === -1) {
      const { value } = this.dateBox.option();

      return value as Date;
    }

    const itemData = this._widgetItems[selectedIndex];

    return this._getDateByItemData(itemData);
  }

  useCurrentDateByDefault(): boolean {
    return true;
  }

  getDefaultDate(): Date {
    return new Date(0);
  }

  popupShowingHandler(): void {
    this.dateBox._dimensionChanged();
  }

  _renderWidget(): void {
    super._renderWidget();
    this._refreshItems();
  }

  _getWidgetName(): typeof List {
    return List;
  }

  _getWidgetOptions(): Record<string, unknown> {
    return {
      itemTemplate: this._timeListItemTemplate.bind(this),
      selectionMode: 'single',
      tabIndex: -1,
      onItemClick: this._listItemClickHandler.bind(this),
      onFocusedItemChanged: (
        e: DxEvent & { actionValue: string },
      ) => this._refreshActiveDescendant(e),
    };
  }

  _refreshActiveDescendant(e: DxEvent & { actionValue: string }): void {
    this.dateBox.setAria('activedescendant', '');
    this.dateBox.setAria('activedescendant', e.actionValue);
  }

  _refreshItems(): void {
    this._widgetItems = this._getTimeListItems();
    this.getWidget().option('items', this._widgetItems);
  }

  renderOpenedState(): void {
    if (!this._widget) {
      return;
    }

    this._widget.option('focusedElement', null);
    this._setSelectedItemsByValue();

    const { templatesRenderAsynchronously } = this.getWidget().option();

    if (templatesRenderAsynchronously) {
      // eslint-disable-next-line no-restricted-globals
      this._asyncScrollTimeout = setTimeout(this._scrollToSelectedItem.bind(this));
    } else {
      this._scrollToSelectedItem();
    }
  }

  dispose(): void {
    super.dispose();

    clearTimeout(this._asyncScrollTimeout);
  }

  renderValue(): void {
    this._updateValue();
  }

  _updateValue(): void {
    if (!this._widget) {
      return;
    }

    this._refreshItems();

    const { opened } = this.dateBox.option();

    if (opened) {
      this._setSelectedItemsByValue();
      this._scrollToSelectedItem();
    }
  }

  _setSelectedItemsByValue(): void {
    const value = this.dateBoxValue();
    const dateIndex = this._getDateIndex(value);
    const widget = this.getWidget();

    if (dateIndex === -1) {
      widget.option('selectedItems', []);
    } else {
      widget.option('selectedIndex', dateIndex);
    }
  }

  _scrollToSelectedItem(): void {
    this.getWidget().scrollToItem(this.getWidget().option('selectedIndex'));
  }

  _getDateIndex(date?: Date | null): number {
    let result = -1;

    for (let i = 0, n = this._widgetItems.length; i < n; i += 1) {
      if (this._areDatesEqual(date, this._widgetItems[i])) {
        result = i;
        break;
      }
    }

    return result;
  }

  _areDatesEqual(first?: Date | null, second?: Date | null): boolean {
    return isDate(first) && isDate(second)
      && first.getHours() === second.getHours()
      && first.getMinutes() === second.getMinutes();
  }

  _getTimeListItems(): Date[] {
    let min = this.dateBox.getDateOption('min') ?? this._getBoundaryDate('min');

    const max = this.dateBox.getDateOption('max') ?? this._getBoundaryDate('max');
    const value = this.dateBox.getDateOption('value') ?? null;

    // @ts-expect-error ts-error
    let delta = max - min;

    const { interval = 30 } = this.dateBox.option();
    const minutes = min.getMinutes() % interval;

    if (delta < 0) {
      return [];
    }

    if (delta > dateUtils.ONE_DAY) {
      delta = dateUtils.ONE_DAY;
    }

    // @ts-expect-error ts-error
    if (value - min < dateUtils.ONE_DAY) {
      return this._getRangeItems(min, new Date(min), delta);
    }

    min = this._getBoundaryDate('min');
    min.setMinutes(minutes);

    // @ts-expect-error ts-error
    if (value && Math.abs(value - max) < dateUtils.ONE_DAY) {
      delta = (max.getHours() * 60 + Math.abs(max.getMinutes() - minutes)) * dateUtils.ONE_MINUTE;
    }

    return this._getRangeItems(min, new Date(min), delta);
  }

  _getRangeItems(startValue: Date, currentValue: Date, rangeDuration: number): Date[] {
    const rangeItems: Date[] = [];
    const { interval = 30 } = this.dateBox.option();

    // @ts-expect-error ts-error
    while (currentValue - startValue <= rangeDuration) {
      rangeItems.push(new Date(currentValue));
      currentValue.setMinutes(currentValue.getMinutes() + interval);
    }

    return rangeItems;
  }

  _getBoundaryDate(boundary: 'min' | 'max'): Date {
    const boundaryValue = BOUNDARY_VALUES[boundary];
    const dateBoxDate = this.dateBox.getDateOption('value');
    const newDate = new Date(0);
    const definedValue = ensureDefined(dateBoxDate, newDate);

    const currentValue = new Date(definedValue);

    return new Date(
      currentValue.getFullYear(),
      currentValue.getMonth(),
      currentValue.getDate(),
      boundaryValue.getHours(),
      boundaryValue.getMinutes(),
    );
  }

  _timeListItemTemplate(itemData: Date): string {
    const { displayFormat } = this.dateBox.option();
    return dateLocalization.format(itemData, this.getDisplayFormat(displayFormat)) as string;
  }

  _listItemClickHandler(e: ItemClickEvent): void {
    const { applyValueMode } = this.dateBox.option();
    if (applyValueMode === 'useButtons') {
      return;
    }

    const date = this._getDateByItemData(e.itemData);

    this.dateBox.option('opened', false);
    this.dateBoxValue(date, e.event);
  }

  _getDateByItemData(itemData: Date): Date {
    let { value: date } = this.dateBox.option();

    const hours = itemData.getHours();
    const minutes = itemData.getMinutes();
    const seconds = itemData.getSeconds();
    const year = itemData.getFullYear();
    const month = itemData.getMonth();
    const day = itemData.getDate();

    if (date) {
      const { dateSerializationFormat } = this.dateBox.option();

      if (dateSerializationFormat) {
        date = dateSerialization.deserializeDate(date) as Date;
      } else {
        date = new Date(date);
      }

      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
    } else {
      date = new Date(year, month, day, hours, minutes, 0, 0);
    }

    return date;
  }

  getKeyboardListener(): List {
    return this.getWidget();
  }

  _updatePopupHeight(): void {
    const { dropDownOptions } = this.dateBox.option();
    const dropDownOptionsHeight = getSizeValue(dropDownOptions?.height);

    if (dropDownOptionsHeight === undefined || dropDownOptionsHeight === 'auto') {
      this.dateBox._setPopupOption('height', 'auto');

      const popupHeight = getOuterHeight(this.getWidget().$element());
      const maxHeight = getHeight(window) * 0.45;

      this.dateBox._setPopupOption('height', Math.min(popupHeight, maxHeight));
    }
  }

  getParsedText(text?: string, format?: string): Date | undefined | null {
    let value = super.getParsedText(text, format);

    if (value) {
      // @ts-expect-error ts-error
      value = dateUtils.mergeDates(value, new Date(null), DATE_FORMAT);
    }

    return value;
  }
}

export default ListStrategy;
