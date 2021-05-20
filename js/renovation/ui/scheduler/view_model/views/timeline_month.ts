import dateUtils from '../../../../../core/utils/date';

export const getStartViewDate = (
  startDayHour: number,
  firstDayOfWeek: number,
  currentDate: Date,
): Date => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = dateUtils.getFirstMonthDate(currentDate)!;
  result.setHours(startDayHour);

  return result;
};
