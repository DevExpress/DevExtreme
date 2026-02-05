/* eslint-disable max-classes-per-file */
import dateLocalization from '@js/common/core/localization/date';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import type {
  CalendarSelectionMode, FirstDayOfWeek, WeekNumberRule,
} from '@js/ui/calendar';

import type { BaseViewProperties } from './calendar.base_view';
import BaseView from './calendar.base_view';

const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_WEEK_NUMBER_HEADER_CELL_CLASS = 'dx-week-number-header';
const CALENDAR_WEEK_SELECTION_CLASS = 'dx-calendar-week-selection';

const SCREEN_READER_ONLY_CLASS = 'dx-screen-reader-only';

const WEEK_NUMBER_TEXT = 'WeekNumber';

export interface MonthViewProperties extends BaseViewProperties {
  showWeekNumbers: boolean;

  firstDayOfWeek?: FirstDayOfWeek;

  weekNumberRule?: WeekNumberRule;

  selectionMode?: CalendarSelectionMode;

  selectWeekOnClick?: boolean;
}

export class MonthView extends BaseView<MonthViewProperties> {
  _getViewName(): string {
    return 'month';
  }

  _getCurrentDateFormat(): string {
    return 'longdate';
  }

  _getDefaultOptions(): MonthViewProperties {
    return {
      ...super._getDefaultOptions(),
      firstDayOfWeek: 0,
      rowCount: 6,
      colCount: 7,
    };
  }

  _renderImpl(): void {
    super._renderImpl();
    this._renderHeader();
  }

  _renderBody(): void {
    super._renderBody();

    this._$table.find(`.${CALENDAR_OTHER_VIEW_CLASS}`).addClass(CALENDAR_OTHER_MONTH_CLASS);
  }

  _renderFocusTarget(): void {}

  _renderHeader(): void {
    const $headerRow = $('<tr>');
    const $header = $('<thead>').append($headerRow);

    this._$table.prepend($header);

    const { colCount: columnsCount, showWeekNumbers } = this.option();

    for (let colIndex = 0, colCount = columnsCount; colIndex < colCount; colIndex += 1) {
      this._renderHeaderCell(colIndex, $headerRow);
    }

    if (showWeekNumbers) {
      this._renderWeekHeaderCell($headerRow);
    }
  }

  _renderHeaderCell(cellIndex: number, $headerRow: dxElementWrapper): void {
    const { firstDayOfWeek = 0 } = this.option();

    const {
      full: fullCaption,
      abbreviated: abbrCaption,
    } = this._getDayCaption(firstDayOfWeek + cellIndex);
    const $cell = $('<th>')
      // @ts-expect-error ts-error
      .attr({
        scope: 'col',
        abbr: fullCaption,
      })
      .text(abbrCaption);

    $headerRow.append($cell);
  }

  _renderWeekHeaderCell($headerRow: dxElementWrapper): void {
    const $weekNumberHeaderCell = $('<th>')
      // @ts-expect-error ts-error
      .attr({
        scope: 'col',
        abbr: WEEK_NUMBER_TEXT,
        class: CALENDAR_WEEK_NUMBER_HEADER_CELL_CLASS,
      });

    $('<div>')
      .text(WEEK_NUMBER_TEXT)
      .addClass(SCREEN_READER_ONLY_CLASS)
      .appendTo($weekNumberHeaderCell);

    $headerRow.prepend($weekNumberHeaderCell);
  }

  _renderWeekNumberCell(rowData: { cellDate: Date; prevCellDate: Date; row: HTMLElement }): void {
    const {
      showWeekNumbers,
      cellTemplate,
      selectionMode,
      selectWeekOnClick,
    } = this.option();

    if (!showWeekNumbers) {
      return;
    }

    const weekNumber = this._getWeekNumber(rowData.prevCellDate);

    const cell = domAdapter.createElement('td');
    const $cell = $(cell);

    cell.className = CALENDAR_WEEK_NUMBER_CELL_CLASS;

    if (selectionMode !== 'single' && selectWeekOnClick) {
      $cell.addClass(CALENDAR_WEEK_SELECTION_CLASS);
    }

    if (cellTemplate) {
      // @ts-expect-error ts-error
      cellTemplate.render(this._prepareCellTemplateData(weekNumber, -1, $cell));
    } else {
      cell.innerHTML = `${weekNumber}`;
    }

    rowData.row.prepend(cell);

    this.setAria({
      role: 'gridcell',
      label: `Week ${weekNumber}`,
    }, $cell);
  }

