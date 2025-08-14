import type { DateInterval } from '../types';

export const shiftIntervals = (
  intervals: DateInterval[],
  viewOffset: number,
): DateInterval[] => intervals.map((interval) => ({
  min: interval.min + viewOffset,
  max: interval.max + viewOffset,
}));
