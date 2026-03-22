import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

const borderConfigs = [
  { showColumnLines: true, showBorders: true },
  { showColumnLines: false, showBorders: true },
  { showColumnLines: false, showBorders: false },
  { showColumnLines: true, showBorders: false },
];

test.describe('FixedColumns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  borderConfigs.forEach(({ showColumnLines, showBorders }) => {
    [true, false].forEach((rtlEnabled) => {

  test(`Sticky columns with left position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          dataSource: getData(5, 25),
          width: 884,
          showColumnLines,
          showBorders,
          rtlEnabled,
          columnAutoWidth: true,
          customizeColumns: (columns) => {
            columns[5].fixed = true;
            columns[5].fixedPosition = 'left';
            columns[6].fixed = true;
            columns[6].fixedPosition = 'left';
          },
        });

        // arrange
              expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

        await testScreenshot(page, `left-position-1(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });

        // act
        await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: rtlEnabled ? 0 : 10000 });

        await testScreenshot(page, `left-position-2(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });
      });
});
