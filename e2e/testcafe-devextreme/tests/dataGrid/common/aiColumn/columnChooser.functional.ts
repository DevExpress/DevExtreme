import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column - Column Chooser.Functional`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

const checkCells = async (t, cells: Selector, expectedCells: string[]) => {
  const count = await cells.count;

  await t.expect(cells.count).eql(expectedCells.length);

  for (let i = 0; i < count; i += 1) {
    await t.expect(cells.nth(i).innerText).eql(expectedCells[i]);
  }
};

const checkVisibleHeaders = async (t, headers: Selector, expectedCells: string[]) => {
  await checkCells(t, headers, expectedCells);
};

const checkChooserColumns = async (t, chooserColumns: Selector, expectedCells: string[]) => {
  await checkCells(t, chooserColumns, expectedCells);
};

test('The AI column can be hidden when columnChooser.mode is "dragAndDrop"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(dataGrid.getColumnChooser().isOpened).ok();
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), []);

  // act
  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
    dataGrid.getColumnChooser().content,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), ['AI Column']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column cannot be hidden when columnChooser.mode is "dragAndDrop" and allowHiding is false', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(dataGrid.getColumnChooser().isOpened).ok();
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), []);

  // act
  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
    dataGrid.getColumnChooser().content,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), []);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      allowHiding: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column can be hidden when columnChooser.mode is "select"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  const columnChooser = dataGrid.getColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();

  // act
  await t.click(columnChooser.getCheckbox(0));

  // assert
  await t
    .expect(columnChooser.isCheckboxChecked(0)).notOk()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();

  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column cannot be hidden when columnChooser.mode is "select" and allowHiding is false', async (t) => {
// arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  const columnChooser = dataGrid.getColumnChooser();

  // assert
  await t
    .expect(columnChooser.isOpened)
    .ok()
    .expect(columnChooser.isCheckboxDisabled(0))
    .ok()
    .expect(columnChooser.isCheckboxChecked(0))
    .ok()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible'))
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      allowHiding: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column can be shown when columnChooser.mode is "dragAndDrop"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(dataGrid.getColumnChooser().isOpened).ok();
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), ['AI Column']);

  // act
  await t.dragToElement(
    dataGrid.getColumnChooser().getColumn(0),
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), []);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      visible: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column cannot be shown when columnChooser.mode is "dragAndDrop" and allowHiding is false', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t
    .expect(dataGrid.getColumnChooser().isOpened).ok()
    .expect(dataGrid.getColumnChooser().isColumnDisabled(0)).ok();
  await checkChooserColumns(t, dataGrid.getColumnChooser().getColumns(), ['AI Column']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      allowHiding: false,
      visible: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column can be shown when columnChooser.mode is "select"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  const columnChooser = dataGrid.getColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();

  // act
  await t.click(columnChooser.getCheckbox(0));

  // assert
  await t
    .expect(columnChooser.isCheckboxChecked(0)).ok()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();

  await checkVisibleHeaders(t, headerCells, ['AI Column', 'ID', 'Name', 'Value']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      visible: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column cannot be shown when columnChooser.mode is "select" and allowHiding is false', async (t) => {
// arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const headerCells = dataGrid.getHeaders().getHeaderRow(0).getHeaderCells();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await checkVisibleHeaders(t, headerCells, ['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  const columnChooser = dataGrid.getColumnChooser();

  // assert
  await t
    .expect(columnChooser.isOpened)
    .ok()
    .expect(columnChooser.isCheckboxDisabled(0))
    .ok()
    .expect(columnChooser.isCheckboxChecked(0))
    .notOk()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible'))
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      allowHiding: false,
      visible: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
