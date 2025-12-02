import type { DateInterval } from '../../../types';

export const getNextIntervalStartDate = (
  intervals: DateInterval[],
): number => {
  const minDate = new Date(intervals[intervals.length - 1].min);
  const maxDate = new Date(intervals[intervals.length - 1].max);
  const isTheSameHours = minDate.getUTCHours() === maxDate.getUTCHours()
    && minDate.getUTCMinutes() === maxDate.getUTCMinutes()
    && minDate.getUTCSeconds() === maxDate.getUTCSeconds()
    && minDate.getUTCMilliseconds() === maxDate.getUTCMilliseconds();

  if (isTheSameHours) {
    return maxDate.getTime();
  }

  const nextDate = new Date(maxDate.getTime() - 1);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  nextDate.setUTCHours(
    minDate.getUTCHours(),
    minDate.getUTCMinutes(),
    minDate.getUTCSeconds(),
    minDate.getUTCMilliseconds(),
  );

  return nextDate.getTime();
};
