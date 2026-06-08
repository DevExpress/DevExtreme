import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator';
import {
  getToday, isFirstCellInMonthWithIntervalCount, monthUtils, setOptionHour,
} from '@ts/scheduler/r1/utils/index';
import type { ViewDataProviderOptions } from '@ts/scheduler/types';

import timezoneUtils from '../../utils_time_zone';
import { ViewDataGenerator } from './m_view_data_generator';
import type { MonthViewCellDataSimple, ViewDataProviderExtendedOptions } from './types';
import { calculateAlignedWeeksBetweenDates } from './utils/view_generator_utils';

const toMs = dateUtils.dateToMilliseconds;

const DAYS_IN_WEEK = 7;

export class ViewDataGeneratorMonth extends ViewDataGenerator {
  private minVisibleDate!: Date;

  private maxVisibleDate!: Date;

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
      indicatorTime as Date,
      timeZoneCalculator as TimeZoneCalculator,
    );
    data.otherMonth = this.isOtherMonth(startDate, this.minVisibleDate, this.maxVisibleDate);
    data.isFirstDayMonthHighlighting = isFirstCellInMonthWithIntervalCount(
      startDate,
      intervalCount,
    );
    data.text = monthUtils.getCellText(startDate, intervalCount);

    return data;
  }

  isCurrentDate(date: Date, indicatorTime: Date, timeZoneCalculator: TimeZoneCalculator): boolean {
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

  protected setVisibilityDates(options: ViewDataProviderOptions): void {
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
    return DAYS_IN_WEEK;
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

  protected getCellEndDate(cellStartDate: Date, options: ViewDataProviderOptions): Date {
    const { startDayHour, endDayHour } = options;
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
