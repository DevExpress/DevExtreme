import dateUtils from '@js/core/utils/date';

const DAYS_IN_WEEK = 7;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MAX_WEEKS_IN_MONTH = 6;

export const alignToFirstDayOfWeek = (date: Date, firstDayOfWeek: number): Date => {
  const newDate = new Date(date);
  let dayDiff = newDate.getDay() - firstDayOfWeek;

  if (dayDiff < 0) {
    dayDiff += DAYS_IN_WEEK;
  }

  newDate.setDate(newDate.getDate() - dayDiff);

  return newDate;
};

export const alignToLastDayOfWeek = (date: Date, firstDayOfWeek: number): Date => {
  const newDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
  newDate.setDate(newDate.getDate() + DAYS_IN_WEEK - 1);
  return newDate;
};

export const calculateDaysBetweenDates = (fromDate: Date, toDate: Date): number => {
  const msDiff = dateUtils.trimTime(toDate).getTime() - dateUtils.trimTime(fromDate).getTime();
  return Math.round(msDiff / MS_IN_DAY) + 1;
};

export const calculateAlignedWeeksBetweenDates = (
  fromDate: Date,
  toDate: Date,
  firstDayOfWeek: number,
): number => {
  const alignedFromDate = alignToFirstDayOfWeek(fromDate, firstDayOfWeek);
  const alignedToDate = alignToLastDayOfWeek(toDate, firstDayOfWeek);

  const weekCount = calculateDaysBetweenDates(alignedFromDate, alignedToDate) / DAYS_IN_WEEK;
  return Math.max(weekCount, MAX_WEEKS_IN_MONTH);
};
