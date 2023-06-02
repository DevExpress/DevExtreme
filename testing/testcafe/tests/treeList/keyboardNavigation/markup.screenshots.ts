import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TreeList from '../../../model/treeList';

fixture
  .disablePageReloads`Keyboard Navigation - screenshots`
  .page(url(__dirname, '../../container.html'));

const TREE_LIST_SELECTOR = '#container';

test('Focused cells should look correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const headerCellToFocus = treeList.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const dataCellToFocus = treeList.getDataCell(0, 0);

  await t.click(headerCellToFocus.element)
    .pressKey('tab');
  await takeScreenshot('tree-list_keyboard-navigation-header-cell-focused.png');

  await t.click(dataCellToFocus.element)
    .pressKey('tab');
  await takeScreenshot('tree_list_keyboard-navigation-data-cell-focused.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
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
  sorting: {
    mode: 'none',
  },
}));

test('Focused custom buttons should look correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const headerCellToFocus = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.click(headerCellToFocus.element)
    .pressKey('tab');
  await takeScreenshot('tree-list_keyboard-navigation-custom-buttons-cell-focused.png');

  await t.pressKey('tab');
  await takeScreenshot('tree-list_keyboard-navigation-custom-button-focused.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
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
  columns: [
    {
      type: 'buttons',
      buttons: [
        {
          hint: 'button_1',
          icon: 'edit',
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
}));
