import { describe, expect, it } from '@jest/globals';

import { isVisible, normalizeToolbarItems } from './utils';

describe('isVisible', () => {
  describe('when visibleConfig = true', () => {
    it('should be equal to true', () => {
      expect(isVisible(true, [])).toBe(true);
    });
  });

  describe('when visibleConfig = false', () => {
    it('should be equal to false', () => {
      expect(isVisible(false, [{ name: 'addCardButton' }])).toBe(false);
    });
  });

  describe('when visibleConfig = undefined and there are items', () => {
    it('should be equal to false', () => {
      expect(isVisible(undefined, [])).toBe(false);
    });
  });

  describe('when visibleConfig = undefined and there are no items', () => {
    it('should be equal to true', () => {
      expect(isVisible(undefined, [
        { name: 'addCardButton' },
        { name: 'toolbarItem2' },
      ])).toBe(true);
    });
  });
});

describe('normalizeToolbarItems', () => {
  describe('when only default items are specified', () => {
    it('should return default items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'addCardButton' }],
        undefined,
        ['addCardButton'],
      )).toStrictEqual([{ name: 'addCardButton' }]);
    });
  });

  describe('when only custom items are specified', () => {
    it('should return processed custom items', () => {
      expect(normalizeToolbarItems(
        [],
        [{ name: 'customToolbarItem1' }],
        ['addCardButton'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when default items and custom items are specified', () => {
    it('should return processed custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'addCardButton' }],
        [{ name: 'customToolbarItem1' }],
        ['addCardButton'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when custom items override default items', () => {
    it('should return default items merged with custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'addCardButton', location: 'before' }],
        [{ name: 'addCardButton', location: 'after' }],
        ['addCardButton'],
      )).toStrictEqual([{ name: 'addCardButton', location: 'after' }]);
    });
  });

  describe('when default items are set in custom items', () => {
    it('should return both default and custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'addCardButton', location: 'before' }],
        ['addCardButton', { name: 'customToolbarItem1' }],
        ['addCardButton'],
      )).toStrictEqual([
        { name: 'addCardButton', location: 'before' },
        { name: 'customToolbarItem1', location: 'after' },
      ]);
    });
  });

  describe('when there are no default items but they are specified in custom items', () => {
    it('should return processed default items', () => {
      expect(normalizeToolbarItems(
        [],
        ['addCardButton'],
        ['addCardButton'],
      )).toStrictEqual([{ name: 'addCardButton', location: 'after', visible: false }]);
    });
  });
});
