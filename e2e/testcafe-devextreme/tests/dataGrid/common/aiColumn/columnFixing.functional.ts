import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column - Sticky columns.Functional`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('The AI column should not be fixed when the columnFixing.enabled option is true', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  // assert
  await t.expect(aiHeader.element.textContent).eql('AI Column');
  await t.expect(aiHeader.isSticky()).notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnFixing: {
    enabled: true,
  },
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
  ],
}));

test('The AI column should be fixed when its fixed option is true', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  // assert
  await t.expect(aiHeader.element.textContent).eql('AI Column');
  await t.expect(aiHeader.isSticky('left')).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      fixed: true,
      name: 'myAiColumn',
    },
  ],
}));

test('The AI column should be fixed when its fixed option is true and its fixed position is set to right', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  // assert
  await t.expect(aiHeader.element.textContent).eql('AI Column');
  await t.expect(aiHeader.isSticky('right')).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      fixed: true,
      fixedPosition: 'right',
      name: 'myAiColumn',
    },
  ],
}));

test('The AI column should be fixed when its fixed option is true and its fixed position is set to sticky', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  // assert
  await t.expect(aiHeader.element.textContent).eql('AI Column');
  await t.expect(aiHeader.isSticky('sticky')).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columns: [
    { dataField: 'id', caption: 'ID' },
    {
      type: 'ai',
      caption: 'AI Column',
      fixed: true,
      fixedPosition: 'sticky',
      name: 'myAiColumn',
    },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('Fix an AI column using the context menu', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();

  await t.expect(dataGrid.isReady()).ok();

  const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  // assert
  await t
    .expect(aiHeader.element.textContent).eql('AI Column')
    .expect(aiHeader.isSticky('left')).notOk();

  // act
  await t
    .rightClick(aiHeader.element)
    .click(contextMenu.getItemByText('Set Fixed Position'))
    .click(contextMenu.getItemByText('Left'));

  // assert
  await t.expect(aiHeader.element.textContent).eql('AI Column');
  await t.expect(aiHeader.isSticky('left')).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  width: 600,
  columnWidth: 200,
  columnFixing: {
    enabled: true,
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
