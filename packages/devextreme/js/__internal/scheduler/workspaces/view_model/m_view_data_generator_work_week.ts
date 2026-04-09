import type { WeekdayIndex } from '@ts/scheduler/utils/skipped_days';

import { workWeekUtils } from '../../r1/utils/index';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  protected baseDaysInInterval = 5;

  public skippedDays: WeekdayIndex[] = [0, 6];

  protected calculateStartViewDate(options) {
    return workWeekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }

  getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption || 0;
  }
}
