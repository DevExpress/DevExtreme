import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column.ColumnResizing.Functional`
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
      .eql(120);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(170);
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
        name: 'myAIColumn',
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
      .eql(120);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(170);
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
        name: 'myAIColumn',
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
      .eql(120);

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await t.expect(dataCell.element.clientWidth).eql(120);
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
        name: 'myAIColumn',
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
        name: 'myAIColumn',
      },
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'value', caption: 'Value' },
    ],
  }));
});

test('DropDownButton should be hidden during resizing', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const aiDropDownButton = dataGrid
    .getHeaders()
    .getHeaderRow(0)
    .getCommandCell(0)
    .getAIDropDownButton();

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(aiDropDownButton.element);

  // assert
  await t.expect(await aiDropDownButton.isOpened()).ok();

  // act
  await dataGrid.resizeHeader(1, 50);

  // assert
  await t.expect(await aiDropDownButton.isOpened()).notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnResizing: true,
  columnWidth: 150,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAIColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('AIPromptEditor should be hidden during resizing', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const aiDropDownButton = dataGrid
    .getHeaders()
    .getHeaderRow(0)
    .getCommandCell(0)
    .getAIDropDownButton();
  const aiPromptEditor = dataGrid.getAIPromptEditor();

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(aiDropDownButton.element);

  // assert
  await t.expect(await aiDropDownButton.isOpened()).ok();

  // act
  await t.click((await aiDropDownButton.getList()).getItem(0).element);

  // assert
  await t.expect(aiPromptEditor.isVisible()).ok();

  // act
  await dataGrid.resizeHeader(1, 50);

  // assert
  await t.expect(aiPromptEditor.isVisible()).notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnResizing: true,
  columnWidth: 450,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAIColumn',
      alignment: 'right',
    },
    { dataField: 'id', caption: 'ID' },
  ],
}));
