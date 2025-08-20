import type { DxEvent } from '@js/events';

import type Calendar from './calendar';
import type { WeekNumberClickEvent } from './calendar.base_view';
import CalendarSelectionStrategy from './calendar.selection.strategy';

class CalendarMultiSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component: Calendar) {
    super(component);
    this.NAME = 'MultiSelection';
  }

  dateOption(optionName: 'value'): (Date | null)[];
  dateOption(optionName: 'min' | 'max'): Date | null;
  dateOption(optionName: 'min' | 'max' | 'value'): Date | null | (Date | null)[] {
    if (optionName === 'value') {
      return this.calendar._getDateOption('value') as Date[] | null;
    }
    return this.calendar._getDateOption(optionName);
  }

  getViewOptions(): {
    value: (Date | null)[];
    range: Date[];
    selectionMode: 'multiple';
    onWeekNumberClick?: ((e: WeekNumberClickEvent) => void) | null;
  } {
    return {
      value: this.dateOption('value'),
      range: [],
      selectionMode: 'multiple',
      onWeekNumberClick: this._shouldHandleWeekNumberClick()
        ? this._weekNumberClickHandler.bind(this)
        : null,
    };
  }

  selectValue(selectedValue: Date, e: DxEvent): void {
    const value = [...this.dateOption('value')];
    const alreadySelectedIndex = value
      .findIndex((date) => date?.toDateString() === selectedValue.toDateString());

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

  updateAriaSelected(val?: (Date | null)[], previousVal?: (Date | null)[]): void {
    const value = val ?? this.dateOption('value');
    const previousValue = previousVal ?? [];

    super.updateAriaSelected(value, previousValue);
  }

  getDefaultCurrentDate(): Date | null {
    const value = this.dateOption('value');
    const dates = value.filter((date) => date !== null);

    return this._getLowestDateInArray(dates);
  }

  restoreValue(): void {
    this.calendar.option('value', []);
  }

  _weekNumberClickHandler({ rowDates, event }: WeekNumberClickEvent): void {
    const selectedDates = rowDates.filter((date) => !this._isDateDisabled(date));

    this.dateValue(selectedDates, event);
  }
}

export default CalendarMultiSelectionStrategy;
