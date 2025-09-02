import { describe, expect, it } from '@jest/globals';

import { getOneDayCellIntervals } from './get_one_day_cell_intervals';

describe('getOneDayCellIntervals', () => {
  it('should return cells for week intervals [0, 24]', () => {
    expect(getOneDayCellIntervals({
      intervals: [
        { min: new Date(2000, 0, 1).getTime(), max: new Date(2000, 0, 3).getTime() },
        { min: new Date(2000, 0, 3).getTime(), max: new Date(2000, 0, 5).getTime() },
      ],
      startDayHour: 0,
      endDayHour: 24,
    })).toEqual([
      {
        min: new Date(2000, 0, 1).getTime(),
        max: new Date(2000, 0, 2).getTime(),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 0,
      },
      {
        min: new Date(2000, 0, 2).getTime(),
        max: new Date(2000, 0, 3).getTime(),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 0,
      },
      {
        min: new Date(2000, 0, 3).getTime(),
        max: new Date(2000, 0, 4).getTime(),
        cellIndex: 2,
        columnIndex: 0,
        rowIndex: 1,
      },
      {
        min: new Date(2000, 0, 4).getTime(),
        max: new Date(2000, 0, 5).getTime(),
        cellIndex: 3,
        columnIndex: 1,
        rowIndex: 1,
      },
    ]);
  });

  it('should return cells for week intervals [3, 23]', () => {
    expect(getOneDayCellIntervals({
      intervals: [
        { min: new Date(2000, 0, 1).getTime(), max: new Date(2000, 0, 3).getTime() },
        { min: new Date(2000, 0, 3).getTime(), max: new Date(2000, 0, 5).getTime() },
      ],
      startDayHour: 3,
      endDayHour: 23,
    })).toEqual([
      {
        min: new Date(2000, 0, 1, 3).getTime(),
        max: new Date(2000, 0, 1, 23).getTime(),
        cellIndex: 0,
        columnIndex: 0,
        rowIndex: 0,
      },
      {
        min: new Date(2000, 0, 2, 3).getTime(),
        max: new Date(2000, 0, 2, 23).getTime(),
        cellIndex: 1,
        columnIndex: 1,
        rowIndex: 0,
      },
      {
        min: new Date(2000, 0, 3, 3).getTime(),
        max: new Date(2000, 0, 3, 23).getTime(),
        cellIndex: 2,
        columnIndex: 0,
        rowIndex: 1,
      },
      {
        min: new Date(2000, 0, 4, 3).getTime(),
        max: new Date(2000, 0, 4, 23).getTime(),
        cellIndex: 3,
        columnIndex: 1,
        rowIndex: 1,
      },
    ]);
  });
});
