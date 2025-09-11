import {
  describe, expect, it,
} from '@jest/globals';

import { parseRecurrenceRule } from './base';
import { daysFromByDayRule } from './days_from_by_day_rule';

describe('daysFromByDayRule', () => {
  it('get days of the week by byDay rule', () => {
    const rule = parseRecurrenceRule('FREQ=WEEKLY;BYDAY=TU,SA');
    const days = daysFromByDayRule(rule);

    expect(days).toEqual(['TU', 'SA']);
  });

  it('get days of the week if byDay has frequence for day', () => {
    const rule = parseRecurrenceRule('FREQ=MONTHLY;BYDAY=1TU');
    const days = daysFromByDayRule(rule);

    expect(days).toEqual(['TU']);
  });

  it('get days of the week if byDay has frequence for day (2 values)', () => {
    const rule = parseRecurrenceRule('FREQ=MONTHLY;BYDAY=1TU,3FR');
    const days = daysFromByDayRule(rule);

    expect(days).toEqual(['TU', 'FR']);
  });
});
