import { describe, expect, it } from '@jest/globals';

import { addPosition } from './add_position';

describe('addPosition', () => {
  it('should add cell indexes for regular appointments, contiguous cells', () => {
    const cells = [
      {
        min: 0, max: 10, cellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        min: 10, max: 20, cellIndex: 1, rowIndex: 0, columnIndex: 1,
      },
      {
        min: 20, max: 30, cellIndex: 2, rowIndex: 0, columnIndex: 2,
      },
      {
        min: 30, max: 40, cellIndex: 3, rowIndex: 1, columnIndex: 0,
      },
      {
        min: 40, max: 50, cellIndex: 4, rowIndex: 2, columnIndex: 1,
      },
      {
        min: 50, max: 60, cellIndex: 5, rowIndex: 3, columnIndex: 2,
      },
    ];

    const items = [
      { startDate: 0, endDate: 5 },
      { startDate: 2, endDate: 5 },
      { startDate: 8, endDate: 27 },
      { startDate: 43, endDate: 48 },
      { startDate: 59, endDate: 60 },
    ];

    expect(addPosition(items, cells)).toEqual([
      {
        ...items[0], cellIndex: 0, endCellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[1], cellIndex: 0, endCellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[2], cellIndex: 0, endCellIndex: 2, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[3], cellIndex: 4, endCellIndex: 4, rowIndex: 2, columnIndex: 1,
      },
      {
        ...items[4], cellIndex: 5, endCellIndex: 5, rowIndex: 3, columnIndex: 2,
      },
    ]);
  });

  it('should add cell indexes and crop appointments by cell for interrupted interval', () => {
    const items = [
      { startDate: 10, endDate: 20 },
      { startDate: 20, endDate: 50 },
      { startDate: 40, endDate: 55 },
    ];

    expect(addPosition(items, [
      {
        min: 0, max: 15, cellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        min: 25, max: 35, cellIndex: 1, rowIndex: 0, columnIndex: 1,
      },
      {
        min: 45, max: 55, cellIndex: 2, rowIndex: 0, columnIndex: 2,
      },
    ])).toEqual([
      {
        startDate: 10, endDate: 15, cellIndex: 0, endCellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        startDate: 25, endDate: 50, cellIndex: 1, endCellIndex: 2, rowIndex: 0, columnIndex: 1,
      },
      {
        startDate: 45, endDate: 55, cellIndex: 2, endCellIndex: 2, rowIndex: 0, columnIndex: 2,
      },
    ]);
  });
});
