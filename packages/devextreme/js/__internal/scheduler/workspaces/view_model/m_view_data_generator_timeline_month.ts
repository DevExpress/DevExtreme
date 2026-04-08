import dateUtils from '@js/core/utils/date';
import { setOptionHour, timelineMonthUtils } from '@ts/scheduler/r1/utils/index';

import timezoneUtils from '../../m_utils_time_zone';
import { ViewDataGenerator } from './m_view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
  protected usesWeeklyDayLayout(): boolean {
    return true;
  }

  protected getSkippedDaysAnchorDay(
    firstDayOfWeekOption: number | undefined,
    startViewDate: Date,
  ): number {
    return startViewDate.getDay();
  }

  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('day');
  }

  getCellCountInDay() {
    return 1;
  }

  protected calculateStartViewDate(options: any) {
    return timelineMonthUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
    );
  }

  getCellCount(options) {
    const { intervalCount } = options;
    const currentDate = new Date(options.currentDate);

    let cellCount = 0;
    for (let i = 1; i <= intervalCount; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0);
      const daysInMonth = monthDate.getDate();
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        if (!this.skippedDays.includes(date.getDay())) {
          cellCount += 1;
        }
      }
    }

    return cellCount;
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
