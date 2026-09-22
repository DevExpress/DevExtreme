/**
 * @timezone Asia/Beirut
 */

import { describe, expect, it } from '@jest/globals';

import type { DaylightPlan } from './daylight_grid';
import { buildDayCells, buildDaylightPlan, findDaylightTransition } from './daylight_grid';
import { elapsedMs, expectContinuousInstants, HOUR_MS } from './daylight_grid.test_helpers';

describe('Asia/Beirut midnight transitions', () => {
  it('gives the fall-back at 25 October 2026 to the previous day', () => {
    const owningDay = new Date(2026, 9, 24);
    const nominalDay = new Date(2026, 9, 25);
    const transition = findDaylightTransition(owningDay);
    const { cells } = buildDayCells(owningDay, 0, 24, HOUR_MS);
    const plan = buildDaylightPlan([owningDay, nominalDay], 0, 24, HOUR_MS) as DaylightPlan;

    expect(findDaylightTransition(nominalDay)).toBeUndefined();
    expect(transition?.instant.toISOString()).toBe('2026-10-24T21:00:00.000Z');
    expect(transition?.deltaMs).toBe(-HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(24 * 60);
    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[23].start.getHours()).toBe(23);
    expect(cells[24].start.getHours()).toBe(23);
    expect(cells[24].startUTC - cells[23].startUTC).toBe(HOUR_MS);
    expect(plan.days[1].cells).toHaveLength(24);
    expect(plan.days[1].cells[0].start.getHours()).toBe(0);
    expect(plan.days[1].cells[0].startUTC).toBe(Date.parse('2026-10-24T22:00:00.000Z'));
    expect(plan.days[1].cells[0].startUTC).toBe(cells[cells.length - 1].endUTC);
  });

  it('starts the spring-forward day of 29 March 2026 at 01:00', () => {
    const day = new Date(2026, 2, 29);
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(findDaylightTransition(new Date(2026, 2, 28))).toBeUndefined();
    expect(transition?.instant.toISOString()).toBe('2026-03-28T22:00:00.000Z');
    expect(transition?.deltaMs).toBe(HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(0);
    expect(cells).toHaveLength(23);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[0].start.getHours()).toBe(1);
    expect(cells[0].startUTC).toBe(Date.parse('2026-03-28T22:00:00.000Z'));
  });
});
