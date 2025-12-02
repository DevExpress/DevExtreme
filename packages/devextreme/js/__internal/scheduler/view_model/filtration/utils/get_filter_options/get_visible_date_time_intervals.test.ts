import {
  describe, expect, it,
} from '@jest/globals';

import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';

describe('getVisibleDateTimeIntervals', () => {
  it('should return only one interval for date only view', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: Date.UTC(2000, 0, 10, 3),
      max: Date.UTC(2000, 0, 15, 10),
      skippedDays: [],
    }, true)).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 16),
    }]);
  });

  it('should return only one interval for date only view (wrong hours)', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 10,
      endDayHour: 3,
      min: Date.UTC(2000, 0, 10, 10),
      max: Date.UTC(2000, 0, 15, 3),
      skippedDays: [],
    }, true)).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 16),
    }]);
  });

  it('should return one interval for hours [0, 24]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 15),
      skippedDays: [],
    }, false)).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 15),
    }]);
  });

  it('should return intervals with skipped days', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 20),
      skippedDays: [0, 6],
    }, false)).toEqual([{
      min: Date.UTC(2000, 0, 10),
      max: Date.UTC(2000, 0, 15),
    }, {
      min: Date.UTC(2000, 0, 17),
      max: Date.UTC(2000, 0, 20),
    }]);
  });

  it('should return day by day intervals for [3, 10]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: Date.UTC(2000, 0, 10, 10),
      max: Date.UTC(2000, 0, 15, 5),
      skippedDays: [],
    }, false)).toEqual([
      {
        min: Date.UTC(2000, 0, 10, 3),
        max: Date.UTC(2000, 0, 10, 10),
      }, {
        min: Date.UTC(2000, 0, 11, 3),
        max: Date.UTC(2000, 0, 11, 10),
      }, {
        min: Date.UTC(2000, 0, 12, 3),
        max: Date.UTC(2000, 0, 12, 10),
      }, {
        min: Date.UTC(2000, 0, 13, 3),
        max: Date.UTC(2000, 0, 13, 10),
      }, {
        min: Date.UTC(2000, 0, 14, 3),
        max: Date.UTC(2000, 0, 14, 10),
      }, {
        min: Date.UTC(2000, 0, 15, 3),
        max: Date.UTC(2000, 0, 15, 10),
      },
    ]);
  });
});
