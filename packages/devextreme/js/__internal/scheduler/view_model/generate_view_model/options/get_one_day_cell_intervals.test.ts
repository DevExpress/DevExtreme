import { describe, expect, it } from '@jest/globals';

import { getOneDayCellIntervals } from './get_one_day_cell_intervals';

describe('getOneDayCellIntervals', () => {
  it('should return cells for week intervals [0, 24]', () => {
    expect(getOneDayCellIntervals({
      intervals: [
        { min: Date.UTC(2000, 0, 1), max: Date.UTC(2000, 0, 3) },
        { min: Date.UTC(2000, 0, 3), max: Date.UTC(2000, 0, 5) },
      ],
      startDayHour: 0,
      endDayHour: 24,
      skippedDays: [],
    })).toEqual([
      {
        min: Date.UTC(2000, 0, 1),
        max: Date.UTC(2000, 0, 2),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 0,
      },
      {
        min: Date.UTC(2000, 0, 2),
        max: Date.UTC(2000, 0, 3),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 0,
      },
      {
        min: Date.UTC(2000, 0, 3),
        max: Date.UTC(2000, 0, 4),
        cellIndex: 2,
        columnIndex: 0,
        rowIndex: 1,
      },
      {
        min: Date.UTC(2000, 0, 4),
        max: Date.UTC(2000, 0, 5),
        cellIndex: 3,
        columnIndex: 1,
        rowIndex: 1,
      },
    ]);
  });

  it('should return cells and skip days', () => {
    expect(getOneDayCellIntervals({
      intervals: [
        { min: Date.UTC(2000, 0, 1), max: Date.UTC(2000, 0, 3) },
        { min: Date.UTC(2000, 0, 3), max: Date.UTC(2000, 0, 5) },
      ],
      startDayHour: 0,
      endDayHour: 24,
      skippedDays: [0, 6],
    })).toEqual([
      {
        min: Date.UTC(2000, 0, 3),
        max: Date.UTC(2000, 0, 4),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 1,
      },
      {
        min: Date.UTC(2000, 0, 4),
        max: Date.UTC(2000, 0, 5),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 1,
      },
    ]);
  });

  it('should return cells for week intervals [3, 23]', () => {
    expect(getOneDayCellIntervals({
      intervals: [
        { min: Date.UTC(2000, 0, 1), max: Date.UTC(2000, 0, 3) },
        { min: Date.UTC(2000, 0, 3), max: Date.UTC(2000, 0, 5) },
      ],
      startDayHour: 3,
      endDayHour: 23,
      skippedDays: [],
    })).toEqual([
      {
        min: Date.UTC(2000, 0, 1, 3),
        max: Date.UTC(2000, 0, 1, 23),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 0,
      },
      {
        min: Date.UTC(2000, 0, 2, 3),
        max: Date.UTC(2000, 0, 2, 23),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 0,
      },
      {
        min: Date.UTC(2000, 0, 3, 3),
        max: Date.UTC(2000, 0, 3, 23),
        cellIndex: 2,
        columnIndex: 0,
        rowIndex: 1,
      },
      {
        min: Date.UTC(2000, 0, 4, 3),
        max: Date.UTC(2000, 0, 4, 23),
        cellIndex: 3,
        columnIndex: 1,
        rowIndex: 1,
      },
    ]);
  });
});
