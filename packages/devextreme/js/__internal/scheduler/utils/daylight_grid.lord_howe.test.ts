/**
 * @timezone Australia/Lord_Howe
 */

import { describe, expect, it } from '@jest/globals';

import { buildDayCells } from './daylight_grid';

const HOUR_MS = 60 * 60 * 1000;

describe('buildDayCells with a half-hour transition', () => {
  it('clips the cell that the fall-back cuts short', () => {
    const { cells } = buildDayCells(new Date(2026, 3, 5), 0, 24, HOUR_MS);

    const last = cells[cells.length - 1];

    expect(cells).toHaveLength(25);
    expect(last.endUTC - last.startUTC).toBe(HOUR_MS / 2);
    expect(last.end.toISOString()).toBe('2026-04-05T13:30:00.000Z');
  });

  it('lines every cell up with the half hour when they divide it', () => {
    const { cells } = buildDayCells(new Date(2026, 3, 5), 0, 24, HOUR_MS / 2);

    expect(cells).toHaveLength(49);
    expect(new Set(cells.map((cell) => cell.endUTC - cell.startUTC))).toEqual(
      new Set([HOUR_MS / 2]),
    );
  });
});
