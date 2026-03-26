import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Column resizing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1314667

  test.skip('DataGrid – Resize indicator is moved when resizing a grouped column if showWhenGrouped is set to true', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (dataGrid undefined, t.within, locator.clientWidth)
    await createWidget(page, 'dxDataGrid', {
        dataSource: [{
          ID: 1,
          Country: 'Brazil',
          Area: 8515767,
          Population_Urban: 0.85,
          Population_Rural: 0.15,
          Population_Total: 205809000,
        }],
        keyExpr: 'ID',
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        width: 500,
        columns: [
          {
            dataField: 'ID',
            fixed: true,
            allowReordering: false,
            width: 50,
          },

          {
            caption: 'Population',
            columns: [
              {
                dataField: 'Country',
                showWhenGrouped: true,
                width: 100,
                groupIndex: 0,
              },
              { dataField: 'Area' },
              { dataField: 'Population_Total' },
              { dataField: 'Population_Urban' },
              { dataField: 'Population_Rural' },
            ],
          },
        ],
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await dataGrid.resizeHeader(3, 30, false);

    expect(await page.locator('.dx-header-row').nth(1).locator('td').nth(0).clientWidth);
    await t.within(128, 130);
  });
});
