import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator';
import {
  getToday, isFirstCellInMonthWithIntervalCount, monthUtils, setOptionHour,
} from '@ts/scheduler/r1/utils/index';

import timezoneUtils from '../../utils_time_zone';
import type { MonthViewCellDataSimple, ViewDataProviderExtendedOptions, ViewDataProviderOptions } from './types';
import { calculateAlignedWeeksBetweenDates } from './utils/view_generator_utils';
import { ViewDataGenerator } from './view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

const DAYS_IN_WEEK = 7;

export class ViewDataGeneratorMonth extends ViewDataGenerator {
  private minVisibleDate!: Date;

  private maxVisibleDate!: Date;

  protected override tableAllDay = undefined;

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

    const data = super.getCellData(
      rowIndex,
      columnIndex,
      options,
      false,
    ) as MonthViewCellDataSimple;
    const startDate = timezoneUtils.addOffsetsWithoutDST(data.startDate, -viewOffset);

    data.today = this.isCurrentDate(
      startDate,
      indicatorTime,
      timeZoneCalculator,
    );
    data.otherMonth = this.isOtherMonth(startDate, this.minVisibleDate, this.maxVisibleDate);
    data.isFirstDayMonthHighlighting = isFirstCellInMonthWithIntervalCount(
      startDate,
      intervalCount,
    );
    data.text = monthUtils.getCellText(startDate, intervalCount);

    return data;
  }

  isCurrentDate(
    date: Date,
    indicatorTime: Date | undefined,
    timeZoneCalculator: TimeZoneCalculator | undefined,
  ): boolean {
    return dateUtils.sameDate(date, getToday(indicatorTime, timeZoneCalculator));
  }

  isOtherMonth(cellDate: Date, minDate: Date, maxDate: Date): boolean {
    return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
  }

  protected calculateCellIndex(
    rowIndex: number,
    columnIndex: number,
    rowCount: number,
    columnCount: number,
  ): number {
    return monthUtils.calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  }

  calculateEndDate(startDate: Date, interval: number, endDayHour: number): Date {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('day');
  }

  protected calculateStartViewDate(options: ViewDataProviderOptions): Date {
    return monthUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }

  protected setVisibilityDates(options: ViewDataProviderExtendedOptions): void {
    const {
      intervalCount,
      startDate,
      currentDate,
    } = options;

    const firstMonthDate = dateUtils.getFirstMonthDate(startDate);

    const viewStart = monthUtils.getViewStartByOptions(
      startDate,
      currentDate,
      intervalCount,
      firstMonthDate,
    );

    this.minVisibleDate = new Date(viewStart.setDate(1));

    const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
    this.maxVisibleDate = new Date(nextMonthDate.setDate(0));
  }

  getCellCount(): number {
    return DAYS_IN_WEEK - this.skippedDays.length;
  }

  protected usesMonthDayLayout(): boolean {
    return true;
  }

  getRowCount(options: ViewDataProviderOptions): number {
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

  getCellCountInDay(): number {
    return 1;
  }

  setHiddenInterval(): void {
    this.hiddenInterval = 0;
  }

  protected getCellEndDate(
    cellStartDate: Date,
    startDayHour: number,
    endDayHour: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interval: number,
  ): Date {
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
