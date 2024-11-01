import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';

import type { CalculateCellIndex } from '../types';
import {
  getCalculatedFirstDayOfWeek,
  isDateInRange,
  isFirstCellInMonthWithIntervalCount,
  setOptionHour,
} from './base';

export const calculateCellIndex: CalculateCellIndex = (
  rowIndex,
  columnIndex,
  _,
  columnCount,
) => rowIndex * columnCount + columnIndex;

export const getViewStartByOptions = (
  startDate: Date | undefined,
  currentDate: Date,
  intervalCount: number,
  startViewDate: Date,
): Date => {
  if (!startDate) {
    return new Date(currentDate);
  }
  let currentStartDate = new Date(startViewDate);
  const validStartViewDate = new Date(startViewDate);

  const diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  let endDate = new Date(new Date(
    validStartViewDate.setMonth(validStartViewDate.getMonth() + diff * intervalCount),
  ));

  while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = new Date(endDate);

    if (diff > 0) {
      currentStartDate.setDate(1);
    }

    endDate = new Date(new Date(endDate.setMonth(endDate.getMonth() + diff * intervalCount)));
  }

  return diff > 0 ? currentStartDate : endDate;
};

export const getCellText = (date: Date, intervalCount: number): string => {
  if (isFirstCellInMonthWithIntervalCount(date, intervalCount)) {
    const monthName = dateLocalization.getMonthNames('abbreviated')[date.getMonth()];
    return [monthName, dateLocalization.format(date, 'day')].join(' ');
  }

  return dateLocalization.format(date, 'dd') as string;
};

export const calculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  startDate: Date,
  intervalCount: number,
  firstDayOfWeekOption: number | undefined,
): Date => {
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalCount,
    dateUtils.getFirstMonthDate(startDate) as Date,
  );
  const firstMonthDate = dateUtils.getFirstMonthDate(viewStart);
  const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);

  const firstViewDate = dateUtils.getFirstWeekDate(firstMonthDate, firstDayOfWeek);

  return setOptionHour(firstViewDate, startDayHour);
};
