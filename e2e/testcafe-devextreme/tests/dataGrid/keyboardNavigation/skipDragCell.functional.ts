import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

// T1147695
fixture
  .disablePageReloads`Keyboard Navigation - skip drag cell`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';
const DATA_SOURCE = [
  {
    id: 1,
    columnA: 'A_0',
    columnB: 'B_0',
  },
  {
    id: 2,
    columnA: 'A_1',
    columnB: 'B_1',
  },
  {
    id: 3,
    columnA: 'A_2',
    columnB: 'B_2',
  },
];
const createDataGrid = async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columns: ['id', 'columnA', 'columnB'],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
});

const createDataGridRenderAsyncWithButtons = async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columns: ['id', 'columnA', 'columnB', { type: 'buttons' }],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
  renderAsync: true,
});

test('The drag cell should be skipped when navigating from the header cell by tab keypress', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 1);
  const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createDataGrid());

test('The drag cell should be skipped when navigating from the header cell by tab keypress'
  + ' with buttons column and renderAsync: true', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 1);
  const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createDataGridRenderAsyncWithButtons());

test('The drag cell should be skipped when navigating to the header cell by shift+tab keypress', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
  const cellToStartNavigation = dataGrid.getDataCell(0, 1);

  await t.click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createDataGrid());

test('The drag cell should be skipped when navigating to a next row by tab keypress', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(1, 1);
  const cellToStartNavigation = dataGrid.getDataCell(0, 3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createDataGrid());

test('The drag cell should be skipped when navigating to a previous row by shift+tab keypress', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 3);
  const cellToStartNavigation = dataGrid.getDataCell(1, 1);

  await t.click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createDataGrid());

test('The drag cell shouldn\'t be focused when the next cell is focused and the left arrow key pressed', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 1);

  await t.click(expectedFocusedCell.element)
    .pressKey('left')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createDataGrid());
