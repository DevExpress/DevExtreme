import Button from 'devextreme-testcafe-models/button';
import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture`Keyboard Navigation - common`
  .page(url(__dirname, '../../container.html'));

test('TreeList - Selection CheckBox in a data row isn\'t navigable with Tab button if this CheckBox was focused manually (T1207467)', async (t) => {
  const treeList = new TreeList('#container');
  const focusButton = new Button('#otherContainer');
  const expectedFocusedCell = treeList.getDataCell(0, 2);

  await t
    .click(focusButton.element)
    .pressKey('tab tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxTreeList', {
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
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    showBorders: true,
    selection: {
      mode: 'multiple',
      recursive: false,
    },
    columns: ['id', 'name', 'age'],
  });

  await createWidget('dxButton', {
    text: 'Focus',
    onClick() {
      const checkbox = $('.dx-checkbox:visible')[1];
      if (checkbox) {
        checkbox.focus();
      }
    },
  }, '#otherContainer');
});

test('TreeList - Template button in a data row isn\'t navigable with Tab button if this button was focused manually (T1207467)', async (t) => {
  const treeList = new TreeList('#container');
  const focusButton = new Button('#otherContainer');
  const expectedFocusedCell = treeList.getDataCell(0, 2);

  await t
    .click(focusButton.element)
    .pressKey('tab')
    .expect(expectedFocusedCell.isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxTreeList', {
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
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    showBorders: true,
    selection: {
      mode: 'multiple',
      recursive: false,
    },
    columns: [{
      dataField: 'id',
    }, {
      dataField: 'name',
      cellTemplate(container) {
        const button = document.createElement('button');
        button.innerText = 'select';
        container.append(button);
      },
    }, 'age'],
  });

  await createWidget('dxButton', {
    text: 'Focus',
    onClick() {
      const btn = $('button')[0];
      if (btn) {
        btn.focus();
      }
    },
  }, '#otherContainer');
});

test('TreeList - Keyboard navigation on Expand/Collapse buttons is broken if the mouse used before (T1234949)', async (t) => {
  const treeList = new TreeList('#container');
  const target = treeList.getDataRow(0).getDataCell(0);

  await t
    .click(treeList.getDataRow(0).getDataCell(0).element.child(0))
    .click(treeList.getContainer(), { offsetX: 100, offsetY: 600 })
    .pressKey('tab tab tab')
    .expect(target.element.focused)
    .ok();

  await t.debug();
}).before(
  async () => createWidget('dxTreeList', {
    dataSource: [
      {
        Task_ID: 1,
        Task_Subject: 'Plans 2015',
        Task_Parent_ID: 0,
      },
      {
        Task_ID: 2,
        Task_Subject: 'Health Insurance',
        Task_Parent_ID: 1,
      },
    ],
    keyExpr: 'Task_ID',
    parentIdExpr: 'Task_Parent_ID',
    columns: [
      {
        dataField: 'Task_Subject',
      },
      {
        dataField: 'Task_Assigned_Employee_ID',
      },
    ],
  }),
);
