/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import { buildFallbackDayCells } from './repeated_hour';

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
});
