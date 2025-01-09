import { describe, expect, it } from '@jest/globals';

import { isVisible } from './utils';

describe('isVisible', () => {
  describe('when visibleConfig = true', () => {
    it('should be equal to true', () => {
      expect(isVisible(true, [])).toBe(true);
    });
  });

  describe('when visibleConfig = false', () => {
    it('should be equal to false', () => {
      expect(isVisible(false, [{ name: 'toolbarItem1' }])).toBe(false);
    });
  });

  describe('when visibleConfig = undefined and there are items', () => {
    it('should be equal to false', () => {
      expect(isVisible(undefined, [])).toBe(false);
    });
  });

  describe('when visibleConfig = undefined and there are no items', () => {
    it('should be equal to true', () => {
      expect(isVisible(undefined, [{ name: 'toolbarItem1' }, { name: 'toolbarItem2' }])).toBe(true);
    });
  });
});
