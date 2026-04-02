import { dayUtils } from '../../r1/utils/index';
import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorDay extends ViewDataGenerator {
  calculateStartViewDate(options) {
    return dayUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this.getIntervalDuration(options.intervalCount),
    );
  }
}
