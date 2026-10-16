import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/context_menu';
import ContextMenu from '@ts/ui/context_menu/context_menu';

const ITEMS: Item[] = [{
  text: 'A',
  items: [
    { text: 'A1', items: [{ text: 'A11' }] },
    { text: 'A2', items: [{ text: 'A21' }] },
  ],
}, {
  text: 'B',
  items: [{ text: 'B1' }],
}];

const instances: ContextMenu[] = [];

const createContextMenu = (): ContextMenu => {
  const $target = $('<div>').appendTo(document.body);
  const $element = $('<div>').appendTo(document.body);

  const contextMenu = new ContextMenu($element.get(0) as HTMLElement, {
    target: $target.get(0),
    showSubmenuMode: 'onClick',
    items: ITEMS,
  });
  instances.push(contextMenu);

  contextMenu.show().catch(() => {});
  jest.runAllTimers();

  return contextMenu;
};

describe('ContextMenu', () => {
  const getItem = (
    contextMenu: ContextMenu,
    text: string,
  ): dxElementWrapper => $($(contextMenu._overlay?.$content())
    .find('.dx-menu-item')
    .toArray()
    .find((element) => $(element).children('.dx-menu-item-content').text() === text));

  const isSubmenuVisible = (
    contextMenu: ContextMenu,
    text: string,
  ): boolean => getItem(contextMenu, text)
    .children('.dx-submenu')
    .css('visibility') === 'visible';

  beforeEach(() => {
    jest.useFakeTimers();
    fx.off = true;
  });

  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
    fx.off = false;
    jest.useRealTimers();
  });

  describe('_hideAllShownChildSubmenus', () => {
    it('should hide the submenu of a sibling item when an item with a submenu is clicked', () => {
      const contextMenu = createContextMenu();
      contextMenu._showSubmenu(getItem(contextMenu, 'A'));
      contextMenu._showSubmenu(getItem(contextMenu, 'A2'));
      contextMenu._showSubmenu(getItem(contextMenu, 'A1'));
      jest.runAllTimers();

      expect(isSubmenuVisible(contextMenu, 'A1')).toBe(true);

      contextMenu._hideAllShownChildSubmenus(getItem(contextMenu, 'A2'));
      jest.runAllTimers();

      expect(isSubmenuVisible(contextMenu, 'A1')).toBe(false);
      expect(isSubmenuVisible(contextMenu, 'A')).toBe(true);
    });
  });
});
