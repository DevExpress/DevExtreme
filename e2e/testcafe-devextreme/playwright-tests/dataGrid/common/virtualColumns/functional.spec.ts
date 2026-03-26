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

  test.skip('DataGrid should not scroll back to the focused cell after horizontal scrolling to the right when columnRenderingMode is virtual', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (t.ok, t.eql, locator.focused, dataGrid.getScrollLeft)
    await createWidget(page, 'dxDataGrid', {
      width: 450,
      dataSource: generateData(10, 30),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

      await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).click();
      expect(await page.locator('.dx-data-row').nth(0).locator('td').nth(0).focused);
      await t.ok();

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 50 });

    expect(await dataGrid.getScrollLeft()).toBe(50);

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 100 });

    expect(await dataGrid.getScrollLeft());
    await t.eql(100);
  });
});