  _getWeekNumber(date: Date): number {
    const { weekNumberRule = 'auto', firstDayOfWeek } = this.option();

    if (weekNumberRule === 'auto') {
      return dateUtils.getWeekNumber(
        date,
        firstDayOfWeek,
        firstDayOfWeek === 1 ? 'firstFourDays' : 'firstDay',
      );
    }

    return dateUtils.getWeekNumber(date, firstDayOfWeek, weekNumberRule);
  }

  getNavigatorCaption(): string {
    const { date } = this.option();

    return `${dateLocalization.format(date, 'monthandyear')}`;
  }

  _isTodayCell(cellDate: Date): boolean {
    const { _todayDate: today } = this.option();

    return dateUtils.sameDate(cellDate, today());
  }

  _isDateOutOfRange(cellDate: Date): boolean {
    const minDate = this.option('min');
    const maxDate = this.option('max');

    return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
  }

  _isOtherView(cellDate: Date): boolean {
    const { date } = this.option();

    return cellDate.getMonth() !== date.getMonth();
  }

  _isStartDayOfMonth(cellDate: Date): boolean {
    return dateUtils.sameDate(cellDate, dateUtils.getFirstMonthDate(this.option('date')));
  }

  _isEndDayOfMonth(cellDate: Date): boolean {
    return dateUtils.sameDate(cellDate, dateUtils.getLastMonthDate(this.option('date')));
  }

  _getCellText(cellDate: Date): string {
    return `${dateLocalization.format(cellDate, 'd')}`;
  }

  _getDayCaption(day: number): { full: string; abbreviated: string } {
    const { colCount: daysInWeek } = this.option();
    const dayIndex = day % daysInWeek;

    return {
      full: dateLocalization.getDayNames()[dayIndex],
      abbreviated: dateLocalization.getDayNames('abbreviated')[dayIndex],
    };
  }

  _getFirstCellData(): Date {
    const { firstDayOfWeek = 0, date } = this.option();
    const firstDay = dateUtils.getFirstMonthDate(date) as Date;
    let firstMonthDayOffset = firstDayOfWeek - firstDay.getDay();
    const { colCount: daysInWeek } = this.option();

    if (firstMonthDayOffset >= 0) {
      firstMonthDayOffset -= daysInWeek;
    }

    firstDay.setDate(firstDay.getDate() + firstMonthDayOffset);
    return firstDay;
  }

  _getNextCellData(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    return newDate;
  }

  _getCellByDate(date: Date): dxElementWrapper {
    return this._$table.find(`td[data-value='${dateSerialization.serializeDate(date, dateUtils.getShortDateFormat())}']`);
  }

  isBoundary(date: Date): boolean {
    return dateUtils.sameMonthAndYear(date, this.option('min')) || dateUtils.sameMonthAndYear(date, this.option('max'));
  }

  _getDefaultDisabledDatesHandler(
    disabledDates: Date[],
  ): (args: { date: Date }) => boolean {
    return (args) => disabledDates.some((item) => dateUtils.sameDate(item, args.date));
  }
}

export class YearView extends BaseView {
  _getViewName(): string {
    return 'year';
  }

  _getCurrentDateFormat(): string {
    return 'monthandyear';
  }

  _isTodayCell(cellDate: Date): boolean {
    const { _todayDate: today } = this.option();

    return dateUtils.sameMonthAndYear(cellDate, today());
  }

  _isDateOutOfRange(cellDate: Date): boolean {
    return !dateUtils.dateInRange(cellDate, dateUtils.getFirstMonthDate(this.option('min')), dateUtils.getLastMonthDate(this.option('max')));
  }

  _isOtherView(): boolean {
    return false;
  }

  _isStartDayOfMonth(): boolean {
    return false;
  }

  _isEndDayOfMonth(): boolean {
    return false;
  }

  _getCellText(cellDate: Date): string {
    return dateLocalization.getMonthNames('abbreviated')[cellDate.getMonth()];
  }

  _getFirstCellData(): Date {
    const { date: currentDate } = this.option();
    const data = new Date(currentDate);

    data.setDate(1);
    data.setMonth(0);

    return data;
  }

  _getNextCellData(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);

    return newDate;
  }

  _getCellByDate(date: Date): dxElementWrapper {
    const foundDate = new Date(date);
    foundDate.setDate(1);

    return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
  }

  getNavigatorCaption(): string {
    const { date } = this.option();

    return `${dateLocalization.format(date, 'yyyy')}`;
  }

  isBoundary(date: Date): boolean {
    return dateUtils.sameYear(date, this.option('min')) || dateUtils.sameYear(date, this.option('max'));
  }

  _renderWeekNumberCell(): void {}
}

export class DecadeView extends BaseView {
  _getViewName(): string {
    return 'decade';
  }

