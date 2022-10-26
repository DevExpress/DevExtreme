import { TimeUnit } from './types';

export function toMilliseconds(value: TimeUnit): number {
  const timeIntervals: { [key: string]: number } = {
    millisecond: 1,
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
    month: 1000 * 60 * 60 * 24 * 30,
    quarter: 1000 * 60 * 60 * 24 * 30 * 3,
    year: 1000 * 60 * 60 * 24 * 365,
  };
  return timeIntervals[value];
}
