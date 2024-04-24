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

const tasks_T1218572 = [{
  Task_ID: 1,
  Task_Subject: 'Plans 2015',
  Task_Parent_ID: 0,
}, {
  Task_ID: 2,
  Task_Subject: 'Health Insurance',
  Task_Parent_ID: 0,
}];

test.only('TreeList - Tab navigation breaks on a custom action button when FocusedRowEnabled is set (T1218572)', async (t) => {
  const treeList = new TreeList('#container');
  await t
    .click(treeList.getHeaders().getHeaderRow(0).getHeaderCell(0).element)
    .pressKey('tab tab')

    .expect(treeList.getDataCell(1, 0).isFocused)
    .ok();
}).before(async () => createWidget('dxTreeList', {
  dataSource: tasks_T1218572,
  keyExpr: 'Task_ID',
  parentIdExpr: 'Task_Parent_ID',
  focusedRowEnabled: true,
  focusedRowKey: 2,
  showBorders: true,
  columns: [
  'Task_ID',
  {
      caption: "Actions",
      type: "buttons",
      buttons: [{
      name: "download",
          icon: "download",
      }]
  }
  ],
}));