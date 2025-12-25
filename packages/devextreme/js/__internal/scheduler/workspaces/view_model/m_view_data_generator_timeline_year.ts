import dateUtils from '@js/core/utils/date';
import { setOptionHour, timelineMonthUtils } from '@ts/scheduler/r1/utils/index';

import timezoneUtils from '../../m_utils_time_zone';
import { ViewDataGenerator } from './m_view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

export class ViewDataGeneratorTimelineYear extends ViewDataGenerator {
  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('week');
  }

  _calculateStartViewDate(options: any) {
    const date = new Date(options.currentDate.getFullYear(), 0, 1, 0, 0, 0, 0);

    return date;
  }

  getCellCount(options) {
    const year = options.currentDate.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);
    const firstDayOfYearWeekday = firstDayOfYear.getDay() || 7; // Make Sunday (0) the 7th day
    const daysInYear = (lastDayOfYear.getTime() - firstDayOfYear.getTime()) / toMs('day') + 1;
    const totalDaysWithOffset = daysInYear + (firstDayOfYearWeekday - 1);
    const weeksInYear = Math.ceil(totalDaysWithOffset / 7);

    return weeksInYear;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }

  protected getCellEndDate(cellStartDate: Date, options: any): Date {
    const daysToAdd = 7;
    const cellEndDate = new Date(cellStartDate);
    cellEndDate.setDate(cellStartDate.getDate() + daysToAdd);

    return timezoneUtils.addOffsetsWithoutDST(cellEndDate, 0);
  }
}
