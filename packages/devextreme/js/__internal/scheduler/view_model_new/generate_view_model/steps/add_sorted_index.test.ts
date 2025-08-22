import { describe, expect, it } from '@jest/globals';

import { addSortedIndex } from './add_sorted_index';

describe('addSortedIndex', () => {
  it('should add sorted index in order of sorting', () => {
    const items = [
      { some: '1' },
      { another: '2' },
      { nothing: true },
    ];

    expect(addSortedIndex(items)).toEqual([
      { some: '1', sortedIndex: 0 },
      { another: '2', sortedIndex: 1 },
      { nothing: true, sortedIndex: 2 },
    ]);
  });
});
