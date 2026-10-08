import { describe, expect, it } from '@jest/globals';
import type { Item } from '@js/ui/menu';
import MenuBaseEditStrategy from '@ts/ui/context_menu/menu_base.edit.strategy';

const createStrategy = (items: Item[]): MenuBaseEditStrategy => new MenuBaseEditStrategy({
  option: () => ({ items }),
} as unknown as ConstructorParameters<typeof MenuBaseEditStrategy>[0]);

describe('MenuBaseEditStrategy', () => {
  describe('_getPlainItems', () => {
    it('should return the items of a flat menu', () => {
      const items: Item[] = [{ text: 'A' }, { text: 'B' }];

      expect(createStrategy(items)._getPlainItems()).toEqual(items);
    });

    it('should put the nested items after their parent', () => {
      const child = { text: 'B' };
      const parent = { text: 'A', items: [child] };

      expect(createStrategy([parent, { text: 'C' }])._getPlainItems())
        .toEqual([parent, child, { text: 'C' }]);
    });

    it('should flatten the items of the third and deeper levels', () => {
      const grandChild = { text: 'C' };
      const child = { text: 'B', items: [grandChild] };
      const parent = { text: 'A', items: [child] };
      const sibling = { text: 'D' };

      const plainItems = createStrategy([parent, sibling])._getPlainItems();

      expect(plainItems).toEqual([parent, child, grandChild, sibling]);
      expect(plainItems.every((item) => !Array.isArray(item))).toBe(true);
    });
  });
});
