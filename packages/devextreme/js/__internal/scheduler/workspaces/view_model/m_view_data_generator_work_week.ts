import { workWeekUtils } from '../../r1/utils/index';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  public skippedDays: number[] = [0, 6];

  protected override calculateStartViewDate(options: any): Date {
    return workWeekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
      options.skippedDays ?? this.skippedDays,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public override getFirstDayOfWeek(firstDayOfWeekOption: number | undefined): number {
    return firstDayOfWeekOption ?? 0;
  }

  protected override getSkippedDaysAnchorDay(
    firstDayOfWeekOption: number | undefined,
    startViewDate: Date,
  ): number {
    return this.skippedDays.length > 0
      ? startViewDate.getDay()
      : this.getFirstDayOfWeek(firstDayOfWeekOption);
  }
}
