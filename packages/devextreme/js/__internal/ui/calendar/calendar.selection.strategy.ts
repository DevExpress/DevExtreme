import type { DateLike } from '@js/common';
import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';

import type Calendar from './calendar';

class CalendarSelectionStrategy {
  public NAME!: string;

  public calendar!: Calendar;

  public _currentDateChanged?: boolean;

  constructor(component: Calendar) {
    this.calendar = component;
  }

  dateValue(value: Date | null | (Date | null)[], e: DxEvent): void {
    this.calendar._dateValue(value, e);
  }

  skipNavigate(): void {
    this.calendar._skipNavigate = true;
  }

  updateAriaSelected(value: (Date | null)[], previousValue: (Date | null)[]): void {
    this.calendar._updateAriaSelected(value, previousValue);
    const { currentDate = new Date() } = this.calendar.option();

    if (value[0] && currentDate.getTime() === value[0].getTime()) {
      this.calendar._updateAriaId(value[0]);
    }
  }

  processValueChanged(
    val: Date | null | (Date | null)[],
    previousVal: Date | null | (Date | null)[],
  ): void {
    let value = val;
    let previousValue = previousVal;
    if (isDefined(value) && !Array.isArray(value)) {
      value = [value];
    }
    if (isDefined(previousValue) && !Array.isArray(previousValue)) {
      previousValue = [previousValue];
    }
    value = value?.map((item) => this._convertToDate(item)) ?? [];
    previousValue = previousValue?.map((item) => this._convertToDate(item)) ?? [];

    this._updateViewsValue(value.filter((item): item is Date => item !== null));
    this.updateAriaSelected(value, previousValue);

    if (!this._currentDateChanged) {
      this.calendar._initCurrentDate();
    }
    this._currentDateChanged = false;
  }

  _isDateDisabled(date: Date): boolean {
    const min = this.calendar._getDateOption('min');
    const max = this.calendar._getDateOption('max');
    const isLessThanMin = isDefined(min) && date < min && !dateUtils.sameDate(min, date);
    const isBiggerThanMax = isDefined(max) && date > max && !dateUtils.sameDate(max, date);

    return this.calendar._view.isDateDisabled(date) || isLessThanMin || isBiggerThanMax;
  }

  _getLowestDateInArray(dates: (Date | null)[]): Date | null {
    if (dates.length) {
      return new Date(Math.min(...dates.map((date) => date?.getTime() ?? Infinity)));
    }

    return null;
  }

  _convertToDate(value: DateLike): Date | null {
    return this.calendar._convertToDate(value);
  }

  _isMaxZoomLevel(): boolean {
    return this.calendar._isMaxZoomLevel();
  }

  _updateViewsOption(optionName: string, optionValue: Date | Date[]): void {
    this.calendar._updateViewsOption(optionName, optionValue);
  }

  _updateViewsValue(value: Date | Date[]): void {
    this._updateViewsOption('value', value);
  }

  _updateCurrentDate(value: Date | null): void {
    this.calendar.option('currentDate', value ?? new Date());
  }

  _shouldHandleWeekNumberClick(): boolean {
    const { selectionMode, selectWeekOnClick } = this.calendar.option();

    return selectWeekOnClick === true && selectionMode !== 'single';
  }
}

export default CalendarSelectionStrategy;
