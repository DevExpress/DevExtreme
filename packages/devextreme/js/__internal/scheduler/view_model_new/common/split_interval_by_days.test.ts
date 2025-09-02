import {
  describe, expect, it,
} from '@jest/globals';

import { splitIntervalByDay } from './split_interval_by_days';

describe('splitIntervalByDay', () => {
  it('should return one interval for one day', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 11).getTime(),
    })).toEqual([{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 11).getTime(),
    }]);
  });

  it('should return day by day intervals', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 13).getTime(),
    })).toEqual([{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 11).getTime(),
    }, {
      min: new Date(2000, 0, 11).getTime(),
      max: new Date(2000, 0, 12).getTime(),
    }, {
      min: new Date(2000, 0, 12).getTime(),
      max: new Date(2000, 0, 13).getTime(),
    }]);
  });

  it('should return day by day intervals for [3, 13]', () => {
    expect(splitIntervalByDay({
      startDayHour: 3,
      endDayHour: 13,
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 13).getTime(),
    })).toEqual([{
      min: new Date(2000, 0, 10, 3).getTime(),
      max: new Date(2000, 0, 10, 13).getTime(),
    }, {
      min: new Date(2000, 0, 11, 3).getTime(),
      max: new Date(2000, 0, 11, 13).getTime(),
    }, {
      min: new Date(2000, 0, 12, 3).getTime(),
      max: new Date(2000, 0, 12, 13).getTime(),
    }]);
  });

  it('should return day by day intervals for [0.1, 23.9]', () => {
    expect(splitIntervalByDay({
      startDayHour: 0.1,
      endDayHour: 23.9,
      min: new Date(2000, 0, 10, 0, 6).getTime(),
      max: new Date(2000, 0, 13, 23, 56).getTime(),
    })).toEqual([
      {
        min: new Date(2000, 0, 10, 0, 6).getTime(),
        max: new Date(2000, 0, 10, 23, 54).getTime(),
      }, {
        min: new Date(2000, 0, 11, 0, 6).getTime(),
        max: new Date(2000, 0, 11, 23, 54).getTime(),
      }, {
        min: new Date(2000, 0, 12, 0, 6).getTime(),
        max: new Date(2000, 0, 12, 23, 54).getTime(),
      }, {
        min: new Date(2000, 0, 13, 0, 6).getTime(),
        max: new Date(2000, 0, 13, 23, 54).getTime(),
      },
    ]);
  });

  it('should return zero intervals for interacted hours', () => {
    expect(splitIntervalByDay({
      startDayHour: 20,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 10).getTime(),
      max: new Date(2000, 0, 15, 5).getTime(),
    })).toEqual([]);
  });
});
