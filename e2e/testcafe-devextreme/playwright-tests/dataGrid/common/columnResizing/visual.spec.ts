import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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
  test('column separator should starts from the parent', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Rural: 0.15,
        Population_Total: 205809000,
        GDP_Agriculture: 0.054,
        GDP_Industry: 0.274,
        GDP_Services: 0.672,
        GDP_Total: 2353025,
      }],
      keyExpr: 'ID',
      columnWidth: 100,
      allowColumnResizing: true,
      showBorders: true,
      editing: {
        allowUpdating: true,
      },
      columns: ['Country', {
        dataField: 'Population_Total',
        visible: false,
      }, {
        caption: 'Population',
        columns: ['Population_Rural', {
          caption: 'By Sector',
          columns: ['GDP_Total', {
            caption: 'not resizable',
            dataField: 'ID',
            allowResizing: false,
          }, 'GDP_Agriculture', 'GDP_Industry'],
        }],
      }, {
        caption: 'Nominal GDP',
        columns: ['GDP_Total', 'Population_Urban'],
      }, 'Area'],
    });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    async function makeColumnSeparatorScreenshot(index: number) {
      await dataGrid.resizeHeader(index, 0, false);
      await testScreenshot(page, `column-separator-${index}.png`);

      await t.dispatchEvent(page.locator('#container'), 'mouseup');
    }

    await makeColumnSeparatorScreenshot(1);
    await makeColumnSeparatorScreenshot(2);
    await makeColumnSeparatorScreenshot(3);
    await makeColumnSeparatorScreenshot(4);
    await makeColumnSeparatorScreenshot(5);
    await makeColumnSeparatorScreenshot(6);
    await makeColumnSeparatorScreenshot(7);
    await makeColumnSeparatorScreenshot(8);
    await makeColumnSeparatorScreenshot(9);
  });
});
