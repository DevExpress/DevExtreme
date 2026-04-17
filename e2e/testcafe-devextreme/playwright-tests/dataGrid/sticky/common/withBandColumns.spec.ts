import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Band sticky columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [false, true].forEach((rtlEnabled) => {
    test(`Headers and filter row should display correctly after scrolling to the max right position when there is a grouped column (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field0: 1, field1: 1, field2: 1, field3: 1, field4: 1, field5: 1, field6: 1, field7: 1,
          },
        ],
        keyExpr: 'field0',
        width: 500,
        columnWidth: 100,
        columns: [{
          dataField: 'field0',
          fixed: true,
          fixedPosition: rtlEnabled ? 'right' : 'left',
        }, {
          caption: 'Band',
          fixed: true,
          fixedPosition: rtlEnabled ? 'right' : 'left',
          columns: [{
            dataField: 'field1',
            groupIndex: 0,
          }, 'field2'],
        }, 'field3', 'field4', 'field5', 'field6', 'field7'],
        showBorders: true,
        filterRow: { visible: true },
        rtlEnabled,
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: rtlEnabled ? 0 : 10000 });
      await testScreenshot(page, `T1279722_band_sticky_columns-headers_with_filter_row_and_grouped_column_(rtl=${rtlEnabled}).png`, { element: page.locator('#container') });
    });
  });
});
