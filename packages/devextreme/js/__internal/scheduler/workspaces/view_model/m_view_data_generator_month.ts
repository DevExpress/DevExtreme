import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import {
  getToday, isFirstCellInMonthWithIntervalCount, monthUtils, setOptionHour,
} from '@ts/scheduler/r1/utils/index';

import timezoneUtils from '../../utils_time_zone';
import type { MonthViewCellDataSimple, ViewDataProviderExtendedOptions } from './m_types';
import { ViewDataGenerator } from './m_view_data_generator';
import { calculateAlignedWeeksBetweenDates } from './utils/view_generator_utils';

const toMs = dateUtils.dateToMilliseconds;

const DAYS_IN_WEEK = 7;

export class ViewDataGeneratorMonth extends ViewDataGenerator {
  private minVisibleDate: any;

  private maxVisibleDate: any;

  tableAllDay: any = undefined;

  getCellData(
    rowIndex: number,
    columnIndex: number,
    options: ViewDataProviderExtendedOptions,
  ): MonthViewCellDataSimple {
    const {
      indicatorTime,
      timeZoneCalculator,
      intervalCount,
      viewOffset,
    } = options;

    const data = super.getCellData(rowIndex, columnIndex, options, false) as MonthViewCellDataSimple;
    const startDate = timezoneUtils.addOffsetsWithoutDST(data.startDate, -viewOffset);

    data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
    data.otherMonth = this.isOtherMonth(startDate, this.minVisibleDate, this.maxVisibleDate);
    data.isFirstDayMonthHighlighting = isFirstCellInMonthWithIntervalCount(startDate, intervalCount);
    data.text = monthUtils.getCellText(startDate, intervalCount);

    return data;
  }

  isCurrentDate(date, indicatorTime, timeZoneCalculator) {
    return dateUtils.sameDate(date, getToday(indicatorTime, timeZoneCalculator));
  }

  isOtherMonth(cellDate, minDate, maxDate) {
    return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
  }

  protected calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return monthUtils.calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  }

  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('day');
  }

  protected calculateStartViewDate(options) {
    return monthUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }

  protected setVisibilityDates(options) {
    const {
      intervalCount,
      startDate,
      currentDate,
    } = options;

    const firstMonthDate: any = dateUtils.getFirstMonthDate(startDate);
    const viewStart = monthUtils.getViewStartByOptions(startDate, currentDate, intervalCount, firstMonthDate);

    this.minVisibleDate = new Date(viewStart.setDate(1));

    const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
    this.maxVisibleDate = new Date(nextMonthDate.setDate(0));
  }

  getCellCount() {
    return DAYS_IN_WEEK - this.skippedDays.length;
  }

  protected usesMonthDayLayout(): boolean {
    return true;
  }

  getRowCount(options) {
    const startDate = new Date(options.currentDate);
    startDate.setDate(1);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + options.intervalCount);
    endDate.setDate(0);

    return calculateAlignedWeeksBetweenDates(
      startDate,
      endDate,
      options.firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex(),
    );
  }

  getCellCountInDay() {
    return 1;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }

  protected getCellEndDate(cellStartDate: Date, options: any): Date {
    const { startDayHour, endDayHour } = options;
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
