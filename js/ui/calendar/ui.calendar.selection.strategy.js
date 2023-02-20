import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import dateUtils from '../../core/utils/date';

const abstract = Class.abstract;

const DAY_INTERVAL = 86400000;

const CalendarSelectionStrategy = Class.inherit({
    ctor: function(calendar) {
        this.calendar = calendar;
    },

    getViewOptions: abstract,

    dateOption: function(optionName) {
        return this.calendar._dateOption(optionName);
    },

    dateValue: function(value, e) {
        this.calendar._dateValue(value, e);
    },

    updateAriaSelected: function(value, previousValue) {
        this.calendar._updateAriaSelected(value, previousValue);

        if(value[0] && this.calendar.option('currentDate').getTime() === value[0].getTime()) {
            this.calendar._updateAriaId(value[0]);
        }
    },

    processValueChanged: function(value, previousValue) {
        value = (value || []).map((item) => this._convertToDate(item));
        previousValue = (previousValue || []).map((item) => this._convertToDate(item));

        this._updateViewsValue(value);
        this.updateAriaSelected(value, previousValue);

        !this._currentDateChanged && this.calendar._initCurrentDate();
        this._currentDateChanged = false;
    },

    getDefaultCurrentDate: noop,

    _getLowestDateInArray: function(dates) {
        if(dates.length) {
            return new Date(Math.min(...dates));
        }
    },

    _convertToDate: function(value) {
        return this.calendar._convertToDate(value);
    },

    _isMaxZoomLevel: function() {
        return this.calendar._isMaxZoomLevel();
    },

    _updateViewsOption: function(optionName, optionValue) {
        this.calendar._updateViewsOption(optionName, optionValue);
    },

    _updateViewsValue: function(value) {
        this._updateViewsOption('value', value);
    },

    _updateCurrentDate: function(value) {
        this.calendar.option('currentDate', value || new Date());
    }
});

const CalendarSingleSelectionStrategy = CalendarSelectionStrategy.inherit({
    NAME: 'SingleSelection',

    getViewOptions: function() {
        return {
            value: this.dateOption('value'),
            range: [],
            selectionMode: 'single',
        };
    },

    selectValue: function(selectedValue, e) {
        this.dateValue(selectedValue, e);
    },

    updateAriaSelected: function(value, previousValue) {
        value = value ?? [this.dateOption('value')];
        previousValue = previousValue ?? [];

        this.callBase(value, previousValue);
    },

    getDefaultCurrentDate: function() {
        return this.dateOption('value');
    },

    _updateViewsValue: function(value) {
        this._updateViewsOption('value', value[0]);
    },
});

const CalendarMultiSelectionStrategy = CalendarSelectionStrategy.inherit({
    NAME: 'MultiSelection',

    getViewOptions: function() {
        return {
            value: this.dateOption('values'),
            range: [],
            selectionMode: 'multi',
        };
    },

    selectValue: function(selectedValue, e) {
        const values = [...this.dateOption('values')];
        const alreadySelectedIndex = values.findIndex(date => date?.toDateString() === selectedValue.toDateString());

        if(alreadySelectedIndex > -1) {
            values.splice(alreadySelectedIndex, 1);
        } else {
            values.push(selectedValue);
        }

        this._updateCurrentDate(selectedValue);
        this._currentDateChanged = true;
        this.dateValue(values, e);
    },

    updateAriaSelected: function(value, previousValue) {
        value = value ?? this.dateOption('values');
        previousValue = previousValue ?? [];

        this.callBase(value, previousValue);
    },

    getDefaultCurrentDate: function() {
        return this._getLowestDateInArray(this.dateOption('values').filter(value => value));
    },
});

const CalendarRangeSelectionStrategy = CalendarSelectionStrategy.inherit({
    NAME: 'RangeSelection',

    getViewOptions: function() {
        const value = this._getValues();
        const range = this._getDaysInRange(value[0], value[1]);

        return {
            value,
            range,
            selectionMode: 'range',
            onCellHover: this._cellHoverHandler.bind(this),
        };
    },

    selectValue: function(selectedValue, e) {
        const [startDate, endDate] = this._getValues();

        this._updateCurrentDate(selectedValue);
        this._currentDateChanged = true;
        if(!startDate || endDate) {
            this.dateValue([selectedValue, null], e);
        } else {
            this.dateValue(startDate < selectedValue ? [startDate, selectedValue] : [selectedValue, startDate], e);
        }
    },

    updateAriaSelected: function(value, previousValue) {
        value = value ?? this._getValues();
        previousValue = previousValue ?? [];

        this.callBase(value, previousValue);
    },

    processValueChanged: function(value, previousValue) {
        this.callBase(value, previousValue);

        const range = this._getRange();
        this._updateViewsOption('range', range);
    },

    getDefaultCurrentDate: function() {
        return this._getLowestDateInArray(this._getValues().filter(value => value));
    },

    _getValues: function() {
        const values = this.dateOption('values');

        if(!values.length) {
            return values;
        }

        let [startDate, endDate] = values;

        if(startDate && endDate && startDate > endDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        return [startDate, endDate];
    },

    _getRange: function() {
        const [startDate, endDate] = this._getValues();
        return this._getDaysInRange(startDate, endDate);
    },

    _getDaysInRange: function(startDate, endDate) {
        return startDate && endDate
            ? [...dateUtils.getDatesOfInterval(startDate, endDate, DAY_INTERVAL), endDate]
            : [];
    },

    _cellHoverHandler: function(e) {
        const isMaxZoomLevel = this._isMaxZoomLevel();
        const [startDate, endDate] = this._getValues();

        if(isMaxZoomLevel && startDate && !endDate) {
            this._updateViewsOption('range', this._getDaysInRange(startDate, e.value));
        }
    },
});

export {
    CalendarSingleSelectionStrategy,
    CalendarMultiSelectionStrategy,
    CalendarRangeSelectionStrategy
};
