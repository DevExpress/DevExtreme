/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import type { DaylightPlan } from './daylight_grid';
import {
  buildDayCells,
  buildDaylightPlan,
  buildDaylightPlanForRange,
  findDaylightTransition,
  getColumnByWallMs,
  getPlanCell,
  getStretchShiftMs,
  isRepeatedCell,
  toWallMs,
  visibleDayOrigins,
} from './daylight_grid';
import {
  elapsedMs, expectContinuousInstants, HOUR_MS, MINUTE_MS,
} from './daylight_grid.test_helpers';

const QUARTER_MS = 15 * MINUTE_MS;

const starts = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
): string[] => buildDayCells(day, startDayHour, endDayHour, cellDurationMs)
  .cells.map((cell) => cell.start.toISOString());

describe('Africa/Cairo fall-back, 29 October 2026', () => {
  const day = new Date(2026, 9, 29);

  it('owns the jump at the following midnight and repeats 23:00', () => {
    const transition = findDaylightTransition(day);

    expect(transition?.instant.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(transition?.deltaMs).toBe(-HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(24 * 60);
    expect(transition?.anchorUTC).toBe(Date.parse('2026-10-28T21:00:00.000Z'));
    expect(findDaylightTransition(new Date(2026, 9, 30))).toBeUndefined();
  });

  it('emits 25 hours of 15-minute cells and keeps the two 23:00 passes an hour apart', () => {
    const { cells } = buildDayCells(day, 0, 24, QUARTER_MS);

    expect(cells).toHaveLength(100);
    expect(elapsedMs(cells)).toBe(25 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[92].start.toISOString()).toBe('2026-10-29T20:00:00.000Z');
    expect(cells[92].startUTC).toBe(Date.parse('2026-10-29T20:00:00.000Z'));
    expect(cells[96].start.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells[96].startUTC - cells[92].startUTC).toBe(HOUR_MS);
    expect(cells[99].endUTC).toBe(Date.parse('2026-10-29T22:00:00.000Z'));
  });

  it('gives the next day its own midnight', () => {
    const plan = buildDaylightPlan([day, new Date(2026, 9, 30)], 0, 24, QUARTER_MS) as DaylightPlan;

    expect(plan.days.map((item) => item.cells.length)).toEqual([100, 96]);
    expect(plan.cellCount).toBe(196);
    expect(plan.days[1].cells[0].startUTC).toBe(Date.parse('2026-10-29T22:00:00.000Z'));
    expect(plan.days[1].cells[0].start.toISOString()).toBe('2026-10-29T22:00:00.000Z');
    expect(getPlanCell(plan, 100)?.startUTC).toBe(plan.days[1].cells[0].startUTC);
    expect(getPlanCell(plan, -1)).toBeUndefined();
    expect(getPlanCell(plan, 196)).toBeUndefined();
  });

  it('puts the two 23:45 passes in different columns', () => {
    const plan = buildDaylightPlan([day], 0, 24, QUARTER_MS) as DaylightPlan;
    const wallMs = Date.UTC(2026, 9, 29, 23, 45);
    const first = Date.parse('2026-10-29T20:45:00.000Z');
    const second = Date.parse('2026-10-29T21:45:00.000Z');

    expect(getColumnByWallMs(plan, wallMs, first)).toBe(95);
    expect(getColumnByWallMs(plan, wallMs, second)).toBe(99);
    expect(isRepeatedCell(plan, first)).toBe(true);
    expect(isRepeatedCell(plan, second)).toBe(true);
    expect(isRepeatedCell(plan, Date.parse('2026-10-29T19:00:00.000Z'))).toBe(false);
    expect(isRepeatedCell(plan, Date.parse('2026-10-29T22:00:00.000Z'))).toBe(false);
  });

  it('omits a repeated hour that the visible range does not include', () => {
    const { cells } = buildDayCells(day, 0, 23, QUARTER_MS);

    expect(cells).toHaveLength(92);
    expect(cells[91].end.toISOString()).toBe('2026-10-29T20:00:00.000Z');
  });

  it('keeps both passes when the visible range is only the repeated hour', () => {
    expect(starts(day, 23, 24, QUARTER_MS)).toEqual([
      '2026-10-29T20:00:00.000Z',
      '2026-10-29T20:15:00.000Z',
      '2026-10-29T20:30:00.000Z',
      '2026-10-29T20:45:00.000Z',
      '2026-10-29T21:00:00.000Z',
      '2026-10-29T21:15:00.000Z',
      '2026-10-29T21:30:00.000Z',
      '2026-10-29T21:45:00.000Z',
    ]);
  });
});

describe('Africa/Cairo spring-forward, 24 April 2026', () => {
  const day = new Date(2026, 3, 24);

  it('skips the hour that never happens and starts the day at 01:00', () => {
    const transition = findDaylightTransition(day);
    const { cells } = buildDayCells(day, 0, 24, HOUR_MS);

    expect(transition?.instant.toISOString()).toBe('2026-04-23T22:00:00.000Z');
    expect(transition?.deltaMs).toBe(HOUR_MS);
    expect(transition?.wallBeforeMinutes).toBe(0);
    expect(cells).toHaveLength(23);
    expect(elapsedMs(cells)).toBe(23 * HOUR_MS);
    expectContinuousInstants(cells);
    expect(cells[0].start.toISOString()).toBe('2026-04-23T22:00:00.000Z');
    expect(cells[0].start.getHours()).toBe(1);
    expect(cells.at(-1)?.end.toISOString()).toBe('2026-04-24T21:00:00.000Z');
    expect(findDaylightTransition(new Date(2026, 3, 23))).toBeUndefined();
  });

  it('keeps a day whose visible hours start after the skipped one intact', () => {
    const { cells } = buildDayCells(day, 8, 20, HOUR_MS);

    expect(cells).toHaveLength(12);
    expect(cells[0].start.toISOString()).toBe('2026-04-24T05:00:00.000Z');
    expect(elapsedMs(cells)).toBe(12 * HOUR_MS);
  });

  it('gives the following day a full midnight of its own', () => {
    const plan = buildDaylightPlan(
      [day, new Date(2026, 3, 25)],
      0,
      24,
      HOUR_MS,
    ) as DaylightPlan;

    expect(plan.days.map((item) => item.cells.length)).toEqual([23, 24]);
    expect(plan.days[1].cells[0].startUTC).toBe(Date.parse('2026-04-24T21:00:00.000Z'));
    expect(plan.days[1].cells[0].start.getHours()).toBe(0);
    expect(isRepeatedCell(plan, plan.days[0].cells[0].startUTC)).toBe(false);
  });
});

describe('getStretchShiftMs', () => {
  const planOf = (
    origins: Date[],
    startDayHour = 0,
    endDayHour = 24,
  ): ReturnType<typeof buildDaylightPlan> => buildDaylightPlan(
    origins,
    startDayHour,
    endDayHour,
    QUARTER_MS,
  );

  it('carries the Thursday extra hour over to Monday when Friday to Sunday are hidden', () => {
    const skipped = [0, 5, 6];
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 3, skipped, 0));

    expect(getStretchShiftMs(plan, toWallMs(new Date(2026, 10, 2, 10)))).toBe(HOUR_MS);
  });

  it('adds nothing before the repeated hour and an hour after it', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 2, [], 0));

    expect(getStretchShiftMs(plan, toWallMs(new Date(2026, 9, 29, 22)))).toBe(0);
    expect(getStretchShiftMs(plan, toWallMs(new Date(2026, 9, 30)))).toBe(HOUR_MS);
  });

  it('takes an hour off the days that follow a spring-forward', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 3, 24), 2, [], 0));

    expect(getStretchShiftMs(plan, toWallMs(new Date(2026, 3, 25, 10)))).toBe(-HOUR_MS);
  });

  it('keeps a wall clock that the spring-forward skips at the jump', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 3, 24), 1, [], 0));

    expect(getStretchShiftMs(plan, Date.UTC(2026, 3, 24, 0, 30))).toBe(-30 * MINUTE_MS);
  });

  it('separates the two passes over a repeated hour by their source instant', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0));
    const wallMs = Date.UTC(2026, 9, 29, 23);
    const first = Date.parse('2026-10-29T20:00:00.000Z');
    const second = Date.parse('2026-10-29T21:00:00.000Z');

    expect(getStretchShiftMs(plan, wallMs, first)).toBe(0);
    expect(getStretchShiftMs(plan, wallMs, second)).toBe(HOUR_MS);
  });

  it('leaves a recurrent source that names the same wall clock on the first pass', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0));
    const wallMs = Date.UTC(2026, 9, 29, 23);
    const otherDay = Date.parse('2026-10-22T21:00:00.000Z');

    expect(getStretchShiftMs(plan, wallMs, otherDay)).toBe(0);
  });

  it('reports the whole day once the wall clock runs past endDayHour', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0));

    expect(getStretchShiftMs(plan, Date.UTC(2026, 9, 30))).toBe(HOUR_MS);
  });

  it('reports nothing before the plan starts', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0));

    expect(getStretchShiftMs(plan, Date.UTC(2026, 9, 28, 10))).toBe(0);
    expect(getStretchShiftMs(undefined, Date.UTC(2026, 9, 29, 23))).toBe(0);
  });
});

