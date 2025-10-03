import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column - Column Chooser.Functional`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('The AI column can be hidden when columnChooser.mode is "dragAndDrop"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql([]);

  // act
  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
    dataGrid.getColumnChooser().content,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);
  await t.expect(await columnChooser.getColumnTexts()).eql(['AI Column']);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql([]);

  // act
  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
    dataGrid.getColumnChooser().content,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);
  await t.expect(await columnChooser.getColumnTexts()).eql([]);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();

  // act
  await t.click(columnChooser.getCheckbox(0));

  // assert
  await t
    .expect(columnChooser.isCheckboxChecked(0)).notOk()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();

  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql(['AI Column']);

  // act
  await t.dragToElement(
    columnChooser.getColumn(0),
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element,
  );

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);
  await t.expect(await columnChooser.getColumnTexts()).eql([]);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t
    .expect(columnChooser.isOpened).ok()
    .expect(columnChooser.isColumnDisabled(0)).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql(['AI Column']);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();

  // act
  await t.click(columnChooser.getCheckbox(0));

  // assert
  await t
    .expect(columnChooser.isCheckboxChecked(0)).ok()
    .expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).ok();
  await t.expect(await headerRow.getHeaderTexts()).eql(['AI Column', 'ID', 'Name', 'Value']);
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
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

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

test('The AI column should not be visible in column chooser when showInColumnChooser is false and columnChooser.mode is "dragAndDrop"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql([]);
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
      showInColumnChooser: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column should not be visible in column chooser when showInColumnChooser is false and columnChooser.mode is "select"', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const columnChooser = dataGrid.getColumnChooser();

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.apiColumnOption('myAiColumn', 'visible')).notOk();
  await t.expect(await headerRow.getHeaderTexts()).eql(['ID', 'Name', 'Value']);

  // act
  await dataGrid.apiShowColumnChooser();

  // assert
  await t.expect(columnChooser.isOpened).ok();
  await t.expect(await columnChooser.getColumnTexts()).eql(['ID', 'Name', 'Value']);
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
      showInColumnChooser: false,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
