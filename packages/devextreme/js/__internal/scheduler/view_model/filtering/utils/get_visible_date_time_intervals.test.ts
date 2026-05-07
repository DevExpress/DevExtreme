import {
  describe, expect, it,
} from '@jest/globals';

import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';

describe('getVisibleDateTimeIntervals', () => {
  it('should return only one interval for date only view', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 3),
      max: new Date(2000, 0, 15, 10),
    }, true)).toEqual([{
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    }]);
  });

  it('should return only one interval for date only view (wrong hours)', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 10,
      endDayHour: 3,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 3),
    }, true)).toEqual([{
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    }]);
  });

  it('should return one interval for hours [0, 24]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 15),
    }, false)).toEqual([{
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    }]);
  });

  it('should return day by day intervals for [3, 10]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 5),
    }, false)).toEqual([
      {
        min: new Date(2000, 0, 10, 3),
        max: new Date(2000, 0, 10, 10),
      }, {
        min: new Date(2000, 0, 11, 3),
        max: new Date(2000, 0, 11, 10),
      }, {
        min: new Date(2000, 0, 12, 3),
        max: new Date(2000, 0, 12, 10),
      }, {
        min: new Date(2000, 0, 13, 3),
        max: new Date(2000, 0, 13, 10),
      }, {
        min: new Date(2000, 0, 14, 3),
        max: new Date(2000, 0, 14, 10),
      }, {
        min: new Date(2000, 0, 15, 3),
        max: new Date(2000, 0, 15, 10),
      },
    ]);
  });

  it('should return day by day intervals for [0.1, 23.9]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 0.1,
      endDayHour: 23.9,
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 13),
    }, false)).toEqual([
      {
        min: new Date(2000, 0, 10, 0, 6),
        max: new Date(2000, 0, 10, 23, 54),
      }, {
        min: new Date(2000, 0, 11, 0, 6),
        max: new Date(2000, 0, 11, 23, 54),
      }, {
        min: new Date(2000, 0, 12, 0, 6),
        max: new Date(2000, 0, 12, 23, 54),
      }, {
        min: new Date(2000, 0, 13, 0, 6),
        max: new Date(2000, 0, 13, 23, 54),
      },
    ]);
  });

  it('should return zero intervals for interacted hours', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 20,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 5),
    }, false)).toEqual([]);
  });
});
