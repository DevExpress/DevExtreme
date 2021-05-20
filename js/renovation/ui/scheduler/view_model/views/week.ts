import dateUtils from '../../../../../core/utils/date';

export const getStartViewDate = (
  startDayHour: number,
  firstDayOfWeek: number,
  currentDate: Date,
): Date => {
  const result = dateUtils.getFirstWeekDate(currentDate, firstDayOfWeek);
  result.setHours(startDayHour);

  return result;
};
