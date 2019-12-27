const $ = require('../../core/renderer');
const window = require('../../core/utils/window').getWindow();
const List = require('../list');
const DateBoxStrategy = require('./ui.date_box.strategy');
const noop = require('../../core/utils/common').noop;
const ensureDefined = require('../../core/utils/common').ensureDefined;
const isDate = require('../../core/utils/type').isDate;
const extend = require('../../core/utils/extend').extend;
const dateUtils = require('./ui.date_utils');
const dateLocalization = require('../../localization/date');

const DATE_FORMAT = 'date';

const BOUNDARY_VALUES = {
    'min': new Date(0, 0, 0, 0, 0),
    'max': new Date(0, 0, 0, 23, 59)
};

const ListStrategy = DateBoxStrategy.inherit({

    NAME: 'List',

    supportedKeys: function() {
        return {
            tab: function() {
                if(this.option('opened')) {
                    this.close();
                }
            },
            space: noop,
            home: noop,
            end: noop
        };
    },

    getDefaultOptions: function() {
        return extend(this.callBase(), {
            applyValueMode: 'instantly'
        });
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || 'shorttime';
    },

    popupConfig: function(popupConfig) {
        return extend(popupConfig, {
            width: this._getPopupWidth()
        });
    },

    useCurrentDateByDefault: function() {
        return true;
    },

    getDefaultDate: function() {
        return new Date(null);
    },

    _getPopupWidth: function() {
        return this.dateBox.$element().outerWidth();
    },

    popupShowingHandler: function() {
        this._dimensionChanged();
    },

    _renderWidget: function() {
        this.callBase();
        this._refreshItems();
    },

    _getWidgetName: function() {
        return List;
    },

    _getWidgetOptions: function() {
        return {
            itemTemplate: this._timeListItemTemplate.bind(this),
            onItemClick: this._listItemClickHandler.bind(this),
            tabIndex: -1,
            onFocusedItemChanged: this._refreshActiveDescendant.bind(this),
            selectionMode: 'single'
        };
    },

    _refreshActiveDescendant: function(e) {
        this.dateBox.setAria('activedescendant', '');
        this.dateBox.setAria('activedescendant', e.actionValue);
    },

    _refreshItems: function() {
        this._widgetItems = this._getTimeListItems();
        this._widget.option('items', this._widgetItems);
    },

    renderOpenedState: function() {
        if(!this._widget) {
            return;
        }

        this._widget.option('focusedElement', null);

        this._setSelectedItemsByValue();
        if(this._widget.option('templatesRenderAsynchronously')) {
            this._asyncScrollTimeout = setTimeout(this._scrollToSelectedItem.bind(this));
        } else {
            this._scrollToSelectedItem();
        }
    },

    dispose: function() {
        this.callBase();
        clearTimeout(this._asyncScrollTimeout);
    },

    _updateValue: function() {
        if(!this._widget) {
            return;
        }

        this._refreshItems();

        this._setSelectedItemsByValue();
        this._scrollToSelectedItem();
    },

    _setSelectedItemsByValue: function() {
        const value = this.dateBoxValue();
        const dateIndex = this._getDateIndex(value);

        if(dateIndex === -1) {
            this._widget.option('selectedItems', []);
        } else {
            this._widget.option('selectedIndex', dateIndex);
        }
    },

    _scrollToSelectedItem: function() {
        this._widget.scrollToItem(this._widget.option('selectedIndex'));
    },

    _getDateIndex: function(date) {
        let result = -1;

        for(let i = 0, n = this._widgetItems.length; i < n; i++) {
            if(this._areDatesEqual(date, this._widgetItems[i])) {
                result = i;
                break;
            }
        }

        return result;
    },

    _areDatesEqual: function(first, second) {
        return isDate(first) && isDate(second)
            && first.getHours() === second.getHours()
            && first.getMinutes() === second.getMinutes();
    },

    _getTimeListItems: function() {
        let min = this.dateBox.dateOption('min') || this._getBoundaryDate('min');
        const max = this.dateBox.dateOption('max') || this._getBoundaryDate('max');
        const value = this.dateBox.dateOption('value') || null;
        let delta = max - min;
        const minutes = min.getMinutes() % this.dateBox.option('interval');

        if(delta < 0) {
            return [];
        }

        if(delta > dateUtils.ONE_DAY) {
            delta = dateUtils.ONE_DAY;
        }

        if(value - min < dateUtils.ONE_DAY) {
            return this._getRangeItems(min, new Date(min), delta);
        }

        min = this._getBoundaryDate('min');
        min.setMinutes(minutes);

        if(value && Math.abs(value - max) < dateUtils.ONE_DAY) {
            delta = (max.getHours() * 60 + Math.abs(max.getMinutes() - minutes)) * dateUtils.ONE_MINUTE;
        }

        return this._getRangeItems(min, new Date(min), delta);
    },

    _getRangeItems: function(startValue, currentValue, rangeDuration) {
        const rangeItems = [];
        const interval = this.dateBox.option('interval');

        while(currentValue - startValue < rangeDuration) {
            rangeItems.push(new Date(currentValue));
            currentValue.setMinutes(currentValue.getMinutes() + interval);
        }

        return rangeItems;
    },

    _getBoundaryDate: function(boundary) {
        const boundaryValue = BOUNDARY_VALUES[boundary];
        const currentValue = new Date(ensureDefined(this.dateBox.dateOption('value'), 0));

        return new Date(
            currentValue.getFullYear(),
            currentValue.getMonth(),
            currentValue.getDate(),
            boundaryValue.getHours(),
            boundaryValue.getMinutes()
        );
    },

    _timeListItemTemplate: function(itemData) {
        const displayFormat = this.dateBox.option('displayFormat');
        return dateLocalization.format(itemData, this.getDisplayFormat(displayFormat));
    },

    _listItemClickHandler: function(e) {
        this.dateBox.option('opened', false);

        let date = this.dateBox.option('value');
        const { itemData } = e;
        const hours = itemData.getHours();
        const minutes = itemData.getMinutes();
        const seconds = itemData.getSeconds();
        const year = itemData.getFullYear();
        const month = itemData.getMonth();
        const day = itemData.getDate();

        if(date) {
            date = new Date(date);

            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setFullYear(year);
            date.setMonth(month);
            date.setDate(day);
        } else {
            date = new Date(year, month, day, hours, minutes, 0, 0);
        }

        this.dateBoxValue(date);
    },

    getKeyboardListener() {
        return this._widget;
    },

    _dimensionChanged: function() {
        this._getPopup() && this._updatePopupDimensions();
    },

    _updatePopupDimensions: function() {
        this._updatePopupWidth();
        this._updatePopupHeight();
    },

    _updatePopupWidth: function() {
        this.dateBox._setPopupOption('width', this._getPopupWidth());
    },

    _updatePopupHeight: function() {
        this.dateBox._setPopupOption('height', 'auto');

        const popupHeight = this._widget.$element().outerHeight();
        const maxHeight = $(window).height() * 0.45;
        this.dateBox._setPopupOption('height', Math.min(popupHeight, maxHeight));
        this.dateBox._timeList && this.dateBox._timeList.updateDimensions();
    },

    getParsedText: function(text, format) {
        let value = this.callBase(text, format);

        if(value) {
            value = dateUtils.mergeDates(value, new Date(null), DATE_FORMAT);
        }

        return value;
    }
});

module.exports = ListStrategy;
