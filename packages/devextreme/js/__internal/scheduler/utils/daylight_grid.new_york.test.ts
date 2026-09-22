/**
 * @timezone America/New_York
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

describe('America/New_York spring-forward, 8 March 2026', () => {
  const day = new Date(2026, 2, 8);

  it('skips 02:00 and keeps the 23 hours that happen', () => {
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(transition?.instant.toISOString()).toBe('2026-03-08T07:00:00.000Z');
    expect(transition?.deltaMs).toBe(HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(120);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-03-08T05:00:00.000Z'));
    expect(cells).toHaveLength(23);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[1].start.getHours()).toBe(1);
    expect(cells[2].start.getHours()).toBe(3);
    expect(cells[2].startUTC).toBe(Date.parse('2026-03-08T07:00:00.000Z'));
  });

  it('cuts the 45-minute cell that meets 02:00 down to 30 minutes', () => {
    const { cells } = buildDayCells(day, 0, 24, 45 * MINUTE_MS);
    const clippedIndex = cells.findIndex(
      (cell) => cell.endUTC === Date.parse('2026-03-08T07:00:00.000Z'),
    );
    const clipped = cells[clippedIndex];

    expect(clippedIndex).toBeGreaterThanOrEqual(0);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(clipped.endUTC - clipped.startUTC).toBe(30 * MINUTE_MS);
    expect(clipped.start.getHours()).toBe(1);
    expect(clipped.start.getMinutes()).toBe(30);
    expect(cells[clippedIndex + 1].start.getHours()).toBe(3);
  });
});

describe('America/New_York fall-back, 1 November 2026', () => {
  const day = new Date(2026, 10, 1);

  it('repeats 01:00 and puts the two passes in different columns', () => {
    const transition = findDaylightTransition(day);
    const plan = buildDaylightPlan([day], 0, 24, HOUR_MS) as DaylightPlan;
    const { cells } = plan.days[0];
    const wallMs = Date.UTC(2026, 10, 1, 1);

    expect(transition?.instant.toISOString()).toBe('2026-11-01T06:00:00.000Z');
    expect(transition?.deltaMs).toBe(-HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(120);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-11-01T04:00:00.000Z'));
    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[1].startUTC).toBe(Date.parse('2026-11-01T05:00:00.000Z'));
    expect(cells[2].startUTC).toBe(Date.parse('2026-11-01T06:00:00.000Z'));
    expect(cells[1].start.getHours()).toBe(1);
    expect(cells[2].start.getHours()).toBe(1);
    expect(cells[3].start.getHours()).toBe(2);
    expect(getColumnByWallMs(plan, wallMs, cells[1].startUTC)).toBe(1);
    expect(getColumnByWallMs(plan, wallMs, cells[2].startUTC)).toBe(2);
  });

  it('cuts a 45-minute cell at 02:00 and then plays 01:00 again', () => {
    const { cells } = buildDayCells(day, 0, 24, 45 * MINUTE_MS);
    const jump = Date.parse('2026-11-01T06:00:00.000Z');
    const clipped = cells[cells.findIndex((cell) => cell.endUTC === jump)];
    const secondPass = cells[cells.findIndex((cell) => cell.startUTC === jump)];

    expect(cells).toHaveLength(34);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(clipped.endUTC - clipped.startUTC).toBe(30 * MINUTE_MS);
    expect(secondPass.start.getHours()).toBe(1);
    expect(secondPass.start.getMinutes()).toBe(0);
  });
});
