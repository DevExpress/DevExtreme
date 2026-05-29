/**
 * @timezone Africa/Cairo
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { getWeekIntervals } from './get_week_intervals';

describe('getWeekIntervals', () => {
  it('T1327394: should not add a timeline cell before the first available local time on midnight DST', () => {
    const intervals = getWeekIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2026, 3, 24, 1),
      max: Date.UTC(2026, 3, 25),
      skippedDays: [],
    }, 60, 0, true);

    expect(intervals.cells[0]).toEqual({
      min: Date.UTC(2026, 3, 24, 1),
      max: Date.UTC(2026, 3, 24, 2),
      rowIndex: 0,
      columnIndex: 0,
      cellIndex: 0,
    });
  });

  it('T1327394: should not add a timeline week cell before the first available local time on midnight DST', () => {
    const intervals = getWeekIntervals({
      startDayHour: 0,
      endDayHour: 24,
      min: Date.UTC(2026, 3, 20),
      max: Date.UTC(2026, 3, 27),
      skippedDays: [],
    }, 60, 0, true);

    expect(intervals.cells.find((cell) => cell.min === Date.UTC(2026, 3, 24))).toBeUndefined();
    expect(intervals.cells.find((cell) => cell.min === Date.UTC(2026, 3, 24, 1))).toEqual({
      min: Date.UTC(2026, 3, 24, 1),
      max: Date.UTC(2026, 3, 24, 2),
      rowIndex: 0,
      columnIndex: 96,
      cellIndex: 96,
    });
  });
});
