import { dayUtils } from '@ts/scheduler/r1/utils/index';

import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorDay extends ViewDataGenerator {
  _calculateStartViewDate(options) {
    return dayUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
    );
  }
}
