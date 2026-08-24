import {
  describe, expect, it,
} from '@jest/globals';

import type { SummaryItem } from '../../types';
import { getSummaryItemIndex } from '../get_summary_item_index';

describe('findSummaryItem', () => {
  describe('when there is nothing to search in or for', () => {
    const summaryItems: SummaryItem[] = [{ summaryType: 'count' }];

    it('should return -1 when summaryItems is not defined', () => {
      expect(getSummaryItemIndex(undefined, 'count')).toBe(-1);
    });

    it('should return -1 when summaryItems is empty', () => {
      expect(getSummaryItemIndex([], 'count')).toBe(-1);
    });

    it('should return -1 when name is not defined', () => {
      expect(getSummaryItemIndex(summaryItems, undefined)).toBe(-1);
    });

    it('should return -1 when name is null', () => {
      expect(getSummaryItemIndex(summaryItems, null)).toBe(-1);
    });
  });

  describe('search by custom name', () => {
    const summaryItems: SummaryItem[] = [{
      name: 'testCount1',
      summaryType: 'count',
    }, {
      name: 'testCount2',
      summaryType: 'count',
    }, {
      name: 'testMin',
      summaryType: 'min',
      column: 'testField',
    }];

    it('should find by summaryType', () => {
      expect(getSummaryItemIndex(summaryItems, 'count')).toBe(0);
    });

    it('should find by column name', () => {
      expect(getSummaryItemIndex(summaryItems, 'testField')).toBe(2);
    });

    it('should find by summaryType + column name', () => {
      expect(getSummaryItemIndex(summaryItems, 'min_testField')).toBe(2);
    });

    it('should find by name', () => {
      expect(getSummaryItemIndex(summaryItems, 'testCount2')).toBe(1);
    });

    it('should find by summary item index', () => {
      expect(getSummaryItemIndex(summaryItems, 1)).toBe(1);
    });

    it('should return -1 for a wrong name', () => {
      expect(getSummaryItemIndex(summaryItems, 'test3')).toBe(-1);
    });
  });

  describe('search by index', () => {
    const summaryItems: SummaryItem[] = [
      { summaryType: 'count' },
      { summaryType: 'min', column: 'field' },
    ];

    it('should find the first item by index 0', () => {
      expect(getSummaryItemIndex(summaryItems, 0)).toBe(0);
    });

    it('should return -1 when index is out of range', () => {
      expect(getSummaryItemIndex(summaryItems, 2)).toBe(-1);
      expect(getSummaryItemIndex(summaryItems, -1)).toBe(-1);
    });

    it('should not match an index passed as a string', () => {
      expect(getSummaryItemIndex(summaryItems, '1')).toBe(-1);
    });
  });

  describe('full name', () => {
    it('should use summaryType only when column is not defined', () => {
      const summaryItems: SummaryItem[] = [{ summaryType: 'sum' }];

      expect(getSummaryItemIndex(summaryItems, 'sum')).toBe(0);
      expect(getSummaryItemIndex(summaryItems, 'sum_undefined')).toBe(-1);
    });

    it('should use column only when summaryType is not defined', () => {
      const summaryItems: SummaryItem[] = [{ column: 'field' }];

      expect(getSummaryItemIndex(summaryItems, 'field')).toBe(0);
      expect(getSummaryItemIndex(summaryItems, 'undefined_field')).toBe(-1);
    });

    it('should not match items without summaryType, column and name', () => {
      const summaryItems: SummaryItem[] = [{}, { summaryType: 'sum' }];

      expect(getSummaryItemIndex(summaryItems, 'sum')).toBe(1);
    });
  });

  describe('several matching items', () => {
    it('should return the first matching item', () => {
      const summaryItems: SummaryItem[] = [
        { summaryType: 'count' },
        { summaryType: 'count' },
      ];

      expect(getSummaryItemIndex(summaryItems, 'count')).toBe(0);
    });

    it('should prefer an earlier item matched by name over a later index match', () => {
      const summaryItems: SummaryItem[] = [
        { name: '1', summaryType: 'count' },
        { summaryType: 'min', column: 'field' },
      ];

      expect(getSummaryItemIndex(summaryItems, '1')).toBe(0);
    });

    it('should not match a numeric name against an item name of the same digits', () => {
      const summaryItems: SummaryItem[] = [
        { name: '1', summaryType: 'count' },
        { name: 'other', summaryType: 'min' },
      ];

      expect(getSummaryItemIndex(summaryItems, 1)).toBe(1);
    });
  });
});
