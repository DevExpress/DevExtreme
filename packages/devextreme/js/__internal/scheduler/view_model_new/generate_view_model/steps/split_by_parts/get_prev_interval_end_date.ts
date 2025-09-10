import type { DateInterval } from '../../../types';

export const getPrevIntervalEndDate = (
  intervals: DateInterval[],
): number => {
  const maxDate = new Date(intervals[0].max);
  const prevDate = new Date(intervals[0].min);
  const isTheSameHours = maxDate.getHours() === prevDate.getHours()
    && maxDate.getMinutes() === prevDate.getMinutes()
    && maxDate.getSeconds() === prevDate.getSeconds()
    && maxDate.getMilliseconds() === prevDate.getMilliseconds();

  if (isTheSameHours) {
    return prevDate.getTime();
  }

  prevDate.setHours(
    maxDate.getHours(),
    maxDate.getMinutes(),
    maxDate.getSeconds(),
    maxDate.getMilliseconds(),
  );
  prevDate.setDate(prevDate.getDate() - 1);

  return prevDate.getTime();
};
