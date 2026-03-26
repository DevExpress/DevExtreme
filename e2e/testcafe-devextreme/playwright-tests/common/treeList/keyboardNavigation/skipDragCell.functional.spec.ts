import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';
  const DATA_SOURCE = [
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
  ];

  const createTreeList = async () => createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    columns: ['id', 'columnA', 'columnB'],
    rowDragging: {
      allowReordering: true,
    },
    sorting: {
      mode: 'none',
    },
  });

  const createTreeListRenderAsyncWithButtons = async () => createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    columns: ['id', 'columnA', 'columnB', { type: 'buttons' }],
    rowDragging: {
      allowReordering: true,
    },
    sorting: {
      mode: 'none',
    },
    renderAsync: true,
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 1);
    const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .expect(expectedFocusedCell.isFocused)
      .ok();

    });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress'
    + ' with buttons column and renderAsync: true', async ({ page }) => {
    await createTreeListRenderAsyncWithButtons();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 1);
    const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(4);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .expect(expectedFocusedCell.isFocused)
      .ok();

    });

  test('The drag cell should be skipped when navigating to the header cell by shift+tab keypress', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);
    const cellToStartNavigation = treeList.getDataCell(0, 1);

    await cellToStartNavigation.click()
      .pressKey('shift+tab')
      .expect(expectedFocusedCell.isFocused).ok();

    });

  test('The drag cell should be skipped when navigating to a next row by tab keypress', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(1, 1);
    const cellToStartNavigation = treeList.getDataCell(0, 3);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .expect(expectedFocusedCell.isFocused).ok();

    });

  test('The drag cell should be skipped when navigating to a previous row by shift+tab keypress', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 3);
    const cellToStartNavigation = treeList.getDataCell(1, 1);

    await cellToStartNavigation.click()
      .pressKey('shift+tab')
      .expect(expectedFocusedCell.isFocused).ok();

    });

  test('The drag cell shouldn\'t be focused when the next cell is focused and the left arrow key pressed', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 1);

    await expectedFocusedCell.click()
      .pressKey('left')
      .expect(expectedFocusedCell.isFocused).ok();

    });
});
