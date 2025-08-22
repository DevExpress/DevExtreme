import { describe, expect, it } from '@jest/globals';

import { monthCells } from '../__mock__/month.mock';
import { addPosition } from './add_position';

describe('addPosition', () => {
  it('should add cell indexes', () => {
    const items = [
      {
        startDate: new Date(2025, 0, 1).getTime(),
        endDate: new Date(2025, 0, 1, 1).getTime(),
      },
      {
        startDate: new Date(2025, 0, 1, 23, 59).getTime(),
        endDate: new Date(2025, 0, 3, 5).getTime(),
      },
      {
        startDate: new Date(2025, 0, 7, 12).getTime(),
        endDate: new Date(2025, 0, 7, 13).getTime(),
      },
      {
        startDate: new Date(2025, 0, 9, 3).getTime(),
        endDate: new Date(2025, 0, 10).getTime(),
      },
      {
        startDate: new Date(2025, 0, 10).getTime(),
        endDate: new Date(2025, 0, 11).getTime(),
      },
      {
        startDate: new Date(2025, 0, 28).getTime(),
        endDate: new Date(2025, 0, 29).getTime(),
      },
    ];

    expect(addPosition(items as any, monthCells)).toEqual([
      {
        ...items[0], cellIndex: 0, endCellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[1], cellIndex: 0, endCellIndex: 2, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[2], cellIndex: 6, endCellIndex: 6, rowIndex: 0, columnIndex: 6,
      },
      {
        ...items[3], cellIndex: 8, endCellIndex: 8, rowIndex: 1, columnIndex: 1,
      },
      {
        ...items[4], cellIndex: 9, endCellIndex: 9, rowIndex: 1, columnIndex: 2,
      },
      {
        ...items[5], cellIndex: 27, endCellIndex: 27, rowIndex: 3, columnIndex: 6,
      },
    ]);
  });
});
