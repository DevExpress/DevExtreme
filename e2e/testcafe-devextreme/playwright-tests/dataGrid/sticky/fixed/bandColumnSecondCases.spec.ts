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
      test(`Sticky column + Band sticky column + Sticky column: sticky positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtl = ${rtlEnabled})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          dataSource: getData(5, 25),
          width: 984,
          showColumnLines,
          showBorders,
          rtlEnabled,
          columnAutoWidth: true,
          customizeColumns: (columns: any[]) => {
            columns[1].fixed = true;
            columns[1].fixedPosition = 'sticky';

            columns.splice(2, 0, {
              caption: 'Band column 1',
              fixed: true,
              fixedPosition: 'sticky',
              columns: [{
                caption: 'Nested band column 1',
                columns: [
                  { dataField: 'field_11', name: 'child_1' },
                  { dataField: 'field_12', name: 'child_2' },
                ],
              }, { dataField: 'field_13', name: 'child_3' }, {
                caption: 'Nested band column 2',
                columns: [
                  { dataField: 'field_14', name: 'child_4' },
                  { dataField: 'field_15', name: 'child_5' },
                ],
              }],
            });

            columns[3].fixed = true;
            columns[3].fixedPosition = 'sticky';
          },
        });

        expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

        await testScreenshot(page, `band-columns-1-(case-8)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });

        await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: rtlEnabled ? 0 : 10000 });

        await testScreenshot(page, `band-columns-2-(case-8)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: page.locator('#container') });
      });
    });
  });
});
