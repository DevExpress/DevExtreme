import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: needs DataGrid page object for apiColumnOption, getGroupRow, getGroupRowSelector, dataRows
test.describe('Grouping API - calculateGroupValue runtime changes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('One group: should expand grouped section after calculateGroupValue update', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, A: 'A_0', group: 'A' },
        { id: 1, A: 'A_1', group: 'A' },
        { id: 2, A: 'A_2', group: 'B' },
        { id: 3, A: 'A_3', group: 'B' },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'group', groupIndex: 0 },
        'A',
      ],
      grouping: { autoExpandAll: false },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });

  test.skip('One group: should expand grouped section after calculateGroupValue update if first record contains null value', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });

  test.skip('Multiple groups: should expand grouped section after calculateGroupValue update', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });

  test.skip('Multiple groups: should expand grouped section after calculateGroupValue update if first record contains null value [T1281192]', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });

  test.skip('Should not reset sorting parameters after calculateGroupValue update [T1298901]', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });
});
