import dateUtils from '../../../../../../../core/utils/date';
import dateLocalization from '../../../../../../../localization/date';
import {
  getCalculatedFirstDayOfWeek,
  getStartViewDateTimeOffset,
  getViewStartByOptions,
  setOptionHour,
} from './base';
import timeZoneUtils from '../../../../../../../ui/scheduler/utils.timeZone';
import { CalculateStartViewDate } from '../types';

export const getIntervalDuration = (
  intervalCount: number,
): number => dateUtils.dateToMilliseconds('day') * 7 * intervalCount;

export const getValidStartDate = (
  startDate: Date | undefined,
  firstDayOfWeek: number,
): Date | undefined => (startDate
  ? dateUtils.getFirstWeekDate(startDate, firstDayOfWeek)
  : undefined);

export const calculateStartViewDate: CalculateStartViewDate = (
  currentDate,
  startDayHour,
  startDate,
  intervalDuration,
  firstDayOfWeekOption,
) => {
  const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    getValidStartDate(startDate, firstDayOfWeek),
  );

  const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);

  return setOptionHour(firstViewDate, startDayHour);
};

export const calculateViewStartDate = (
  startDateOption: Date,
  firstDayOfWeek: number | undefined,
): Date => {
  const validFirstDayOfWeek = firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex();

  return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};

const getTimeCellDate = (
  rowIndex: number,
  date: Date,
  startViewDate: Date,
  cellDuration: number,
  startDayHour: number,
): Date => {
  if (!timeZoneUtils.isTimezoneChangeInDate(date)) {
    return date;
  }

  const startViewDateWithoutDST = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
  const result = new Date(startViewDateWithoutDST);
  const timeCellDuration = Math.round(cellDuration);

  const startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
  result.setMilliseconds(
    result.getMilliseconds() + timeCellDuration * rowIndex - startViewDateOffset,
  );

  return result;
};

// T410490: incorrectly displaying time slots on Linux
export const getTimePanelCellText = (
  rowIndex: number,
  date: Date,
  startViewDate: Date,
  cellDuration: number,
  startDayHour: number,
): string => {
  if (rowIndex % 2 === 0) {
    const validDate = getTimeCellDate(rowIndex, date, startViewDate, cellDuration, startDayHour);
    return dateLocalization.format(validDate, 'shorttime') as string;
  }
  return '';
};
