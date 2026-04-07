import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const getHeaderPanel = (instance): any => instance.getView('headerPanel');

describe('HeaderPanel', () => {
  beforeEach(() => {
    beforeTest();
  });
  afterEach(afterTest);

  describe('applyToolbarItem', () => {
    it('should set a toolbar item and make header panel visible', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });
      const headerPanel = getHeaderPanel(instance);

      expect(headerPanel.isVisible()).toBe(false);

      headerPanel.applyToolbarItem('customButton', {
        widget: 'dxButton',
        options: { text: 'Custom' },
        location: 'after',
        name: 'customButton',
      });
      jest.runAllTimers();
      headerPanel.render();

      expect(headerPanel.isVisible()).toBe(true);
      const $toolbar = $(instance.element()).find('.dx-toolbar');
      expect($toolbar.length).toBe(1);
    });

    it('should replace an existing item when setting with the same name', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });
      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('myItem', {
        text: 'First',
        location: 'before',
        name: 'myItem',
        sortIndex: 10,
      });

      headerPanel.applyToolbarItem('myItem', {
        text: 'Replaced',
        location: 'after',
        name: 'myItem',
        sortIndex: 10,
      });

      const items = headerPanel._getToolbarItems();

      expect(items).toHaveLength(1);
      expect(items[0].text).toBe('Replaced');
    });

    it('should call _invalidate when setting item after first render', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);
      const invalidateSpy = jest.spyOn(headerPanel, '_invalidate');

      headerPanel.applyToolbarItem('customButton', {
        text: 'Custom',
        location: 'after',
        name: 'customButton',
      });

      expect(invalidateSpy).toHaveBeenCalled();
    });

    it('should not call _invalidate when updating an existing item in rendered toolbar', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('customButton', {
        text: 'Original',
        location: 'after',
        name: 'customButton',
      });
      jest.runAllTimers();
      headerPanel.render();

      const invalidateSpy = jest.spyOn(headerPanel, '_invalidate');

      headerPanel.applyToolbarItem('customButton', {
        text: 'Updated',
        location: 'after',
        name: 'customButton',
      });

      expect(invalidateSpy).not.toHaveBeenCalled();
    });

    it('should update toolbar item in-place without full re-render', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('customButton', {
        text: 'Original',
        location: 'after',
        name: 'customButton',
      });
      jest.runAllTimers();
      headerPanel.render();

      const items = headerPanel._toolbar?.option('items') ?? [];
      expect(items[0].text).toBe('Original');

      headerPanel.applyToolbarItem('customButton', {
        text: 'Updated',
        location: 'after',
        name: 'customButton',
      });

      const updatedItems = headerPanel._toolbar?.option('items') ?? [];
      expect(updatedItems[0].text).toBe('Updated');
    });

    it('should update item location and order when changed via in-place update', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('item1', {
        widget: 'dxButton',
        options: { text: 'Item 1' },
        location: 'after',
        name: 'item1',
      });
      headerPanel.applyToolbarItem('item2', {
        widget: 'dxButton',
        options: { text: 'Item 2' },
        location: 'after',
        name: 'item2',
      });
      jest.runAllTimers();
      headerPanel.render();

      const $element = $(instance.element());

      const getItemTexts = (): string[] => {
        const texts: string[] = [];
        $element
          .find('.dx-toolbar .dx-item .dx-button-text')
          .each((_, el) => {
            texts.push($(el).text());
            return true;
          });
        return texts;
      };

      // initial state: both in 'after', Item 1 first by array order
      expect(getItemTexts()).toEqual(['Item 1', 'Item 2']);

      // move item2 to 'before' — 'before' section comes first in DOM
      // so Item 2 should now appear before Item 1
      headerPanel.applyToolbarItem('item2', {
        widget: 'dxButton',
        options: { text: 'Item 2' },
        location: 'before',
        name: 'item2',
      });
      jest.runAllTimers();

      expect(getItemTexts()).toEqual(['Item 2', 'Item 1']);
    });
  });

  describe('removeToolbarItem', () => {
    it('should remove a previously set item', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('toRemove', {
        text: 'Remove me',
        location: 'after',
        name: 'toRemove',
      });

      expect(headerPanel._getToolbarItems()).toHaveLength(1);

      headerPanel.removeToolbarItem('toRemove');

      expect(headerPanel._getToolbarItems()).toHaveLength(0);
    });

    it('should not call _invalidate when removing non-existent item', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);
      const invalidateSpy = jest.spyOn(headerPanel, '_invalidate');

      headerPanel.removeToolbarItem('nonExistent');

      expect(invalidateSpy).not.toHaveBeenCalled();
    });

    it('should call _invalidate when removing existing item after render', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('temp', {
        text: 'Temp',
        name: 'temp',
      });
      jest.runAllTimers();

      const invalidateSpy = jest.spyOn(headerPanel, '_invalidate');

      headerPanel.removeToolbarItem('temp');

      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  describe('_sortToolbarItems', () => {
    it('should sort items by sortIndex ascending', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('c', {
        text: 'C', name: 'c', sortIndex: 30, location: 'after',
      });
      headerPanel.applyToolbarItem('a', {
        text: 'A', name: 'a', sortIndex: 10, location: 'after',
      });
      headerPanel.applyToolbarItem('b', {
        text: 'B', name: 'b', sortIndex: 20, location: 'after',
      });

      headerPanel.render();
      const toolbarItems: ToolbarItem[] = headerPanel._toolbarOptions?.items;

      const names = toolbarItems?.map((item) => item.name);
      expect(names).toEqual(['a', 'b', 'c']);
    });

    it('should treat missing sortIndex as 0', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('withIndex', {
        text: 'With', name: 'withIndex', sortIndex: 10, location: 'after',
      });
      headerPanel.applyToolbarItem('noIndex', {
        text: 'No', name: 'noIndex', location: 'before',
      });

      headerPanel.render();
      const toolbarItems: ToolbarItem[] = headerPanel._toolbarOptions?.items;

      const names = toolbarItems?.map((item) => item.name);
      expect(names).toEqual(['noIndex', 'withIndex']);
    });

    it('should not mutate the original items array', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('b', {
        text: 'B', name: 'b', sortIndex: 20, location: 'after',
      });
      headerPanel.applyToolbarItem('a', {
        text: 'A', name: 'a', sortIndex: 10, location: 'after',
      });

      const itemsBefore = headerPanel._getToolbarItems();
      const firstItemNameBefore = itemsBefore[0].name;

      headerPanel.render();

      const itemsAfter = headerPanel._getToolbarItems();
      expect(itemsAfter[0].name).toBe(firstItemNameBefore);
    });
  });

  describe('_getToolbarItems', () => {
    it('should return items from both registerToolbarItem and applyToolbarItem', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.registerToolbarItem('registered', {
        text: 'Registered', name: 'registered', location: 'before',
      });
      headerPanel.applyToolbarItem('applied', {
        text: 'Applied', name: 'applied', location: 'after',
      });

      const items: ToolbarItem[] = headerPanel._getToolbarItems();

      expect(items).toHaveLength(2);
      expect(items.map((i) => i.name)).toEqual(
        expect.arrayContaining(['registered', 'applied']),
      );
    });

    it('should return empty array when no items registered', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
      });

      const headerPanel = getHeaderPanel(instance);

      expect(headerPanel._getToolbarItems()).toEqual([]);
    });
  });

  describe('items from extensions and applyToolbarItem combined', () => {
    it('should include items from both extensions and applyToolbarItem', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        columnChooser: { enabled: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('customItem', {
        text: 'Custom',
        name: 'customItem',
        location: 'after',
        sortIndex: 100,
      });

      const items: ToolbarItem[] = headerPanel._getToolbarItems();
      const names = items.map((i) => i.name);

      expect(names).toContain('columnChooserButton');
      expect(names).toContain('customItem');
    });

    it('should sort extension items and registered items together by sortIndex', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        columnChooser: { enabled: true },
        searchPanel: { visible: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('middleItem', {
        text: 'Middle',
        name: 'middleItem',
        location: 'after',
        sortIndex: 45,
      });

      headerPanel.render();

      const toolbarItems: ToolbarItem[] = headerPanel._toolbarOptions?.items ?? [];
      const names = toolbarItems.map((i) => i.name);

      const columnChooserIdx = names.indexOf('columnChooserButton');
      const middleIdx = names.indexOf('middleItem');
      const searchIdx = names.indexOf('searchPanel');

      expect(columnChooserIdx).toBeGreaterThanOrEqual(0);
      expect(middleIdx).toBeGreaterThanOrEqual(0);
      expect(searchIdx).toBeGreaterThanOrEqual(0);

      expect(columnChooserIdx).toBeLessThan(middleIdx);
      expect(middleIdx).toBeLessThan(searchIdx);
    });

    it('should remove only the registered item without affecting extension items', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1 }],
        columnChooser: { enabled: true },
      });

      const headerPanel = getHeaderPanel(instance);

      headerPanel.applyToolbarItem('toRemove', {
        text: 'Remove',
        name: 'toRemove',
        location: 'after',
      });

      let items: ToolbarItem[] = headerPanel._getToolbarItems();
      expect(items.map((i) => i.name)).toContain('toRemove');
      expect(items.map((i) => i.name)).toContain('columnChooserButton');

      // act
      headerPanel.removeToolbarItem('toRemove');

      items = headerPanel._getToolbarItems();
      expect(items.map((i) => i.name)).not.toContain('toRemove');
      expect(items.map((i) => i.name)).toContain('columnChooserButton');
    });
  });
});
