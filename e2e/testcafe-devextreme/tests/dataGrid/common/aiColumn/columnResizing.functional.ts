import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column.ColumnResizing`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

(['nextColumn', 'widget'] as const).forEach((columnResizingMode) => {
  test(`Column resizing should work when allowColumnResizing is true (columnResizingMode = ${columnResizingMode})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);

    await t.expect(dataGrid.isReady()).ok();

    // assert
    await t
      .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.textContent)
      .eql('AI Column')
      .expect(dataCell.element.clientWidth)
      .eql(100);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(150);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'Name 1', value: 10 },
      { id: 2, name: 'Name 2', value: 20 },
      { id: 3, name: 'Name 3', value: 30 },
    ],
    allowColumnResizing: true,
    columnResizingMode,
    columnWidth: 100,
    columns: [
      {
        type: 'ai',
        caption: 'AI Column',
      },
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
    ],
  }));

  test(`Column resizing should work when allowResizing is true (columnResizingMode = ${columnResizingMode})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);

    await t.expect(dataGrid.isReady()).ok();

    // assert
    await t
      .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.textContent)
      .eql('AI Column')
      .expect(dataCell.element.clientWidth)
      .eql(100);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(150);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'Name 1', value: 10 },
      { id: 2, name: 'Name 2', value: 20 },
      { id: 3, name: 'Name 3', value: 30 },
    ],
    allowColumnResizing: false,
    columnResizingMode,
    columnWidth: 100,
    columns: [
      {
        type: 'ai',
        caption: 'AI Column',
        allowResizing: true,
      },
      {
        dataField: 'id',
        caption: 'ID',
        allowResizing: true,
      },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },

    ],
  }));

  test(`Column resizing should not work when allowResizing is false (columnResizingMode = ${columnResizingMode})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);

    await t.expect(dataGrid.isReady()).ok();

    // assert
    await t
      .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.textContent)
      .eql('AI Column')
      .expect(dataCell.element.clientWidth)
      .eql(100);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(100);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'Name 1', value: 10 },
      { id: 2, name: 'Name 2', value: 20 },
      { id: 3, name: 'Name 3', value: 30 },
    ],
    allowColumnResizing: true,
    columnResizingMode,
    columnWidth: 100,
    columns: [
      {
        type: 'ai',
        caption: 'AI Column',
        allowResizing: false,
      },
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
    ],
  }));

  test(`The column width should not be less than its min width when column resizing (columnResizingMode = ${columnResizingMode})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);

    await t.expect(dataGrid.isReady()).ok();

    // assert
    await t
      .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.textContent)
      .eql('AI Column')
      .expect(dataCell.element.clientWidth)
      .eql(100);

    // act
    await dataGrid.resizeHeader(1, -50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(75);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, name: 'Name 1', value: 10 },
      { id: 2, name: 'Name 2', value: 20 },
      { id: 3, name: 'Name 3', value: 30 },
    ],
    allowColumnResizing: true,
    columnResizingMode,
    columnWidth: 100,
    columns: [
      {
        type: 'ai',
        caption: 'AI Column',
        minWidth: 75,
      },
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
    ],
  }));
});
