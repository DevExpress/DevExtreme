import type { DateInterval } from '../types';

export const shiftIntervals = <T extends DateInterval>(
  intervals: T[],
  viewOffset: number,
): T[] => intervals.map((interval) => ({
    ...interval,
    min: interval.min + viewOffset,
    max: interval.max + viewOffset,
  }));
