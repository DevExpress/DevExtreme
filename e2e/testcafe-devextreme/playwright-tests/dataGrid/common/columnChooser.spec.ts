import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Column chooser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['dragAndDrop', 'select'].forEach((mode: any) => {
    test(`Column chooser screenshot in mode=${mode}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(20, 3),
        height: 400,
        showBorders: true,
        columns: [{
          dataField: 'field_0',
          dataType: 'string',
        }, {
          dataField: 'field_1',
          dataType: 'string',
        }, {
          dataField: 'field_2',
          dataType: 'string',
          visible: false,
        }],
        columnChooser: {
          enabled: true,
          mode,
        },
      });

      await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').showColumnChooser());

      expect(await page.locator('.dx-datagrid-column-chooser').isVisible()).toBeTruthy();

      await testScreenshot(page, `column-chooser-${mode}-mode.png`, { element: page.locator('#container') });
    });
  });
});
