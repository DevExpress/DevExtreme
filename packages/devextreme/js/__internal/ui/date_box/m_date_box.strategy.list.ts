/* eslint-disable class-methods-use-this */
import '@ts/ui/list/modules/selection';

import dateLocalization from '@js/common/core/localization/date';
import { ensureDefined, noop } from '@js/core/utils/common';
import dateSerialization from '@js/core/utils/date_serialization';
import { getHeight, getOuterHeight } from '@js/core/utils/size';
import { isDate } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import { getSizeValue } from '@ts/ui/drop_down_editor/m_utils';
import List from '@ts/ui/list/list.edit.search';

import type { PopupProperties } from '../popup/m_popup';
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

  ctor(dateBox): void {
    super.ctor(dateBox);

    this.NAME = 'List';
  }

  supportedKeys() {
    return {
      space: noop,
      home: noop,
      end: noop,
    };
  }

  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      applyValueMode: 'instantly',
    };
  }

  getDisplayFormat(displayFormat) {
    return displayFormat || 'shorttime';
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return popupConfig;
  }

  getValue() {
    const selectedIndex = this._widget.option('selectedIndex');

    if (selectedIndex === -1) {
      return this.dateBox.option('value');
    }

    const itemData = this._widgetItems[selectedIndex];
    return this._getDateByItemData(itemData);
  }

  useCurrentDateByDefault(): boolean {
    return true;
  }

  getDefaultDate() {
    // @ts-expect-error ts-error
    return new Date(null);
  }

  popupShowingHandler(): void {
    this.dateBox._dimensionChanged();
  }

  _renderWidget(): void {
    super._renderWidget();
    this._refreshItems();
  }

  _getWidgetName() {
    return List;
  }

  _getWidgetOptions() {
    return {
      itemTemplate: this._timeListItemTemplate.bind(this),
      onItemClick: this._listItemClickHandler.bind(this),
      tabIndex: -1,
      onFocusedItemChanged: this._refreshActiveDescendant.bind(this),
      selectionMode: 'single',
    };
  }

  _refreshActiveDescendant(e): void {
    this.dateBox.setAria('activedescendant', '');
    this.dateBox.setAria('activedescendant', e.actionValue);
  }

  _refreshItems(): void {
    this._widgetItems = this._getTimeListItems();
    this._widget.option('items', this._widgetItems);
  }

  renderOpenedState(): void {
    if (!this._widget) {
      return;
    }

    this._widget.option('focusedElement', null);

    this._setSelectedItemsByValue();
    if (this._widget.option('templatesRenderAsynchronously')) {
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

    if (dateIndex === -1) {
      this._widget.option('selectedItems', []);
    } else {
      this._widget.option('selectedIndex', dateIndex);
    }
  }

  _scrollToSelectedItem(): void {
    this._widget.scrollToItem(this._widget.option('selectedIndex'));
  }

  _getDateIndex(date) {
    let result = -1;

    for (let i = 0, n = this._widgetItems.length; i < n; i++) {
      if (this._areDatesEqual(date, this._widgetItems[i])) {
        result = i;
        break;
      }
    }

    return result;
  }

  _areDatesEqual(first, second) {
    return isDate(first) && isDate(second)
    && first.getHours() === second.getHours()
    && first.getMinutes() === second.getMinutes();
  }

  _getTimeListItems() {
    let min = this.dateBox.getDateOption('min') || this._getBoundaryDate('min');
    const max = this.dateBox.getDateOption('max') || this._getBoundaryDate('max');
    const value = this.dateBox.getDateOption('value') || null;
    let delta = max - min;
    const minutes = min.getMinutes() % this.dateBox.option('interval');

    if (delta < 0) {
      return [];
    }

    if (delta > dateUtils.ONE_DAY) {
      delta = dateUtils.ONE_DAY;
    }

    if (value - min < dateUtils.ONE_DAY) {
      return this._getRangeItems(min, new Date(min), delta);
    }

    min = this._getBoundaryDate('min');
    min.setMinutes(minutes);

    if (value && Math.abs(value - max) < dateUtils.ONE_DAY) {
      delta = (max.getHours() * 60 + Math.abs(max.getMinutes() - minutes)) * dateUtils.ONE_MINUTE;
    }

    return this._getRangeItems(min, new Date(min), delta);
  }

  _getRangeItems(startValue, currentValue, rangeDuration) {
    const rangeItems = [];
    const interval = this.dateBox.option('interval');

    while (currentValue - startValue <= rangeDuration) {
      // @ts-expect-error
      rangeItems.push(new Date(currentValue));
      currentValue.setMinutes(currentValue.getMinutes() + interval);
    }

    return rangeItems;
  }

  _getBoundaryDate(boundary) {
    const boundaryValue = BOUNDARY_VALUES[boundary];
    const currentValue = new Date(ensureDefined(this.dateBox.getDateOption('value'), 0));

    return new Date(
      currentValue.getFullYear(),
      currentValue.getMonth(),
      currentValue.getDate(),
      boundaryValue.getHours(),
      boundaryValue.getMinutes(),
    );
  }

  _timeListItemTemplate(itemData) {
    const displayFormat = this.dateBox.option('displayFormat');
    return dateLocalization.format(itemData, this.getDisplayFormat(displayFormat));
  }

  _listItemClickHandler(e): void {
    if (this.dateBox.option('applyValueMode') === 'useButtons') {
      return;
    }

    const date = this._getDateByItemData(e.itemData);

    this.dateBox.option('opened', false);
    this.dateBoxValue(date, e.event);
  }

  _getDateByItemData(itemData) {
    let date = this.dateBox.option('value');
    const hours = itemData.getHours();
    const minutes = itemData.getMinutes();
    const seconds = itemData.getSeconds();
    const year = itemData.getFullYear();
    const month = itemData.getMonth();
    const day = itemData.getDate();

    if (date) {
      if (this.dateBox.option('dateSerializationFormat')) {
        date = dateSerialization.deserializeDate(date);
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

  getKeyboardListener() {
    return this._widget;
  }

  _updatePopupHeight(): void {
    const dropDownOptionsHeight = getSizeValue(this.dateBox.option('dropDownOptions.height'));
    if (dropDownOptionsHeight === undefined || dropDownOptionsHeight === 'auto') {
      this.dateBox._setPopupOption('height', 'auto');
      const popupHeight = getOuterHeight(this._widget.$element());
      const maxHeight = getHeight(window) * 0.45;
      this.dateBox._setPopupOption('height', Math.min(popupHeight, maxHeight));
    }

    this.dateBox._timeList?.updateDimensions();
  }

  getParsedText(text, format) {
    let value = super.getParsedText(text, format);

    if (value) {
      // @ts-expect-error ts-error
      value = dateUtils.mergeDates(value, new Date(null), DATE_FORMAT);
    }

    return value;
  }
}

export default ListStrategy;
