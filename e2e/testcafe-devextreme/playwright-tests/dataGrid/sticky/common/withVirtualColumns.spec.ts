import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Virtual Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Fixed columns with sticky position should not work', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 100),
      columnWidth: 100,
      showColumnLines: true,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      customizeColumns(columns) {
        columns[0].fixed = true;
        columns[1].fixed = true;

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';
      },
    });

    // arrange, act
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'virtual_columns_with_sticky_columns_1.png', { element: page.locator('#container') });

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 150 });

    await testScreenshot(page, 'virtual_columns_with_sticky_columns_2.png', { element: page.locator('#container') });

    // assert
  });
});
