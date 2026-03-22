import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Resize columns - nextColumn mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const scrollTo = ClientFunction((x = 0, y = 0) => {
    window.scrollTo(x, y);
  });
  [false, true].forEach((rtlEnabled) => {

  test(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: getData(5, 25),
        rtlEnabled,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'nextColumn',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';
        },
      });

      // arrange
          const columnIndex = rtlEnabled ? 23 : 1;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      // act
      await dataGrid.resizeHeader(columnIndex, 100);

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_1_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });

      // act
      await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: scrollLeft });

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_2_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });

      // assert
    });
    // TODO: .after() block removed
});
