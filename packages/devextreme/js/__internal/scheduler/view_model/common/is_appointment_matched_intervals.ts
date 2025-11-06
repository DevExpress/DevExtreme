import type { DateInterval } from '../types';

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
