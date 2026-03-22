import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../playwright-helpers';
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

test.describe('Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  async function getMaxRightOffset(dataGrid: DataGrid): Promise<number> {
    const scrollWidth = await dataGrid.getScrollWidth();
    const rowsViewWidth = await dataGrid.getRowsView().clientWidth;
    return scrollWidth - rowsViewWidth;
  }

  async function getRightScrollOffset(dataGrid: DataGrid): Promise<number> {
    const maxHorizontalOffset = await getMaxRightOffset(dataGrid);
    const scrollLeft = await dataGrid.getScrollLeft();
    return maxHorizontalOffset - scrollLeft;
  }

  function getData(rowCount: number, colCount: number): Record<string, string>[] {
    const items: Record<string, string>[] = [];
    for (let i = 0; i < rowCount; i += 1) {
      const item: Record<string, string> = {};
      for (let j = 0; j < colCount; j += 1) {
        item[`field_${j}`] = `val_${i}_${j}`;
      }
      items.push(item);
    }

    return items;
  }

  async function getTestLoadCount(page: any): Promise<number> {
    return ClientFunction(() => (window as any).testLoadCount as number)();
  }

  );

  test('DataGrid should set the scrollbar position to the left on resize (T934842)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      columnWidth: 100,
    });

      // act
    await page.setViewportSize({ width: 900, height: 250 });

    // assert
    expect(await dataGrid.getScrollLeft()).toBe(0);

    // act
    await page.setViewportSize({ width: 700, height: 250 });

    // assert
    expect(await dataGrid.getScrollLeft()).toBe(0);

    // act
    await page.setViewportSize({ width: 600, height: 250 });

    // assert
    expect(await dataGrid.getScrollLeft()).toBe(0);
  });
    // TODO: .after() block removed
});
