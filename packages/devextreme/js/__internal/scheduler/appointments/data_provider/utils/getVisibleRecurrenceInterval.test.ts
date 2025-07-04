import {
  describe, expect, it,
} from '@jest/globals';

import { getVisibleRecurrenceInterval } from './getVisibleRecurrenceInterval';

describe('getVisibleRecurrenceInterval', () => {
  it('should return interval for date only view', () => {
    expect(getVisibleRecurrenceInterval({
      startDayHour: 3,
      endDayHour: 10,
      min: new Date(2000, 0, 10, 3),
      max: new Date(2000, 0, 15, 10),
      isOnlyDateCheck: true,
    })).toEqual({
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    });
  });

  it('should return one interval for [0, 24]', () => {
    expect(getVisibleRecurrenceInterval({
      startDayHour: 0,
      endDayHour: 24,
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 15),
      isOnlyDateCheck: false,
    })).toEqual({
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 16),
    });
  });

  it('should return one interval for [0.1, 23.9]', () => {
    expect(getVisibleRecurrenceInterval({
      startDayHour: 0.1,
      endDayHour: 23.9,
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 13),
      isOnlyDateCheck: false,
    })).toEqual({
      min: new Date(2000, 0, 10, 0, 6),
      max: new Date(2000, 0, 13, 23, 54),
    });
  });

  it('should return one interval for [13, 20]', () => {
    expect(getVisibleRecurrenceInterval({
      startDayHour: 13,
      endDayHour: 20,
      min: new Date(2000, 0, 10),
      max: new Date(2000, 0, 15),
      isOnlyDateCheck: false,
    })).toEqual({
      min: new Date(2000, 0, 10, 13),
      max: new Date(2000, 0, 15, 20),
    });
  });
});
