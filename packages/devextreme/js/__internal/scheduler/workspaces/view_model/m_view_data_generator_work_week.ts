import type { WeekdayIndex } from '@ts/scheduler/utils/skipped_days';

import { workWeekUtils } from '../../r1/utils/index';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

interface WorkWeekStartViewDateOptions {
  currentDate: Date;
  startDayHour: number;
  startDate: Date;
  intervalCount: number;
  firstDayOfWeek: number;
}

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  protected baseDaysInInterval = 5;

  public skippedDays: WeekdayIndex[] = [0, 6];

  protected override calculateStartViewDate(options: WorkWeekStartViewDateOptions): Date {
    return workWeekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
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