describe('buildDaylightPlanForRange', () => {
  it('returns nothing for a range that no transition falls in', () => {
    expect(buildDaylightPlanForRange(
      Date.UTC(2026, 4, 4),
      Date.UTC(2026, 4, 6),
      0,
      24,
      QUARTER_MS,
      [],
    )).toBeUndefined();
    expect(buildDaylightPlan([], 0, 24, QUARTER_MS)).toBeUndefined();
  });

  it('counts the cells of every day it covers', () => {
    const plan = buildDaylightPlanForRange(
      Date.UTC(2026, 9, 29),
      Date.UTC(2026, 9, 31),
      0,
      24,
      QUARTER_MS,
      [],
    );

    expect(plan?.days.map((day) => day.cells.length)).toEqual([100, 96]);
    expect(plan?.cellCount).toBe(196);
  });
});

describe('getColumnByWallMs', () => {
  it('stops on a hidden Friday instead of walking into Monday', () => {
    const skipped = [0, 5, 6];
    const origins = visibleDayOrigins(new Date(2026, 9, 29), 2, skipped, 0);
    const plan = buildDaylightPlan(origins, 0, 24, HOUR_MS) as DaylightPlan;

    expect(getColumnByWallMs(plan, toWallMs(new Date(2026, 9, 30, 10)))).toBe(25);
  });

  it('splits a column by how far into its cell the wall clock sits', () => {
    const origins = visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0);
    const plan = buildDaylightPlan(origins, 0, 24, QUARTER_MS) as DaylightPlan;

    expect(getColumnByWallMs(plan, Date.UTC(2026, 9, 29, 23, 22, 30))).toBe(93.5);
  });
});
