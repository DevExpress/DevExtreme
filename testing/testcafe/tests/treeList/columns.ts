import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

fixture`Columns`
  .page(url(__dirname, '../containerMaterial.html'));

// T1053931
test('Correct display border to last column', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1053931-material.blue.light', treeList.getHeaders().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', lastName: 'Last 1', age: 19,
    },
    {
      id: 2, parentId: 0, name: 'Name 2', lastName: 'Last 2', age: 23,
    },
  ],
  columns: [
    { dataField: 'id' }, { columns: ['name', 'lastName'] }, { dataField: 'age' },
  ],
  width: 600,
  height: 300,
}));
