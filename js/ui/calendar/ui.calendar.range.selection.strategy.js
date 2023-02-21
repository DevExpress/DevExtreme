import dateUtils from '../../core/utils/date';
import CalendarSelectionStrategy from './ui.calendar.selection.strategy';

const DAY_INTERVAL = 86400000;

class CalendarRangeSelectionStrategy extends CalendarSelectionStrategy {
    constructor(component) {
        super(component);
        this.NAME = 'RangeSelection';
    }

    getViewOptions() {
        const value = this._getValues();
        const range = this._getDaysInRange(value[0], value[1]);

        return {
            value,
            range,
            selectionMode: 'range',
            onCellHover: this._cellHoverHandler.bind(this),
        };
    }

    selectValue(selectedValue, e) {
        const [startDate, endDate] = this._getValues();

        this._updateCurrentDate(selectedValue);
        this._currentDateChanged = true;
        if(!startDate || endDate) {
            this.dateValue([selectedValue, null], e);
        } else {
            this.dateValue(startDate < selectedValue ? [startDate, selectedValue] : [selectedValue, startDate], e);
        }
    }

    updateAriaSelected(value, previousValue) {
        value ??= this._getValues();
        previousValue ??= [];

        super.updateAriaSelected(value, previousValue);
    }

    processValueChanged(value, previousValue) {
        super.processValueChanged(value, previousValue);

        const range = this._getRange();
        this._updateViewsOption('range', range);
    }

    getDefaultCurrentDate() {
        const dates = this.dateOption('values').filter(value => value);
        return this._getLowestDateInArray(dates);
    }

    _getValues() {
        const values = this.dateOption('values');

        if(!values.length) {
            return values;
        }

        let [startDate, endDate] = values;

        if(startDate && endDate && startDate > endDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        return [startDate, endDate];
    }

    _getRange() {
        const [startDate, endDate] = this._getValues();
        return this._getDaysInRange(startDate, endDate);
    }

    _getDaysInRange(startDate, endDate) {
        return startDate && endDate
            ? [...dateUtils.getDatesOfInterval(startDate, endDate, DAY_INTERVAL), endDate]
            : [];
    }

    _cellHoverHandler(e) {
        const isMaxZoomLevel = this._isMaxZoomLevel();
        const [startDate, endDate] = this._getValues();

        if(isMaxZoomLevel && startDate && !endDate) {
            this._updateViewsOption('range', this._getDaysInRange(startDate, e.value));
        }
    }
}

export default CalendarRangeSelectionStrategy;
