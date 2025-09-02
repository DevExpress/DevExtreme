/**
 * @timezone Canada/Pacific
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { splitIntervalByDay } from './split_interval_by_days';

describe('splitIntervalByDay', () => {
  it('should return intervals through winter DST', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2016, 10, 5, 10).getTime(),
      max: new Date(2016, 10, 7, 23, 59).getTime(),
    })).toEqual([{
      min: new Date(2016, 10, 5).getTime(),
      max: new Date(2016, 10, 6).getTime(),
    }, {
      min: new Date(2016, 10, 6).getTime(),
      max: new Date(2016, 10, 7).getTime(),
    }, {
      min: new Date(2016, 10, 7).getTime(),
      max: new Date(2016, 10, 8).getTime(),
    }]);
  });

  it('should return intervals through summer DST', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2016, 2, 12).getTime(),
      max: new Date(2016, 2, 14, 23, 59).getTime(),
    })).toEqual([{
      min: new Date(2016, 2, 12).getTime(),
      max: new Date(2016, 2, 13).getTime(),
    }, {
      min: new Date(2016, 2, 13).getTime(),
      max: new Date(2016, 2, 14).getTime(),
    }, {
      min: new Date(2016, 2, 14).getTime(),
      max: new Date(2016, 2, 15).getTime(),
    }]);
  });
});
