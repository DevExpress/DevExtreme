/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import { buildFallbackDayCells, repeatedHourShiftMs } from './repeated_hour';

describe('buildFallbackDayCells', () => {
  it('adds the repeated hour on 29 October 2026 and clips each cell to 15 minutes', () => {
    const cells = buildFallbackDayCells(new Date(2026, 9, 29), 0, 24, 15 * 60 * 1000);

    expect(cells).toHaveLength(100);
    expect(cells?.[95].start.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(cells?.[95].end.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells?.[96].start.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells?.[99].end.toISOString()).toBe('2026-10-29T22:00:00.000Z');
  });

  it('returns undefined on a day without a fall-back', () => {
    expect(buildFallbackDayCells(new Date(2026, 9, 30), 0, 24, 15 * 60 * 1000)).toBeUndefined();
  });

  it('omits the repeated hour that is earlier than startDayHour', () => {
    const cells = buildFallbackDayCells(new Date(2026, 9, 29), 23.5, 24, 15 * 60 * 1000);

    expect(cells?.map((cell) => cell.start.toISOString())).toEqual([
      '2026-10-29T20:30:00.000Z',
      '2026-10-29T20:45:00.000Z',
      '2026-10-29T21:30:00.000Z',
      '2026-10-29T21:45:00.000Z',
    ]);
  });
});

describe('repeatedHourShiftMs', () => {
  const hourMs = 60 * 60 * 1000;
  const cellDurationMs = 15 * 60 * 1000;

  it('keeps the Thursday extra hour on Monday when Friday–Sunday are hidden', () => {
    const shift = repeatedHourShiftMs(
      Date.UTC(2026, 9, 29),
      Date.UTC(2026, 10, 3),
      new Date(2026, 10, 2, 10),
      0,
      24,
      cellDurationMs,
      [0, 5, 6],
    );

    expect(shift).toBe(hourMs);
  });

  it('keeps the extra hour on the next day when the visible range is not a full day', () => {
    const shift = repeatedHourShiftMs(
      Date.UTC(2026, 9, 29, 22),
      Date.UTC(2026, 9, 30, 24),
      new Date(2026, 9, 30, 23),
      22,
      24,
      cellDurationMs,
      [],
    );

    expect(shift).toBe(hourMs);
  });

  it('clips an appointment inside the hidden half onto the next visible cell', () => {
    const minuteMs = 60 * 1000;
    const shift = repeatedHourShiftMs(
      Date.UTC(2026, 9, 29, 23, 30),
      Date.UTC(2026, 9, 30),
      new Date('2026-10-29T21:15:00.000Z'),
      23.5,
      24,
      cellDurationMs,
      [],
    );

    expect(shift).toBe(45 * minuteMs);
  });
});
