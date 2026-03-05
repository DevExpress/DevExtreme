import DataGrid from 'devextreme-testcafe-models/dataGrid';

import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Column resizing`
  .page(url(__dirname, '../../../container.html'));

// T1314667
test('DataGrid – Resize indicator is moved when resizing a grouped column if showWhenGrouped is set to true', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.resizeHeader(3, 30, false);

  await t
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element.clientWidth)
    .within(128, 130);
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

const tryResizeHeaderInBandArea = (
  dataGrid: DataGrid,
  columnIndex: number,
  offset: number,
): Promise<void> => {
  const { getInstance } = dataGrid;

  const triggerPointerEvent = ($element: JQuery<any>, eventName: string, x: number, y: number) => {
    $element
      .trigger($.Event(eventName, {
        pageX: x,
        pageY: y,
        pointers: [{ pointerId: 1 }],
      }));
  };

  return ClientFunction(
    () => {
      const gridInstance = getInstance() as any;
      const $gridElement = $(gridInstance.element());
      const columnHeadersView = gridInstance.getView('columnHeadersView');
      const $header = $(columnHeadersView.getHeaderElement(columnIndex));
      const headerOffset = $header.offset();

      triggerPointerEvent($(document), 'dxpointermove', headerOffset.left, headerOffset.top - 10);
      triggerPointerEvent($gridElement, 'dxpointerdown', headerOffset.left, headerOffset.top - 10);
      triggerPointerEvent($(document), 'dxpointermove', headerOffset.left + offset, headerOffset.top - 10);
      triggerPointerEvent($(document), 'dxpointerup', headerOffset.left + offset, headerOffset.top - 10);
    },
    {
      dependencies: {
        getInstance,
        triggerPointerEvent,
        columnIndex,
        offset,
      },
    },
  )();
};

// T1317039
test('DataGrid – Columns should not be resized from band area (T1317039)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await tryResizeHeaderInBandArea(dataGrid, 3, 30);

  await t
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element.clientWidth)
    .within(98, 100);
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});
