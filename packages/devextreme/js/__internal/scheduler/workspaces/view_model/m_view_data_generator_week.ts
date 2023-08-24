import { calculateStartViewDate, getIntervalDuration } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/week';

import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
  // @ts-expect-error
  readonly daysInInterval = 7;

  _getIntervalDuration(intervalCount) {
    return getIntervalDuration(intervalCount);
  }

  _calculateStartViewDate(options) {
    return calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }
}
