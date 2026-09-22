/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import type { DaylightPlan } from './daylight_grid';
import {
  buildDayCells,
  buildDaylightPlan,
  buildDaylightPlanForRange,
  getColumnByWallMs,
  getStretchShiftMs,
  toWallMs,
  visibleDayOrigins,
} from './daylight_grid';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const QUARTER_MS = 15 * MINUTE_MS;

const starts = (day: Date, startDayHour: number, endDayHour: number, cellDurationMs: number):
string[] => buildDayCells(day, startDayHour, endDayHour, cellDurationMs)
  .cells.map((cell) => cell.start.toISOString());

describe('buildDayCells on a fall-back day', () => {
  it('repeats the 23:00 hour of 29 October 2026 as cells of its own', () => {
    const { cells } = buildDayCells(new Date(2026, 9, 29), 0, 24, QUARTER_MS);

    expect(cells).toHaveLength(100);
    expect(cells[95].start.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(cells[95].end.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells[96].start.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells[99].end.toISOString()).toBe('2026-10-29T22:00:00.000Z');
    expect(cells[99].endUTC - cells[96].startUTC).toBe(HOUR_MS);
  });

  it('gives a plain day the cells its wall clock asks for', () => {
    const { cells, transition } = buildDayCells(new Date(2026, 9, 30), 0, 24, QUARTER_MS);

    expect(transition).toBeUndefined();
    expect(cells).toHaveLength(96);
  });

  it('omits a repeated hour that ends before startDayHour', () => {
    expect(starts(new Date(2026, 9, 29), 23, 24, QUARTER_MS)).toEqual([
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

  it('drops the repeated hour entirely when endDayHour ends before it', () => {
    const { cells } = buildDayCells(new Date(2026, 9, 29), 0, 23, QUARTER_MS);

    expect(cells).toHaveLength(92);
    expect(cells[91].end.toISOString()).toBe('2026-10-29T20:00:00.000Z');
  });
});

describe('buildDayCells on a spring-forward day', () => {
  it('leaves out the hour 24 April 2026 never has', () => {
    const { cells } = buildDayCells(new Date(2026, 3, 24), 0, 24, HOUR_MS);

    expect(cells).toHaveLength(23);
    expect(cells[0].start.toISOString()).toBe('2026-04-23T22:00:00.000Z');
    expect(cells[0].startUTC).toBe(Date.parse('2026-04-23T22:00:00.000Z'));
    expect(cells.at(-1)?.end.toISOString()).toBe('2026-04-24T21:00:00.000Z');
  });

  it('keeps a day whose visible hours start after the skipped one intact', () => {
    const { cells } = buildDayCells(new Date(2026, 3, 24), 8, 20, HOUR_MS);

    expect(cells).toHaveLength(12);
    expect(cells[0].start.toISOString()).toBe('2026-04-24T05:00:00.000Z');
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

    expect(getStretchShiftMs(plan, toWallMs(new Date(2026, 3, 24, 0, 30)))).toBe(-30 * MINUTE_MS);
  });

  it('separates the two passes over a repeated hour by their source instant', () => {
    const plan = planOf(visibleDayOrigins(new Date(2026, 9, 29), 1, [], 0));
    const wallMs = Date.UTC(2026, 9, 29, 23);
    const first = Date.parse('2026-10-29T20:00:00.000Z');
    const second = Date.parse('2026-10-29T21:00:00.000Z');

    expect(getStretchShiftMs(plan, wallMs, first)).toBe(0);
    expect(getStretchShiftMs(plan, wallMs, second)).toBe(HOUR_MS);
  });

  it('ignores a source instant that describes another wall clock', () => {
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
