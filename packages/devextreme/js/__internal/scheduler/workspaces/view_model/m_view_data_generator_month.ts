import dateUtils from '@js/core/utils/date';
import dateLocalization from '@js/localization/date';
import { getToday, setOptionHour } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import {
  calculateCellIndex,
  calculateStartViewDate,
  getCellText,
  getViewStartByOptions,
  isFirstCellInMonthWithIntervalCount,
} from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/month';

// eslint-disable-next-line import/no-cycle
import { calculateAlignedWeeksBetweenDates } from './m_utils';
import { ViewDataGenerator } from './m_view_data_generator';

const DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');
const DAYS_IN_WEEK = 7;
export class ViewDataGeneratorMonth extends ViewDataGenerator {
  _minVisibleDate: any;

  _maxVisibleDate: any;

  tableAllDay: any = undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCellData(rowIndex, columnIndex, options, allDay) {
    const {
      indicatorTime,
      timeZoneCalculator,
      intervalCount,
    } = options;
    const data = super.getCellData(rowIndex, columnIndex, options, false);
    const { startDate } = data;

    data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
    data.otherMonth = this.isOtherMonth(startDate, this._minVisibleDate, this._maxVisibleDate);
    data.firstDayOfMonth = isFirstCellInMonthWithIntervalCount(startDate, intervalCount);
    data.text = getCellText(startDate, intervalCount);

    return data;
  }

  isCurrentDate(date, indicatorTime, timeZoneCalculator) {
    return dateUtils.sameDate(date, getToday(indicatorTime, timeZoneCalculator));
  }

  isOtherMonth(cellDate, minDate, maxDate) {
    return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
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

  _calculateStartViewDate(options) {
    return calculateStartViewDate(
      options.currentDate,
      options.startDayHour,
      options.startDate,
      options.intervalCount,
      this.getFirstDayOfWeek(options.firstDayOfWeek),
    );
  }

  _setVisibilityDates(options) {
    const {
      intervalCount,
      startDate,
      currentDate,
    } = options;

    const firstMonthDate: any = dateUtils.getFirstMonthDate(startDate);
    const viewStart = getViewStartByOptions(startDate, currentDate, intervalCount, firstMonthDate);

    this._minVisibleDate = new Date(viewStart.setDate(1));

    const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
    this._maxVisibleDate = new Date(nextMonthDate.setDate(0));
  }

  getCellCount() {
    return DAYS_IN_WEEK;
  }

  getRowCount(options) {
    const startDate = new Date(options.currentDate);
    startDate.setDate(1);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + options.intervalCount);
    endDate.setDate(0);

    return calculateAlignedWeeksBetweenDates(
      startDate,
      endDate,
      options.firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex(),
    );
  }

  getCellCountInDay() {
    return 1;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }
}
