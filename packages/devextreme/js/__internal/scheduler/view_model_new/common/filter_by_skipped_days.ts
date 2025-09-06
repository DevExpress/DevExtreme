import type { DateInterval } from '../types';

export const filterBySkippedDays = <T extends DateInterval>(
  intervals: T[],
  skippedDays: number[],
): T[] => intervals.filter((item) => !skippedDays.includes(new Date(item.min).getDay()));
