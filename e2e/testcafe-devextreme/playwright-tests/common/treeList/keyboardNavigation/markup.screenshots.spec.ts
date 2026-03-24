import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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

  test('Focused cells should look correctly', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
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
    columns: ['id', 'columnA', 'columnB'],
    sorting: {
      mode: 'none',
    },
  });

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const headerCellToFocus = treeList.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const dataCellToFocus = treeList.getDataCell(0, 0);

    await headerCellToFocus.click()
      .pressKey('tab');
    await testScreenshot(page, 'tree-list_keyboard-navigation-header-cell-focused.png', { element: treeList.element });

    await dataCellToFocus.click()
      .pressKey('tab');
    await testScreenshot(page, 'tree_list_keyboard-navigation-data-cell-focused.png', { element: treeList.element });

    });

  test('Focused custom buttons should look correctly', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
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

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const headerCellToFocus = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await headerCellToFocus.click()
      .pressKey('tab');
    await testScreenshot(page, 'tree-list_keyboard-navigation-custom-buttons-header-cell-focused.png', { element: treeList.element });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'tree-list_keyboard-navigation-custom-button-focused.png', { element: treeList.element });

    });
});
