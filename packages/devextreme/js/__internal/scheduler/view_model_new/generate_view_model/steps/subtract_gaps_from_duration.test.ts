import { describe, expect, it } from '@jest/globals';

import { subtractGapsFromDuration } from './subtract_gaps_from_duration';

describe('subtractGapsFromDuration', () => {
  it('should subtract zero gaps', () => {
    const items = [{
      cellIndex: 0,
      endCellIndex: 1,
      duration: 15,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      cellIndex: 0,
      endCellIndex: 2,
      duration: 30,
      columnIndex: 0,
      rowIndex: 0,
    }];

    expect(subtractGapsFromDuration(items, [
      {
        min: 0, max: 10, cellIndex: 0, columnIndex: 0, rowIndex: 0,
      },
      {
        min: 10, max: 20, cellIndex: 1, columnIndex: 1, rowIndex: 0,
      },
      {
        min: 20, max: 30, cellIndex: 2, columnIndex: 2, rowIndex: 0,
      },
    ])).toEqual(items);
  });

  it('should subtract gaps', () => {
    const items = [{
      cellIndex: 0,
      endCellIndex: 1,
      duration: 16,
      columnIndex: 0,
      rowIndex: 0,
    }, {
      cellIndex: 0,
      endCellIndex: 2,
      duration: 25,
      columnIndex: 0,
      rowIndex: 0,
    }];

    expect(subtractGapsFromDuration(items, [
      {
        min: 2, max: 8, cellIndex: 0, columnIndex: 0, rowIndex: 0,
      },
      {
        min: 12, max: 18, cellIndex: 1, columnIndex: 1, rowIndex: 0,
      },
      {
        min: 22, max: 28, cellIndex: 2, columnIndex: 2, rowIndex: 0,
      },
    ])).toEqual([
      { ...items[0], duration: 12 },
      { ...items[1], duration: 17 },
    ]);
  });
});
