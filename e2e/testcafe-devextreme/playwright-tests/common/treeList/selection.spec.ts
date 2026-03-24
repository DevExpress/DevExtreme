import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, TreeList } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('TreeList with selection and boolean data in first column should render right (T1109666)', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: [
        { id: 1, parentId: 0, value: true, value1: 'text' },
        { id: 2, parentId: 1, value: true, value1: 'text' },
        { id: 3, parentId: 2, value: true, value1: 'text' },
        { id: 4, parentId: 3, value: true, value1: 'text' },
        { id: 5, parentId: 4, value: true, value1: 'text' },
        { id: 6, parentId: 5, value: true, value1: 'text' },
        { id: 7, parentId: 6, value: true, value1: 'text' },
        { id: 8, parentId: 7, value: true, value1: 'text' },
      ],
      height: 300,
      width: 400,
      autoExpandAll: true,
      columns: [{
        dataField: 'value',
        width: 100,
      }, {
        dataField: 'value1',
      }],
      selection: {
        mode: 'multiple',
      },
    });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1109666-selection', { element: treeList });
  });

  test('TreeList restore selection after the search panel has cleared (T1264312)', async ({ page }) => {
    const tasksData = [
      {
        Task_ID: 1, Task_Subject: 'Plans 2015', Task_Parent_ID: 0,
      },
      {
        Task_ID: 2, Task_Subject: 'Health Insurance', Task_Parent_ID: 1,
      },
      {
        Task_ID: 3, Task_Subject: 'New Brochures', Task_Parent_ID: 1,
      },
      {
        Task_ID: 4, Task_Subject: 'Update NDA', Task_Parent_ID: 1,
      },
      {
        Task_ID: 5, Task_Subject: 'Training', Task_Parent_ID: 2,
      },
    ];

    await createWidget(page, 'dxTreeList', {
      dataSource: tasksData,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      autoExpandAll: true,
      height: 400,
      searchPanel: {
        visible: true,
      },
      selection: {
        mode: 'multiple',
        recursive: true,
      },
      columns: [
        { dataField: 'Task_Subject' },
      ],
    });

    const treeList = new TreeList(page);

    const firstCheckbox = treeList.getDataRow(0).element.locator('.dx-select-checkbox');
    await firstCheckbox.click();

    const searchInput = page.locator('.dx-searchbox .dx-texteditor-input');
    await searchInput.fill('Health');
    await page.waitForTimeout(500);

    await searchInput.fill('');
    await page.waitForTimeout(500);

    const expandButton = treeList.getDataRow(0).getExpandButton();
    await expandButton.click();

    const selectedCheckboxes = page.locator('.dx-select-checkbox.dx-checkbox-checked');
    const count = await selectedCheckboxes.count();
    expect(count).toBeGreaterThan(0);
  });
});
