import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const getClientWidth = (
  dataGrid: DataGrid,
  rowIndex: number,
  columnIndex: number,
): Promise<number> => dataGrid
  .getHeaders().getHeaderRow(rowIndex).getHeaderCell(columnIndex).element
  .evaluate((element) => element.clientWidth);

// The pointer goes down in the band header above the column's border.
const tryResizeHeaderInBandArea = (
  dataGrid: DataGrid,
  columnIndex: number,
  offset: number,
): Promise<void> => dataGrid.element.evaluate((element, { index, delta }) => {
  const triggerPointerEvent = (
    $element: JQuery<any>,
    eventName: string,
    x: number,
    y: number,
  ): void => {
    $element
      .trigger($.Event(eventName, {
        pageX: x,
        pageY: y,
        pointers: [{ pointerId: 1 }],
      }));
  };

  const gridInstance = ($(element) as any).dxDataGrid('instance');
  const $gridElement = $(gridInstance.element());
  const columnHeadersView = gridInstance.getView('columnHeadersView');
  const $header = $(columnHeadersView.getHeaderElement(index));
  const headerOffset = $header.offset() as JQuery.Coordinates;

  triggerPointerEvent($(document), 'dxpointermove', headerOffset.left, headerOffset.top - 10);
  triggerPointerEvent($gridElement, 'dxpointerdown', headerOffset.left, headerOffset.top - 10);
  triggerPointerEvent($(document), 'dxpointermove', headerOffset.left + delta, headerOffset.top - 10);
  triggerPointerEvent($(document), 'dxpointerup', headerOffset.left + delta, headerOffset.top - 10);
}, { index: columnIndex, delta: offset });

test.describe('Column resizing', () => {
  // T1314667
  test('DataGrid – Resize indicator is moved when resizing a grouped column if showWhenGrouped is set to true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Rural: 0.15,
        Population_Total: 205809000,
      }],
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.resizeHeader(3, 30, false);

    await expect.poll(() => getClientWidth(dataGrid, 1, 0)).toBeGreaterThanOrEqual(128);
    await expect.poll(() => getClientWidth(dataGrid, 1, 0)).toBeLessThanOrEqual(130);
  });

  // T1329677
  test('DataGrid - column width changed via columnOption should be applied immediately, without a repaint (T1329677)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ Task_Subject: 'Test' }],
      width: 1000,
      columnAutoWidth: true,
      columns: [
        { dataField: 'Task_Subject' },
        { dataField: 'Task_Assigned_Employee_ID', caption: 'Assigned' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiColumnOption('Task_Assigned_Employee_ID', 'width', 700);

    const assignedColumnWidth = await getClientWidth(dataGrid, 0, 1);

    expect(
      assignedColumnWidth,
      'columnOption width should be applied immediately, without an explicit repaint',
    ).toBeGreaterThanOrEqual(700 - 1);
    expect(
      assignedColumnWidth,
      'columnOption width should be applied immediately, without an explicit repaint',
    ).toBeLessThanOrEqual(700 + 1);
  });

  // T1329677
  test('DataGrid - other column width should be updated immediately when another column width is changed via columnOption (T1329677)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        Col1: 'Test 1',
        Col2: 'Test 2',
        Col3: 'Test 3',
        Col4: 'Test 4',
      }],
      width: 400,
      columnAutoWidth: true,
      columns: [
        { dataField: 'Col1' },
        { dataField: 'Col2' },
        { dataField: 'Col3' },
        { dataField: 'Col4' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const getFirstColumnWidth = (): Promise<number> => dataGrid.getDataCell(0, 0).element
      .evaluate((element) => element.clientWidth);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const firstColumnOldWidth = await getFirstColumnWidth();

    await dataGrid.apiColumnOption('Col2', 'width', 200);

    const firstColumnNewWidth = await getFirstColumnWidth();

    expect(firstColumnOldWidth, 'first column width should be changed').not.toBe(firstColumnNewWidth);
  });

  // T1317039
  test('DataGrid – Columns should not be resized from band area (T1317039)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Rural: 0.15,
        Population_Total: 205809000,
      }],
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await tryResizeHeaderInBandArea(dataGrid, 3, 30);

    await expect.poll(() => getClientWidth(dataGrid, 1, 0)).toBeGreaterThanOrEqual(98);
    await expect.poll(() => getClientWidth(dataGrid, 1, 0)).toBeLessThanOrEqual(100);
  });
});
