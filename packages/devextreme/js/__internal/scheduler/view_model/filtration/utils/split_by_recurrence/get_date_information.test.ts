import {
  afterAll, describe, expect, it,
} from '@jest/globals';

import { globalCache } from '../../../../global_cache';
import { findDSTOfDay } from './get_date_information';

const HOUR_MS = 3600_000;

describe('findDSTOfDay', () => {
  afterAll(() => {
    globalCache.DST.clear();
  });

  it('should return no DST if interval has no DST', () => {
    expect(findDSTOfDay(Date.UTC(2025, 0, 1), 'America/Santiago')).toEqual([
      -Date.UTC(2025, 0, 1), -3 * HOUR_MS, -3 * HOUR_MS,
    ]);
  });

  it('should return summer DST in America/Santiago', () => {
    expect(findDSTOfDay(Date.UTC(2025, 3, 6), 'America/Santiago')).toEqual([
      Date.UTC(2025, 3, 6, 3),
      -3 * HOUR_MS,
      -4 * HOUR_MS,
    ]);
  });

  it('should return winter DST in America/Santiago', () => {
    expect(findDSTOfDay(Date.UTC(2025, 8, 7), 'America/Santiago')).toEqual([
      Date.UTC(2025, 8, 7, 4),
      -4 * HOUR_MS,
      -3 * HOUR_MS,
    ]);
  });

  it('should return summer DST in Canada/Pacific', () => {
    expect(findDSTOfDay(Date.UTC(2025, 2, 9, 10), 'Canada/Pacific')).toEqual([
      Date.UTC(2025, 2, 9, 10),
      -8 * HOUR_MS,
      -7 * HOUR_MS,
    ]);
  });

  it('should return winter DST in Canada/Pacific', () => {
    expect(findDSTOfDay(Date.UTC(2025, 10, 2), 'Canada/Pacific')).toEqual([
      Date.UTC(2025, 10, 2, 2) + 7 * HOUR_MS,
      -7 * HOUR_MS,
      -8 * HOUR_MS,
    ]);
  });
});
