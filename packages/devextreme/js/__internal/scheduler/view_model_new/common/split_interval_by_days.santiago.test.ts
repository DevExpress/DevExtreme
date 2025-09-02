/**
 * @timezone America/Santiago
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
      min: new Date(2016, 8, 6).getTime(),
      max: new Date(2016, 8, 8, 23, 59).getTime(),
    })).toEqual([{
      min: new Date(2016, 8, 6).getTime(),
      max: new Date(2016, 8, 7).getTime(),
    }, {
      min: new Date(2016, 8, 7).getTime(),
      max: new Date(2016, 8, 8).getTime(),
    }, {
      min: new Date(2016, 8, 8).getTime(),
      max: new Date(2016, 8, 9).getTime(),
    }]);
  });

  it('should return intervals through summer DST', () => {
    expect(splitIntervalByDay({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2016, 3, 3).getTime(),
      max: new Date(2016, 3, 5, 23, 59).getTime(),
    })).toEqual([{
      min: new Date(2016, 3, 3).getTime(),
      max: new Date(2016, 3, 4).getTime(),
    }, {
      min: new Date(2016, 3, 4).getTime(),
      max: new Date(2016, 3, 5).getTime(),
    }, {
      min: new Date(2016, 3, 5).getTime(),
      max: new Date(2016, 3, 6).getTime(),
    }]);
  });
});
