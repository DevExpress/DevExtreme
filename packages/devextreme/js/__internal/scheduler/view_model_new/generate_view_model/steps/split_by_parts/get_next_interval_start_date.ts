import type { DateInterval } from '../../../types';

export const getNextIntervalStartDate = (
  intervals: DateInterval[],
): number => {
  const minDate = new Date(intervals[intervals.length - 1].min);
  const nextDate = new Date(intervals[intervals.length - 1].max);
  const isTheSameHours = minDate.getUTCHours() === nextDate.getUTCHours()
    && minDate.getUTCMinutes() === nextDate.getUTCMinutes()
    && minDate.getUTCSeconds() === nextDate.getUTCSeconds()
    && minDate.getUTCMilliseconds() === nextDate.getUTCMilliseconds();

  if (isTheSameHours) {
    return nextDate.getTime();
  }

  nextDate.setUTCHours(
    minDate.getUTCHours(),
    minDate.getUTCMinutes(),
    minDate.getUTCSeconds(),
    minDate.getUTCMilliseconds(),
  );
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);

  return nextDate.getTime();
};
