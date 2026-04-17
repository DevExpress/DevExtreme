import { test, expect } from '@playwright/test';
import { createWidget, TreeList } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';
  const createTreeList = async (page) => createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        id: 1,
        parentId: 0,
        columnA: 'A_0',
        columnB: 'B_0',
      },
      {
        id: 2,
        parentId: 0,
        columnA: 'A_1',
        columnB: 'B_1',
      },
      {
        id: 3,
        parentId: 0,
        columnA: 'A_2',
        columnB: 'B_2',
      },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    columns: [
      {
        type: 'buttons',
        buttons: [
          {
            hint: 'button_1',
            icon: 'edit',
            onClick: (e) => $(e.event.target).attr('has-been-clicked', 'true'),
          },
          {
            hint: 'button_2',
            icon: 'remove',
          },
        ],
      },
      'id',
      'columnA',
      'columnB',
    ],
    sorting: {
      mode: 'none',
    },
  });

  test('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    await createTreeList(page);

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 0);
    const cellToStartNavigation = treeList.getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');
    await expect(expectedFocusedCell).toBeFocused();

    });

  test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async ({ page }) => {
    await createTreeList(page);

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 0);
    const cellToStartNavigation = treeList.getDataCell(0, 1);

    await cellToStartNavigation.click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(expectedFocusedCell).toBeFocused();

    });

  test('First custom button inside custom buttons cell should be focused on tab navigation', async ({ page }) => {
    await createTreeList(page);

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.locator('[title="button_1"]');
    const cellToStartNavigation = treeList.getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(expectedFocusedButton).toBeFocused();

    });

  test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async ({ page }) => {
    await createTreeList(page);

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.locator('[title="button_2"]');
    const cellToStartNavigation = treeList.getDataCell(0, 1);

    await cellToStartNavigation.click();
    await page.keyboard.press('Shift+Tab');
    await expect(expectedFocusedButton).toBeFocused();

    });

  test('Custom button inside custom buttons cell should be clickable by pressing enter key', async ({ page }) => {
    await createTreeList(page);

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.locator('[title="button_1"]');
    const cellToStartNavigation = treeList.getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(expectedFocusedButton).toHaveAttribute('has-been-clicked', 'true');

    });
});
