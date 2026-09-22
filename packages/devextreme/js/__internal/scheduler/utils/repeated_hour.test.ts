/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import {
  findFallbackInstant,
  getCumulativeFallbackShiftMs,
  getRepeatedHourLayoutMs,
  getVisibleFallbackMs,
} from './repeated_hour';

const HOUR = 60 * 60 * 1000;
const CELL = 15 * 60 * 1000;

describe('repeated hour layout', () => {
  const fallbackDay = new Date(2026, 9, 29);
  const nextDay = new Date(2026, 9, 30);

  it('adds one elapsed hour on the Egypt fallback day and none on the next day', () => {
    expect(getVisibleFallbackMs(fallbackDay, 0, 24)).toBe(HOUR);
    expect(getVisibleFallbackMs(nextDay, 0, 24)).toBe(0);
  });

  it('keeps the extra hour only inside the visible hours', () => {
    expect(getVisibleFallbackMs(fallbackDay, 22, 24)).toBe(HOUR);
    expect(getVisibleFallbackMs(fallbackDay, 0, 22)).toBe(0);
  });

  it('places the next noon after both occurrences of the repeated hour', () => {
    const noon = new Date(2026, 9, 30, 12);

    expect(getRepeatedHourLayoutMs({
      from: fallbackDay,
      to: noon,
      startDayHour: 0,
      endDayHour: 24,
      cellDurationMs: CELL,
      nominalCellCount: 96,
      skippedDays: [],
      visibleDayCount: 2,
      skipHiddenDays: false,
    })).toBe(37 * HOUR);
  });

  it('places the second 23:30 in the added hour', () => {
    const secondOccurrence = new Date((findFallbackInstant(fallbackDay) ?? 0) + 30 * 60 * 1000);

    expect(getRepeatedHourLayoutMs({
      from: fallbackDay,
      to: secondOccurrence,
      startDayHour: 0,
      endDayHour: 24,
      cellDurationMs: CELL,
      nominalCellCount: 96,
      skippedDays: [],
      visibleDayCount: 2,
      skipHiddenDays: false,
    })).toBe(24.5 * HOUR);
  });

  it('shifts only instants at or after the fallback', () => {
    const first = new Date(2026, 9, 29, 23);
    const transition = findFallbackInstant(fallbackDay) ?? 0;
    const second = new Date(transition);
    const noon = new Date(2026, 9, 30, 12);

    expect(getCumulativeFallbackShiftMs(fallbackDay, first, 0, 24, [], false)).toBe(0);
    expect(getCumulativeFallbackShiftMs(fallbackDay, second, 0, 24, [], false)).toBe(HOUR);
    expect(getCumulativeFallbackShiftMs(fallbackDay, noon, 0, 24, [], false)).toBe(HOUR);
  });
});
