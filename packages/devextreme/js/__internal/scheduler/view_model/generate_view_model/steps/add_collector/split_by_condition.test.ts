import { describe, expect, it } from '@jest/globals';

import { splitByCondition } from './split_by_condition';

describe('splitByCondition', () => {
  it('should split arrays by condition', () => {
    const items = [
      { id: 1, flag: true },
      { id: 2, flag: false },
      { id: 3, flag: false },
      { id: 4, flag: true },
      { id: 5, flag: true },
      { id: 6, flag: false },
    ];

    expect(splitByCondition(items, (item) => item.flag)).toEqual([
      [
        { id: 1, flag: true },
        { id: 4, flag: true },
        { id: 5, flag: true },
      ],
      [
        { id: 2, flag: false },
        { id: 3, flag: false },
        { id: 6, flag: false },
      ],
    ]);
  });
});
