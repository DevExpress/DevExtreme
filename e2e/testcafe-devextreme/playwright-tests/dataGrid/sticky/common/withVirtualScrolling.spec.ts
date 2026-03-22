import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Fixed columns should display correctly when scrolling vertically quickly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(400, 15),
      height: 700,
      columnWidth: 100,
      showColumnLines: true,
      scrolling: {
        mode: 'virtual',
        // @ts-expect-error private option
        updateTimeout: 3000,
      },
      customizeColumns(columns) {
        columns[0].fixed = true;

        columns[1].fixed = true;
        columns[1].fixedPosition = 'right';
        columns[2].fixed = true;
        columns[2].fixedPosition = 'right';
      },
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { y: 500 });
    await page.waitForTimeout(100);
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { y: 1000 });
    await page.waitForTimeout(100);
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { y: 1500 });
    await page.waitForTimeout(100);

    await testScreenshot(page, 'fixed_columns_with_virtual_scrolling_1.png', { element: page.locator('#container') });

    // waiting for size update
    await page.waitForTimeout(3000);

    await testScreenshot(page, 'fixed_columns_with_virtual_scrolling_2.png', { element: page.locator('#container') });

    // assert
  });
});
