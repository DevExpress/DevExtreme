import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TreeList from '../../../model/treeList';

fixture`Keyboard Navigation - custom buttons`
  .page(url(__dirname, '../../container.html'));

const TREE_LIST_SELECTOR = '#container';
const createTreeList = async () => createWidget('dxTreeList', {
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 0);
  const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createTreeList());

test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const expectedFocusedCell = treeList.getDataCell(0, 0);
  const cellToStartNavigation = treeList.getDataCell(0, 1);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .pressKey('shift+tab')
    .pressKey('shift+tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => createTreeList());

test('First custom button inside custom buttons cell should be focused on tab navigation', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const customButtonsCell = treeList.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
  const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .pressKey('tab')
    .expect(expectedFocusedButton.focused)
    .ok();
}).before(async () => createTreeList());

test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const customButtonsCell = treeList.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_2');
  const cellToStartNavigation = treeList.getDataCell(0, 1);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('shift+tab')
    .expect(expectedFocusedButton.focused)
    .ok();
}).before(async () => createTreeList());

test('Custom button inside custom buttons cell should be clickable by pressing enter key', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);
  const customButtonsCell = treeList.getDataCell(0, 0);
  const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
  const cellToStartNavigation = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(cellToStartNavigation.element)
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('enter')
    .expect(expectedFocusedButton.withAttribute('has-been-clicked').exists)
    .ok();
}).before(async () => createTreeList());
