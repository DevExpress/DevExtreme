import Button from 'devextreme-testcafe-models/button';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import TreeList from 'devextreme-testcafe-models/treeList';

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
