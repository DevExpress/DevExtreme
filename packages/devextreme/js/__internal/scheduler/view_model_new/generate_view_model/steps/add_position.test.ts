import { describe, expect, it } from '@jest/globals';

import { monthCells } from '../__mock__/month.mock';
import { addPosition } from './add_position';

describe('addPosition', () => {
  it('should add cell indexes for regular appointments', () => {
    const items = [
      {
        allDay: false,
        startDate: new Date(2025, 0, 1).getTime(),
        endDate: new Date(2025, 0, 1, 1).getTime(),
      },
      {
        allDay: false,
        startDate: new Date(2025, 0, 1, 23, 59).getTime(),
        endDate: new Date(2025, 0, 3, 5).getTime(),
      },
      {
        allDay: false,
        startDate: new Date(2025, 0, 7, 12).getTime(),
        endDate: new Date(2025, 0, 7, 13).getTime(),
      },
      {
        allDay: false,
        startDate: new Date(2025, 0, 9, 3).getTime(),
        endDate: new Date(2025, 0, 10).getTime(),
      },
      {
        allDay: false,
        startDate: new Date(2025, 0, 10).getTime(),
        endDate: new Date(2025, 0, 11).getTime(),
      },
      {
        allDay: false,
        startDate: new Date(2025, 0, 28).getTime(),
        endDate: new Date(2025, 0, 29).getTime(),
      },
    ];

    expect(addPosition(items, monthCells)).toEqual([
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

  it('should add cell indexes for all day appointments', () => {
    const items = [
      {
        allDay: true,
        startDate: new Date(2025, 0, 1).getTime(),
        endDate: new Date(2025, 0, 1, 1).getTime(),
      },
      {
        allDay: true,
        startDate: new Date(2025, 0, 10).getTime(),
        endDate: new Date(2025, 0, 11).getTime(),
      },
    ];

    expect(addPosition(items, monthCells)).toEqual([
      {
        ...items[0], cellIndex: 0, endCellIndex: 0, rowIndex: 0, columnIndex: 0,
      },
      {
        ...items[1], cellIndex: 9, endCellIndex: 10, rowIndex: 1, columnIndex: 2,
      },
    ]);
  });
});
