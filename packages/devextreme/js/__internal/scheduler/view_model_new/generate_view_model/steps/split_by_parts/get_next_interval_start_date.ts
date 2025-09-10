import type { DateInterval } from '../../../types';

export const getNextIntervalStartDate = (
  intervals: DateInterval[],
): number => {
  const minDate = new Date(intervals[intervals.length - 1].min);
  const nextDate = new Date(intervals[intervals.length - 1].max);
  const isTheSameHours = minDate.getHours() === nextDate.getHours()
    && minDate.getMinutes() === nextDate.getMinutes()
    && minDate.getSeconds() === nextDate.getSeconds()
    && minDate.getMilliseconds() === nextDate.getMilliseconds();

  if (isTheSameHours) {
    return nextDate.getTime();
  }

  nextDate.setHours(
    minDate.getHours(),
    minDate.getMinutes(),
    minDate.getSeconds(),
    minDate.getMilliseconds(),
  );
  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate.getTime();
};
