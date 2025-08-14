import {
  describe, expect, it,
} from '@jest/globals';

import { createTimeZoneCalculator } from '../../r1/timezone_calculator';
import { getRecurrenceException } from './get_recurrence_exception';

describe('getRecurrenceException', () => {
  it.each([
    { timezone: 'Etc/GMT+9', result: '20000111T000000,20000112T000000,20000113T000000' },
    { timezone: 'Etc/GMT+10', result: '20000110T230000,20000111T230000,20000112T230000' },
    { timezone: 'Etc/GMT+11', result: '20000110T220000,20000111T220000,20000112T220000' },
  ])('should convert exception dates to client timezones ($timezone)', ({ timezone, result }) => {
    expect(getRecurrenceException(
      '20000111T090000Z,20000112T090000Z,20000113T090000Z',
      new Date('2000-01-11T09:00:00.000Z'),
      createTimeZoneCalculator(timezone),
    )).toBe(result);
  });
});
