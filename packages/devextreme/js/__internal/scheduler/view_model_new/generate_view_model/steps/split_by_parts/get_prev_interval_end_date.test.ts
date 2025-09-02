import { describe, expect, it } from '@jest/globals';

import { getPrevIntervalEndDate } from './get_prev_interval_end_date';

describe('getPrevIntervalEndDate', () => {
  it('should return correct prev end date for several intervals with gap', () => {
    expect(getPrevIntervalEndDate([{
      min: new Date(2000, 0, 10, 3, 30).getTime(),
      max: new Date(2000, 0, 10, 23, 30).getTime(),
    }, {
      min: new Date(2000, 0, 11, 3, 30).getTime(),
      max: new Date(2000, 0, 11, 23, 30).getTime(),
    }])).toEqual(new Date(2000, 0, 9, 23, 30).getTime());
  });

  it('should return correct prev end date for several intervals without gap', () => {
    expect(getPrevIntervalEndDate([{
      min: new Date(2000, 0, 10, 23, 30).getTime(),
      max: new Date(2000, 0, 11, 23, 30).getTime(),
    }, {
      min: new Date(2000, 0, 11, 23, 30).getTime(),
      max: new Date(2000, 0, 12, 23, 30).getTime(),
    }])).toEqual(new Date(2000, 0, 10, 23, 30).getTime());
  });
});
