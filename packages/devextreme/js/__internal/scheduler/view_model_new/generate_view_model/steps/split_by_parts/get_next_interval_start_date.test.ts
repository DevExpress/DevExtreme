import { describe, expect, it } from '@jest/globals';

import { getNextIntervalStartDate } from './get_next_interval_start_date';

describe('getNextIntervalStartDate', () => {
  it('should return correct next start date for several intervals with gap', () => {
    expect(getNextIntervalStartDate([{
      min: new Date(2000, 0, 10, 3, 30).getTime(),
      max: new Date(2000, 0, 10, 23, 30).getTime(),
    }, {
      min: new Date(2000, 0, 11, 3, 30).getTime(),
      max: new Date(2000, 0, 11, 23, 30).getTime(),
    }])).toEqual(new Date(2000, 0, 12, 3, 30).getTime());
  });

  it('should return correct next start date for several intervals without gap', () => {
    expect(getNextIntervalStartDate([{
      min: new Date(2000, 0, 10, 23, 30).getTime(),
      max: new Date(2000, 0, 11, 23, 30).getTime(),
    }, {
      min: new Date(2000, 0, 11, 23, 30).getTime(),
      max: new Date(2000, 0, 12, 23, 30).getTime(),
    }])).toEqual(new Date(2000, 0, 12, 23, 30).getTime());
  });
});
