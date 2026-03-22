import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Group footer summary should be focusable', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
      ],
      columns: [
        'id',
        {
          dataField: 'value',
          groupIndex: 0,
        },
      ],
      summary: {
        groupItems: [
          {
            column: 'id',
            summaryType: 'count',
            showInGroupFooter: true,
          },
        ],
      },
    });

      await (page.locator('.dx-data-row').nth(4).locator('td').nth(1)).click();
    await page.keyboard.press('tab');

    await testScreenshot(page, 'group-summary-focused.png', { element: page.locator('#container') });
  });
});
