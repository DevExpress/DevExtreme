/**
 * @timezone Australia/Lord_Howe
 */

import {
  describe, expect, it,
} from '@jest/globals';

import timeZoneUtils from './utils_time_zone';

const MINUTE_MS = 60 * 1000;

// NOTE: Lord Howe Island has a half an hour DST shift.
// In 2026 the fall-back transition is on April 5, 02:00 -> 01:30.
describe('half an hour fall-back DST', () => {
  it('should return the repeated time of a fall-back day', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 3, 5),
      Date.UTC(2026, 3, 6),
    )).toBe(30 * MINUTE_MS);
  });

  it('should add the cells that cover the repeated time', () => {
    expect(timeZoneUtils.getFallBackExtraCellCounts(new Date(2026, 3, 5), 2, 0.25, 0, 24))
      .toEqual([2, 0]);
    expect(timeZoneUtils.getFallBackExtraCellCounts(new Date(2026, 3, 5), 1, 1, 0, 24))
      .toEqual([1]);
  });

  it('should keep a 30-minute fall-back from being cancelled by the next spring-forward', () => {
    expect(timeZoneUtils.getLocalFallBackShiftMs(
      new Date(2026, 0, 1),
      new Date(2026, 11, 1),
    )).toBe(30 * MINUTE_MS);
  });
});
