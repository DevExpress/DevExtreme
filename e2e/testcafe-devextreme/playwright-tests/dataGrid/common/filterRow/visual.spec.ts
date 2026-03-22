import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FilterRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Filter row\'s height should be adjusted by content (T1072609)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columns: [{
        dataField: 'Date',
        dataType: 'date',
        width: 140,
        selectedFilterOperation: 'between',
        filterValue: [new Date(2022, 2, 28), new Date(2022, 2, 29)],
      }],
      filterRow: { visible: true },
      wordWrapEnabled: true,
      showBorders: true,
    });

      await testScreenshot(page, 'T1072609.png', { element: page.locator('#container') });
  });
});
