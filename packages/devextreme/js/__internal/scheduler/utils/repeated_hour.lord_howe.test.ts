/**
 * @timezone Australia/Lord_Howe
 */

import { describe, expect, it } from '@jest/globals';

import { buildFallbackDayCells } from './repeated_hour';

describe('buildFallbackDayCells', () => {
  it('splits a long cell at a non-hour fallback transition', () => {
    const cells = buildFallbackDayCells(new Date(2026, 3, 5), 1.75, 3, 60 * 60 * 1000);

    expect(cells?.map((cell) => [
      cell.start.toISOString(),
      cell.end.toISOString(),
    ])).toEqual([
      ['2026-04-04T14:45:00.000Z', '2026-04-04T15:00:00.000Z'],
      ['2026-04-04T15:15:00.000Z', '2026-04-04T16:15:00.000Z'],
      ['2026-04-04T16:15:00.000Z', '2026-04-04T16:30:00.000Z'],
    ]);
  });
});
