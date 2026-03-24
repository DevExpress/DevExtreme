import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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
  const createTreeList = async () => createWidget(page, 'dxTreeList', {
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
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 0);
    const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .expect(expectedFocusedCell.isFocused)
      .ok();

    });

  test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const expectedFocusedCell = treeList.getDataCell(0, 0);
    const cellToStartNavigation = treeList.getDataCell(0, 1);

    await cellToStartNavigation.click()
      .pressKey('shift+tab')
      .pressKey('shift+tab')
      .pressKey('shift+tab')
      .expect(expectedFocusedCell.isFocused)
      .ok();

    });

  test('First custom button inside custom buttons cell should be focused on tab navigation', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
    const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .pressKey('tab')
      .expect(expectedFocusedButton.focused)
      .ok();

    });

  test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_2');
    const cellToStartNavigation = treeList.getDataCell(0, 1);

    await cellToStartNavigation.click()
      .pressKey('shift+tab')
      .expect(expectedFocusedButton.focused)
      .ok();

    });

  test('Custom button inside custom buttons cell should be clickable by pressing enter key', async ({ page }) => {
    await createTreeList();

    const treeList = new TreeList(TREE_LIST_SELECTOR);
    const customButtonsCell = treeList.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
    const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.click()
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('enter')
      .expect(expectedFocusedButton.withAttribute('has-been-clicked').exists)
      .ok();

    });
});
