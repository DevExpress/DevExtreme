import {
  describe, expect, it,
} from '@jest/globals';

import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';

describe('getVisibleDateTimeIntervals', () => {
  it('should return only one interval for date only view', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 3).getTime(),
      max: new Date(2000, 0, 15, 10).getTime(),
    }, true)).toEqual([{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 16).getTime(),
    }]);
  });

  it('should return only one interval for date only view (wrong hours)', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 10,
      endDayHour: 3,
      min: new Date(2000, 0, 10, 10).getTime(),
      max: new Date(2000, 0, 15, 3).getTime(),
    }, true)).toEqual([{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 16).getTime(),
    }]);
  });

  it('should return one interval for hours [0, 24]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 15).getTime(),
    }, false)).toEqual([{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 16).getTime(),
    }]);
  });

  it('should return day by day intervals for [3, 10]', () => {
    expect(getVisibleDateTimeIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10).getTime(),
      max: new Date(2000, 0, 15, 5).getTime(),
    }, false)).toEqual([
      {
        min: new Date(2000, 0, 10, 3).getTime(),
        max: new Date(2000, 0, 10, 10).getTime(),
      }, {
        min: new Date(2000, 0, 11, 3).getTime(),
        max: new Date(2000, 0, 11, 10).getTime(),
      }, {
        min: new Date(2000, 0, 12, 3).getTime(),
        max: new Date(2000, 0, 12, 10).getTime(),
      }, {
        min: new Date(2000, 0, 13, 3).getTime(),
        max: new Date(2000, 0, 13, 10).getTime(),
      }, {
        min: new Date(2000, 0, 14, 3).getTime(),
        max: new Date(2000, 0, 14, 10).getTime(),
      }, {
        min: new Date(2000, 0, 15, 3).getTime(),
        max: new Date(2000, 0, 15, 10).getTime(),
      },
    ]);
  });
});
