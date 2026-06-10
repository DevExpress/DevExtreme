import { dayUtils } from '../../r1/utils/index';
import type { ViewDataProviderOptions } from './types';
import { ViewDataGenerator } from './view_data_generator';

export class ViewDataGeneratorDay extends ViewDataGenerator {
  protected calculateStartViewDate(options: ViewDataProviderOptions): Date {
    return dayUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      this._getIntervalDuration(options.intervalCount),
    );
  }
}
