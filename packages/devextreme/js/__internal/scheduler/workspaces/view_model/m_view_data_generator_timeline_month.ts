import dateUtils from '@js/core/utils/date';
import { setOptionHour } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { calculateCellIndex } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/month';
import { calculateStartViewDate } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/timeline_month';

import { ViewDataGenerator } from './m_view_data_generator';

const DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCellData(rowIndex, columnIndex, options, allDay) {
    const data = super.getCellData(rowIndex, columnIndex, options, false);
    data.endDate = new Date(data.endDate.getTime() - dateUtils.dateToMilliseconds('minute'));

    return data;
  }

  _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  }

  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval() {
    return DAY_IN_MILLISECONDS;
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
    const { intervalCount, currentDate } = options;
    let cellCount = 0;
    for (let i = 1; i <= intervalCount; i++) {
      cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
    }

    return cellCount;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }
}
