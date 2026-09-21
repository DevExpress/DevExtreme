/**
 * @timezone America/New_York
 */

import {
  describe, expect, it,
} from '@jest/globals';

import timeZoneUtils from './utils_time_zone';

const HOUR_MS = 60 * 60 * 1000;

// NOTE: In 2026 the fall-back transition is on November 1, 02:00 -> 01:00,
// the spring-forward one is on March 8, 02:00 -> 03:00.
describe('getLocalFallBackShiftInWallClockRange', () => {
  it('should return the repeated time of a fall-back day', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 10, 1),
      Date.UTC(2026, 10, 2),
    )).toBe(HOUR_MS);
  });

  it('should return zero for a spring-forward day', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 2, 8),
      Date.UTC(2026, 2, 9),
    )).toBe(0);
  });

  it('should return zero when the repeated time is out of the range', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 10, 1, 8),
      Date.UTC(2026, 10, 1, 18),
    )).toBe(0);
  });

  it('should return zero when the range ends at the repeated time', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 10, 1),
      Date.UTC(2026, 10, 1, 1),
    )).toBe(0);
  });

  it('should return the repeated time when the range ends inside of it', () => {
    expect(timeZoneUtils.getLocalFallBackShiftInWallClockRange(
      Date.UTC(2026, 10, 1),
      Date.UTC(2026, 10, 1, 1, 30),
    )).toBe(HOUR_MS);
  });
});

describe('getFallBackExtraCellCounts', () => {
  it('should add cells that cover the repeated time', () => {
    expect(timeZoneUtils.getFallBackExtraCellCounts(
      new Date(2026, 10, 1),
      1,
      0.75,
      0,
      24,
    )).toEqual([2]);
  });
});

describe('getLocalFallBackShiftMs', () => {
  it('should return the repeated time for a date after the transition', () => {
    expect(timeZoneUtils.getLocalFallBackShiftMs(
      new Date(2026, 10, 1),
      new Date(2026, 10, 1, 12),
    )).toBe(HOUR_MS);
  });

  it('should return zero for a spring-forward transition', () => {
    expect(timeZoneUtils.getLocalFallBackShiftMs(
      new Date(2026, 2, 8),
      new Date(2026, 2, 8, 12),
    )).toBe(0);
  });
});
