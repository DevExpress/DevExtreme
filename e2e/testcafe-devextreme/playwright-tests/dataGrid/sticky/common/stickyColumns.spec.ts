import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('The simulated scrollbar should display correctly when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      columnAutoWidth: true,
      scrolling: {
        useNative: false,
      },
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });

    // arrange
      const scrollbarVerticalThumbTrack = page.locator('.dx-scrollbar-horizontal .dx-scrollable-scroll');

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await (scrollbarVerticalThumbTrack).hover();
    await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_1.png', { element: page.locator('#container') });

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 1500 });

    await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_2.png', { element: page.locator('#container') });
  });
    // TODO: .after() block removed
});
