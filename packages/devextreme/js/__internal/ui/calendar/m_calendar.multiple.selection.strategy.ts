import { DAY_INTERVAL } from './m_calendar.base_view';
import CalendarSelectionStrategy from './m_calendar.selection.strategy';

class CalendarMultiSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component) {
    super(component);
    this.NAME = 'MultiSelection';
  }

  getViewOptions() {
    const value = this.dateOption('value');

    return {
      value,
      range: [],
      ranges: this._generateRanges(value),
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

  _generateRanges(values) {
    const datesInMilliseconds = values.map((value) => {
      const date = new Date(new Date(value).setHours(0, 0, 0, 0)).getTime();

      return date;
    });
    const sortedDates = datesInMilliseconds.sort((a, b) => a - b);

    const getRange = (date, dates, index) => {
      const range = date === dates[index - 1]
        ? [date]
        : [date, dates[index - 1]];

      return range.map((value) => new Date(value));
    };

    const ranges = [];

    let startDate = sortedDates[0];

    sortedDates.forEach((date, index) => {
      if (index === 0) {
        return;
      }

      const previousDate = sortedDates[index - 1];
      const isNewRange = date - previousDate > DAY_INTERVAL;

      if (isNewRange) {
        const range = getRange(startDate, sortedDates, index);

        // @ts-expect-error
        ranges.push(range);

        startDate = date;
      }
    });

    const range = getRange(startDate, sortedDates, sortedDates.length);

    // @ts-expect-error
    ranges.push(range);

    return ranges;
  }

  processValueChanged(value, previousValue): void {
    const ranges = this._generateRanges(value);

    this._updateViewsOption('ranges', ranges);

    super.processValueChanged(value, previousValue);
  }
}

export default CalendarMultiSelectionStrategy;
