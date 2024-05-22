import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';

import { changeTheme } from '../../helpers/changeTheme';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture`Markup`
  .page(url(__dirname, '../container.html'));

const tasksT1223168 = [{
  Task_ID: 1,
  Task_Subject: 'Plans 2015',
  Task_Parent_ID: 0,
}, {
  Task_ID: 2,
  Task_Subject: 'Health Insurance',
  Task_Parent_ID: 1,
}];

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
  test(`TreeList - Expand/collapse buttons are too close to column borders if the first column is a boolean column (T1223168) in ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const treeList = new TreeList('#container');

    await t
      .expect(await takeScreenshot(`T1223168-expandable-${theme}`, treeList.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await createWidget('dxTreeList', {
      dataSource: tasksT1223168,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      wordWrapEnabled: true,
      showBorders: true,
      columns: [{
        dataField: 'test',
        dataType: 'boolean',
      }, 'Task_Subject'],
      showColumnLines: true,
      rowDragging: {
        allowReordering: true,
      },
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
