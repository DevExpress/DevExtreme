import dateUtils from '../../../../../../../core/utils/date';
import { CalculateStartViewDate } from '../types';
import { getViewStartByOptions, setOptionHour } from './base';
import { getValidStartDate } from './week';

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;
const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;

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
  if (isDataOnWeekend(firstViewDate)) {
    const currentDay = firstViewDate.getDay();
    const distance = (MONDAY_INDEX + DAYS_IN_WEEK - currentDay) % 7;

    firstViewDate.setDate(firstViewDate.getDate() + distance);
  }

  return setOptionHour(firstViewDate, startDayHour);
};
