import { dayUtils } from '../../r1/utils/index';
import { getFirstVisibleDate } from '../../utils/skipped_days';
import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorDay extends ViewDataGenerator {
  // eslint-disable-next-line class-methods-use-this
  protected override getSkippedDaysAnchorDay(
    firstDayOfWeekOption: number | undefined,
    startViewDate: Date,
  ): number {
    return startViewDate.getDay();
  }

  protected override calculateStartViewDate(options: any): Date {
    const startViewDate = dayUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
    );

    return getFirstVisibleDate(
      startViewDate,
      options.skippedDays ?? this.skippedDays,
      (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
      },
    );
  }
}
