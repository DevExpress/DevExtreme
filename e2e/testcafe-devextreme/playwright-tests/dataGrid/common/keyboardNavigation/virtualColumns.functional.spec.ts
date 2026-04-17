import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, unknown> = {};
    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }
    items.push(item);
  }
  return items;
};

test.describe.skip('Virtual Columns.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('DataGrid should scroll to the first cell of the next row and focus it when navigating with Tab key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page);

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 10000 }));
    await page.waitForTimeout(200);

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBeGreaterThan(0);

    const lastCellInFirstRow = page.locator('.dx-data-row').first().locator('td').last();
    await lastCellInFirstRow.click();

    const isFocused = await lastCellInFirstRow.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const scrollLeftAfter = await dataGrid.getScrollLeft();
    expect(scrollLeftAfter).toBe(0);

    const firstCellInSecondRow = page.locator('.dx-data-row').nth(1).locator('td').first();
    const isFocusedAfter = await firstCellInSecondRow.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocusedAfter).toBe(true);
  });

  test('DataGrid should scroll to the last cell of the previous row and focus it when navigating with Shift+Tab keys', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page);

    const firstCellInSecondRow = page.locator('.dx-data-row').nth(1).locator('td').first();
    await firstCellInSecondRow.click();

    const isFocused = await firstCellInSecondRow.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(200);

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBeGreaterThan(0);

    const lastCellInFirstRow = page.locator('.dx-data-row').first().locator('td').last();
    const isFocusedAfter = await lastCellInFirstRow.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocusedAfter).toBe(true);
  });

  test('DataGrid should scroll to the next virtual cell and focus it when navigating with Tab key (rtlEnabled: false, useNative: false)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      rtlEnabled: false,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
    });

    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 4);
      $(cell).trigger($.Event('dxpointerdown'));
    });

    await page.waitForTimeout(100);

    const cell4Focused = await dataGrid.getDataCell(0, 4).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell4Focused).toBe(true);

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBe(100);

    const cell5Focused = await dataGrid.getDataCell(0, 5).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell5Focused).toBe(true);
  });

  test('DataGrid should scroll to the next virtual cell and focus it when navigating with Right key (rtlEnabled: false, useNative: false)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 500,
      rtlEnabled: false,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
    });

    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 4);
      $(cell).trigger($.Event('dxpointerdown'));
    });

    await page.waitForTimeout(100);

    const cell4Focused = await dataGrid.getDataCell(0, 4).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell4Focused).toBe(true);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const scrollLeft = await dataGrid.getScrollLeft();
    expect(scrollLeft).toBe(100);

    const cell5Focused = await dataGrid.getDataCell(0, 5).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell5Focused).toBe(true);
  });
});
