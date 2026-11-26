import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import List from '../../../models/list';

const LIST_ITEM_DELETE_BUTTON = 'dx-list-static-delete-button';

const createList = (
  page: Page,
  selectionMode: string,
  allowItemDeleting = false,
): Promise<void> => createWidget(page, 'dxList', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode,
  allowItemDeleting,
});

test.describe('List', () => {
  [true, false].forEach((focusStateEnabled) => {
    test(`Should${focusStateEnabled ? '' : ' not'} focus item when deleting when focusStateEnabled=${focusStateEnabled} (T1226030)`, async ({ page }) => {
      await createWidget(page, 'dxList', {
        items: ['item1', 'item2', 'item3'],
        selectionMode: 'none',
        allowItemDeleting: true,
        itemDeleteMode: 'static',
        focusStateEnabled,
      });

      const list = new List(page, '#container');
      const firstItem = list.getItem(0);

      await firstItem.element.locator(`.${LIST_ITEM_DELETE_BUTTON}`).click();
      await firstItem.expectFocused(focusStateEnabled);
    });
  });

  test('Should apply styles on selectAll checkbox after tab button press', async ({ page }) => {
    await createList(page, 'all');

    const list = new List(page, '#container');

    await page.keyboard.press('Tab');
    await list.selectAll.checkBox.expectFocused();
  });

  test('Should apply styles on selectAll checkbox after enter button press on it', async ({ page }) => {
    await createList(page, 'all');

    const list = new List(page, '#container');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await list.selectAll.checkBox.expectChecked();
  });

  ['single', 'multiple'].forEach((selectionMode) => {
    test(`Should apply styles on list item after tab button press, ${selectionMode} mode`, async ({ page }) => {
      await createList(page, selectionMode);

      const list = new List(page, '#container');

      await page.keyboard.press('Tab');
      await list.getItem(0).expectFocused();
    });

    test(`Should apply styles on list item after enter button press on it, ${selectionMode} mode`, async ({ page }) => {
      await createList(page, selectionMode);

      const list = new List(page, '#container');
      const firstItem = list.getItem(0);
      const firstItemType = selectionMode === 'single' ? firstItem.radioButton : firstItem.checkBox;

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await firstItemType.expectChecked();
    });
  });

  test('Should select next item after delete by keyboard', async ({ page }) => {
    await createList(page, 'none', true);

    const list = new List(page, '#container');
    const firstItem = list.getItem(0);

    await expect(list.visibleItems).toHaveCount(3);
    await firstItem.element.click();
    await page.keyboard.press('Delete');

    const item = list.getItem(0);

    await item.expectFocused();
    await expect(item.element).toHaveText('item2');
    await expect(list.items).toHaveCount(2);
  });

  test('Should select previous item after delete last item', async ({ page }) => {
    await createList(page, 'none', true);

    const list = new List(page, '#container');
    const lastItem = list.getItem(2);

    await expect(list.visibleItems).toHaveCount(3);
    await lastItem.element.click();
    await page.keyboard.press('Delete');

    const item = list.getItem(1);

    await item.expectFocused();
    await expect(item.element).toHaveText('item2');
    await expect(list.items).toHaveCount(2);
  });

  [[2, 0], [1, 2]].forEach(([selectItemIdx, deleteItemIdx]) => {
    test(`Should not change selection after delete another (not selected) item (${selectItemIdx}, ${deleteItemIdx})`, async ({ page }) => {
      await createList(page, 'none', true);

      const list = new List(page, '#container');
      const itemToSelect = list.getItem(selectItemIdx);
      const itemToDelete = list.getItem(deleteItemIdx);

      await expect(list.visibleItems).toHaveCount(3);
      await itemToSelect.element.click();
      await itemToDelete.element.locator('.dx-button').click();

      const item = list.getItem(deleteItemIdx > selectItemIdx ? selectItemIdx : selectItemIdx - 1);

      await item.expectFocused();
      await expect(item.element).toHaveText(`item${selectItemIdx + 1}`);
      await expect(list.items).toHaveCount(2);
    });
  });
});
