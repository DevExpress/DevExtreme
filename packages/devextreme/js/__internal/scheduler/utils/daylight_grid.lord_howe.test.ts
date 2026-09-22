/**
 * @timezone Australia/Lord_Howe
 */

import { describe, expect, it } from '@jest/globals';

import type { DaylightPlan } from './daylight_grid';
import {
  buildDayCells,
  buildDaylightPlan,
  findDaylightTransition,
  getColumnByWallMs,
} from './daylight_grid';
import {
  elapsedMs, expectContinuousInstants, HOUR_MS, MINUTE_MS,
} from './daylight_grid.test_helpers';

describe('Australia/Lord_Howe fall-back, 5 April 2026', () => {
  const day = new Date(2026, 3, 5);

  it('jumps back half an hour at 02:00', () => {
    const transition = findDaylightTransition(day);

    expect(transition?.instant.toISOString()).toBe('2026-04-04T15:00:00.000Z');
    expect(transition?.deltaMs).toBe(-30 * MINUTE_MS);
    expect(transition?.wallBeforeMinutes).toBe(120);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-04-04T13:00:00.000Z'));
  });

  it('clips the last hour cell to the extra half hour', () => {
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);
    const last = cells[cells.length - 1];

    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(24.5 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(last.endUTC - last.startUTC).toBe(HOUR_MS / 2);
    expect(last.end.toISOString()).toBe('2026-04-05T13:30:00.000Z');
  });

  it('gives each half hour its own cell and separates the two 01:30 passes', () => {
    const plan = buildDaylightPlan([day], 0, 24, HOUR_MS / 2) as DaylightPlan;
    const { cells } = plan.days[0];
    const wallMs = Date.UTC(2026, 3, 5, 1, 30);

    expect(cells).toHaveLength(49);
    expect(new Set(cells.map((cell) => cell.endUTC - cell.startUTC))).toEqual(
      new Set([HOUR_MS / 2]),
    );
    expect(cells[3].startUTC).toBe(Date.parse('2026-04-04T14:30:00.000Z'));
    expect(cells[4].startUTC).toBe(Date.parse('2026-04-04T15:00:00.000Z'));
    expect(cells[3].start.getHours()).toBe(1);
    expect(cells[3].start.getMinutes()).toBe(30);
    expect(cells[4].start.getHours()).toBe(1);
    expect(cells[4].start.getMinutes()).toBe(30);
    expect(getColumnByWallMs(plan, wallMs, cells[3].startUTC)).toBe(3);
    expect(getColumnByWallMs(plan, wallMs, cells[4].startUTC)).toBe(4);
  });
});

describe('Australia/Lord_Howe spring-forward, 4 October 2026', () => {
  const day = new Date(2026, 9, 4);

  it('skips 02:00 to 02:30 and shortens the day by half an hour', () => {
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS / 2);

    expect(transition?.instant.toISOString()).toBe('2026-10-03T15:30:00.000Z');
    expect(transition?.deltaMs).toBe(30 * MINUTE_MS);
    expect(transition?.wallBeforeMinutes).toBe(120);
    expect(cells).toHaveLength(47);
    expect(elapsedMs(cells)).toBe(23.5 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[3].start.getHours()).toBe(1);
    expect(cells[3].start.getMinutes()).toBe(30);
    expect(cells[4].start.getHours()).toBe(2);
    expect(cells[4].start.getMinutes()).toBe(30);
    expect(cells[4].startUTC).toBe(Date.parse('2026-10-03T15:30:00.000Z'));
  });

  it('keeps hour cells on elapsed time, so the half hour left over closes the day', () => {
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);
    const last = cells[cells.length - 1];

    expect(cells).toHaveLength(24);
    expect(elapsedMs(cells)).toBe(23.5 * HOUR_MS);
    expect(last.endUTC - last.startUTC).toBe(30 * MINUTE_MS);
    expect(cells[2].start.getHours()).toBe(2);
    expect(cells[2].start.getMinutes()).toBe(30);
  });
});
