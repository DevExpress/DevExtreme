import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import type { RovingTabIndexComponent } from './roving_tab_index';
import { RovingTabIndex } from './roving_tab_index';

const createComponent = (
  container: HTMLElement,
  tabindex: number | undefined = undefined,
): RovingTabIndexComponent => ({
  option: (optionName?: string) => {
    if (optionName === undefined) {
      return { tabindex };
    }

    return optionName === 'tabindex' ? tabindex : undefined;
  },
  element: () => container,
});

describe('RovingTabIndex', () => {
  let container: HTMLElement = document.createElement('div');
  let items: HTMLElement[] = [];

  const createItems = (count: number): HTMLElement[] => {
    container.innerHTML = '';

    return Array.from({ length: count }, () => {
      const item = document.createElement('div');
      container.appendChild(item);

      return item;
    });
  };

  const createHelper = (
    options: Partial<{
      tabindex: number;
      scrollToItem: (item: HTMLElement) => void;
    }> = {},
  ): RovingTabIndex => new RovingTabIndex({
    component: createComponent(container, options.tabindex),
    getItems: () => items,
    scrollToItem: options.scrollToItem,
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    items = createItems(3);
  });

  afterEach(() => {
    container.remove();
  });

  describe('updateTabIndexes', () => {
    it('should make the first item the single tab stop by default', () => {
      const helper = createHelper();

      helper.updateTabIndexes();

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    });

    it('should use the component tabindex option for the focused item', () => {
      const helper = createHelper({ tabindex: 5 });

      helper.updateTabIndexes();

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['5', '-1', '-1']);
    });

    it('should keep the focused item as the tab stop', () => {
      const helper = createHelper();
      helper.focusItem(2);

      helper.updateTabIndexes();

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
    });

    it('should clamp the focused index when items shrink', () => {
      const helper = createHelper();
      helper.focusItem(2);

      items = createItems(2);
      helper.updateTabIndexes();

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '0']);
      expect(helper.getFocusedItemIndex()).toBe(1);
    });

    it('should do nothing when there are no items', () => {
      const helper = createHelper();
      items = [];

      expect(() => helper.updateTabIndexes()).not.toThrow();
      expect(helper.getFocusedItemIndex()).toBe(-1);
      expect(helper.getFocusedItem()).toBeUndefined();
    });
  });

  describe('focusItem', () => {
    it('should focus the item by index and move the tab stop', () => {
      const helper = createHelper();

      helper.focusItem(1);

      expect(document.activeElement).toBe(items[1]);
      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
      expect(helper.getFocusedItem()).toBe(items[1]);
    });

    it('should focus the item by element', () => {
      const helper = createHelper();

      helper.focusItem(items[2]);

      expect(document.activeElement).toBe(items[2]);
      expect(helper.getFocusedItemIndex()).toBe(2);
    });

    it('should scroll the item into view', () => {
      const scrollToItem = jest.fn();
      const helper = createHelper({ scrollToItem });

      helper.focusItem(1);

      expect(scrollToItem).toHaveBeenCalledTimes(1);
      expect(scrollToItem).toHaveBeenCalledWith(items[1]);
    });

    it('should ignore an out of range index', () => {
      const helper = createHelper();
      helper.focusItem(1);

      helper.focusItem(10);

      expect(helper.getFocusedItemIndex()).toBe(1);
    });

    it('should ignore a foreign element', () => {
      const helper = createHelper();
      helper.focusItem(1);

      helper.focusItem(document.createElement('div'));

      expect(helper.getFocusedItemIndex()).toBe(1);
    });
  });

  describe('handleFocusIn', () => {
    it('should move the tab stop to the item focused from outside', () => {
      const helper = createHelper();
      helper.updateTabIndexes();

      helper.handleFocusIn(items[2]);

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
      expect(helper.getFocusedItemIndex()).toBe(2);
    });

    it('should ignore a foreign element', () => {
      const helper = createHelper();
      helper.updateTabIndexes();

      helper.handleFocusIn(document.createElement('div'));

      expect(helper.getFocusedItemIndex()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should move the tab stop back to the first item', () => {
      const helper = createHelper();
      helper.focusItem(2);

      helper.reset();
      helper.updateTabIndexes();

      expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    });
  });

  describe('saveFocus and restoreFocus', () => {
    it('should restore focus to the same position after a re-render', () => {
      const helper = createHelper();
      helper.focusItem(1);

      helper.saveFocus();
      items = createItems(3);
      helper.updateTabIndexes();
      helper.restoreFocus();

      expect(document.activeElement).toBe(items[1]);
    });
  });
});
