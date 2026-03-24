import { test, expect } from '@playwright/test';
import { createWidget, List } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const LIST_ITEM_DELETE_BUTTON = 'dx-list-static-delete-button';

  const createList = async (page: any, selectionMode: string, allowItemDeleting = false) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode,
      allowItemDeleting,
    });
  };

  [true, false].forEach((focusStateEnabled) => {
    test(`Should${focusStateEnabled ? '' : ' not'} focus item when deleting when focusStateEnabled=${focusStateEnabled} (T1226030)`, async ({ page }) => {
      await createWidget(page, 'dxList', {
        items: ['item1', 'item2', 'item3'],
        selectionMode: 'none',
        allowItemDeleting: true,
        itemDeleteMode: 'static',
        focusStateEnabled,
      });

      const list = new List(page);
      const firstItem = list.getItem(0);
      const deleteBtn = firstItem.element.locator(`.${LIST_ITEM_DELETE_BUTTON}`);

      await deleteBtn.click();
      expect(await firstItem.isFocused).toBe(focusStateEnabled);
    });
  });

  test('Should apply styles on selectAll checkbox after tab button press', async ({ page }) => {
    await createList(page, 'all');

    const list = new List(page);

    await page.keyboard.press('Tab');
    expect(await list.selectAll.checkBox.isFocused).toBe(true);
  });

  test('Should apply styles on selectAll checkbox after enter button press on it', async ({ page }) => {
    await createList(page, 'all');

    const list = new List(page);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    expect(await list.selectAll.checkBox.isChecked).toBe(true);
  });

  ['single', 'multiple'].forEach((selectionMode) => {
    test(`Should apply styles on list item after tab button press, ${selectionMode} mode`, async ({ page }) => {
      await createList(page, selectionMode);

      const list = new List(page);

      await page.keyboard.press('Tab');
      expect(await list.getItem(0).isFocused).toBe(true);
    });

    test(`Should apply styles on list item after enter button press on it, ${selectionMode} mode`, async ({ page }) => {
      await createList(page, selectionMode);

      const list = new List(page);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      const firstItem = list.getItem(0);
      const checkedProp = selectionMode === 'single'
        ? firstItem.radioButton.isChecked
        : firstItem.checkBox.isChecked;
      expect(await checkedProp).toBe(true);
    });
  });

  test('Should select next item after delete by keyboard', async ({ page }) => {
    await createList(page, 'none', true);

    const list = new List(page);
    const firstItem = list.getItem(0);

    expect(await list.getVisibleItems().count()).toBe(3);
    await firstItem.element.click();
    await page.keyboard.press('Delete');

    const item = list.getItem(0);
    expect(await item.isFocused).toBe(true);
    expect(await item.text).toBe('item2');
    expect(await list.getItems().count()).toBe(2);
  });

  test('Should select previous item after delete last item', async ({ page }) => {
    await createList(page, 'none', true);

    const list = new List(page);
    const lastItem = list.getItem(2);

    expect(await list.getVisibleItems().count()).toBe(3);
    await lastItem.element.click();
    await page.keyboard.press('Delete');

    const item = list.getItem(1);
    expect(await item.isFocused).toBe(true);
    expect(await item.text).toBe('item2');
    expect(await list.getItems().count()).toBe(2);
  });

  [[2, 0], [1, 2]].forEach(([selectItemIdx, deleteItemIdx]) => {
    test(`Should not change selection after delete another (not selected) item (${selectItemIdx}, ${deleteItemIdx})`, async ({ page }) => {
      await createList(page, 'none', true);

      const list = new List(page);
      const itemToSelect = list.getItem(selectItemIdx);
      const itemToDelete = list.getItem(deleteItemIdx);

      expect(await list.getVisibleItems().count()).toBe(3);
      await itemToSelect.element.click();
      await itemToDelete.element.locator('.dx-button').click();

      const item = list.getItem(deleteItemIdx > selectItemIdx ? selectItemIdx : selectItemIdx - 1);
      expect(await item.isFocused).toBe(true);
      expect(await item.text).toBe(`item${selectItemIdx + 1}`);
      expect(await list.getItems().count()).toBe(2);
    });
  });
});
