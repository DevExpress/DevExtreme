import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Ai Column.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';

  test('Default render', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Name 1', value: 10,
      },
      {
        id: 2, parentId: 1, name: 'Name 2', value: 20,
      },
      {
        id: 3, parentId: 0, name: 'Name 3', value: 30,
      },
      {
        id: 4, parentId: 3, name: 'Name 4', value: 40,
      },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    expandedRowKeys: [3],
    columns: [
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
      {
        type: 'ai',
        caption: 'AI Column',
      },
    ],
  });

    // arrange, act
    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await testScreenshot(page, 'treelist__ai-column__default.png', { element: treeList.element });

    // assert

    });

  test('AI Column when multiple selection is enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Name 1', value: 10,
      },
      {
        id: 2, parentId: 1, name: 'Name 2', value: 20,
      },
      {
        id: 3, parentId: 0, name: 'Name 3', value: 30,
      },
      {
        id: 4, parentId: 3, name: 'Name 4', value: 40,
      },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    expandedRowKeys: [3],
    selection: {
      mode: 'multiple',
    },
    columns: [
      {
        type: 'ai',
        caption: 'AI Column',
      },
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
    ],
  });

    // arrange, act
    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await testScreenshot(page, 'treelist__ai-column__multiple-selection.png', { element: treeList.element });

    // assert

    });
});
