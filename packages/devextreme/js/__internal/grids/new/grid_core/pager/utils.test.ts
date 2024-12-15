import { describe, expect, it } from '@jest/globals';

import { calculatePageSizes, isVisible } from './utils';

describe('calculatePageSizes', () => {
  describe('when pageSizesConfig = \'auto\'', () => {
    it('calculates pageSizes by pageSize', () => {
      expect(calculatePageSizes(undefined, 'auto', 6)).toEqual([3, 6, 12]);
    });
  });

  describe('when pageSizesConfig with custom values', () => {
    it('return custom values', () => {
      expect(calculatePageSizes(undefined, [4, 10, 20], 6)).toEqual([4, 10, 20]);
    });
  });

  describe('when there is an initial value of pageSizes and pageSizesConfig = \'auto\'', () => {
    it('return initial values', () => {
      expect(calculatePageSizes([3, 6, 12], 'auto', 12)).toEqual([3, 6, 12]);
    });
  });
});

describe('isVisible', () => {
  describe('when visibleConfig = true', () => {
    it('visible should be equal to true', () => {
      expect(isVisible(true, 1)).toBe(true);
    });
  });

  describe('when visibleConfig = false', () => {
    it('visible should be equal to false', () => {
      expect(isVisible(false, 2)).toBe(false);
    });
  });

  describe('when visibleConfig = \'auto\' and pageCount = 1', () => {
    it('visible should be equal to false', () => {
      expect(isVisible('auto', 1)).toBe(false);
    });
  });

  describe('when visibleConfig = \'auto\' and pageCount > 1', () => {
    it('visible should be equal to true', () => {
      expect(isVisible('auto', 2)).toBe(true);
    });
  });
});
