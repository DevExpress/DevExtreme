import TreeList from 'devextreme-testcafe-models/treeList';
import ExpandableCell from 'devextreme-testcafe-models/treeList/expandableCell';

import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture`Row dragging`
  .page(url(__dirname, '../container.html'));

const tasksT1228650 = [{
  Task_ID: 1,
  Task_Subject: 'Plans 2015',
  Task_Parent_ID: 0,
}, {
  Task_ID: 2,
  Task_Subject: 'Health Insurance',
  Task_Parent_ID: 1,
}, {
  Task_ID: 3,
  Task_Subject: 'Training',
  Task_Parent_ID: 2,
}];

test('TreeList - Expand/collapse mechanism breaks after dragging action in the space between the last row and the border (T1228650)', async (t) => {
  const treeList = new TreeList('#container');
  const dataRow = treeList.getDataRow(0);
  const expandButton = new ExpandableCell(dataRow.getDataCell(0)).getExpandButton();
  const freeSpaceRow = treeList.getFreeSpaceRow();
  await t
    .dragToElement(freeSpaceRow, dataRow.element)
    .click(expandButton)
    .expect(treeList.getDataRow(1).element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxTreeList', {
    dataSource: tasksT1228650,
    keyExpr: 'Task_ID',
    parentIdExpr: 'Task_Parent_ID',
    height: 200,
    wordWrapEnabled: true,
    showBorders: true,
    columnFixing: {
      legacyMode: true,
    },
    columns: [
      {
        dataField: 'test',
        dataType: 'boolean',
      },
      {
        dataField: 'Task_Subject',
        fixed: true,
        fixedPosition: 'right',
      },
    ],
    showColumnLines: true,
    rowDragging: {
      allowDropInsideItem: true,
      allowReordering: false,
      showDragIcons: false,
      group: 'none',
    },
  });
});
