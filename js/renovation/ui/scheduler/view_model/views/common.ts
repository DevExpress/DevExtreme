import dateUtils from '../../../../../core/utils/date';

export const getCurrentDate = (
  currentDate: Date,
  startDate?: Date,
): Date => {
  const validCurrentDate = startDate ?? currentDate;

  return dateUtils.trimTime(validCurrentDate);
};

export const getFirstDayOfWeek = (
  includedDays: number[],
  firstDayOfWeek: number,
): number => {
  const isFirstDayOfWeekInIncludedDays = includedDays.includes(firstDayOfWeek);
  const sortedIncludedDays = includedDays.slice().sort((a, b) => a - b);

  return isFirstDayOfWeekInIncludedDays
    ? firstDayOfWeek
    : sortedIncludedDays[0];
};

export const getStartViewDate = (
  _startDayHour: number,
  _firstDayOfWeek: number,
  currentDate: Date,
): Date => currentDate;
