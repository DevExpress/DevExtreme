import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: needs DataGrid page object for getRows, getContainer, getHeadersContainer, getRowsView, getFixedDataRow, verifyGridStyles
test.describe('Grouping Panel - check borders and backgrounds with various options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Should have correct applied styles with rowAlternationEnabled: true, showColumnLines: true, showRowLines: true, showBorders: true, hasFixedColumn: false, hasMasterDetail: false', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });
});