  _isTodayCell(cellDate: Date): boolean {
    const { _todayDate: today } = this.option();

    return dateUtils.sameYear(cellDate, today());
  }

  _isDateOutOfRange(cellDate: Date): boolean {
    const { min, max } = this.option();

    return !dateUtils.dateInRange(cellDate.getFullYear(), min?.getFullYear(), max?.getFullYear());
  }

  _isOtherView(cellDate: Date): boolean {
    const date = new Date(cellDate);
    date.setMonth(1);

    return !dateUtils.sameDecade(date, this.option('date'));
  }

  _isStartDayOfMonth(): boolean {
    return false;
  }

  _isEndDayOfMonth(): boolean {
    return false;
  }

  _getCellText(cellDate: Date): string {
    return `${dateLocalization.format(cellDate, 'yyyy')}`;
  }

  _getFirstCellData(): Date {
    const year = dateUtils.getFirstYearInDecade(this.option('date')) - 1;
    return dateUtils.createDateWithFullYear(year, 0, 1);
  }

  _getNextCellData(date: Date): Date {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);

    return newDate;
  }

  getNavigatorCaption(): string {
    const { date: currentDate } = this.option();
    const firstYearInDecade = dateUtils.getFirstYearInDecade(currentDate);
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    startDate.setFullYear(firstYearInDecade);
    endDate.setFullYear(firstYearInDecade + 9);

    return `${dateLocalization.format(startDate, 'yyyy')}-${dateLocalization.format(endDate, 'yyyy')}`;
  }

  _isValueOnCurrentView(currentDate: Date, value: Date): boolean {
    return dateUtils.sameDecade(currentDate, value);
  }

  _getCellByDate(date: Date): dxElementWrapper {
    const foundDate = new Date(date);
    foundDate.setDate(1);
    foundDate.setMonth(0);

    return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
  }

  isBoundary(date: Date): boolean {
    return dateUtils.sameDecade(date, this.option('min')) || dateUtils.sameDecade(date, this.option('max'));
  }

  _renderWeekNumberCell(): void {}
}

export class CenturyView extends BaseView {
  _getViewName(): string {
    return 'century';
  }

  _isTodayCell(cellDate: Date): boolean {
    const { _todayDate: today } = this.option();

    return dateUtils.sameDecade(cellDate, today());
  }

  _isDateOutOfRange(cellDate: Date): boolean {
    const decade = dateUtils.getFirstYearInDecade(cellDate);
    const minDecade = dateUtils.getFirstYearInDecade(this.option('min'));
    const maxDecade = dateUtils.getFirstYearInDecade(this.option('max'));

    return !dateUtils.dateInRange(decade, minDecade, maxDecade);
  }

  _isOtherView(cellDate: Date): boolean {
    const date = new Date(cellDate);
    date.setMonth(1);

    return !dateUtils.sameCentury(date, this.option('date'));
  }

  _isStartDayOfMonth(): boolean {
    return false;
  }

  _isEndDayOfMonth(): boolean {
    return false;
  }

  _getCellText(cellDate: Date): string {
    const startDate = dateLocalization.format(cellDate, 'yyyy');
    const endDate = new Date(cellDate);

    endDate.setFullYear(endDate.getFullYear() + 9);

    return `${startDate} - ${dateLocalization.format(endDate, 'yyyy')}`;
  }

  _getFirstCellData(): Date {
    const decade = dateUtils.getFirstDecadeInCentury(this.option('date')) - 10;
    return dateUtils.createDateWithFullYear(decade, 0, 1);
  }

  _getNextCellData(date: Date): Date {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 10);

    return newDate;
  }

  _getCellByDate(date: Date): dxElementWrapper {
    const foundDate = new Date(date);
    foundDate.setDate(1);
    foundDate.setMonth(0);
    foundDate.setFullYear(dateUtils.getFirstYearInDecade(foundDate));

    return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
  }

  getNavigatorCaption(): string {
    const { date: currentDate } = this.option();
    const firstDecadeInCentury = dateUtils.getFirstDecadeInCentury(currentDate);
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    startDate.setFullYear(firstDecadeInCentury);
    endDate.setFullYear(firstDecadeInCentury + 99);

    return `${dateLocalization.format(startDate, 'yyyy')}-${dateLocalization.format(endDate, 'yyyy')}`;
  }

  isBoundary(date: Date): boolean {
    return dateUtils.sameCentury(date, this.option('min')) || dateUtils.sameCentury(date, this.option('max'));
  }

  _renderWeekNumberCell(): void {}
}

export default {
  month: MonthView,
  year: YearView,
  decade: DecadeView,
  century: CenturyView,
};
