import {
  describe, expect, it,
} from '@jest/globals';

import { shiftIntervals } from './shift_intervals';

const intervals = [
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
];

describe('getVisibleDateTimeIntervals', () => {
  it('should shift intervals by offset 0', () => {
    expect(shiftIntervals(intervals, 0)).toEqual(intervals);
  });

  it('should shift intervals by offset 760 min', () => {
    expect(shiftIntervals(intervals, 760 * 60000)).toEqual([
      {
        min: Date.UTC(2000, 0, 10, 12, 46),
        max: Date.UTC(2000, 0, 11, 12, 34),
      }, {
        min: Date.UTC(2000, 0, 11, 12, 46),
        max: Date.UTC(2000, 0, 12, 12, 34),
      }, {
        min: Date.UTC(2000, 0, 12, 12, 46),
        max: Date.UTC(2000, 0, 13, 12, 34),
      }, {
        min: Date.UTC(2000, 0, 13, 12, 46),
        max: Date.UTC(2000, 0, 14, 12, 34),
      },
    ]);
  });

  it('should shift intervals by offset -760 min', () => {
    expect(shiftIntervals(intervals, -760 * 60000)).toEqual([
      {
        min: Date.UTC(2000, 0, 9, 11, 26),
        max: Date.UTC(2000, 0, 10, 11, 14),
      }, {
        min: Date.UTC(2000, 0, 10, 11, 26),
        max: Date.UTC(2000, 0, 11, 11, 14),
      }, {
        min: Date.UTC(2000, 0, 11, 11, 26),
        max: Date.UTC(2000, 0, 12, 11, 14),
      }, {
        min: Date.UTC(2000, 0, 12, 11, 26),
        max: Date.UTC(2000, 0, 13, 11, 14),
      },
    ]);
  });
});
