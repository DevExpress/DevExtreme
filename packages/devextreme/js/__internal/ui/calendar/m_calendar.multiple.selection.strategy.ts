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
      // range: [],
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

  // TODO: Check in runtime
  _generateRanges(values) {
    // TODO: Check with all value formats:
    // https://js.devexpress.com/jQuery/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value
    const datesInMilliseconds = values.map((value) => {
      const date = new Date(new Date(value).setHours(0, 0, 0, 0)).getTime();

      return date;
    });
    const sortedDates = datesInMilliseconds.sort((a, b) => a - b);

    const ranges = [];

    let startDate = sortedDates[0];

    sortedDates.forEach((date, index) => {
      if (index === 0) {
        return;
      }

      const previousDate = sortedDates[index - 1];

      const isNewRange = date - previousDate > DAY_INTERVAL;

      if (isNewRange) {
        if (startDate === sortedDates[index - 1]) {
          // @ts-expect-error
          ranges.push([startDate]);
        } else {
          // @ts-expect-error
          ranges.push([startDate, sortedDates[index - 1]]);
        }

        startDate = date;
      }
    });

    if (startDate === sortedDates[sortedDates.length - 1]) {
      // @ts-expect-error
      ranges.push([startDate]);
    } else {
      // @ts-expect-error
      ranges.push([startDate, sortedDates[sortedDates.length - 1]]);
    }

    return ranges;
  }
}

export default CalendarMultiSelectionStrategy;
