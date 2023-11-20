import dateUtils from '@js/core/utils/date';
import { setOptionHour } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { calculateCellIndex } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/month';
import { calculateStartViewDate } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/timeline_month';

import timezoneUtils from '../../m_utils_time_zone';
import { ViewDataGenerator } from './m_view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
  _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  }

  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval(): number {
    return toMs('day');
  }

  _calculateStartViewDate(options: any) {
    return calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
    );
  }

  getCellCount(options) {
    const { intervalCount } = options;
    const currentDate = new Date(options.currentDate);

    let cellCount = 0;
    for (let i = 1; i <= intervalCount; i++) {
      cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
    }

    return cellCount;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }

  protected getCellEndDate(cellStartDate: Date, options: any): Date {
    const { startDayHour, endDayHour } = options;
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
