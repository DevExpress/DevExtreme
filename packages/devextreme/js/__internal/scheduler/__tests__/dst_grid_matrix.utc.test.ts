/**
 * @timezone Etc/UTC
 */

import { describe, expect, it } from '@jest/globals';

import { createTimeZoneCalculator } from '../r1/timezone_calculator';
import { buildDaylightPlan } from '../utils/daylight_grid';
import {
  assertBrowserZone,
  describeDaylightGridMatrix,
  expectContinuousInstants,
  expectExactOwnKeys,
  expectFullDayLength,
} from './dst_grid_matrix';

const HOUR_MS = 60 * 60 * 1000;

describeDaylightGridMatrix(false);

describe('half-hour transition', () => {
  it('gives Lord Howe a 24.5-hour fall-back day', () => {
    assertBrowserZone('Australia/Lord_Howe', false);

    const plan = buildDaylightPlan(
      [new Date(2026, 3, 5), new Date(2026, 9, 4)],
      0,
      24,
      HOUR_MS,
      createTimeZoneCalculator('Australia/Lord_Howe'),
    );

    if (!plan) {
      throw new Error('A transition day produced no plan');
    }

    expectFullDayLength(plan);
    expect(plan.days.map((day) => day.cells.length)).toEqual([25, 24]);
  });
});

describe('cellData key comparison', () => {
  it('still sees an undefined own key that toEqual and JSON drop', () => {
    const startDate = new Date(0);
    const cell = { startDate, startDateUTC: undefined };

    expect(cell).toEqual({ startDate });
    expect(JSON.stringify(cell)).toBe(JSON.stringify({ startDate }));
    expect(() => expectExactOwnKeys(cell, ['startDate'])).toThrow();
  });

  it('rejects a gap or an empty cell', () => {
    expect(() => expectContinuousInstants([
      { startUTC: 0, endUTC: 10 },
      { startUTC: 11, endUTC: 20 },
    ])).toThrow();
    expect(() => expectContinuousInstants([
      { startUTC: 0, endUTC: 0 },
    ])).toThrow();
  });
});
