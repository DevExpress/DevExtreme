import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

// T1147695
fixture
  .disablePageReloads`Keyboard Navigation - skip drag cell`
  .page(url(__dirname, '../../container.html'));

const TREE_LIST_SELECTOR = '#container';
const DATA_SOURCE = [
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
];

const createTreeList = async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  columns: ['id', 'columnA', 'columnB'],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
});

const createTreeListRenderAsyncWithButtons = async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 1);
  const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createTreeList());

test('The drag cell should be skipped when navigating from the header cell by tab keypress'
  + ' with buttons column and renderAsync: true', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 1);
  const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createTreeListRenderAsyncWithButtons());

test('The drag cell should be skipped when navigating to the header cell by shift+tab keypress', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);
  const cellToStartNavigation = treeList.getDataCell(0, 1);

  await t.click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createTreeList());

test('The drag cell should be skipped when navigating to a next row by tab keypress', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(1, 1);
  const cellToStartNavigation = treeList.getDataCell(0, 3);

  await t.click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createTreeList());

test('The drag cell should be skipped when navigating to a previous row by shift+tab keypress', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 3);
  const cellToStartNavigation = treeList.getDataCell(1, 1);

  await t.click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createTreeList());

test('The drag cell shouldn\'t be focused when the next cell is focused and the left arrow key pressed', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 1);

  await t.click(expectedFocusedCell.element)
    .pressKey('left')
    .expect(expectedFocusedCell.isFocused).ok();
}).before(async () => createTreeList());
