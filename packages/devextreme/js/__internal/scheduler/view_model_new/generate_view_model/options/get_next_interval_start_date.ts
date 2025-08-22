import type { DateInterval } from '../../types';

export const getNextIntervalStartDate = (
  intervals: DateInterval[],
  isAllDayIntervals: boolean,
): number => {
  if (isAllDayIntervals) {
    return intervals[intervals.length - 1].max;
  }

  const prevDate = new Date(intervals[intervals.length - 1].min);
  prevDate.setDate(prevDate.getDate() + 1);

  return prevDate.getTime();
};
