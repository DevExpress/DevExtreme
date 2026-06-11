import type { ViewDataProviderOptions } from '@ts/scheduler/types';

import { weekUtils } from '../../r1/utils/index';
import { ViewDataGenerator } from './m_view_data_generator';

export class ViewDataGeneratorWeek extends ViewDataGenerator {
  readonly daysInInterval: number = 7;

  _getIntervalDuration(intervalCount: number): number {
    return weekUtils.getIntervalDuration(intervalCount);
  }

  protected calculateStartViewDate(options: ViewDataProviderOptions): Date {
    return weekUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }
}
