import dateUtils from '@js/core/utils/date';
import { setOptionHour, timelineMonthUtils } from '@ts/scheduler/r1/utils/index';

import type { CountGenerationConfig } from '../../types';
import timezoneUtils from '../../utils_time_zone';
import type { ViewDataProviderOptions } from './types';
import { ViewDataGenerator } from './view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
  calculateEndDate(startDate: Date, interval: number, endDayHour: number): Date {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('day');
  }

  protected calculateStartViewDate(options: ViewDataProviderOptions): Date {
    return timelineMonthUtils.calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
    );
  }

  getCellCount(options: CountGenerationConfig): number {
    const { intervalCount } = options;
    const currentDate = new Date(options.currentDate);

    let cellCount = 0;
    for (let i = 1; i <= intervalCount; i += 1) {
      cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
    }

    return cellCount;
  }

  setHiddenInterval(): void {
    this.hiddenInterval = 0;
  }

  protected getCellEndDate(
    cellStartDate: Date,
    startDayHour: number,
    endDayHour: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interval: number,
  ): Date {
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
