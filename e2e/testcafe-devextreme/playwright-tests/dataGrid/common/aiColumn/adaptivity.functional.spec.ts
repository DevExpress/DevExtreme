import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.Adaptivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The AI column should be hidden when columnHidingEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      width: 350,
      columnWidth: 100,
      columnHidingEnabled: true,
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

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const fourthHeaderCell = page.locator('.dx-header-row').nth(0).locator('td').nth(3);

    await expect(fourthHeaderCell).toHaveText('AI Column');
    await expect(fourthHeaderCell).toBeHidden();

    await expect(page.locator('.dx-data-row').nth(0).locator('.dx-command-adaptive')).toBeVisible();
  });
});
