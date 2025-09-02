import { describe, expect, it } from '@jest/globals';

import { getMinutesCellIntervals } from './get_minutes_cell_intervals';

describe('getMinutesCellIntervals', () => {
  it('should return cells in range of [startDayHour, endDayHour] for timeline interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: new Date(2021, 8, 26, 4).getTime(),
        max: new Date(2021, 8, 28, 16).getTime(),
      }],
      startDayHour: 4,
      endDayHour: 16,
      durationMinutes: 6 * 60,
    })).toEqual([{
      min: new Date(2021, 8, 26, 4).getTime(),
      max: new Date(2021, 8, 26, 10).getTime(),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 10).getTime(),
      max: new Date(2021, 8, 26, 16).getTime(),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 27, 4).getTime(),
      max: new Date(2021, 8, 27, 10).getTime(),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 27, 10).getTime(),
      max: new Date(2021, 8, 27, 16).getTime(),
      cellIndex: 3,
      columnIndex: 3,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 28, 4).getTime(),
      max: new Date(2021, 8, 28, 10).getTime(),
      cellIndex: 4,
      columnIndex: 4,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 28, 10).getTime(),
      max: new Date(2021, 8, 28, 16).getTime(),
      cellIndex: 5,
      columnIndex: 5,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [0, 24] for timeline interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: new Date(2021, 8, 26).getTime(),
        max: new Date(2021, 8, 28).getTime(),
      }],
      startDayHour: 0,
      endDayHour: 24,
      durationMinutes: 12 * 60,
    })).toEqual([{
      min: new Date(2021, 8, 26, 0).getTime(),
      max: new Date(2021, 8, 26, 12).getTime(),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 12).getTime(),
      max: new Date(2021, 8, 26, 24).getTime(),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 27, 0).getTime(),
      max: new Date(2021, 8, 27, 12).getTime(),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 27, 12).getTime(),
      max: new Date(2021, 8, 27, 24).getTime(),
      cellIndex: 3,
      columnIndex: 3,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [startDayHour, endDayHour] for one day interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: new Date(2021, 8, 26, 4).getTime(),
        max: new Date(2021, 8, 26, 16).getTime(),
      }],
      startDayHour: 4,
      endDayHour: 4 + 12,
      durationMinutes: 4 * 60,
    })).toEqual([{
      min: new Date(2021, 8, 26, 4).getTime(),
      max: new Date(2021, 8, 26, 8).getTime(),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 8).getTime(),
      max: new Date(2021, 8, 26, 12).getTime(),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 12).getTime(),
      max: new Date(2021, 8, 26, 16).getTime(),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }]);
  });

  it('should return cells in range of [0, 24] for one day interval', () => {
    expect(getMinutesCellIntervals({
      intervals: [{
        min: new Date(2021, 8, 26).getTime(),
        max: new Date(2021, 8, 27).getTime(),
      }],
      startDayHour: 0,
      endDayHour: 24,
      durationMinutes: 8 * 60,
    })).toEqual([{
      min: new Date(2021, 8, 26, 0).getTime(),
      max: new Date(2021, 8, 26, 8).getTime(),
      cellIndex: 0,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 8).getTime(),
      max: new Date(2021, 8, 26, 16).getTime(),
      cellIndex: 1,
      columnIndex: 1,
      rowIndex: 0,
    }, {
      min: new Date(2021, 8, 26, 16).getTime(),
      max: new Date(2021, 8, 26, 24).getTime(),
      cellIndex: 2,
      columnIndex: 2,
      rowIndex: 0,
    }]);
  });
});
