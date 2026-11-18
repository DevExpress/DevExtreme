import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import TagBox from '../../../models/tagBox';

const pressKey = async (page: Page, key: string, times = 1): Promise<void> => {
  for (let index = 0; index < times; index += 1) {
    await page.keyboard.press(key);
  }
};

test.describe('TagBox', () => {
  test('Keyboard navigation should work then tagBox is focused or list is focused', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
      applyValueMode: 'useButtons',
    });

    const tagBox = new TagBox(page, '#container');

    await tagBox.element.click();

    await tagBox.expectFocused();
    await expect.poll(() => tagBox.isOpened()).toBe(true);

    const list = await tagBox.getList();
    const selectAllCheckBox = list.selectAll.checkBox;
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;

    // List is focused
    await pressKey(page, 'Tab');
    await selectAllCheckBox.expectFocused();
    await pressKey(page, 'ArrowDown', 3);
    await thirdItemCheckBox.expectFocused();
    await pressKey(page, 'ArrowDown');
    await selectAllCheckBox.expectFocused();
    await pressKey(page, 'ArrowUp', 3);
    await firstItemCheckBox.expectFocused();
    await firstItemCheckBox.expectChecked(false);
    await pressKey(page, 'Space');
    await firstItemCheckBox.expectChecked();
    await pressKey(page, 'Enter');
    await firstItemCheckBox.expectChecked(false);

    // TagBox is focused
    await pressKey(page, 'Shift+Tab');
    await tagBox.expectFocused();
    await pressKey(page, 'ArrowDown');
    await secondItemCheckBox.expectFocused();
    await pressKey(page, 'ArrowDown', 2);
    await selectAllCheckBox.expectFocused();
    await pressKey(page, 'ArrowUp', 3);
    await firstItemCheckBox.expectFocused();
    await firstItemCheckBox.expectChecked(false);
    await pressKey(page, 'Space');
    await firstItemCheckBox.expectChecked();
    await pressKey(page, 'Enter');
    await firstItemCheckBox.expectChecked(false);
  });

  test('Select all checkbox should be focused by tab and closed by escape (T389453)', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
      applyValueMode: 'useButtons',
    });

    const tagBox = new TagBox(page, '#container');

    await tagBox.element.click();

    await tagBox.expectFocused();
    await expect.poll(() => tagBox.isOpened()).toBe(true);

    const list = await tagBox.getList();
    const selectAllCheckBox = list.selectAll.checkBox;

    await pressKey(page, 'Tab');
    await tagBox.expectFocused(false);
    await selectAllCheckBox.expectFocused();

    await pressKey(page, 'Shift+Tab');
    await tagBox.expectFocused();
    await selectAllCheckBox.expectFocused(false);

    await pressKey(page, 'Tab');
    await tagBox.expectFocused(false);
    await selectAllCheckBox.expectFocused();

    await pressKey(page, 'Escape');

    await tagBox.expectFocused();
    await expect.poll(() => tagBox.isOpened()).toBe(false);
  });

  test.describe(() => {
    test.use({ browserSize: [300, 300] });

    test('TagBox with selection controls', async ({ page }) => {
      await createWidget(page, 'dxTagBox', {
        items: [1, 2, 3, 4, 5, 6, 7],
        showSelectionControls: true,
        width: 300,
      });

      const tagBox = new TagBox(page, '#container');

      // The editor and the body margin are wider than the window. TestCafe scrolled the whole
      // target into view before a click; Playwright scrolls only to the click point, so the focus
      // scrolls the page afterwards, and the drop-down closes on that scroll.
      await tagBox.element.evaluate((element) => {
        element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
      await tagBox.element.click();

      await testScreenshot(page, 'TagBox with selection controls.png');
    });
  });

  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
      width: 300,
      placeholder: 'Choose a value',
    });

    const tagBox = new TagBox(page, '#container');

    await tagBox.option('items', [1, 2, 3]);

    await testScreenshot(page, 'TagBox placeholder if value is not choosen.png', { element: '#container' });
  });
});
