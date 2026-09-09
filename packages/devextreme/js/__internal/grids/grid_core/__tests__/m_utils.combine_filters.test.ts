import { describe, expect, it } from '@jest/globals';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

const FIRST = ['a', '=', 1];
const SECOND = ['b', '=', 2];
const THIRD = ['c', '=', 3];
const MATCH_NOTHING = ['!'];

const combineFilters = (
  filters: unknown[],
  operation?: 'and' | 'or',
): DataFilter => gridCoreUtils.combineFilters(filters as DataFilter[], operation);

describe('combineFilters', () => {
  describe('when the list is empty', () => {
    it('should return undefined', () => {
      expect(combineFilters([])).toBeUndefined();
    });
  });

  describe('when every entry is empty', () => {
    it('should return undefined', () => {
      expect(combineFilters([null, undefined])).toBeUndefined();
    });
  });

  describe('when a single expression is given', () => {
    it('should unwrap it', () => {
      expect(combineFilters([FIRST])).toEqual(FIRST);
    });
  });

  describe('when several expressions are given', () => {
    it('should join them with and by default', () => {
      expect(combineFilters([FIRST, SECOND])).toEqual([FIRST, 'and', SECOND]);
    });

    it('should join them with the requested operation', () => {
      expect(combineFilters([FIRST, SECOND], 'or')).toEqual([FIRST, 'or', SECOND]);
    });

    it('should skip the empty entries', () => {
      expect(combineFilters([null, FIRST, undefined, SECOND]))
        .toEqual([FIRST, 'and', SECOND]);
    });
  });

  describe('when the same expressions are folded pairwise and combined in one call', () => {
    it('should nest to the left while folding pairwise', () => {
      expect(combineFilters([combineFilters([FIRST, SECOND]), THIRD]))
        .toEqual([[FIRST, 'and', SECOND], 'and', THIRD]);
    });

    it('should stay flat while combining in one call', () => {
      expect(combineFilters([FIRST, SECOND, THIRD]))
        .toEqual([FIRST, 'and', SECOND, 'and', THIRD]);
    });

    it('should produce different structures for the two ways', () => {
      expect(combineFilters([combineFilters([FIRST, SECOND]), THIRD]))
        .not.toEqual(combineFilters([FIRST, SECOND, THIRD]));
    });
  });

  describe('when a match-nothing filter is among the entries', () => {
    it('should collapse an and group', () => {
      expect(combineFilters([FIRST, MATCH_NOTHING])).toEqual(MATCH_NOTHING);
    });

    it('should be skipped in an or group', () => {
      expect(combineFilters([FIRST, MATCH_NOTHING], 'or')).toEqual(FIRST);
    });

    it('should survive on its own', () => {
      expect(combineFilters([MATCH_NOTHING])).toEqual(MATCH_NOTHING);
    });
  });

  describe('when a predicate function is among the entries', () => {
    const predicate = (item: unknown): boolean => Boolean(item);

    it('should pass it through on its own', () => {
      expect(combineFilters([predicate])).toBe(predicate);
    });

    it('should make it a member of the group next to an expression', () => {
      const combined = combineFilters([predicate, FIRST]) as unknown as unknown[];

      expect(combined).toHaveLength(3);
      expect(combined[0]).toBe(predicate);
      expect(combined.slice(1)).toEqual(['and', FIRST]);
    });
  });
});
