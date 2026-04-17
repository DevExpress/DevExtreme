import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, List } from '../../../playwright-helpers';
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

  test('Should focus first item after changing selection mode (T811770)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'single',
    });

    const list = new List(page);
    await list.focus();

    const firstItem = list.getItem(0);
    expect(await firstItem.isFocused).toBe(true);

    await list.option('selectionMode', 'multiple');
    await list.focus();

    expect(await list.getItem(0).isFocused).toBe(true);
  });

  test('There is hover class in hovered list item (T1110076)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
    });

    const list = new List(page);
    const firstItem = list.getItem(0);

    await firstItem.element.hover();
    expect(await firstItem.isHovered).toBe(true);

    await list.repaint();

    await firstItem.element.hover();
    expect(await firstItem.isHovered).toBe(true);
  });

  test('List selection should work with keyboard arrows (T718398)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
    });

    const list = new List(page);
    const firstItemCheckBox = list.getItem(0).checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;
    const selectAllCheckBox = list.selectAll.checkBox;

    await list.focus();

    expect(await selectAllCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    expect(await selectAllCheckBox.isFocused).toBe(false);
    expect(await firstItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    expect(await firstItemCheckBox.isFocused).toBe(false);
    expect(await secondItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    expect(await secondItemCheckBox.isFocused).toBe(false);
    expect(await thirdItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    expect(await thirdItemCheckBox.isFocused).toBe(false);
    expect(await selectAllCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    expect(await selectAllCheckBox.isFocused).toBe(false);
    expect(await firstItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowUp');
    expect(await firstItemCheckBox.isFocused).toBe(false);

    await page.keyboard.press('ArrowUp');
    expect(await thirdItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowUp');
    expect(await thirdItemCheckBox.isFocused).toBe(false);
    expect(await secondItemCheckBox.isFocused).toBe(true);

    await page.keyboard.press('Tab');
    expect(await selectAllCheckBox.isFocused).toBe(false);
    expect(await secondItemCheckBox.isFocused).toBe(false);
  });

  test('Should save focused checkbox', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
    });

    const list = new List(page);
    const secondItemCheckBox = list.getItem(1).checkBox;
    const selectAllCheckBox = list.selectAll.checkBox;

    await list.focus();

    expect(await selectAllCheckBox.isFocused).toBe(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    expect(await secondItemCheckBox.isFocused).toBe(true);
    expect(await selectAllCheckBox.isFocused).toBe(false);

    await page.keyboard.press('Shift+Tab');
    expect(await secondItemCheckBox.isFocused).toBe(false);
    expect(await selectAllCheckBox.isFocused).toBe(false);

    await page.keyboard.press('Tab');
    expect(await secondItemCheckBox.isFocused).toBe(true);
    expect(await selectAllCheckBox.isFocused).toBe(false);

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    expect(await selectAllCheckBox.isFocused).toBe(true);
    expect(await secondItemCheckBox.isFocused).toBe(false);

    await page.keyboard.press('Shift+Tab');
    expect(await secondItemCheckBox.isFocused).toBe(false);
    expect(await selectAllCheckBox.isFocused).toBe(false);

    await page.keyboard.press('Tab');
    expect(await selectAllCheckBox.isFocused).toBe(true);
    expect(await secondItemCheckBox.isFocused).toBe(false);
  });

  test('Disabled item should be focused on tab press to match accessibility criteria', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: [
        { text: 'item1', disabled: true },
        { text: 'item2' },
        { text: 'item3' },
      ],
      searchEnabled: true,
    });

    const list = new List(page);

    await list.searchInput.click();
    await page.keyboard.press('Tab');

    const firstItem = list.getItem(0);
    expect(await firstItem.isFocused).toBe(true);
    expect(await firstItem.isDisabled).toBe(true);
  });

  test('The delete button should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{
        text: 'item 1',
        icon: 'user',
      }],
      allowItemDeleting: true,
      itemDeleteMode: 'static',
    });

    await page.evaluate(() => {
      ($('#container') as any).dxList('instance').focus();
    });

    await testScreenshot(page, 'List delete button when item is focused.png');
  });

  test('The button icon in custom template should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{ text: 'item 1' }],
      itemTemplate: (_: any, __: any, element: any) => {
        const button = ($('<div>') as any).dxButton({
          text: 'custom',
          icon: 'home',
        });

        element.append(button);
      },
    });

    await page.evaluate(() => {
      ($('#container') as any).dxList('instance').focus();
    });

    await testScreenshot(page, 'List icon in button when item is focused.png');
  });
});
