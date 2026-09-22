import { describe, expect, it } from '@jest/globals';

import { getWeekIntervals } from './get_week_intervals';

describe('getWeekIntervals', () => {
  it('keeps a pre-1970 timeline interval from extending to the Unix epoch', () => {
    const intervals = getWeekIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(1969, 0, 1),
      max: Date.UTC(1969, 0, 2),
      skippedDays: [],
    }, 60, 0, true);

    const lastCellMax = intervals.cells[intervals.cells.length - 1].max;

    expect(intervals.intervals[0].max).toBe(lastCellMax);
    expect(intervals.intervals[0].max).toBeLessThan(0);
  });
});
