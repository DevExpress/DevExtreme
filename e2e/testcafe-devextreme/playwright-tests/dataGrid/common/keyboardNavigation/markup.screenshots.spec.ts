import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  fixture
    .disablePageReloads`Keyboard Navigation - screenshots`
    .page(url(__dirname, '../../../container.html'));

  test('Focused cells should look correctly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1,
          columnA: 'A_0',
          columnB: 'B_0',
        },
        {
          id: 2,
          columnA: 'A_1',
          columnB: 'B_1',
        },
        {
          id: 3,
          columnA: 'A_2',
          columnB: 'B_2',
        },
      ],
      keyExpr: 'id',
      columns: ['id', 'columnA', 'columnB'],
      sorting: {
        mode: 'none',
      },
    });

      const headerCellToFocus = page.locator('.dx-header-row').nth(0).locator('td').nth(0);
    const dataCellToFocus = page.locator('.dx-data-row').nth(0).locator('td').nth(0);

    await (headerCellToFocus.element).click()
      .pressKey('tab');
    await testScreenshot(page, 'data-grid_keyboard-navigation-header-cell-focused.png');

    await (dataCellToFocus.element).click()
      .pressKey('tab');
    await testScreenshot(page, 'data-grid_keyboard-navigation-data-cell-focused.png');
  });
});
