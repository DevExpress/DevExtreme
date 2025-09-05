import { describe, expect, it } from '@jest/globals';

import { monthCells } from '../__mock__/month.mock';
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
      cellIndex: 0,
      endCellIndex: 2,
      rowIndex: 0,
      columnIndex: 0,
    },
    {
      duration: 0,
      cellIndex: 6,
      endCellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
    },
    {
      duration: 0,
      cellIndex: 8,
      endCellIndex: 8,
      rowIndex: 1,
      columnIndex: 1,
    },
    {
      duration: 0,
      cellIndex: 9,
      endCellIndex: 9,
      rowIndex: 1,
      columnIndex: 2,
    },
    {
      duration: 0,
      cellIndex: 27,
      endCellIndex: 27,
      rowIndex: 3,
      columnIndex: 6,
    }];

    expect(snapToCells(items as any, monthCells)).toEqual([{
      startDate: new Date(2025, 0, 1).getTime(),
      endDate: new Date(2025, 0, 2).getTime(),
      duration: 24 * 3600_000,
      cellIndex: 0,
      endCellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
    },
    {
      startDate: new Date(2025, 0, 1).getTime(),
      endDate: new Date(2025, 0, 4).getTime(),
      duration: 3 * 24 * 3600_000,
      cellIndex: 0,
      endCellIndex: 2,
      rowIndex: 0,
      columnIndex: 0,
    },
    {
      startDate: new Date(2025, 0, 7).getTime(),
      endDate: new Date(2025, 0, 8).getTime(),
      duration: 24 * 3600_000,
      cellIndex: 6,
      endCellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
    },
    {
      startDate: new Date(2025, 0, 9).getTime(),
      endDate: new Date(2025, 0, 10).getTime(),
      duration: 24 * 3600_000,
      cellIndex: 8,
      endCellIndex: 8,
      rowIndex: 1,
      columnIndex: 1,
    },
    {
      startDate: new Date(2025, 0, 10).getTime(),
      endDate: new Date(2025, 0, 11).getTime(),
      duration: 24 * 3600_000,
      cellIndex: 9,
      endCellIndex: 9,
      rowIndex: 1,
      columnIndex: 2,
    },
    {
      startDate: new Date(2025, 0, 28).getTime(),
      endDate: new Date(2025, 0, 29).getTime(),
      duration: 24 * 3600_000,
      cellIndex: 27,
      endCellIndex: 27,
      rowIndex: 3,
      columnIndex: 6,
    }]);
  });
});
