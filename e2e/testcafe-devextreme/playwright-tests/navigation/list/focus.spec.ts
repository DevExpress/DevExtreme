import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
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

  const createList = (selectionMode, allowItemDeleting = false) => createWidget(page, 'dxList', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode,
    allowItemDeleting,
  });

  [true, false].forEach((focusStateEnabled) => {
    test(`Should${focusStateEnabled ? '' : ' not'} focus item when deleting when focusStateEnabled=${focusStateEnabled} (T1226030)`, async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      selectionMode: 'none',
      allowItemDeleting: true,
      itemDeleteMode: 'static',
      focusStateEnabled,
    });

      const list = page.locator('#container');
      const firstItem = list.getItem(0);
      const $firstDeleteBtn = firstItem.element.find(`.${LIST_ITEM_DELETE_BUTTON}`);

      await page.click($firstDeleteBtn)
        .expect(firstItem.isFocused)
        .eql(focusStateEnabled);

    });
  });

  test('Should apply styles on selectAll checkbox after tab button press', async ({ page }) => {
    await createList('all');

    const list = page.locator('#container');

    await page.keyboard.press('Tab')
      .expect(list.selectAll.checkBox.isFocused)
      .ok();

    });

  test('Should apply styles on selectAll checkbox after enter button press on it', async ({ page }) => {
    await createList('all');

    const list = page.locator('#container');

    await page.keyboard.press('Tab')
      .pressKey('enter')
      .expect(list.selectAll.checkBox.isChecked)
      .ok();

    });

  ['single', 'multiple'].forEach((selectionMode) => {
    test(`Should apply styles on list item after tab button press, ${selectionMode} mode`, async ({ page }) => {
    await createList(selectionMode);

      const list = page.locator('#container');

      await page.keyboard.press('Tab')
        .expect(list.getItem(0).isFocused)
        .ok();

    });

    test(`Should apply styles on list item after enter button press on it, ${selectionMode} mode`, async ({ page }) => {
    await createList(selectionMode);

      const list = page.locator('#container');

      const firstItem = list.getItem(0);
      const firstItemType = selectionMode === 'single' ? firstItem.radioButton : firstItem.checkBox;

      await page.keyboard.press('Tab')
        .pressKey('enter')
        .expect(firstItemType.isChecked)
        .ok();

    });
  });

  test('Should select next item after delete by keyboard', async ({ page }) => {
    await createList('none', true);

    const list = page.locator('#container');
    const firstItem = list.getItem(0);

    await page.expect(list.getVisibleItems().count).eql(3)
      .click(firstItem.element)
      .pressKey('delete');

    const item = list.getItem(0);

    expect(item.isFocused).toBeTruthy();
    expect(item.text).toBe('item2');
    await expect(list.getItems().count).eql(2);

    });

  test('Should select previous item after delete last item', async ({ page }) => {
    await createList('none', true);

    const list = page.locator('#container');
    const lastItem = list.getItem(2);

    await page.expect(list.getVisibleItems().count).eql(3)
      .click(lastItem.element)
      .pressKey('delete');

    const item = list.getItem(1);

    expect(item.isFocused).toBeTruthy();
    expect(item.text).toBe('item2');
    await expect(list.getItems().count).eql(2);

    });

  [[2, 0], [1, 2]].forEach(([selectItemIdx, deleteItemIdx]) => {
    test(`Should not change selection after delete another (not selected) item (${selectItemIdx}, ${deleteItemIdx})`, async ({ page }) => {
    await createList('none', true);

      const list = page.locator('#container');
      const itemToSelect = list.getItem(selectItemIdx);
      const itemToDelete = list.getItem(deleteItemIdx);

      await page.expect(list.getVisibleItems().count).eql(3)
        .click(itemToSelect.element)
        .click(itemToDelete.element.find('.dx-button'));

      const item = list.getItem(deleteItemIdx > selectItemIdx ? selectItemIdx : selectItemIdx - 1);

      expect(item.isFocused).toBeTruthy();
      expect(item.text).toBe(`item${selectItemIdx + 1}`);
      await expect(list.getItems().count).eql(2);

    });
  });
});
