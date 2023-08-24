import {
  calculateStartViewDate,
  isDataOnWeekend,
} from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/work_week';

import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  // @ts-expect-error
  readonly daysInInterval = 5;

  // @ts-expect-error
  readonly isWorkView = true;

  // @ts-expect-error
  isSkippedDate(date) {
    return isDataOnWeekend(date);
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

  getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption || 0;
  }
}
