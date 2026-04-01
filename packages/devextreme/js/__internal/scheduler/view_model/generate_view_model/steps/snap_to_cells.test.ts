import { describe, expect, it } from '@jest/globals';

import { snapToCells } from './snap_to_cells';

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
];

describe('snapToCells', () => {
  describe('always mode', () => {
    it('should snap appointments to cell boundaries', () => {
      const items = [
        {
          cellIndex: 0, endCellIndex: 0, startDateUTC: 2, endDateUTC: 8, duration: 6,
        },
        {
          cellIndex: 3, endCellIndex: 4, startDateUTC: 32, endDateUTC: 48, duration: 16,
        },
        {
          cellIndex: 0, endCellIndex: 2, startDateUTC: 3, endDateUTC: 27, duration: 24,
        },
      ];

      expect(snapToCells(items as any, cells, 'always')).toEqual([
        expect.objectContaining({
          startDateUTC: 0, endDateUTC: 10, duration: 10,
        }),
        expect.objectContaining({
          startDateUTC: 30, endDateUTC: 50, duration: 20,
        }),
        expect.objectContaining({
          startDateUTC: 0, endDateUTC: 30, duration: 30,
        }),
      ]);
    });
  });

  describe('never mode', () => {
    it('should return same reference without changes', () => {
      const items = [
        {
          cellIndex: 0, endCellIndex: 0, startDateUTC: 2, endDateUTC: 10, duration: 8,
        },
        {
          cellIndex: 1, endCellIndex: 2, startDateUTC: 12, endDateUTC: 27, duration: 15,
        },
      ];

      expect(snapToCells(items as any, cells, 'never')).toBe(items);
    });
  });

  describe('auto mode', () => {
    it('should snap both boundaries when cells are covered by more than 50%', () => {
      const items = [
        {
          cellIndex: 0, endCellIndex: 1, startDateUTC: 2, endDateUTC: 16, duration: 14,
        },
      ];

      expect(snapToCells(items as any, cells, 'auto')).toEqual([
        expect.objectContaining({
          startDateUTC: 0, endDateUTC: 20, duration: 20,
        }),
      ]);
    });

    it('should not snap boundary when cell is covered by less than 50%', () => {
      const items = [
        {
          cellIndex: 0, endCellIndex: 0, startDateUTC: 2, endDateUTC: 7, duration: 5,
        },
      ];

      expect(snapToCells(items as any, cells, 'auto')).toEqual([
        expect.objectContaining({
          startDateUTC: 2, endDateUTC: 7, duration: 5,
        }),
      ]);
    });

    it('should not snap boundary when cell is covered by exactly 50%', () => {
      const items = [
        {
          cellIndex: 0, endCellIndex: 0, startDateUTC: 0, endDateUTC: 5, duration: 5,
        },
      ];

      expect(snapToCells(items as any, cells, 'auto')).toEqual([
        expect.objectContaining({
          startDateUTC: 0, endDateUTC: 5, duration: 5,
        }),
      ]);
    });
  });
});
