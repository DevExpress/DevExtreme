import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, TreeList } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';

  test('Header hover should display correctly when there are fixed columns', async ({ page }) => {

    await createWidget(page, 'dxTreeList', {
      dataSource: new Array(20).fill(null).map((_, index) => {
        const item: Record<string, unknown> = {
          id: index + 1,
          parentId: index % 5,
        };

        for (let i = 0; i < 13; i += 1) {
          item[`field${i}`] = `test ${i} ${index + 2}`;
        }

        return item;
      }),
      keyExpr: 'id',
      columnFixing: {
        enabled: true,
      },
      width: 850,
      autoExpandAll: true,
      columnAutoWidth: true,
      customizeColumns(columns) {
        columns[5].fixed = true;
        columns[6].fixed = true;

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const headerCell = treeList.getHeaderCell(0, 13);

    await headerCell.hover();

    await testScreenshot(page, 'treelist_header_hover_with_fixed_columns.png', { element: treeList.element });

    });

  test('Row hover should display correctly when there are fixed columns', async ({ page }) => {

    await createWidget(page, 'dxTreeList', {
      dataSource: new Array(20).fill(null).map((_, index) => {
        const item: Record<string, unknown> = {
          id: index + 1,
          parentId: index % 5,
        };

        for (let i = 0; i < 13; i += 1) {
          item[`field${i}`] = `test ${i} ${index + 2}`;
        }

        return item;
      }),
      keyExpr: 'id',
      columnFixing: {
        enabled: true,
      },
      width: 850,
      autoExpandAll: true,
      columnAutoWidth: true,
      hoverStateEnabled: true,
      customizeColumns(columns) {
        columns[5].fixed = true;
        columns[6].fixed = true;

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    const treeList = new TreeList(page, TREE_LIST_SELECTOR);
    const dataRow = treeList.getDataRow(1);

    await dataRow.element.hover();

    await testScreenshot(page, 'treelist_row_hover_with_fixed_columns.png', { element: treeList.element });

    });
});
