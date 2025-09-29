import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Ai Column.ColumnReordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Column reordering should work when allowColumnReordering is true', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await t.drag(headerRow.getHeaderCell(0).element, 100, 0);

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'AI Column', 'Name', 'Value']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: true,
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

test('Column reordering should not work when allowColumnReordering is false', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await t.drag(headerRow.getHeaderCell(0).element, 100, 0);

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: false,
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

test('Column reordering should not work when it has allowReordering set to false', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await t.drag(headerRow.getHeaderCell(0).element, 100, 0);

  // assert
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: true,
  columnWidth: 100,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      allowReordering: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The draggable AI column should have a caption', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.moveHeader(0, 100, 5, true);

  // assert
  await t
    .expect(dataGrid.getDraggableHeader().visible).ok()
    .expect(dataGrid.getDraggableHeader().innerText).eql('AI Column');

  // act
  await dataGrid.dropHeader(0);

  // assert
  await t.expect(dataGrid.getDraggableHeader().visible).notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: true,
  columnWidth: 125,
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
