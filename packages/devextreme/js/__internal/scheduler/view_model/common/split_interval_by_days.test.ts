import {
  describe, expect, it,
} from '@jest/globals';

import { splitIntervalByDay } from './split_interval_by_days';

describe('splitIntervalByDay', () => {
  it('should return one interval for one day', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 11),
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 11),
    }]);
  });

  it('should return day by day intervals', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 13),
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 11),
    }, {
      min: Date.UTC(2000, 0, 11),
      max: Date.UTC(2000, 0, 12),
    }, {
      min: Date.UTC(2000, 0, 12),
      max: Date.UTC(2000, 0, 13),
    }]);
  });

  it('should return day by day intervals for [3, 13]', () => {
    expect(splitIntervalByDay({
      startDayHour: 3,
      endDayHour: 13,
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 13),
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2000, 0, 10, 3),
      max: Date.UTC(2000, 0, 10, 13),
    }, {
      min: Date.UTC(2000, 0, 11, 3),
      max: Date.UTC(2000, 0, 11, 13),
    }, {
      min: Date.UTC(2000, 0, 12, 3),
      max: Date.UTC(2000, 0, 12, 13),
    }]);
  });

  it('should return day by day intervals for [0.1, 23.9]', () => {
    expect(splitIntervalByDay({
      startDayHour: 0.1,
      endDayHour: 23.9,
      min: Date.UTC(2000, 0, 10, 0, 6),
      max: Date.UTC(2000, 0, 13, 23, 56),
      skippedDays: [],
    })).toEqual([
      {
        min: Date.UTC(2000, 0, 10, 0, 6),
        max: Date.UTC(2000, 0, 10, 23, 54),
      }, {
        min: Date.UTC(2000, 0, 11, 0, 6),
        max: Date.UTC(2000, 0, 11, 23, 54),
      }, {
        min: Date.UTC(2000, 0, 12, 0, 6),
        max: Date.UTC(2000, 0, 12, 23, 54),
      }, {
        min: Date.UTC(2000, 0, 13, 0, 6),
        max: Date.UTC(2000, 0, 13, 23, 54),
      },
    ]);
  });

  it('should return zero intervals for interacted hours', () => {
    expect(splitIntervalByDay({
      startDayHour: 20,
      endDayHour: 10,
      min: Date.UTC(2000, 0, 10, 10),
      max: Date.UTC(2000, 0, 15, 5),
      skippedDays: [],
    })).toEqual([]);
  });

  it('should return intervals without skipped days', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2000, 2, 1),
      max: Date.UTC(2000, 2, 7),
      skippedDays: [0, 6],
    })).toEqual([{
      min: Date.UTC(2000, 2, 1), // Wed
      max: Date.UTC(2000, 2, 2),
    }, {
      min: Date.UTC(2000, 2, 2), // Thu
      max: Date.UTC(2000, 2, 3),
    }, {
      min: Date.UTC(2000, 2, 3), // Fri
      max: Date.UTC(2000, 2, 4),
    }, {
      min: Date.UTC(2000, 2, 6), // Mon
      max: Date.UTC(2000, 2, 7),
    }]);
  });
});
