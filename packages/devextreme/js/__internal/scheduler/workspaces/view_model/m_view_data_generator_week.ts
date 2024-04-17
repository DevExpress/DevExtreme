import { weekUtils } from '@ts/scheduler/r1/utils/index';

import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
  readonly daysInInterval: number = 7;

  _getIntervalDuration(intervalCount) {
    return weekUtils.getIntervalDuration(intervalCount);
  }

  _calculateStartViewDate(options) {
    return weekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }
}
