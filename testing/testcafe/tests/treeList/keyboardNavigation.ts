import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

fixture`Keyboard Navigation`
  .page(url(__dirname, '../container.html'));

// T861048
test('The row should be selected on click if less than half of a row is visible', async (t) => {
  const treeList = new TreeList('#container');
  const dataRow = treeList.getDataRow(3);

  await t
    .click(dataRow.getSelectCheckBox(), { offsetX: 0, offsetY: 0 })
    .expect(dataRow.isSelected).ok();
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', age: 19,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', age: 11,
    },
    {
      id: 3, parentId: 0, name: 'Name 3', age: 15,
    },
    {
      id: 4, parentId: 3, name: 'Name 4', age: 16,
    },
    {
      id: 5, parentId: 0, name: 'Name 5', age: 25,
    },
    {
      id: 6, parentId: 5, name: 'Name 6', age: 18,
    },
    {
      id: 7, parentId: 0, name: 'Name 7', age: 21,
    },
    {
      id: 8, parentId: 7, name: 'Name 8', age: 14,
    },
  ],
  height: 150,
  autoExpandAll: true,
  columns: ['name', 'age'],
  selection: {
    mode: 'multiple',
  },
}));
