import CalendarSelectionStrategy from './m_calendar.selection.strategy';

const DAY_INTERVAL = 86400000;

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
      _ranges: this._generateRanges(this.dateOption('value')),
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

  _generateRanges(value) {
    const sortedValue = value.sort((a, b) => a - b);

    const ranges = [];
    let startDate = sortedValue[0];

    sortedValue.forEach((date, index) => {
      if (index === 0) {
        return;
      }

      const prevDay = new Date(sortedValue[index - 1]).setHours(0, 0, 0, 0);
      const currentDay = new Date(date).setHours(0, 0, 0, 0);

      const diffInDays = (currentDay - prevDay) / DAY_INTERVAL;

      if (diffInDays > 1) {
        // @ts-expect-error
        ranges.push([startDate, sortedValue[index - 1]]);

        startDate = date;
      }
    });

    // @ts-expect-error
    ranges.push([startDate, sortedValue[sortedValue.length - 1]]);

    return ranges;
  }
}

export default CalendarMultiSelectionStrategy;
