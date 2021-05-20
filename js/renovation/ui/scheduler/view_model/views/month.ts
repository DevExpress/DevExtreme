import dateUtils from '../../../../../core/utils/date';

export const getStartViewDate = (
  startDayHour: number,
  firstDayOfWeek: number,
  currentDate: Date,
): Date => {
  const firstMonthDate = dateUtils.getFirstMonthDate(currentDate);

  const result = dateUtils.getFirstWeekDate(firstMonthDate, firstDayOfWeek);
  result.setHours(startDayHour);

  return result;
};
