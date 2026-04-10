import { describe, expect, it } from '@jest/globals';

import {
  calculateEndViewDate,
  calculateRows,
  calculateStartViewDate,
  getDateByIndex,
} from './agenda';

const items = [
  { groupIndex: 0, startDateUTC: Date.UTC(2020, 0, 10, 5) },
  { groupIndex: 0, startDateUTC: Date.UTC(2020, 0, 11, 5) },
  { groupIndex: 0, startDateUTC: Date.UTC(2020, 0, 15, 5) },
  { groupIndex: 0, startDateUTC: Date.UTC(2020, 0, 10, 15) },
  { groupIndex: 1, startDateUTC: Date.UTC(2020, 0, 14, 5) },
  { groupIndex: 1, startDateUTC: Date.UTC(2020, 0, 11, 5) },
  { groupIndex: 1, startDateUTC: Date.UTC(2020, 0, 11, 15) },
  { groupIndex: 1, startDateUTC: Date.UTC(2020, 0, 14, 15) },
  { groupIndex: 1, startDateUTC: Date.UTC(2020, 0, 12, 5) },
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

  it('should count only visible agenda days when skippedDays are set', () => {
    expect(calculateRows(items, 3, new Date(2020, 0, 10), 2, [0, 6])).toEqual([
      [2, 0, 0],
      [0, 0, 2],
    ]);
  });
});

describe('visible agenda days', () => {
  it('should shift startViewDate to the first visible date', () => {
    expect(calculateStartViewDate(new Date(2020, 0, 11, 9), 9, [0, 6])).toEqual(
      new Date(2020, 0, 13, 9),
    );
  });

  it('should return visible day by row index', () => {
    expect(getDateByIndex(new Date(2020, 0, 10, 9), 2, [0, 6])).toEqual(
      new Date(2020, 0, 14, 9),
    );
  });

  it('should calculate endViewDate by visible days', () => {
    expect(calculateEndViewDate(new Date(2020, 0, 10, 9), 18, 3, [0, 6])).toEqual(
      new Date(2020, 0, 14, 17, 59),
    );
  });
});
