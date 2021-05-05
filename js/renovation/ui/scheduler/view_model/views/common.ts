import dateUtils from '../../../../../core/utils/date';

export const getCurrentDate = (
  currentDate: Date,
  startDate?: Date,
): Date => {
  const validCurrentDate = startDate || currentDate;

  return dateUtils.trimTime(validCurrentDate);
};

export const getFirstDayOfWeek = (
  includedDays: number[],
  firstDayOfWeek: number,
): number => {
  const isFirstDayOfWeekInIncludedDays = includedDays.indexOf(firstDayOfWeek) !== -1;
  const sortedIncludedDays = includedDays.slice().sort();

  return isFirstDayOfWeekInIncludedDays
    ? firstDayOfWeek
    : sortedIncludedDays[0];
};

export const getStartViewDate = (
  startDayHour: number,
  firstDayOfWeek: number,
  currentDate: Date,
): Date => currentDate;
