import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Ai Column.Visual`
  .page(url(__dirname, '../../../container.html'));

const TREE_LIST_SELECTOR = '#container';

test('Default render', async (t) => {
  // arrange, act
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'treelist__ai-column__default.png', { element: treeList.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 0, name: 'Name 3', value: 30,
    },
    {
      id: 4, parentId: 3, name: 'Name 4', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  expandedRowKeys: [3],
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
    },
  ],
}));
