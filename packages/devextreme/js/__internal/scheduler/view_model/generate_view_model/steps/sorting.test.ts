import { describe, expect, it } from '@jest/globals';

import { sortByDuration, sortByGroupIndex, sortByStartDate } from './sorting';

describe('sorting', () => {
  describe('sortByStartDate', () => {
    it('should sort items by start date', () => {
      const items = [
        { id: 1, startDateUTC: 10 },
        { id: 2, startDateUTC: 100 },
        { id: 3, startDateUTC: 20 },
        { id: 4, startDateUTC: 100 },
        { id: 5, startDateUTC: 5 },
        { id: 6, startDateUTC: 500 },
        { id: 7, startDateUTC: 10 },
      ];

      expect(sortByStartDate(items)).toEqual([
        { id: 5, startDateUTC: 5 },
        { id: 1, startDateUTC: 10 },
        { id: 7, startDateUTC: 10 },
        { id: 3, startDateUTC: 20 },
        { id: 2, startDateUTC: 100 },
        { id: 4, startDateUTC: 100 },
        { id: 6, startDateUTC: 500 },
      ]);
    });
  });

  describe('sortByGroupIndex', () => {
    it('should sort items by group index', () => {
      const items = [
        { id: 1, groupIndex: 10 },
        { id: 2, groupIndex: 100 },
        { id: 3, groupIndex: 20 },
        { id: 4, groupIndex: 100 },
        { id: 5, groupIndex: 5 },
        { id: 6, groupIndex: 500 },
        { id: 7, groupIndex: 10 },
      ];

      expect(sortByGroupIndex(items)).toEqual([
        { id: 5, groupIndex: 5 },
        { id: 1, groupIndex: 10 },
        { id: 7, groupIndex: 10 },
        { id: 3, groupIndex: 20 },
        { id: 2, groupIndex: 100 },
        { id: 4, groupIndex: 100 },
        { id: 6, groupIndex: 500 },
      ]);
    });
  });

  describe('sortByDuration', () => {
    it('should sort items by duration, long first', () => {
      const items = [
        { id: 1, duration: 10 },
        { id: 2, duration: 100 },
        { id: 3, duration: 20 },
        { id: 4, duration: 100 },
        { id: 5, duration: 5 },
        { id: 6, duration: 500 },
        { id: 7, duration: 10 },
      ];

      expect(sortByDuration(items)).toEqual([
        { id: 6, duration: 500 },
        { id: 2, duration: 100 },
        { id: 4, duration: 100 },
        { id: 3, duration: 20 },
        { id: 1, duration: 10 },
        { id: 7, duration: 10 },
        { id: 5, duration: 5 },
      ]);
    });
  });
});
