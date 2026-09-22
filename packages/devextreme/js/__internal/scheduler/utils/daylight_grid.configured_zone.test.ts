/**
 * @timezone Etc/UTC
 */

import { describe, expect, it } from '@jest/globals';

import { createTimeZoneCalculator } from '../r1/timezone_calculator';
import type { DaylightPlan } from './daylight_grid';
import {
  buildDayCells,
  buildDaylightPlan,
  findDaylightTransition,
} from './daylight_grid';
import { elapsedMs, expectContinuousInstants, HOUR_MS } from './daylight_grid.test_helpers';

describe('daylight grid in a configured Scheduler time zone', () => {
  const zoneCalculator = createTimeZoneCalculator('Africa/Cairo');
  const day = new Date(2026, 9, 29);

  it('keeps the client zone and the Scheduler zone in different cache entries', () => {
    const inCairo = findDaylightTransition(day, zoneCalculator);
    const inUtc = findDaylightTransition(day);

    expect(inCairo?.deltaMs).toBe(-HOUR_MS);
    expect(inUtc).toBeUndefined();
    expect(findDaylightTransition(day, zoneCalculator)).toBe(inCairo);
  });

  it('does not invent a Cairo transition from the UTC client zone alone', () => {
    const { cells, transition } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(transition).toBeUndefined();
    expect(cells).toHaveLength(24);
  });

  it('repeats Cairo 23:00 as the same wall clock and two instants', () => {
    const plan = buildDaylightPlan(
      [day, new Date(2026, 9, 30)],
      0,
      24,
      HOUR_MS,
      zoneCalculator,
    ) as DaylightPlan;
    const { cells } = plan.days[0];

    expect(cells).toHaveLength(25);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[23].start.getHours()).toBe(23);
    expect(cells[24].start.getHours()).toBe(23);
    expect(cells[23].start.getTime()).toBe(cells[24].start.getTime());
    expect(cells[23].startUTC).toBe(Date.parse('2026-10-29T20:00:00.000Z'));
    expect(cells[24].startUTC).toBe(Date.parse('2026-10-29T21:00:00.000Z'));
    expect(plan.days[1].cells[0].start.getHours()).toBe(0);
    expect(plan.days[1].cells[0].start.getDate()).toBe(30);
    expect(plan.days[1].cells[0].startUTC).toBe(Date.parse('2026-10-29T22:00:00.000Z'));
  });

  it('returns nothing for an empty or inverted visible range', () => {
    expect(buildDaylightPlan([], 0, 24, HOUR_MS, zoneCalculator)).toBeUndefined();
    expect(buildDaylightPlan([day], 0, 24, 0, zoneCalculator)).toBeUndefined();
    expect(buildDaylightPlan([day], 18, 8, HOUR_MS, zoneCalculator)).toBeUndefined();
    expect(buildDayCells(day, 10, 10, HOUR_MS, zoneCalculator).cells).toEqual([]);
  });
});
