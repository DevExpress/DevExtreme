import { describe, expect, it } from '@jest/globals';

import { normalizeToolbarItems } from './utils';

describe('normalizeToolbarItems', () => {
  describe('when only default items are specified', () => {
    it('should return correct items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1' }],
        undefined,
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1' }]);
    });
  });

  describe('when only custom items are specified', () => {
    it('should return correct items', () => {
      expect(normalizeToolbarItems(
        [],
        [{ name: 'customToolbarItem1' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when default items and custom items are specified', () => {
    it('should return correct items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1' }],
        [{ name: 'customToolbarItem1' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'customToolbarItem1', location: 'after' }]);
    });
  });

  describe('when custom items override default items', () => {
    it('should return correct items', () => {
      expect(normalizeToolbarItems(
        [{ name: 'toolbarItem1', location: 'before' }],
        [{ name: 'toolbarItem1', location: 'after' }],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1', location: 'after' }]);
    });
  });

  describe('when default items are set in custom items', () => {
    it('should return correct items', () => {
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
    it('should return correct items', () => {
      expect(normalizeToolbarItems(
        [],
        ['toolbarItem1'],
        ['toolbarItem1'],
      )).toStrictEqual([{ name: 'toolbarItem1', location: 'after', visible: false }]);
    });
  });
});
