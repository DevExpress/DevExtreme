import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TagBox', () => {
  test.beforeEach(async ({ page }) => {
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

    expect(tagBox.isFocused).toBeTruthy()
      .expect(await tagBox.isOpened())
      .ok();

    const list = await tagBox.getList();
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;

    await t
    // List is focused
      .pressKey('tab')
      .expect(selectAllCheckBox.isFocused).ok()
      .pressKey('down down down')
      .expect(thirdItemCheckBox.isFocused)
      .ok()
      .pressKey('down')
      .expect(selectAllCheckBox.isFocused)
      .ok()
      .pressKey('up up up')
      .expect(firstItemCheckBox.isFocused)
      .ok()
      .expect(firstItemCheckBox.isChecked)
      .notOk()
      .pressKey('space')
      .expect(firstItemCheckBox.isChecked)
      .ok()
      .pressKey('enter')
      .expect(firstItemCheckBox.isChecked)
      .notOk()

    // TagBox is focused
      .pressKey('shift+tab')
      .expect(tagBox.isFocused)
      .ok()
      .pressKey('down')
      .expect(secondItemCheckBox.isFocused)
      .ok()
      .pressKey('down down')
      .expect(selectAllCheckBox.isFocused)
      .ok()
      .pressKey('up up up')
      .expect(firstItemCheckBox.isFocused)
      .ok()
      .expect(firstItemCheckBox.isChecked)
      .notOk()
      .pressKey('space')
      .expect(firstItemCheckBox.isChecked)
      .ok()
      .pressKey('enter')
      .expect(firstItemCheckBox.isChecked)
      .notOk();

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

    expect(tagBox.isFocused).toBeTruthy()
      .expect(await tagBox.isOpened())
      .ok();

    const list = await tagBox.getList();
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await page.keyboard.press('Tab')
      .expect(tagBox.isFocused).notOk()
      .expect(selectAllCheckBox.isFocused)
      .ok()

      .pressKey('shift+tab')
      .expect(tagBox.isFocused)
      .ok()
      .expect(selectAllCheckBox.isFocused)
      .notOk()

      .pressKey('tab')
      .expect(tagBox.isFocused)
      .notOk()
      .expect(selectAllCheckBox.isFocused)
      .ok();

    await page.keyboard.press('esc');

    expect(tagBox.isFocused).toBeTruthy()
      .expect(await tagBox.isOpened())
      .notOk();

    });

  test('TagBox with selection controls', async ({ page }) => {
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

    const tagBox = page.locator('#container');

    await tagBox.option('items', [1, 2, 3]);

    await testScreenshot(page, 'TagBox placeholder if value is not choosen.png', { element: '#container' });

    });
});
