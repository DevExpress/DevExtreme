import { describe, expect, it } from '@jest/globals';

import { getPrevIntervalEndDate } from './get_prev_interval_end_date';

describe('getPrevIntervalEndDate', () => {
  it('should return correct prev end date for several intervals with gap', () => {
    expect(getPrevIntervalEndDate([{
      min: Date.UTC(2000, 0, 10, 3, 30),
      max: Date.UTC(2000, 0, 10, 23, 30),
    }, {
      min: Date.UTC(2000, 0, 11, 3, 30),
      max: Date.UTC(2000, 0, 11, 23, 30),
    }])).toEqual(Date.UTC(2000, 0, 9, 23, 30));
  });

  it('should return correct prev end date for several intervals without gap', () => {
    expect(getPrevIntervalEndDate([{
      min: Date.UTC(2000, 0, 10, 23, 30),
      max: Date.UTC(2000, 0, 11, 23, 30),
    }, {
      min: Date.UTC(2000, 0, 11, 23, 30),
      max: Date.UTC(2000, 0, 12, 23, 30),
    }])).toEqual(Date.UTC(2000, 0, 10, 23, 30));
  });

  it('should return correct prev end date for several intervals with gap at start of day', () => {
    expect(getPrevIntervalEndDate([{
      min: Date.UTC(2000, 0, 10, 9),
      max: Date.UTC(2000, 0, 12, 0),
    }, {
      min: Date.UTC(2000, 0, 12, 9),
      max: Date.UTC(2000, 0, 14, 0),
    }])).toEqual(Date.UTC(2000, 0, 10, 0));
  });

  it('should return correct prev end date for several intervals with gap at end of day', () => {
    expect(getPrevIntervalEndDate([{
      min: Date.UTC(2000, 0, 10, 0),
      max: Date.UTC(2000, 0, 11, 9),
    }, {
      min: Date.UTC(2000, 0, 12, 0),
      max: Date.UTC(2000, 0, 13, 9),
    }])).toEqual(Date.UTC(2000, 0, 9, 9));
  });
});
