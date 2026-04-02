import { isDataOnWeekend, workWeekUtils } from '../../r1/utils/index';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

export class ViewDataGeneratorWorkWeek extends ViewDataGeneratorWeek {
  readonly daysInInterval = 5;

  isSkippedDate(date) {
    return isDataOnWeekend(date);
  }

  calculateStartViewDate(options) {
    return workWeekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this.getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }

  getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption || 0;
  }
}
