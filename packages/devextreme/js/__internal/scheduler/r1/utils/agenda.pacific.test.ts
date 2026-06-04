/**
 * @timezone Canada/Pacific
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
  it('should count rows through winter 02:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 5, 10) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 5, 23) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 6, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 6, 2) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 6, 15) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 7, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 7, 16) },
      { groupIndex: 0, startDateUTC: createDate(2016, 10, 8, 0) },
    ] as any, 7, new Date(2016, 10, 5), 0)).toEqual([
      [2, 3, 2, 1, 0, 0, 0],
    ]);
  });

  it('should count rows through summer 02:00 DST', () => {
    expect(calculateRows([
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 12, 10) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 12, 23) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 13, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 13, 2) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 13, 15) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 14, 0) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 14, 16) },
      { groupIndex: 0, startDateUTC: createDate(2016, 2, 15, 0) },
    ] as any, 7, new Date(2016, 2, 11), 0)).toEqual([
      [0, 2, 3, 2, 1, 0, 0],
    ]);
  });
});
