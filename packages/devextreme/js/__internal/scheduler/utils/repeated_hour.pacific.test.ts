/**
 * @timezone America/Los_Angeles
 */

import { describe, expect, it } from '@jest/globals';

import { dateAtVisibleOffset, getVisibleFallbackMs } from './repeated_hour';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

describe('repeated hour inside a partial visible range', () => {
  const fallbackDay = new Date(2021, 10, 7);

  it('adds only the repeated half hour that is inside 01:30-02:00', () => {
    expect(getVisibleFallbackMs(fallbackDay, 1.5, 2)).toBe(30 * MINUTE);
    expect(getVisibleFallbackMs(fallbackDay, 0, 1.5)).toBe(30 * MINUTE);
    expect(getVisibleFallbackMs(fallbackDay, 0, 24)).toBe(HOUR);
  });

  it('skips the second 01:00-01:30 when the view starts at 01:30', () => {
    const firstCell = dateAtVisibleOffset(fallbackDay, 1.5, 2, 0);
    const secondCell = dateAtVisibleOffset(fallbackDay, 1.5, 2, 30 * MINUTE);

    expect(firstCell.toISOString()).toBe('2021-11-07T08:30:00.000Z');
    expect(secondCell.toISOString()).toBe('2021-11-07T09:30:00.000Z');
  });
});
