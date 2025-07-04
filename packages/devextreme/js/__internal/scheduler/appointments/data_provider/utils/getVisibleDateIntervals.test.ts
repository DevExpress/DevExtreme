import {
  describe, expect, it,
} from '@jest/globals';

import { getVisibleDateIntervals } from './getVisibleDateIntervals';

describe('getVisibleDateIntervals', () => {
  it('should return only one interval for date only view', () => {
    expect(getVisibleDateIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 3),
      max: new Date(2000, 0, 15, 10),
      isOnlyDateCheck: true,
    })).toEqual([{
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    }]);
  });

  it('should return only one interval for date only view (wrong hours)', () => {
    expect(getVisibleDateIntervals({
      startDayHour: 10,
      endDayHour: 3,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 3),
      isOnlyDateCheck: true,
    })).toEqual([{
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    }]);
  });

  it('should return day by day intervals', () => {
    expect(getVisibleDateIntervals({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 5),
      isOnlyDateCheck: false,
    })).toEqual([
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

  it('should return zero intervals for interacted hours', () => {
    expect(getVisibleDateIntervals({
      startDayHour: 20,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10),
      max: new Date(2000, 0, 15, 5),
      isOnlyDateCheck: false,
    })).toEqual([]);
  });
});
