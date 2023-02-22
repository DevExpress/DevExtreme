import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture
  .disablePageReloads`Keyboard Navigation - screenshots`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Focused cells should look correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerCellToFocus = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const dataCellToFocus = dataGrid.getDataCell(0, 1);

  await t.click(headerCellToFocus.element)
    .pressKey('tab');
  await takeScreenshot('data-grid_keyboard-navigation-header-cell-focused.png');

  await t.click(dataCellToFocus.element)
    .pressKey('tab');
  await takeScreenshot('data-grid_keyboard-navigation-data-cell-focused.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      id: 1,
      parentId: 0,
      columnA: 'A_0',
      columnB: 'B_0',
    },
    {
      id: 2,
      parentId: 0,
      columnA: 'A_1',
      columnB: 'B_1',
    },
    {
      id: 3,
      parentId: 0,
      columnA: 'A_2',
      columnB: 'B_2',
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  columns: ['id', 'columnA', 'columnB'],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
}));
