/**
 * @timezone Europe/Belgrade
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { getIntervalDaysCount } from './get_interval_days_count';

describe('getIntervalDaysCount', () => {
  it('should return count for interval in the same day', () => {
    expect(getIntervalDaysCount({
      min: new Date(2016, 10, 5, 10).getTime(),
      max: new Date(2016, 10, 5, 23, 59).getTime(),
    })).toBe(1);
  });

  it('should return count for interval in the different months', () => {
    expect(getIntervalDaysCount({
      min: new Date(2016, 6, 30).getTime(),
      max: new Date(2016, 7, 6).getTime(),
    })).toBe(7);
  });

  it('should return count for interval with summer DST', () => {
    expect(getIntervalDaysCount({
      min: new Date(2025, 2, 28).getTime(),
      max: new Date(2025, 2, 31).getTime(),
    })).toBe(3);
  });

  it('should return count for interval with winter DST', () => {
    expect(getIntervalDaysCount({
      min: new Date(2025, 9, 25).getTime(),
      max: new Date(2025, 9, 27).getTime(),
    })).toBe(2);
  });
});
