import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Integration_DataGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((useNative) => {
    test(`The rows in the fixed column are not aligned when the grid is encapsulated inside a <td> element, useNative: ${useNative} (T1071725)`, async ({ page }) => {

      await setAttribute(page, '#container', 'style', 'width: 300px; height: 200px;');

      await appendElementTo(page, '#container', 'table', 'outerTable', {});
      await appendElementTo(page, '#outerTable', 'tr', 'outerTableTR', {});
      await appendElementTo(page, '#outerTableTR', 'td', 'outerTableTD', {});
      await appendElementTo(page, '#outerTableTR', 'div', 'grid', {});

      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: 'test1', field2: 'test2',
          },
        ],
        scrolling: {
          useNative,
        },
        width: 300,
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        columns: [
          { dataField: 'field1', fixed: true },
          { dataField: 'field2' },
        ],
        hoverStateEnabled: true,
      }, '#grid');


      await testScreenshot(page, `Grid with scrollable wrapped in td,useNative=${useNative}.png`, { element: '#container' });

    });
  });
});
