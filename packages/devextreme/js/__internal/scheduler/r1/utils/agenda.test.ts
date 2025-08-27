import { describe, expect, it } from '@jest/globals';

import { calculateRows } from './agenda';

const items = [
  { groupIndex: 0, startDate: new Date(2020, 0, 10, 5).getTime() },
  { groupIndex: 0, startDate: new Date(2020, 0, 11, 5).getTime() },
  { groupIndex: 0, startDate: new Date(2020, 0, 15, 5).getTime() },
  { groupIndex: 0, startDate: new Date(2020, 0, 10, 15).getTime() },
  { groupIndex: 1, startDate: new Date(2020, 0, 14, 5).getTime() },
  { groupIndex: 1, startDate: new Date(2020, 0, 11, 5).getTime() },
  { groupIndex: 1, startDate: new Date(2020, 0, 11, 15).getTime() },
  { groupIndex: 1, startDate: new Date(2020, 0, 14, 15).getTime() },
  { groupIndex: 1, startDate: new Date(2020, 0, 12, 5).getTime() },
] as any[];

describe('calculateRows', () => {
  it('should count rows for no grouping', () => {
    expect(calculateRows(items.slice(0, 4), 7, new Date(2020, 0, 10), 0)).toEqual([
      [2, 1, 0, 0, 0, 1, 0],
    ]);
  });

  it('should count rows for grouped items', () => {
    expect(calculateRows(items, 7, new Date(2020, 0, 10), 2)).toEqual([
      [2, 1, 0, 0, 0, 1, 0],
      [0, 2, 1, 0, 2, 0, 0],
    ]);
  });
});
