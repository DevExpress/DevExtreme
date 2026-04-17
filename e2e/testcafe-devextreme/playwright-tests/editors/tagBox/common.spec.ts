import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TagBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 300 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Keyboard navigation should work then tagBox is focused or list is focused', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode: 'all',
    applyValueMode: 'useButtons',
  });

    const tagBox = page.locator('#container');

    await tagBox.click();

    await expect(tagBox).toHaveClass(/dx-state-focused/);

    const isOpened = await page.evaluate(() => {
      const el = document.querySelector('#container');
      const instance = (window as any).DevExpress.ui.dxTagBox.getInstance(el);
      return instance ? instance.option('opened') : false;
    });
    expect(isOpened).toBe(true);

    const selectAllCheckBox = page.locator('.dx-list-select-all .dx-checkbox');
    const firstItem = page.locator('.dx-list-item').nth(0);
    const secondItem = page.locator('.dx-list-item').nth(1);
    const thirdItem = page.locator('.dx-list-item').nth(2);
    const firstItemCheckBox = firstItem.locator('.dx-checkbox');
    const secondItemCheckBox = secondItem.locator('.dx-checkbox');
    const thirdItemCheckBox = thirdItem.locator('.dx-checkbox');

    // List is focused
    await page.keyboard.press('Tab');
    await expect(page.locator('.dx-list-select-all')).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(thirdItem).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.dx-list-select-all')).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(firstItem).toHaveClass(/dx-state-focused/);

    await expect(firstItemCheckBox).not.toHaveClass(/dx-checkbox-checked/);
    await page.keyboard.press('Space');
    await expect(firstItemCheckBox).toHaveClass(/dx-checkbox-checked/);
    await page.keyboard.press('Enter');
    await expect(firstItemCheckBox).not.toHaveClass(/dx-checkbox-checked/);

    // TagBox is focused
    await page.keyboard.press('Shift+Tab');
    await expect(tagBox).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowDown');
    await expect(secondItem).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.dx-list-select-all')).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(firstItem).toHaveClass(/dx-state-focused/);

    await expect(firstItemCheckBox).not.toHaveClass(/dx-checkbox-checked/);
    await page.keyboard.press('Space');
    await expect(firstItemCheckBox).toHaveClass(/dx-checkbox-checked/);
    await page.keyboard.press('Enter');
    await expect(firstItemCheckBox).not.toHaveClass(/dx-checkbox-checked/);

    });

  test('Select all checkbox should be focused by tab and closed by escape (T389453)', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode: 'all',
    applyValueMode: 'useButtons',
  });

    const tagBox = page.locator('#container');

    await tagBox.click();

    await expect(tagBox).toHaveClass(/dx-state-focused/);

    const isOpened = await page.evaluate(() => {
      const el = document.querySelector('#container');
      const instance = (window as any).DevExpress.ui.dxTagBox.getInstance(el);
      return instance ? instance.option('opened') : false;
    });
    expect(isOpened).toBe(true);

    const selectAllItem = page.locator('.dx-list-select-all');

    await page.keyboard.press('Tab');
    await expect(tagBox).not.toHaveClass(/dx-state-focused/);
    await expect(selectAllItem).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Shift+Tab');
    await expect(tagBox).toHaveClass(/dx-state-focused/);
    await expect(selectAllItem).not.toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Tab');
    await expect(tagBox).not.toHaveClass(/dx-state-focused/);
    await expect(selectAllItem).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Escape');

    await expect(tagBox).toHaveClass(/dx-state-focused/);

    const isOpenedAfterEsc = await page.evaluate(() => {
      const el = document.querySelector('#container');
      const instance = (window as any).DevExpress.ui.dxTagBox.getInstance(el);
      return instance ? instance.option('opened') : true;
    });
    expect(isOpenedAfterEsc).toBe(false);

    });

  test('TagBox with selection controls', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 285 });

    await createWidget(page, 'dxTagBox', {
    items: [1, 2, 3, 4, 5, 6, 7],
    showSelectionControls: true,
    width: 300,
  });

    const tagBox = page.locator('#container');

    await tagBox.click();

    await testScreenshot(page, 'TagBox with selection controls.png');

    });

  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {
    await createWidget(page, 'dxTagBox', {
    width: 300,
    placeholder: 'Choose a value',
  });

    await page.evaluate(() => {
      const el = document.querySelector('#container');
      const instance = (window as any).DevExpress.ui.dxTagBox.getInstance(el);
      if (instance) instance.option('items', [1, 2, 3]);
    });

    await testScreenshot(page, 'TagBox placeholder if value is not choosen.png', { element: '#container' });

    });
});
