import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('SearchPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Items are shown in the original order after search is applied - T1274434 - 1', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    showBorders: true,
    showRowLines: true,
    expandedRowKeys: [1],
    searchPanel: {
      visible: true,
    },
    columns: ['text'],
    dataSource: [
      { id: 1, parentId: 0, text: 'parent1' },
      { id: 2, parentId: 0, text: 'test1' },
      { id: 3, parentId: 1, text: 'test2' },
    ],
  });

    const treeList = page.locator('#container');
    await treeList.apiSearchByText('test');

    await page.expect((await treeList.apiGetVisibleRows()).length)
      .eql(3);

    await page.expect(treeList.apiGetCellValue(0, 0))
      .eql('parent1');

    await page.expect(treeList.apiGetCellValue(1, 0))
      .eql('test2');

    await page.expect(treeList.apiGetCellValue(2, 0))
      .eql('test1');

    });

  test('Items are shown in the original order after search is applied - T1274434 - 2', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    showBorders: true,
    showRowLines: true,
    expandedRowKeys: [1],
    searchPanel: {
      visible: true,
    },
    columns: ['text'],
    dataSource: [
      { id: 1, parentId: 0, text: 'parent1' },
      { id: 2, parentId: 0, text: 'test1' },
      { id: 3, parentId: 1, text: 'test2' },
      { id: 4, parentId: 0, text: 'parent2' },
    ],
  });

    const treeList = page.locator('#container');
    await treeList.apiSearchByText('test');

    await page.expect((await treeList.apiGetVisibleRows()).length)
      .eql(3);

    await page.expect(treeList.apiGetCellValue(0, 0))
      .eql('parent1');

    await page.expect(treeList.apiGetCellValue(1, 0))
      .eql('test2');

    await page.expect(treeList.apiGetCellValue(2, 0))
      .eql('test1');

    });
});
