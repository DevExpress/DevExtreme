import type { DateInterval } from '../type';

export const isAppointmentMatchedIntervals = (
  { startDate, endDate }: {
    startDate: Date;
    endDate: Date;
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
