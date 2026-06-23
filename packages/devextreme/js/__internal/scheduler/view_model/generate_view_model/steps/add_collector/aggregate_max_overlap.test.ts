import { describe, expect, it } from '@jest/globals';

import { aggregateMaxOverlap } from './aggregate_max_overlap';

interface GroupIndexItem {
  groupIndex: number;
  maxLevel: number;
}

interface RowIndexItem {
  rowIndex: number;
  maxLevel: number;
}

const getGroupIndex = (item: GroupIndexItem): number => Number(item.groupIndex);

const getRowIndex = (item: RowIndexItem): number => Number(item.rowIndex);

describe('aggregateMaxOverlap', () => {
  it('should aggregate max overlap by key', () => {
    const items: GroupIndexItem[] = [
      { groupIndex: 0, maxLevel: 1 },
      { groupIndex: 1, maxLevel: 3 },
      { groupIndex: 0, maxLevel: 2 },
      { groupIndex: 1, maxLevel: 1 },
    ];

    const result = aggregateMaxOverlap(items, getGroupIndex);

    expect(result).toEqual([2, 3]);
  });

  it('should keep empty slots for missing keys', () => {
    const items: RowIndexItem[] = [
      { rowIndex: 0, maxLevel: 2 },
      { rowIndex: 2, maxLevel: 4 },
    ];

    const result = aggregateMaxOverlap(items, getRowIndex);

    expect(result).toEqual([2, 0, 4]);
  });

  it('should return empty array for empty items', () => {
    const items: RowIndexItem[] = [];

    const result = aggregateMaxOverlap(items, getRowIndex);

    expect(result).toEqual([]);
  });
});
