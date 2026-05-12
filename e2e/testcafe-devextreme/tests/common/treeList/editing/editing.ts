import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Treelist - Editing`
  .page(url(__dirname, '../../../container.html'));

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

test('Editing the parentIdExpr column causes the row to disappear if the column has setCellValue (T1307499)', async (t) => {
  // arrange
  const treeList = new TreeList('#container');
  const addRowButton = treeList.getHeaderPanel().getAddRowButton();

  // assert
  await t.expect(treeList.isReady()).ok();

  // act
  await t.click(addRowButton);

  const newRow = treeList.getDataRow(0);
  const parentIdCellEditor = newRow.getDataCell(1).getEditor();

  // assert
  await t
    .expect(newRow.isInserted)
    .ok()
    .expect(parentIdCellEditor.element.value)
    .eql('0')
    .expect(treeList.dataRows.count)
    .eql(2);

  // act
  await t
    .typeText(parentIdCellEditor.element, '1', { replace: true })
    .pressKey('tab');

  // assert
  await t
    .expect(parentIdCellEditor.element.value)
    .eql('1')
    .expect(treeList.dataRows.count)
    .eql(2);
}).before(async () => createWidget('dxTreeList', {
  dataSource: [{ id: 1, parentId: 0, text: 'item 1' }],
  editing: {
    allowAdding: true,
  },
  columns: ['id', {
    dataField: 'parentId',
    setCellValue(newData, value) {
      newData.parentId = value;
    },
  }, 'text'],
}));
