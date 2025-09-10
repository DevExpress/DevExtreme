import { describe, expect, it } from '@jest/globals';

import { snapToCells } from './snap_to_cells';

describe('snapToCells', () => {
  it('should snap appointments to cells', () => {
    const items = [{
      duration: 0,
      cellIndex: 0,
      endCellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
    },
    {
      duration: 0,
      cellIndex: 3,
      endCellIndex: 4,
      rowIndex: 1,
      columnIndex: 0,
    },
    {
      duration: 0,
      cellIndex: 0,
      endCellIndex: 2,
      rowIndex: 0,
      columnIndex: 0,
    },
    {
      duration: 0,
      cellIndex: 4,
      endCellIndex: 4,
      rowIndex: 2,
      columnIndex: 1,
    },
    {
      duration: 0,
      cellIndex: 5,
      endCellIndex: 5,
      rowIndex: 3,
      columnIndex: 2,
    }];

    expect(snapToCells(items as any, [
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
    ])).toEqual([
      {
        ...items[0],
        duration: 10,
        startDate: 0,
        endDate: 10,
      },
      {
        ...items[1],
        duration: 20,
        startDate: 30,
        endDate: 50,
      },
      {
        ...items[2],
        duration: 30,
        startDate: 0,
        endDate: 30,
      },
      {
        ...items[3],
        duration: 10,
        startDate: 40,
        endDate: 50,
      },
      {
        ...items[4],
        duration: 10,
        startDate: 50,
        endDate: 60,
      },
    ]);
  });
});
