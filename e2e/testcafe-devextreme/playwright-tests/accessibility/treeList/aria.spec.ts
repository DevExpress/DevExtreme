import { test, expect } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const treeListData = [
  { Task_ID: 1, Task_Subject: 'Plans 2015', Task_Parent_ID: 0 },
  { Task_ID: 2, Task_Subject: 'Health Insurance', Task_Parent_ID: 1 },
  { Task_ID: 3, Task_Subject: 'New Brochures', Task_Parent_ID: 1 },
];

test.describe('Accessibility - TreeList aria', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('aria expanded toggle', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: treeListData,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      expandedRowKeys: [1],
      columns: ['Task_Subject', 'Task_ID'],
    });

    const container = page.locator('#container');
    await expect(container.locator('[aria-label]').first()).toBeVisible();
    await a11yCheck(page, {}, '#container');
  });
});
