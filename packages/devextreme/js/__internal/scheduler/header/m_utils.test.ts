import { describe, expect, it } from '@jest/globals';

import { getCaptionInterval, getNextIntervalDate } from './m_utils';

describe('agenda hiddenWeekDays support in header utils', () => {
  const skippedDays: number[] = [0, 6];
  const options = {
    date: new Date(2026, 3, 11),
    step: 'agenda' as const,
    intervalCount: 1,
    agendaDuration: 3,
    skippedDays,
  };

  it('should build caption interval by calendar days', () => {
    expect(getCaptionInterval(options)).toEqual({
      startDate: new Date(2026, 3, 11),
      endDate: new Date(2026, 3, 13, 23, 59, 59, 999),
    });
  });

  it('should navigate to next agenda interval by calendar days', () => {
    expect(getNextIntervalDate(options, 1)).toEqual(new Date(2026, 3, 14));
  });

  it('should navigate to previous agenda interval by calendar days', () => {
    expect(getNextIntervalDate(options, -1)).toEqual(new Date(2026, 3, 8));
  });
});

describe('workWeek hiddenWeekDays support in header utils', () => {
  it('should keep Mon-Fri caption for default skippedDays', () => {
    expect(getCaptionInterval({
      date: new Date(2026, 3, 8), // Wednesday
      step: 'workWeek',
      intervalCount: 1,
      skippedDays: [0, 6],
      firstDayOfWeek: 0,
    })).toEqual({
      startDate: new Date(2026, 3, 6),
      endDate: new Date(2026, 3, 10, 23, 59, 59, 999),
    });
  });

  it('should use full week caption when skippedDays override is empty', () => {
    expect(getCaptionInterval({
      date: new Date(2026, 3, 8), // Wednesday
      step: 'workWeek',
      intervalCount: 1,
      skippedDays: [],
      firstDayOfWeek: 0,
    })).toEqual({
      startDate: new Date(2026, 3, 5),
      endDate: new Date(2026, 3, 11, 23, 59, 59, 999),
    });
  });

  it('should use first and last visible days for custom skippedDays', () => {
    expect(getCaptionInterval({
      date: new Date(2026, 3, 8), // Wednesday
      step: 'workWeek',
      intervalCount: 1,
      skippedDays: [1, 2],
      firstDayOfWeek: 0,
    })).toEqual({
      startDate: new Date(2026, 3, 5),
      endDate: new Date(2026, 3, 11, 23, 59, 59, 999),
    });
  });
});

describe('week hiddenWeekDays support in header utils', () => {
  it('should use first and last visible day for week caption', () => {
    expect(getCaptionInterval({
      date: new Date(2026, 3, 8), // Wednesday
      step: 'week',
      intervalCount: 1,
      skippedDays: [0, 1],
      firstDayOfWeek: 1, // Monday
    })).toEqual({
      startDate: new Date(2026, 3, 7),
      endDate: new Date(2026, 3, 11, 23, 59, 59, 999),
    });
  });
});
