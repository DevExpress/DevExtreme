import dateUtils from '../../../../../core/utils/date';

export const getStartViewDate = (
  startDayHour: number,
  _firstDayOfWeek: number,
  currentDate: Date,
): Date => {
  const result = dateUtils.getFirstMonthDate(currentDate) as Date;
  result.setHours(startDayHour);

  return result;
};
