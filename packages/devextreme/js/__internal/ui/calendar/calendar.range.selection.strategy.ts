import dateUtils from '@js/core/utils/date';
import type { DxEvent } from '@js/events';

import type Calendar from './calendar';
import type { CellEvent, WeekNumberClickEvent } from './calendar.base_view';
import CalendarSelectionStrategy from './calendar.selection.strategy';

const DAY_INTERVAL = 86400000;

class CalendarRangeSelectionStrategy extends CalendarSelectionStrategy {
  constructor(component: Calendar) {
    super(component);
    this.NAME = 'RangeSelection';
  }

  dateOption(optionName: 'value'): (Date | null)[];
  dateOption(optionName: 'min' | 'max'): Date | null;
  dateOption(optionName: 'min' | 'max' | 'value'): Date | null | (Date | null)[] {
    if (optionName === 'value') {
      return this.calendar._getDateOption('value') as (Date | null)[] || null;
    }
    return this.calendar._getDateOption(optionName);
  }

  getViewOptions(): {
    value: (Date | null)[];
    range: Date[];
    selectionMode: 'range';
    onCellHover?: (e: CellEvent) => void;
    onWeekNumberClick?: ((e: WeekNumberClickEvent) => void) | null;
  } {
    const value = this._getValue();
    const range = this._getDaysInRange(value[0], value[1]);

    return {
      value,
      range,
      selectionMode: 'range',
      onCellHover: this._cellHoverHandler.bind(this),
      onWeekNumberClick: this._shouldHandleWeekNumberClick()
        ? this._weekNumberClickHandler.bind(this)
        : null,
    };
  }

  selectValue(selectedValue: Date, e: DxEvent): void {
    const [startDate, endDate] = this._getValue();

    this.skipNavigate();
    this._updateCurrentDate(selectedValue);
    this._currentDateChanged = true;
    const { allowChangeSelectionOrder, currentSelection } = this.calendar.option();

    if (allowChangeSelectionOrder === true) {
      this.calendar._valueSelected = true;
      const convertedSelectedValue = this.calendar._convertToDate(selectedValue) as Date;
      if (currentSelection === 'startDate') {
        if (convertedSelectedValue > (this.calendar._convertToDate(endDate) ?? new Date(0))) {
          this.dateValue([selectedValue, null], e);
        } else {
          this.dateValue([selectedValue, endDate], e);
        }
      } else if (convertedSelectedValue
        >= (this.calendar._convertToDate(startDate) ?? new Date(0))) {
        this.dateValue([startDate, selectedValue], e);
      } else {
        this.dateValue([selectedValue, null], e);
      }
    } else if (!startDate || endDate) {
      this.dateValue([selectedValue, null], e);
    } else {
      this.dateValue(
        startDate < selectedValue
          ? [startDate, selectedValue]
          : [selectedValue, startDate],
        e,
      );
    }
  }

  updateAriaSelected(val?: (Date | null)[] | null, previousVal?: (Date | null)[] | null): void {
    const value = val ?? this._getValue();
    const previousValue = previousVal ?? [];
    super.updateAriaSelected(value, previousValue);
  }

  processValueChanged(value: (Date | null)[], previousValue: (Date | null)[]): void {
    super.processValueChanged(value, previousValue);

    const range = this._getRange();
    this._updateViewsOption('range', range);
  }

  getDefaultCurrentDate(): Date | null {
    const { allowChangeSelectionOrder, currentSelection } = this.calendar.option();
    const value = this.dateOption('value');

    if (allowChangeSelectionOrder) {
      if (currentSelection === 'startDate' && value[0]) {
        return value[0];
      }

      if (currentSelection === 'endDate' && value[1]) {
        return value[1];
      }
    }

    const dates = value.filter((date) => date !== null);

    return this._getLowestDateInArray(dates);
  }

  restoreValue(): void {
    this.calendar.option('value', [null, null]);
  }

  _getValue(): (Date | null)[] {
    const value = this.dateOption('value');

    if (!value.length) {
      return value;
    }

    let [startDate, endDate] = value;

    if (startDate && endDate && startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    return [startDate, endDate];
  }

  _getRange(): Date[] {
    const [startDate, endDate] = this._getValue();
    return this._getDaysInRange(startDate, endDate);
  }

  _getDaysInRange(startDate: Date | null, endDate: Date | null): Date[] {
    if (!startDate || !endDate) {
      return [];
    }

    const { currentDate, viewsCount } = this.calendar.option();
    const isAdditionalViewDate = this.calendar._isAdditionalViewDate(currentDate);
    const firstDateInViews = dateUtils.getFirstMonthDate(
      currentDate,
      isAdditionalViewDate ? -2 : -1,
    ) as Date;
    const lastDateInViews = dateUtils.getLastMonthDate(
      currentDate,
      isAdditionalViewDate ? 1 : viewsCount,
    ) as Date;

    const rangeStartDate = new Date(Math.max(firstDateInViews.getTime(), startDate.getTime()));
    const rangeEndDate = new Date(Math.min(lastDateInViews.getTime(), endDate.getTime()));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [
      ...dateUtils.getDatesOfInterval(rangeStartDate, rangeEndDate, DAY_INTERVAL),
      rangeEndDate,
    ];
  }

  _cellHoverHandler(e: CellEvent): void {
    const isMaxZoomLevel = this._isMaxZoomLevel();
    const [startDate, endDate] = this._getValue();

    const { allowChangeSelectionOrder, currentSelection } = this.calendar.option();

    if (isMaxZoomLevel) {
      const skipHoveredRange = allowChangeSelectionOrder && currentSelection === 'startDate';

      if (startDate && !endDate && !skipHoveredRange) {
        if (e.value > startDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(startDate, e.value));
          return;
        }
      } else if (!startDate && endDate && !(allowChangeSelectionOrder && currentSelection === 'endDate')) {
        if (e.value < endDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, endDate));
          return;
        }
      } else if (startDate && endDate) {
        if (currentSelection === 'startDate' && e.value < startDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, startDate));
          return;
        } if (currentSelection === 'endDate' && e.value > endDate) {
          this._updateViewsOption('hoveredRange', this._getDaysInRange(endDate, e.value));
          return;
        }
      }

      this._updateViewsOption('hoveredRange', []);
    }
  }

  _weekNumberClickHandler({ rowDates, event }: WeekNumberClickEvent): void {
    const selectedDates = rowDates.filter((date) => !this._isDateDisabled(date));
    const value = selectedDates.length
      ? [selectedDates[0], selectedDates[selectedDates.length - 1]]
      : [null, null];

    this.dateValue(value, event);
  }
}

export default CalendarRangeSelectionStrategy;
