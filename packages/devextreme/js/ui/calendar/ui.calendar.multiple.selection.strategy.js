import CalendarSelectionStrategy from './ui.calendar.selection.strategy';

class CalendarMultiSelectionStrategy extends CalendarSelectionStrategy {
    constructor(component) {
        super(component);
        this.NAME = 'MultiSelection';
    }

    getViewOptions() {
        return {
            value: this.dateOption('values'),
            range: [],
            selectionMode: 'multi',
            onWeekNumberClick: this._shouldHandleWeekNumberClick() ? this._weekNumberClickHandler.bind(this) : null,
        };
    }

    selectValue(selectedValue, e) {
        const values = [...this.dateOption('values')];
        const alreadySelectedIndex = values.findIndex(date => date?.toDateString() === selectedValue.toDateString());

        if(alreadySelectedIndex > -1) {
            values.splice(alreadySelectedIndex, 1);
        } else {
            values.push(selectedValue);
        }

        this.skipNavigate();
        this._updateCurrentDate(selectedValue);
        this._currentDateChanged = true;
        this.dateValue(values, e);
    }

    updateAriaSelected(value, previousValue) {
        value ??= this.dateOption('values');
        previousValue ??= [];

        super.updateAriaSelected(value, previousValue);
    }

    getDefaultCurrentDate() {
        const dates = this.dateOption('values').filter(value => value);
        return this._getLowestDateInArray(dates);
    }

    restoreValue() {
        this.calendar.option('values', []);
    }

    _weekNumberClickHandler({ rowDates, event }) {
        const selectedDates = rowDates.filter((date) => !this._isDateDisabled(date));

        this.dateValue(selectedDates, event);
    }
}

export default CalendarMultiSelectionStrategy;
