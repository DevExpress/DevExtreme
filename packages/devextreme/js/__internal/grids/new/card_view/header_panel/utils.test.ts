import { describe, expect, it } from '@jest/globals';
import type { FilterType } from '@js/common/grids';

import { hasFilterValues } from './utils';

describe('HeaderPanel', () => {
  describe('utils', () => {
    describe('hasFilterValues', () => {
      it.each<{
        filterType: FilterType | undefined;
        filterValues: any[] | undefined;
        expected: boolean;
      }>([
        { filterType: 'include', filterValues: ['A'], expected: true },
        { filterType: 'exclude', filterValues: ['A'], expected: true },
        { filterType: 'include', filterValues: [], expected: false },
        { filterType: 'exclude', filterValues: [], expected: true },
        { filterType: 'include', filterValues: undefined, expected: false },
        { filterType: 'exclude', filterValues: undefined, expected: true },
        { filterType: undefined, filterValues: [], expected: false },
        { filterType: undefined, filterValues: ['A'], expected: true },
        { filterType: undefined, filterValues: undefined, expected: false },
      ])('filterType: $filterType | filterValues: $filterValues -> should return $expected', ({
        filterType, filterValues, expected,
      }) => {
        const result = hasFilterValues(filterType, filterValues);

        expect(result).toBe(expected);
      });
    });
  });
});
