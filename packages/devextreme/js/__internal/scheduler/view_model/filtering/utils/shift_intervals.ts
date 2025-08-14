import { dateUtilsTs } from '@ts/core/utils/date';

import type { DateInterval } from './type';

export const shiftIntervals = (
  intervals: DateInterval[],
  viewOffset: number,
): DateInterval[] => intervals.map((interval) => ({
  min: dateUtilsTs.addOffsets(interval.min, [viewOffset]),
  max: dateUtilsTs.addOffsets(interval.max, [viewOffset]),
}));
