/**
 * @timezone Canada/Pacific
 */

import { describe, expect, it } from '@jest/globals';

import { calculateRows } from './agenda';

describe('calculateRows', () => {
  it('should count rows through winter 02:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDate: new Date(2016, 10, 5, 10).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 5, 23).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 6, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 6, 2).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 6, 15).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 7, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 7, 16).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 10, 8, 0).getTime() },
    ] as any, 7, new Date(2016, 10, 5), 0)).toEqual([
      [2, 3, 2, 1, 0, 0, 0],
    ]);
  });

  it('should count rows through summer 02:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDate: new Date(2016, 2, 12, 10).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 12, 23).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 13, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 13, 2).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 13, 15).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 14, 0).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 14, 16).getTime() },
      { groupIndex: 0, startDate: new Date(2016, 2, 15, 0).getTime() },
    ] as any, 7, new Date(2016, 2, 11), 0)).toEqual([
      [0, 2, 3, 2, 1, 0, 0],
    ]);
  });
});
