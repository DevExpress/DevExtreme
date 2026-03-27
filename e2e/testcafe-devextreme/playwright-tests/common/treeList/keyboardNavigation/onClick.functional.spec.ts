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

  // T861048
  test('The row should be selected on click if less than half of a row is visible', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Name 1', age: 19,
      },
      {
        id: 2, parentId: 1, name: 'Name 2', age: 11,
      },
      {
        id: 3, parentId: 0, name: 'Name 3', age: 15,
      },
      {
        id: 4, parentId: 3, name: 'Name 4', age: 16,
      },
      {
        id: 5, parentId: 0, name: 'Name 5', age: 25,
      },
      {
        id: 6, parentId: 5, name: 'Name 6', age: 18,
      },
      {
        id: 7, parentId: 0, name: 'Name 7', age: 21,
      },
      {
        id: 8, parentId: 7, name: 'Name 8', age: 14,
      },
    ],
    height: 150,
    autoExpandAll: true,
    columns: ['name', 'age'],
    selection: {
      mode: 'multiple',
    },
  });

    const treeList = new TreeList(page);
    const dataRow = treeList.getDataRow(3);
    const checkbox = dataRow.element.locator('.dx-select-checkbox');

    await checkbox.click({ position: { x: 0, y: 0 } });
    await expect(dataRow.element).toHaveClass(/dx-selection/);

    });
});
