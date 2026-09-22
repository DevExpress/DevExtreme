/**
 * @timezone America/Santiago
 */

import { describe, expect, it } from '@jest/globals';

import type { DaylightPlan } from './daylight_grid';
import { buildDayCells, buildDaylightPlan, findDaylightTransition } from './daylight_grid';
import { elapsedMs, expectContinuousInstants, HOUR_MS } from './daylight_grid.test_helpers';

describe('America/Santiago midnight transitions', () => {
  it('gives the fall-back at 5 April 2026 to 4 April', () => {
    const owningDay = new Date(2026, 3, 4);
    const nextDay = new Date(2026, 3, 5);
    const transition = findDaylightTransition(owningDay);
    const { cells } = buildDayCells(owningDay, 0, 24, HOUR_MS);
    const plan = buildDaylightPlan([owningDay, nextDay], 0, 24, HOUR_MS) as DaylightPlan;

    expect(findDaylightTransition(nextDay)).toBeUndefined();
    expect(transition?.instant.toISOString()).toBe('2026-04-05T03:00:00.000Z');
    expect(transition?.deltaMs).toBe(-HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(24 * 60);
    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[23].startUTC).toBe(Date.parse('2026-04-05T02:00:00.000Z'));
    expect(cells[24].startUTC).toBe(Date.parse('2026-04-05T03:00:00.000Z'));
    expect(cells[23].start.getHours()).toBe(23);
    expect(cells[24].start.getHours()).toBe(23);
    expect(plan.days[1].cells[0].start.getHours()).toBe(0);
    expect(plan.days[1].cells[0].startUTC).toBe(Date.parse('2026-04-05T04:00:00.000Z'));
  });

  it('starts 6 September 2026 at 01:00 and leaves 5 September a full day', () => {
    const previousDay = new Date(2026, 8, 5);
    const day = new Date(2026, 8, 6);
    const transition = findDaylightTransition(day);
    const previous = buildDayCells(previousDay, 0, 24, HOUR_MS);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(findDaylightTransition(previousDay)).toBeUndefined();
    expect(transition?.instant.toISOString()).toBe('2026-09-06T04:00:00.000Z');
    expect(transition?.deltaMs).toBe(HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(0);
    expect(previous.cells).toHaveLength(24);
    expect(elapsedMs(previous.cells)).toBe(24 * HOUR_MS);
    expect(cells).toHaveLength(23);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[0].start.getHours()).toBe(1);
    expect(cells[0].startUTC).toBe(Date.parse('2026-09-06T04:00:00.000Z'));
    expect(cells[0].startUTC).toBe(previous.cells[previous.cells.length - 1].endUTC);
  });
});
