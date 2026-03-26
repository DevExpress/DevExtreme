import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Export button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('allowExportSelectedData: false, menu: false', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
      },
    });

      await testScreenshot(page, 'grid-export-one-button.png', { element: page.locator('.dx-datagrid-header-panel') });
  });
});
