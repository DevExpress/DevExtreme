import { isDataOnWeekend, workWeekUtils } from '@ts/scheduler/r1/utils/index';

import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  readonly daysInInterval = 5;

  readonly isWorkView: boolean = true;

  isSkippedDate(date) {
    return isDataOnWeekend(date);
  }

  _calculateStartViewDate(options) {
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
