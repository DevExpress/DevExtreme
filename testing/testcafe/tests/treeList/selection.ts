import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

fixture`Selection`
  .page(url(__dirname, '../container.html'));

// T1109666
test('TreeList with selection and boolean data in first column should render right', async (t) => {
  const treeList = new TreeList('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1109666-selection', treeList.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    {
      id: 1, parentId: 0, value: true, value1: 'text',
    },
    {
      id: 2, parentId: 1, value: true, value1: 'text',
    },
    {
      id: 3, parentId: 2, value: true, value1: 'text',
    },
    {
      id: 4, parentId: 3, value: true, value1: 'text',
    },
    {
      id: 5, parentId: 4, value: true, value1: 'text',
    },
    {
      id: 6, parentId: 5, value: true, value1: 'text',
    },
    {
      id: 7, parentId: 6, value: true, value1: 'text',
    },
    {
      id: 8, parentId: 7, value: true, value1: 'text',
    },
  ],
  height: 300,
  width: 400,
  autoExpandAll: true,
  columns: [{
    dataField: 'value',
    width: 100,
  }, {
    dataField: 'value1',
  }],
  selection: {
    mode: 'multiple',
  },
}));
