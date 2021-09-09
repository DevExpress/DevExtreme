import dateUtils from '../../../../../../../core/utils/date';
import { CalculateStartViewDate } from '../types';
import { getViewStartByOptions, setOptionHour } from './base';
import { getValidStartDate } from './week';

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

export const isDataOnWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};

export const getWeekendsCount = (days: number): number => 2 * Math.floor(days / 7);

export const calculateStartViewDate: CalculateStartViewDate = (
  currentDate,
  startDayHour,
  startDate,
  intervalDuration,
  firstDayOfWeek,
) => {
  const viewStart = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    getValidStartDate(startDate, firstDayOfWeek),
  );

  const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  const normalizedDate = dateUtils.normalizeDateByWeek(firstViewDate, viewStart);

  return setOptionHour(normalizedDate, startDayHour);
};
