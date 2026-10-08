import { describe, expect, it } from '@jest/globals';

import { smartFormatter } from './smart_formatter';

const tick = new Date(2024, 5, 15, 14, 30);

describe('smartFormatter locale-only format', () => {
  it('keeps time for a datetime axis', () => {
    const text = smartFormatter(tick, {
      labelOptions: { format: { locale: 'en-US' } },
      ticks: [tick],
      dataType: 'datetime',
      type: 'continuous',
    });

    expect(text).toBe('6/15/2024, 2:30 PM');
  });

  it('does not turn a numeric format into a date', () => {
    const text = smartFormatter(1234.5, {
      labelOptions: { format: { locale: 'en-US' } },
      ticks: [1234.5],
      dataType: 'numeric',
      type: 'continuous',
    });

    expect(text).toBe('1,234.5');
  });
});
