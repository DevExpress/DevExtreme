import { weekUtils } from '../../r1/utils/index';
import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
  _getIntervalDuration(intervalCount) {
    return weekUtils.getIntervalDuration(intervalCount);
  }

  protected calculateStartViewDate(options) {
    return weekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
      options.skippedDays ?? this.skippedDays,
    );
  }

  protected override getSkippedDaysAnchorDay(
    firstDayOfWeekOption: number | undefined,
    startViewDate: Date,
  ): number {
    return this.skippedDays.length > 0
      ? startViewDate.getDay()
      : this.getFirstDayOfWeek(firstDayOfWeekOption) ?? 0;
  }
}
