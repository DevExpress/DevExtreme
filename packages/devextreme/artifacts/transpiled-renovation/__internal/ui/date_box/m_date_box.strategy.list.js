"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("../../ui/list/modules/m_selection");
var _common = require("../../../core/utils/common");
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _extend = require("../../../core/utils/extend");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _date = _interopRequireDefault(require("../../../localization/date"));
var _list_light = _interopRequireDefault(require("../../../ui/list_light"));
var _m_utils = require("../../ui/drop_down_editor/m_utils");
var _m_date_box = _interopRequireDefault(require("./m_date_box.strategy"));
var _m_date_utils = _interopRequireDefault(require("./m_date_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const DATE_FORMAT = 'date';
const BOUNDARY_VALUES = {
  min: new Date(0, 0, 0, 0, 0),
  max: new Date(0, 0, 0, 23, 59)
};
const ListStrategy = _m_date_box.default.inherit({
  NAME: 'List',
  supportedKeys() {
    return {
      space: _common.noop,
      home: _common.noop,
      end: _common.noop
    };
  },
  getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      applyValueMode: 'instantly'
    });
  },
  getDisplayFormat(displayFormat) {
    return displayFormat || 'shorttime';
  },
  popupConfig(popupConfig) {
    return popupConfig;
  },
  getValue() {
    const selectedIndex = this._widget.option('selectedIndex');
    if (selectedIndex === -1) {
      return this.dateBox.option('value');
    }
    const itemData = this._widgetItems[selectedIndex];
    return this._getDateByItemData(itemData);
  },
  useCurrentDateByDefault() {
    return true;
  },
  getDefaultDate() {
    // @ts-expect-error
    return new Date(null);
  },
  popupShowingHandler() {
    this.dateBox._dimensionChanged();
  },
  _renderWidget() {
    this.callBase();
    this._refreshItems();
  },
  _getWidgetName() {
    return _list_light.default;
  },
  _getWidgetOptions() {
    return {
      itemTemplate: this._timeListItemTemplate.bind(this),
      onItemClick: this._listItemClickHandler.bind(this),
      tabIndex: -1,
      onFocusedItemChanged: this._refreshActiveDescendant.bind(this),
      selectionMode: 'single'
    };
  },
  _refreshActiveDescendant(e) {
    this.dateBox.setAria('activedescendant', '');
    this.dateBox.setAria('activedescendant', e.actionValue);
  },
  _refreshItems() {
    this._widgetItems = this._getTimeListItems();
    this._widget.option('items', this._widgetItems);
  },
  renderOpenedState() {
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
  },
  dispose() {
    this.callBase();
    clearTimeout(this._asyncScrollTimeout);
  },
  _updateValue() {
    if (!this._widget) {
      return;
    }
    this._refreshItems();
    this._setSelectedItemsByValue();
    this._scrollToSelectedItem();
  },
  _setSelectedItemsByValue() {
    const value = this.dateBoxValue();
    const dateIndex = this._getDateIndex(value);
    if (dateIndex === -1) {
      this._widget.option('selectedItems', []);
    } else {
      this._widget.option('selectedIndex', dateIndex);
    }
  },
  _scrollToSelectedItem() {
    this._widget.scrollToItem(this._widget.option('selectedIndex'));
  },
  _getDateIndex(date) {
    let result = -1;
    for (let i = 0, n = this._widgetItems.length; i < n; i++) {
      if (this._areDatesEqual(date, this._widgetItems[i])) {
        result = i;
        break;
      }
    }
    return result;
  },
  _areDatesEqual(first, second) {
    return (0, _type.isDate)(first) && (0, _type.isDate)(second) && first.getHours() === second.getHours() && first.getMinutes() === second.getMinutes();
  },
  _getTimeListItems() {
    let min = this.dateBox.dateOption('min') || this._getBoundaryDate('min');
    const max = this.dateBox.dateOption('max') || this._getBoundaryDate('max');
    const value = this.dateBox.dateOption('value') || null;
    let delta = max - min;
    const minutes = min.getMinutes() % this.dateBox.option('interval');
    if (delta < 0) {
      return [];
    }
    if (delta > _m_date_utils.default.ONE_DAY) {
      delta = _m_date_utils.default.ONE_DAY;
    }
    if (value - min < _m_date_utils.default.ONE_DAY) {
      return this._getRangeItems(min, new Date(min), delta);
    }
    min = this._getBoundaryDate('min');
    min.setMinutes(minutes);
    if (value && Math.abs(value - max) < _m_date_utils.default.ONE_DAY) {
      delta = (max.getHours() * 60 + Math.abs(max.getMinutes() - minutes)) * _m_date_utils.default.ONE_MINUTE;
    }
    return this._getRangeItems(min, new Date(min), delta);
  },
  _getRangeItems(startValue, currentValue, rangeDuration) {
    const rangeItems = [];
    const interval = this.dateBox.option('interval');
    while (currentValue - startValue <= rangeDuration) {
      // @ts-expect-error
      rangeItems.push(new Date(currentValue));
      currentValue.setMinutes(currentValue.getMinutes() + interval);
    }
    return rangeItems;
  },
  _getBoundaryDate(boundary) {
    const boundaryValue = BOUNDARY_VALUES[boundary];
    const currentValue = new Date((0, _common.ensureDefined)(this.dateBox.dateOption('value'), 0));
    return new Date(currentValue.getFullYear(), currentValue.getMonth(), currentValue.getDate(), boundaryValue.getHours(), boundaryValue.getMinutes());
  },
  _timeListItemTemplate(itemData) {
    const displayFormat = this.dateBox.option('displayFormat');
    return _date.default.format(itemData, this.getDisplayFormat(displayFormat));
  },
  _listItemClickHandler(e) {
    if (this.dateBox.option('applyValueMode') === 'useButtons') {
      return;
    }
    const date = this._getDateByItemData(e.itemData);
    this.dateBox.option('opened', false);
    this.dateBoxValue(date, e.event);
  },
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
        date = _date_serialization.default.deserializeDate(date);
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
  },
  getKeyboardListener() {
    return this._widget;
  },
  _updatePopupHeight() {
    const dropDownOptionsHeight = (0, _m_utils.getSizeValue)(this.dateBox.option('dropDownOptions.height'));
    if (dropDownOptionsHeight === undefined || dropDownOptionsHeight === 'auto') {
      this.dateBox._setPopupOption('height', 'auto');
      const popupHeight = (0, _size.getOuterHeight)(this._widget.$element());
      const maxHeight = (0, _size.getHeight)(window) * 0.45;
      this.dateBox._setPopupOption('height', Math.min(popupHeight, maxHeight));
    }
    this.dateBox._timeList && this.dateBox._timeList.updateDimensions();
  },
  getParsedText(text, format) {
    let value = this.callBase(text, format);
    if (value) {
      // @ts-expect-error
      value = _m_date_utils.default.mergeDates(value, new Date(null), DATE_FORMAT);
    }
    return value;
  }
});
var _default = exports.default = ListStrategy;