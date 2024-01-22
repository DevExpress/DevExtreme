import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture
  `Keyboard Navigation - custom buttons`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';
const createDataGrid = async () => createWidget('dxDataGrid', {
  dataSource: [
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
  ],
  keyExpr: 'id',
  columns: [
    {
      type: 'buttons',
      buttons: [
        {
          hint: 'button_1',
          icon: 'edit',
          onClick: (e) => $(e.event.target).attr('has-been-clicked', 'true'),
        },
        {
          hint: 'button_2',
          icon: 'remove',
        },
      ],
    },
    'id',
    'columnA',
    'columnB',
  ],
  sorting: {
    mode: 'none',
  },
});

test('Custom buttons cell should be focused before custom buttons on tab navigation', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 0);
  const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createDataGrid());

test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const expectedFocusedCell = dataGrid.getDataCell(0, 0);
  const cellToStartNavigation = dataGrid.getDataCell(0, 1);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .pressKey('shift+tab')
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createDataGrid());

test('First custom button inside custom buttons cell should be focused on tab navigation', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const customButtonsCell = dataGrid.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
  const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .pressKey('tab')
    .expect(expectedFocusedButton.focused)
    .ok();
}).before(async () => createDataGrid());

test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const customButtonsCell = dataGrid.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_2');
  const cellToStartNavigation = dataGrid.getDataCell(0, 1);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedButton.focused)
    .ok();
}).before(async () => createDataGrid());

test('Custom button inside custom buttons cell should be clickable by pressing enter key', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const customButtonsCell = dataGrid.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
  const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('enter')
    .expect(expectedFocusedButton.withAttribute('has-been-clicked').exists)
    .ok();
}).before(async () => createDataGrid());
