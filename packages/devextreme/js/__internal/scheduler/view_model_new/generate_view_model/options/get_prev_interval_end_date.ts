import type { DateInterval } from '../../types';

export const getPrevIntervalEndDate = (
  intervals: DateInterval[],
  isAllDayIntervals: boolean,
): number => {
  if (isAllDayIntervals) {
    return intervals[0].min;
  }

  const prevDate = new Date(intervals[0].max);
  prevDate.setDate(prevDate.getDate() - 1);

  return prevDate.getTime();
};
