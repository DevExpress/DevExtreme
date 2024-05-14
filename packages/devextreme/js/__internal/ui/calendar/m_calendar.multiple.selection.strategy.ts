import CalendarSelectionStrategy from './m_calendar.selection.strategy';

class CalendarMultiSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component) {
    super(component);
    this.NAME = 'MultiSelection';
  }

  getViewOptions() {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'multiple',
      onWeekNumberClick: this._shouldHandleWeekNumberClick() ? this._weekNumberClickHandler.bind(this) : null,
    };
  }

  selectValue(selectedValue, e) {
    const value = [...this.dateOption('value')];
    const alreadySelectedIndex = value.findIndex((date) => date?.toDateString() === selectedValue.toDateString());

    if (alreadySelectedIndex > -1) {
      value.splice(alreadySelectedIndex, 1);
    } else {
      value.push(selectedValue);
    }

    this.skipNavigate();
    this._updateCurrentDate(selectedValue);
    this._currentDateChanged = true;
    this.dateValue(value, e);
  }

  updateAriaSelected(value, previousValue) {
    value ??= this.dateOption('value');
    previousValue ??= [];

    super.updateAriaSelected(value, previousValue);
  }

  getDefaultCurrentDate() {
    const dates = this.dateOption('value').filter((value) => value);
    return this._getLowestDateInArray(dates);
  }

  restoreValue() {
    this.calendar.option('value', []);
  }

  _weekNumberClickHandler({ rowDates, event }) {
    const selectedDates = rowDates.filter((date) => !this._isDateDisabled(date));

    this.dateValue(selectedDates, event);
  }
}

export default CalendarMultiSelectionStrategy;
