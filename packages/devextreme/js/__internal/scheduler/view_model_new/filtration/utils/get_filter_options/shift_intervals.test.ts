import {
  describe, expect, it,
} from '@jest/globals';

import { shiftIntervals } from './shift_intervals';

const intervals = [
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
];

describe('getVisibleDateTimeIntervals', () => {
  it('should shift intervals by offset 0', () => {
    expect(shiftIntervals(intervals, 0)).toEqual(intervals);
  });

  it('should shift intervals by offset 760 min', () => {
    expect(shiftIntervals(intervals, 760 * 60000)).toEqual([
      {
        min: new Date(2000, 0, 10, 12, 46).getTime(),
        max: new Date(2000, 0, 11, 12, 34).getTime(),
      }, {
        min: new Date(2000, 0, 11, 12, 46).getTime(),
        max: new Date(2000, 0, 12, 12, 34).getTime(),
      }, {
        min: new Date(2000, 0, 12, 12, 46).getTime(),
        max: new Date(2000, 0, 13, 12, 34).getTime(),
      }, {
        min: new Date(2000, 0, 13, 12, 46).getTime(),
        max: new Date(2000, 0, 14, 12, 34).getTime(),
      },
    ]);
  });

  it('should shift intervals by offset -760 min', () => {
    expect(shiftIntervals(intervals, -760 * 60000)).toEqual([
      {
        min: new Date(2000, 0, 9, 11, 26).getTime(),
        max: new Date(2000, 0, 10, 11, 14).getTime(),
      }, {
        min: new Date(2000, 0, 10, 11, 26).getTime(),
        max: new Date(2000, 0, 11, 11, 14).getTime(),
      }, {
        min: new Date(2000, 0, 11, 11, 26).getTime(),
        max: new Date(2000, 0, 12, 11, 14).getTime(),
      }, {
        min: new Date(2000, 0, 12, 11, 26).getTime(),
        max: new Date(2000, 0, 13, 11, 14).getTime(),
      },
    ]);
  });
});
