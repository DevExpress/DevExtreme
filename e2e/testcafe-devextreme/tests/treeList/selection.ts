import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import ExpandableCell from 'devextreme-testcafe-models/treeList/expandableCell';

import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { tasksApiMock } from './apiMocks/tasksApiMock';

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

// T1264312
test('TreeList restore selection after the search panel has cleared', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeList = new TreeList('#container');
  const dataRow = treeList.getDataRow(0);
  const expandableCell = new ExpandableCell(dataRow.getDataCell(0));
  const searchBox = treeList.getSearchBox();

  await t
    .click(dataRow.getSelectCheckBox())
    .expect(dataRow.isSelected).ok();
  await t
    .click(expandableCell.getExpandButton())
    .expect(expandableCell.isExpanded()).ok();
  await t.expect(await takeScreenshot('T1264312-selection-checked-all', treeList.element)).ok();

  await t
    .click(expandableCell.getCollapseButton())
    .typeText(searchBox.input, 'google')
    .expect(expandableCell.isExpanded()).ok();
  await t.expect(await takeScreenshot('T1264312-selection-checked-searched', treeList.element)).ok();

  await t
    .click(dataRow.getSelectCheckBox())
    .expect(dataRow.isSelected).notOk();
  await t.expect(await takeScreenshot('T1264312-selection-unchecked-searched', treeList.element)).ok();

  await t
    .click(searchBox.getClearButton())
    .click(expandableCell.getExpandButton())
    .expect(expandableCell.isExpanded()).ok();
  await t.expect(await takeScreenshot('T1264312-selection-unchecked-all', treeList.element)).ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.addRequestHooks(tasksApiMock);
  return createWidget('dxTreeList', () => ({
    dataSource: (window as any).DevExpress.data.AspNet.createStore({
      key: 'Task_ID',
      loadUrl: 'https://api/data',
    }),
    selection: { mode: 'multiple', recursive: true, allowSelectAll: false },
    remoteOperations: { filtering: true, sorting: true, grouping: true },
    parentIdExpr: 'Task_Parent_ID',
    hasItemsExpr: 'Has_Items',
    searchPanel: {
      visible: true,
    },
    headerFilter: {
      visible: true,
    },
    showRowLines: true,
    showBorders: true,
    columnWidth: 180,
    columns: [{
      dataField: 'Task_Subject',
      width: 300,
    }, {
      dataField: 'Task_Assigned_Employee_ID',
      caption: 'Assigned',
    }, {
      dataField: 'Task_Status',
      caption: 'Status',
    }, {
      dataField: 'Task_Start_Date',
      caption: 'Start Date',
      dataType: 'date',
    }, {
      dataField: 'Task_Due_Date',
      caption: 'Due Date',
      dataType: 'date',
    },
    ],
  }));
});
