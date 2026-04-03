import { weekUtils } from '../../r1/utils/index';
import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
  readonly daysInInterval: number = 7;

  getIntervalDuration(intervalCount) {
    return weekUtils.getIntervalDuration(intervalCount);
  }

  protected calculateStartViewDate(options) {
    return weekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this.getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }
}
