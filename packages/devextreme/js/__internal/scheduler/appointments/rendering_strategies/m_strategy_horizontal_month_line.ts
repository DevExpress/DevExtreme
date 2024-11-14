import query from '@js/common/data/query';
import dateUtils from '@js/core/utils/date';

import { sortAppointmentsByStartDate } from '../data_provider/m_utils';
import HorizontalAppointmentsStrategy from './m_strategy_horizontal';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MILLISECONDS_IN_MINUTE = 60000;
const ZERO_APPOINTMENT_DURATION_IN_DAYS = 1;

class HorizontalMonthLineRenderingStrategy extends HorizontalAppointmentsStrategy {
  calculateAppointmentWidth(_, position) {
    const {
      startDate: startDateWithTime,
      normalizedEndDate,
    } = position.info.appointment;
    const startDate = dateUtils.trimTime(startDateWithTime);
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();
    const duration = Math.ceil(this._getDurationInDays(startDate, normalizedEndDate));

    let width = this.cropAppointmentWidth(duration * cellWidth, cellWidth);

    if (this.isVirtualScrolling) {
      const skippedDays = this.viewDataProvider.getSkippedDaysCount(
        position.groupIndex,
        startDate,
        normalizedEndDate,
        duration,
      );

      width -= skippedDays * cellWidth;
    }

    return width;
  }

  _columnCondition(a, b) {
    const conditions = this._getConditions(a, b);
    return conditions.rowCondition || conditions.columnCondition || conditions.cellPositionCondition;
  }

  _getDurationInDays(startDate, endDate) {
    const adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
    return (adjustedDuration / dateUtils.dateToMilliseconds('day')) || ZERO_APPOINTMENT_DURATION_IN_DAYS;
  }

  getDeltaTime(args, initialSize) {
    return HOURS_IN_DAY * MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * this._getDeltaWidth(args, initialSize);
  }

  isAllDay() {
    return false;
  }

  createTaskPositionMap(items, skipSorting) {
    if (!skipSorting) {
      sortAppointmentsByStartDate(items, this.dataAccessors);
    }

    return super.createTaskPositionMap(items);
  }

  _getSortedPositions(map, skipSorting) {
    let result = super._getSortedPositions(map);

    if (!skipSorting) {
      // @ts-expect-error
      result = query(result).sortBy('top').thenBy('left').thenBy('cellPosition')
        .thenBy('i')
        .toArray();
    }

    return result;
  }

  needCorrectAppointmentDates() {
    return false;
  }

  getPositionShift(timeShift) {
    return {
      top: 0,
      left: 0,
      cellPosition: timeShift * this.cellWidth,
    };
  }
}

export default HorizontalMonthLineRenderingStrategy;
