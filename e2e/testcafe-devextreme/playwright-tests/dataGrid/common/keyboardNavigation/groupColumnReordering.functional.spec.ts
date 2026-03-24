import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: needs DataGrid page object for getGroupPanel
test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('The column should be grouped when pressing Ctrl + G if grouping.contextMenuEnabled is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      grouping: {
        contextMenuEnabled: false,
      },
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });

    const firstVisibleHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(0);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+g');

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });
});
