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
