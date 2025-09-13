import { describe, expect, it } from '@jest/globals';

import { getNextIntervalStartDate } from './get_next_interval_start_date';

describe('getNextIntervalStartDate', () => {
  it('should return correct next start date for several intervals with gap', () => {
    expect(getNextIntervalStartDate([{
      min: Date.UTC(2000, 0, 10, 3, 30),
      max: Date.UTC(2000, 0, 10, 23, 30),
    }, {
      min: Date.UTC(2000, 0, 11, 3, 30),
      max: Date.UTC(2000, 0, 11, 23, 30),
    }])).toEqual(Date.UTC(2000, 0, 12, 3, 30));
  });

  it('should return correct next start date for several intervals without gap', () => {
    expect(getNextIntervalStartDate([{
      min: Date.UTC(2000, 0, 10, 23, 30),
      max: Date.UTC(2000, 0, 11, 23, 30),
    }, {
      min: Date.UTC(2000, 0, 11, 23, 30),
      max: Date.UTC(2000, 0, 12, 23, 30),
    }])).toEqual(Date.UTC(2000, 0, 12, 23, 30));
  });
});
