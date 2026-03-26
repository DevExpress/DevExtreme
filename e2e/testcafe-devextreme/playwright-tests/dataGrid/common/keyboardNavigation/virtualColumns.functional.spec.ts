import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Virtual Columns.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};

      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
      }

      items.push(item);
    }

    return items;
  };

  test.skip('DataGrid should scroll to the first cell of the next row and focus it when navigating with Tab key', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (t.ok, t.eql, locator.focused, dataGrid.getScrollLeft)
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    // arrange
      // assert
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    // assert
    expect(await dataGrid.getScrollLeft());
    await t.eql(1500);
    expect(await page.locator('.dx-data-row').nth(0).locator('td').nth(19).exists);
    await t.ok();

    // act
    await (page.locator('.dx-data-row').nth(0).locator('td').nth(19)).click();

    // assert
    expect(await page.locator('.dx-data-row').nth(0).locator('td').nth(19).focused);
    await t.ok();

    // act
    await page.keyboard.press('tab');

    // assert
    expect(await dataGrid.getScrollLeft());
    await t.eql(0);
    expect(await page.locator('.dx-data-row').nth(1).locator('td').nth(0).focused);
    await t.ok();
  });
});
