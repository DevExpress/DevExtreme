import { describe, expect, it } from '@jest/globals';

import { createTimeZoneCalculator } from '../../../../r1/timezone_calculator';
import { buildDaylightPlan } from '../../../../utils/daylight_grid';
import { getDateInformation, isCoveredByDaylightPlan, resolveFirstPass } from './get_date_information';

const HOUR_MS = 3600_000;

describe('getDateInformation', () => {
  it('reports a constant offset when the day has no transition', () => {
    const info = getDateInformation(Date.UTC(2025, 0, 1, 12), 'America/Santiago');

    expect(info.deltaMs).toBe(0);
    expect(info.offsetMs).toBe(-3 * HOUR_MS);
    expect(info.isUnreachableTime).toBe(false);
    expect(info.isDoubleTimeStart).toBe(false);
  });

  it('marks the Santiago spring jump and the hour it skips', () => {
    const jump = getDateInformation(Date.UTC(2025, 8, 7, 4), 'America/Santiago');
    const skipped = getDateInformation(Date.UTC(2025, 8, 7, 4, 30), 'America/Santiago');
    const after = getDateInformation(Date.UTC(2025, 8, 7, 5, 30), 'America/Santiago');

    expect(jump.isDoubleTimeStart).toBe(true);
    expect(jump.deltaMs).toBe(HOUR_MS);
    expect(skipped.isUnreachableTime).toBe(true);
    expect(skipped.offsetMs).toBe(-4 * HOUR_MS);
    expect(after.offsetMs).toBe(-3 * HOUR_MS);
    expect(after.isUnreachableTime).toBe(false);
  });

  it('keeps the pre-transition offset through the first pass of a Pacific fall-back', () => {
    const firstPass = getDateInformation(Date.UTC(2025, 10, 2, 8, 30), 'Canada/Pacific');
    const jump = getDateInformation(Date.UTC(2025, 10, 2, 9), 'Canada/Pacific');

    expect(firstPass.deltaMs).toBe(-HOUR_MS);
    expect(firstPass.offsetMs).toBe(-7 * HOUR_MS);
    expect(jump.isDoubleTimeStart).toBe(true);
    expect(jump.offsetMs).toBe(-8 * HOUR_MS);
  });
});

describe('resolveFirstPass', () => {
  it('moves a second pass of Cairo 23:00 back to the first pass', () => {
    const second = Date.parse('2026-10-29T21:30:00.000Z');
    const resolved = resolveFirstPass(second, 'Africa/Cairo');

    expect(resolved.instant).toBe(Date.parse('2026-10-29T20:30:00.000Z'));
    expect(resolved.info.offsetMs).toBe(3 * HOUR_MS);
  });

  it('leaves an explicit first pass where it is', () => {
    const first = Date.parse('2026-10-29T20:30:00.000Z');
    const resolved = resolveFirstPass(first, 'Africa/Cairo');

    expect(resolved.instant).toBe(first);
    expect(resolved.info.offsetMs).toBe(3 * HOUR_MS);
  });
});

describe('isCoveredByDaylightPlan', () => {
  it('covers only the transition day the plan lays out', () => {
    const plan = buildDaylightPlan(
      [new Date(2026, 9, 29), new Date(2026, 9, 30)],
      0,
      24,
      HOUR_MS,
      createTimeZoneCalculator('Africa/Cairo'),
    );

    expect(isCoveredByDaylightPlan(plan, Date.parse('2026-10-29T20:30:00.000Z'))).toBe(true);
    expect(isCoveredByDaylightPlan(plan, Date.parse('2026-10-30T10:00:00.000Z'))).toBe(false);
    expect(isCoveredByDaylightPlan(undefined, Date.parse('2026-10-29T20:30:00.000Z'))).toBe(false);
  });
});
