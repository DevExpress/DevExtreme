import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';

  // T1294363
  test('Focus method should focus the first data cell', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      { id: 1, parentId: 0, name: 'name 1' },
      { id: 2, parentId: 1, name: 'name 2' },
      { id: 3, parentId: 0, name: 'name 3' },
    ],
    keyExpr: 'id',
    parentId: 'parentId',
    columns: [
      'id',
      {
        dataField: 'name',
        cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
      },
    ],
  });

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await treeList.apiFocus();

    await page.expect(treeList.getDataCell(0, 0).element.focused)
      .ok();

    });

  // T1294363
  test('Focus method should focus the first data row when focusedRowEnabled = true', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      { id: 1, parentId: 0, name: 'name 1' },
      { id: 2, parentId: 1, name: 'name 2' },
      { id: 3, parentId: 0, name: 'name 3' },
    ],
    keyExpr: 'id',
    parentId: 'parentId',
    focusedRowEnabled: true,
    columns: [
      'id',
      {
        dataField: 'name',
        cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
      },
    ],
  });

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await treeList.apiFocus();

    await page.expect(treeList.getDataRow(0).element.focused)
      .ok();

    });
});
