import { describe, expect, it } from '@jest/globals';

import { getMinutesCellIntervals } from './get_minutes_cell_intervals';

describe('getMinutesCellIntervals', () => {
  it('should return cells in range of [startDayHour, endDayHour] for timeline interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: Date.UTC(2021, 8, 26, 4),
        max: Date.UTC(2021, 8, 28, 16),
      }],
      startDayHour: 4,
      endDayHour: 16,
      durationMinutes: 6 * 60,
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2021, 8, 26, 4),
      max: Date.UTC(2021, 8, 26, 10),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 26, 10),
      max: Date.UTC(2021, 8, 26, 16),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 4),
      max: Date.UTC(2021, 8, 27, 10),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 10),
      max: Date.UTC(2021, 8, 27, 16),
      cellIndex: 3,
      columnIndex: 3,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 28, 4),
      max: Date.UTC(2021, 8, 28, 10),
      cellIndex: 4,
      columnIndex: 4,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 28, 10),
      max: Date.UTC(2021, 8, 28, 16),
      cellIndex: 5,
      columnIndex: 5,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [0, 24] for timeline interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: Date.UTC(2021, 8, 26),
        max: Date.UTC(2021, 8, 28),
      }],
      startDayHour: 0,
      endDayHour: 24,
      durationMinutes: 12 * 60,
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2021, 8, 26, 0),
      max: Date.UTC(2021, 8, 26, 12),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 26, 12),
      max: Date.UTC(2021, 8, 26, 24),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 0),
      max: Date.UTC(2021, 8, 27, 12),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 12),
      max: Date.UTC(2021, 8, 27, 24),
      cellIndex: 3,
      columnIndex: 3,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [startDayHour, endDayHour] for one day interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: Date.UTC(2021, 8, 26, 4),
        max: Date.UTC(2021, 8, 26, 16),
      }],
      startDayHour: 4,
      endDayHour: 4 + 12,
      durationMinutes: 4 * 60,
      skippedDays: [],
    })).toEqual([{
      min: Date.UTC(2021, 8, 26, 4),
      max: Date.UTC(2021, 8, 26, 8),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 26, 8),
      max: Date.UTC(2021, 8, 26, 12),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 26, 12),
      max: Date.UTC(2021, 8, 26, 16),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [0, 24] and skip days', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: Date.UTC(2021, 8, 26),
        max: Date.UTC(2021, 8, 28),
      }],
      startDayHour: 0,
      endDayHour: 24,
      durationMinutes: 8 * 60,
      skippedDays: [0, 6],
    })).toEqual([{
      min: Date.UTC(2021, 8, 27, 0),
      max: Date.UTC(2021, 8, 27, 8),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 8),
      max: Date.UTC(2021, 8, 27, 16),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: Date.UTC(2021, 8, 27, 16),
      max: Date.UTC(2021, 8, 27, 24),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }]);
  });
});
