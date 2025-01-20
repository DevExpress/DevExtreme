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
      expect(isVisible(undefined, [
        { name: 'toolbarItem1' },
        { name: 'toolbarItem2' },
      ])).toBe(true);
    });
  });
});

describe('normalizeToolbarItems', () => {
  describe('when only default items are specified', () => {
    it('should return default items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1' }],
        undefined,
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1' }]);
    });
  });

  describe('when only custom items are specified', () => {
    it('should return processed custom items', () => {
      expect(normalizeToolbarItems(
        [],
        [{ name: 'customToolbarItem1' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when default items and custom items are specified', () => {
    it('should return processed custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1' }],
        [{ name: 'customToolbarItem1' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when custom items override default items', () => {
    it('should return default items merged with custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1', location: 'before' }],
        [{ name: 'toolbarItem1', location: 'after' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1', location: 'after' }]);
    });
  });

  describe('when default items are set in custom items', () => {
    it('should return both default and custom items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1', location: 'before' }],
        ['toolbarItem1', { name: 'customToolbarItem1' }],
        ['toolbarItem1'],
      )).toStrictEqual([
        { name: 'toolbarItem1', location: 'before' },
        { name: 'customToolbarItem1', location: 'after' },
      ]);
    });
  });

  describe('when there are no default items but they are specified in custom items', () => {
    it('should return processed default items', () => {
      expect(normalizeToolbarItems(
        [],
        ['toolbarItem1'],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1', location: 'after', visible: false }]);
    });
  });
});
