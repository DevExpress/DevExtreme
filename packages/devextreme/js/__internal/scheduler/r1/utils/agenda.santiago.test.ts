/**
 * @timezone America/Santiago
 */

import { describe, expect, it } from '@jest/globals';

import { calculateRows } from './agenda';

describe('calculateRows', () => {
  it('should count rows through winter 00:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDate: new Date(2016, 8, 6, 10).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 6, 23).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 7, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 7, 2).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 7, 15).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 8, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 8, 16).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 8, 9, 0).getTime() },
    ] as any, 7, new Date(2016, 8, 6), 0)).toEqual([
      [2, 3, 2, 1, 0, 0, 0],
    ]);
  });

  it('should count rows through summer 00:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDate: new Date(2016, 3, 3, 10).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 3, 23).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 4, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 4, 2).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 4, 15).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 5, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 5, 16).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 3, 6, 0).getTime() },
    ] as any, 7, new Date(2016, 3, 2), 0)).toEqual([
      [0, 2, 3, 2, 1, 0, 0],
    ]);
  });
});
