import type { DateInterval } from '../../view_model/filtering/utils/type';

export const isAppointmentMatchedIntervals = (
  { startDate, endDate }: {
    startDate: number;
    endDate: number;
  },
  intervals: DateInterval[],
): boolean => {
  const intersectionIntervalIndex = intervals.findIndex(({ max }) => startDate < max);

  if (intersectionIntervalIndex === -1) {
    return false;
  }

  const intervalStartDate = intervals[intersectionIntervalIndex].min;
  return startDate >= intervalStartDate || endDate > intervalStartDate;
};
