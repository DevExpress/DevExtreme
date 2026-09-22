// eslint-disable-next-line import/no-extraneous-dependencies -- test-only helper
import { expect } from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createTimeZoneCalculator } from '../r1/timezone_calculator';
import type { TimeZoneCalculator } from '../r1/timezone_calculator/calculator';
import type { DaylightPlan } from '../utils/daylight_grid';
import { buildDaylightPlan } from '../utils/daylight_grid';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const HOUR_MS = 60 * 60 * 1000;
const QUARTER_MS = 15 * 60 * 1000;

/**
 * Keys `cellData` owns on a timeline whose view has a DST plan.
 * Jest's `toEqual` drops a key whose value is `undefined`, and so does
 * `JSON.stringify`, so a QUnit `deepEqual` failure can look like a match.
 * Compare this list instead of the object.
 */
export const CELL_DATA_KEYS = [
  'allDay',
  'endDate',
  'endDateUTC',
  'groupIndex',
  'index',
  'isFirstGroupCell',
  'isLastGroupCell',
  'key',
  'startDate',
  'startDateUTC',
];

/** Real length of a full local day. A fall-back has a negative `deltaMs`. */
export const fullDayLengthMs = (deltaMs = 0): number => 24 * HOUR_MS - deltaMs;

export const assertBrowserZone = (
  schedulerTimeZone: string,
  matchesScheduler: boolean,
): void => {
  const browserTimeZone = process.env.TZ ?? '';
  const sameZone = browserTimeZone === schedulerTimeZone;

  if (sameZone !== matchesScheduler) {
    throw new Error(
      `Browser zone "${browserTimeZone}" ${sameZone ? 'matches' : 'does not match'}`
      + ` Scheduler zone "${schedulerTimeZone}".`,
    );
  }
};

export const expectContinuousInstants = (
  cells: { startUTC: number; endUTC: number }[],
): void => {
  expect(cells.length).toBeGreaterThan(0);
  cells.forEach((cell, index) => {
    expect(cell.endUTC).toBeGreaterThan(cell.startUTC);

    if (index > 0) {
      expect(cell.startUTC).toBe(cells[index - 1].endUTC);
    }
  });
};

/** Full days only: each day's elapsed time is 24h minus the offset jump, and cells meet. */
export const expectFullDayLength = (plan: DaylightPlan): void => {
  const counted = plan.days.reduce((sum, day) => sum + day.cells.length, 0);

  expect(plan.startDayHour).toBe(0);
  expect(plan.endDayHour).toBe(24);
  expect(plan.cellCount).toBe(counted);

  plan.days.forEach((day) => {
    const expected = fullDayLengthMs(day.transition?.deltaMs ?? 0);
    const elapsed = day.cells.reduce((sum, cell) => sum + (cell.endUTC - cell.startUTC), 0);

    expect(day.elapsedMs).toBe(expected);
    expect(elapsed).toBe(expected);
    expectContinuousInstants(day.cells);
  });
};

export const expectExactOwnKeys = (value: object, keys: readonly string[]): void => {
  const actual = Object.keys(value).sort();
  const record = value as Record<string, unknown>;

  expect(actual).toEqual([...keys].sort());
  actual.forEach((key) => {
    expect(record[key]).not.toBeUndefined();
  });
};

export const expectCellDataKeys = (cell: object): void => {
  expectExactOwnKeys(cell, CELL_DATA_KEYS);
};

const zoneCalculator = (
  schedulerTimeZone: string,
  matchesScheduler: boolean,
): TimeZoneCalculator | undefined => (
  matchesScheduler ? undefined : createTimeZoneCalculator(schedulerTimeZone)
);

/**
 * The same Cairo cases with the browser zone equal to the Scheduler zone and with it different.
 * The file's `@timezone` decides which branch this call is; the guard fails if the file disagrees.
 */
export const describeDaylightGridMatrix = (matchesScheduler: boolean): void => {
  const schedulerTimeZone = 'Africa/Cairo';

  describe(`browser zone ${matchesScheduler ? 'matches' : 'differs from'} ${schedulerTimeZone}`, () => {
    beforeEach(() => {
      assertBrowserZone(schedulerTimeZone, matchesScheduler);
    });

    it('rejects the opposite claim about the browser zone', () => {
      expect(() => assertBrowserZone(schedulerTimeZone, !matchesScheduler)).toThrow();
    });

    it('keeps each full day continuous and as long as its offset change', () => {
      const calculator = zoneCalculator(schedulerTimeZone, matchesScheduler);
      const fall = buildDaylightPlan(
        [new Date(2026, 9, 29), new Date(2026, 9, 30)],
        0,
        24,
        QUARTER_MS,
        calculator,
      );
      const spring = buildDaylightPlan(
        [new Date(2026, 3, 24), new Date(2026, 3, 25)],
        0,
        24,
        HOUR_MS,
        calculator,
      );

      if (!fall || !spring) {
        throw new Error('A transition day produced no plan');
      }

      expectFullDayLength(fall);
      expectFullDayLength(spring);
      expect(fall.days.map((day) => day.cells.length)).toEqual([100, 96]);
      expect(fall.cellCount).toBe(196);
      expect(spring.days.map((day) => day.cells.length)).toEqual([23, 24]);
    });

    it('keeps defined instants on cellData and no undefined own value', async () => {
      fx.off = true;
      setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });

      try {
        const { scheduler } = await createScheduler({
          dataSource: [],
          views: [{ type: 'timelineDay' }],
          currentView: 'timelineDay',
          currentDate: new Date(2026, 9, 29),
          cellDuration: 60,
          timeZone: schedulerTimeZone,
        });
        const cell = scheduler.getWorkSpace()
          .viewDataProvider.viewDataMap.dateTableMap[0][0].cellData;

        expectCellDataKeys(cell);
      } finally {
        fx.off = false;
        document.body.innerHTML = '';
      }
    });
  });
};
