import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

fixture`Columns`
  .page(url(__dirname, '../containerMaterial.html'));

test('CheckBox postion with double rows columns', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1054312-material.blue.light', treeList.getHeaders().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: [{
    ID: 1,
    Full_Name: 'John Heart',
    City: 'Los Angeles',
    State: 'California',
  }],
  keyExpr: 'ID',
  selection: {
    mode: 'multiple',
  },
  columns: [{
    dataField: 'Full_Name',
  },
  { columns: ['City', 'State'] },
  ],
}));
