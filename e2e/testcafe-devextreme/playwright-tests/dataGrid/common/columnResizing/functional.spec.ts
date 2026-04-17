import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const bandColumnDataSource = [{
  ID: 1,
  Country: 'Brazil',
  Area: 8515767,
  Population_Urban: 0.85,
  Population_Rural: 0.15,
  Population_Total: 205809000,
}];

const bandColumnConfig = {
  dataSource: bandColumnDataSource,
  keyExpr: 'ID',
  allowColumnResizing: true,
  columnResizingMode: 'widget',
  width: 500,
  columns: [
    {
      dataField: 'ID',
      fixed: true,
      allowReordering: false,
      width: 50,
    },
    {
      caption: 'Population',
      columns: [
        {
          dataField: 'Country',
          showWhenGrouped: true,
          width: 100,
          groupIndex: 0,
        },
        { dataField: 'Area' },
        { dataField: 'Population_Total' },
        { dataField: 'Population_Urban' },
        { dataField: 'Population_Rural' },
      ],
    },
  ],
};

test.describe.skip('Column resizing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1314667
  test('Resize indicator is moved when resizing a grouped column if showWhenGrouped is set to true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', bandColumnConfig);

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.resizeHeader(3, 30, true);

    const cellWidth = await page.evaluate(() => {
      const cell = document.querySelector('.dx-header-row:nth-child(2) td:nth-child(1)') as HTMLElement;
      return cell ? cell.offsetWidth : 0;
    });

    expect(cellWidth).toBeGreaterThanOrEqual(128);
    expect(cellWidth).toBeLessThanOrEqual(130);
  });

  // T1317039
  test('Columns should not be resized from band area', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', bandColumnConfig);

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await page.evaluate(({ columnIndex, offset }: { columnIndex: number; offset: number }) => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const columnHeadersView = instance.getView('columnHeadersView');
      const $header = $(columnHeadersView.getHeaderElement(columnIndex));
      const headerOffset = ($header as any).offset();

      const triggerPointerEvent = ($element: any, eventName: string, x: number, y: number) => {
        $element.trigger($.Event(eventName, {
          pageX: x,
          pageY: y,
          pointers: [{ pointerId: 1 }],
        }));
      };

      triggerPointerEvent($(document), 'dxpointermove', headerOffset.left, headerOffset.top - 10);
      triggerPointerEvent($('#container'), 'dxpointerdown', headerOffset.left, headerOffset.top - 10);
      triggerPointerEvent($(document), 'dxpointermove', headerOffset.left + offset, headerOffset.top - 10);
      triggerPointerEvent($(document), 'dxpointerup', headerOffset.left + offset, headerOffset.top - 10);
    }, { columnIndex: 3, offset: 30 });

    const cellWidth = await page.evaluate(() => {
      const cells = document.querySelectorAll('.dx-header-row');
      const secondHeaderRow = cells[1];
      if (!secondHeaderRow) return 0;
      const firstCell = secondHeaderRow.querySelector('td') as HTMLElement;
      return firstCell ? firstCell.offsetWidth : 0;
    });

    expect(cellWidth).toBeGreaterThanOrEqual(98);
    expect(cellWidth).toBeLessThanOrEqual(100);
  });
});
