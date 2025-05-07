import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture`Treelist - Editing`.page(url(__dirname, '../../container.html'));

// T1247158
test('TreeList - Insertafterkey doesn\'t work on children nodes', async (t) => {
  const treeList = new TreeList('#container');
  const expectedInsertedRowIndex = 2;

  await t
    .click(treeList.getDataCell(1, 0).element)
    .pressKey('ctrl+enter')
    .expect(treeList.getDataRow(expectedInsertedRowIndex).isInserted)
    .ok();
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    {
      ID: 1,
      Head_ID: -1,
      Full_Name: 'John Heart',
    },
    {
      ID: 2,
      Head_ID: 1,
      Full_Name: 'Samantha Bright',
    },
  ],
  rootValue: -1,
  keyExpr: 'ID',
  parentIdExpr: 'Head_ID',
  columns: ['Full_Name'],
  editing: {
    mode: 'batch',
    allowAdding: true,
    allowUpdating: true,
    useIcons: true,
  },
  focusedRowEnabled: true,
  expandedRowKeys: [1],
  onKeyDown(e) {
    if (e.event.ctrlKey && e.event.key === 'Enter') {
      const currentSelectedParentTaskId = e.component.getNodeByKey(
        e.component.option('focusedRowKey'),
      )?.parent?.key;
      const key = new (window as any).DevExpress.data.Guid().toString();
      const data = { Head_ID: currentSelectedParentTaskId };
      e.component.option('editing.changes', [
        {
          key,
          type: 'insert',
          insertAfterKey: e.component.option('focusedRowKey'),
          data,
        },
      ]);
    }
  },
}));
