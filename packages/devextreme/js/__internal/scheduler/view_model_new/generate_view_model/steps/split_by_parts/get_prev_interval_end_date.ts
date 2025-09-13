import type { DateInterval } from '../../../types';

export const getPrevIntervalEndDate = (
  intervals: DateInterval[],
): number => {
  const maxDate = new Date(intervals[0].max);
  const prevDate = new Date(intervals[0].min);
  const isTheSameHours = maxDate.getUTCHours() === prevDate.getUTCHours()
    && maxDate.getUTCMinutes() === prevDate.getUTCMinutes()
    && maxDate.getUTCSeconds() === prevDate.getUTCSeconds()
    && maxDate.getUTCMilliseconds() === prevDate.getUTCMilliseconds();

  if (isTheSameHours) {
    return prevDate.getTime();
  }

  prevDate.setUTCHours(
    maxDate.getUTCHours(),
    maxDate.getUTCMinutes(),
    maxDate.getUTCSeconds(),
    maxDate.getUTCMilliseconds(),
  );
  prevDate.setUTCDate(prevDate.getUTCDate() - 1);

  return prevDate.getTime();
};
