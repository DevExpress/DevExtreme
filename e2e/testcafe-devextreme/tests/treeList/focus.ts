import TreeList from 'devextreme-testcafe-models/treeList';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`Focus`
  .page(url(__dirname, '../container.html'));

const TREE_LIST_SELECTOR = '#container';

test('Focus method should focus the first data cell', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await treeList.apiFocus();

  await t
    .expect(treeList.getDataCell(0, 0).element.focused)
    .ok();
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    { id: 1, parentId: 0, name: 'name 1' },
    { id: 2, parentId: 1, name: 'name 2' },
    { id: 3, parentId: 0, name: 'name 3' },
  ],
  keyExpr: 'id',
  parentId: 'parentId',
  columns: [
    'id',
    {
      dataField: 'name',
      cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
    },
  ],
}));

test('Focus method should focus the first data row when focusedRowEnabled = true', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await treeList.apiFocus();

  await t
    .expect(treeList.getDataRow(0).element.focused)
    .ok();
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    { id: 1, parentId: 0, name: 'name 1' },
    { id: 2, parentId: 1, name: 'name 2' },
    { id: 3, parentId: 0, name: 'name 3' },
  ],
  keyExpr: 'id',
  parentId: 'parentId',
  focusedRowEnabled: true,
  columns: [
    'id',
    {
      dataField: 'name',
      cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
    },
  ],
}));
