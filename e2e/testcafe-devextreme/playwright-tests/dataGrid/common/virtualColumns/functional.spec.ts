import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
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
      const item: Record<string, unknown> = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
      }
      items.push(item);
    }
    return items;
  };

  test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the right when columnRenderingMode is virtual', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      width: 450,
      dataSource: generateData(10, 30),
      columnWidth: 100,
      scrolling: { columnRenderingMode: 'virtual' },
    });

    await dataGrid.getDataCell(0, 0).click();
    const isFocusedAfterClick = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 0);
      return document.activeElement === cell;
    });
    expect(isFocusedAfterClick).toBe(true);

    await dataGrid.scrollTo({ x: 50 });
    expect(await dataGrid.getScrollLeft()).toBe(50);

    await dataGrid.scrollTo({ x: 100 });
    expect(await dataGrid.getScrollLeft()).toBe(100);
  });

  test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the left when columnRenderingMode is virtual', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      width: 450,
      dataSource: generateData(10, 50),
      columnWidth: 100,
      loadingTimeout: null,
      scrolling: { columnRenderingMode: 'virtual' },
    });

    await dataGrid.scrollTo({ x: 1500 });

    await dataGrid.getDataCell(0, 18).click();
    const isFocusedAfterClick = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const cell = instance.getCellElement(0, 18);
      return document.activeElement === cell;
    });
    expect(isFocusedAfterClick).toBe(true);

    await dataGrid.scrollTo({ x: 1200 });
    expect(await dataGrid.getScrollLeft()).toBe(1200);

    await dataGrid.scrollTo({ x: 1000 });
    expect(await dataGrid.getScrollLeft()).toBe(1000);

    await dataGrid.scrollTo({ x: 800 });
    await page.waitForTimeout(200);
    expect(await dataGrid.getScrollLeft()).toBe(800);
  });
});
