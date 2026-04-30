import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';

import type { CalculateStartViewDate } from '../../types';
import { getFirstVisibleDate } from '../../utils/skipped_days';
import {
  getCalculatedFirstDayOfWeek,
  getValidCellDateForLocalTimeFormat,
  getViewStartByOptions,
  setOptionHour,
} from './base';

// T410490: incorrectly displaying time slots on Linux
export const getTimePanelCellText = (
  rowIndex: number,
  date: Date,
  startViewDate: Date,
  cellDuration: number,
  startDayHour: number,
  viewOffset: number,
): string => {
  if (rowIndex % 2 !== 0) {
    return '';
  }

  const validTimeDate = getValidCellDateForLocalTimeFormat(date, {
    startViewDate,
    startDayHour,
    cellIndexShift: Math.round(cellDuration) * rowIndex,
    viewOffset,
  });

  return dateLocalization.format(validTimeDate, 'shorttime') as string;
};

export const getIntervalDuration = (
  intervalCount: number,
): number => dateUtils.dateToMilliseconds('day') * 7 * intervalCount;

export const getValidStartDate = (
  startDate: Date | undefined,
  firstDayOfWeek?: number,
): Date | undefined => (startDate
  ? dateUtils.getFirstWeekDate(startDate, firstDayOfWeek)
  : undefined);

export const calculateStartViewDate: CalculateStartViewDate = (
  currentDate,
  startDayHour,
  startDate,
  intervalDuration,
  firstDayOfWeekOption,
  skippedDays = [],
) => {
  const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    getValidStartDate(startDate, firstDayOfWeek),
  );

  const weekStartDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  const firstViewDate = getFirstVisibleDate(
    weekStartDate,
    skippedDays,
    (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
  );

  return setOptionHour(firstViewDate, startDayHour);
};

export const calculateViewStartDate = (
  startDateOption: Date,
  firstDayOfWeek: number | undefined,
): Date => {
  const validFirstDayOfWeek = firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex();

  return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};
