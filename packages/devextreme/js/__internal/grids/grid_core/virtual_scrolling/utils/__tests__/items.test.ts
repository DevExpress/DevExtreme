import {
  describe, expect, it,
} from '@jest/globals';

import {
  correctCount, isItemCountableByDataSource, updateItemIndices,
} from '../items';

describe('correctCount', () => {
  it('should not increase count when all items are countable', () => {
    const items = [{ v: 1 }, { v: 2 }, { v: 3 }];

    expect(correctCount(items, 2, false, () => true)).toBe(2);
  });

  it('should increase count for each not countable item from the start', () => {
    const items = [
      { countable: false },
      { countable: true },
      { countable: false },
      { countable: true },
      { countable: true },
    ];

    const result = correctCount(items, 2, false, (item) => item.countable);

    expect(result).toBe(4);
  });

  it('should walk from the end when fromEnd is true', () => {
    const items = [
      { countable: true },
      { countable: false },
      { countable: true },
    ];

    const seen: boolean[] = [];
    const result = correctCount(items, 1, true, (item) => {
      seen.push(item.countable);
      return item.countable;
    });

    expect(result).toBe(2);
    expect(seen[0]).toBe(true);
    expect(seen[1]).toBe(false);
  });

  it('should pass isNextAfterLast as true only when i equals the current count', () => {
    const items = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const flags: boolean[] = [];

    correctCount(items, 1, false, (_item, isNextAfterLast) => {
      flags.push(isNextAfterLast);
      return true;
    });

    expect(flags).toEqual([false, true]);
  });

  it('should stop against missing items (undefined) without incrementing', () => {
    const items = [{ countable: true }];

    expect(correctCount(items, 3, false, (item) => item.countable)).toBe(3);
  });
});

describe('isItemCountableByDataSource', () => {
  const dataSource = {
    isGroupItemCountable: (data: unknown): boolean => data === 'countable',
  };

  it('should count a data row that is not a new row', () => {
    expect(isItemCountableByDataSource({ rowType: 'data', isNewRow: false }, dataSource)).toBe(true);
  });

  it('should not count a new data row', () => {
    expect(isItemCountableByDataSource({ rowType: 'data', isNewRow: true }, dataSource)).toBe(false);
  });

  it('should count a group row when the data source says it is countable', () => {
    expect(isItemCountableByDataSource({ rowType: 'group', data: 'countable' }, dataSource)).toBe(true);
  });

  it('should not count a group row when the data source says it is not countable', () => {
    expect(isItemCountableByDataSource({ rowType: 'group', data: 'other' }, dataSource)).toBe(false);
  });

  it('should not count other row types', () => {
    expect(isItemCountableByDataSource({ rowType: 'groupFooter' }, dataSource)).toBe(false);
  });
});

describe('updateItemIndices', () => {
  it('should assign rowIndex to each item by position', () => {
    const items = [{ rowIndex: -1 }, { rowIndex: -1 }, { rowIndex: -1 }];

    updateItemIndices(items);

    expect(items.map((item) => item.rowIndex)).toEqual([0, 1, 2]);
  });

  it('should return the same array reference', () => {
    const items = [{ rowIndex: 0 }];

    expect(updateItemIndices(items)).toBe(items);
  });
});
