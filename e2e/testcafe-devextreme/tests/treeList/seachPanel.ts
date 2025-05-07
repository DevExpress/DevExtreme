import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`SearchPanel`
  .page(url(__dirname, '../container.html'));

test('Items are shown in the original order after search is applied - T1274434 - 1', async (t) => {
  const treeList = new TreeList('#container');
  await treeList.apiSearchByText('test');

  await t
    .expect((await treeList.apiGetVisibleRows()).length)
    .eql(3);

  await t
    .expect(treeList.apiGetCellValue(0, 0))
    .eql('parent1');

  await t
    .expect(treeList.apiGetCellValue(1, 0))
    .eql('test2');

  await t
    .expect(treeList.apiGetCellValue(2, 0))
    .eql('test1');
}).before(async () => createWidget('dxTreeList', {
  showBorders: true,
  showRowLines: true,
  expandedRowKeys: [1],
  searchPanel: {
    visible: true,
  },
  columns: ['text'],
  dataSource: [
    { id: 1, parentId: 0, text: 'parent1' },
    { id: 2, parentId: 0, text: 'test1' },
    { id: 3, parentId: 1, text: 'test2' },
  ],
}));

test('Items are shown in the original order after search is applied - T1274434 - 2', async (t) => {
  const treeList = new TreeList('#container');
  await treeList.apiSearchByText('test');

  await t
    .expect((await treeList.apiGetVisibleRows()).length)
    .eql(3);

  await t
    .expect(treeList.apiGetCellValue(0, 0))
    .eql('parent1');

  await t
    .expect(treeList.apiGetCellValue(1, 0))
    .eql('test2');

  await t
    .expect(treeList.apiGetCellValue(2, 0))
    .eql('test1');
}).before(async () => createWidget('dxTreeList', {
  showBorders: true,
  showRowLines: true,
  expandedRowKeys: [1],
  searchPanel: {
    visible: true,
  },
  columns: ['text'],
  dataSource: [
    { id: 1, parentId: 0, text: 'parent1' },
    { id: 2, parentId: 0, text: 'test1' },
    { id: 3, parentId: 1, text: 'test2' },
    { id: 4, parentId: 0, text: 'parent2' },
  ],
}));
