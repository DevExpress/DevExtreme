/**
 * @timezone America/Santiago
 */

import { describe, expect, it } from '@jest/globals';

import timeZoneUtils from '../../utils_time_zone';
import { calculateRows } from './agenda';

const createDate = (year: number, month: number, day: number, hours: number) => {
  const date = timeZoneUtils.createUTCDateWithLocalOffset(
    new Date(year, month, day, hours),
  ) as Date;
  return date.getTime();
};

describe('calculateRows', () => {
  it('should count rows through winter 00:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 6, 10) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 6, 23) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 7, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 7, 2) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 7, 15) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 8, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 8, 16) },
      { groupIndex: 0, startDateUTC: createDate(2016, 8, 9, 0) },
    ] as any, 7, new Date(2016, 8, 6), 0)).toEqual([
      [2, 3, 2, 1, 0, 0, 0],
    ]);
  });

  it('should count rows through summer 00:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 3, 10) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 3, 23) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 4, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 4, 2) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 4, 15) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 5, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 5, 16) },
      { groupIndex: 0, startDateUTC: createDate(2016, 3, 6, 0) },
    ] as any, 7, new Date(2016, 3, 2), 0)).toEqual([
      [0, 2, 3, 2, 1, 0, 0],
    ]);
  });
});
