import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1109666
  test('TreeList with selection and boolean data in first column should render right', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
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
  });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1109666-selection', { element: treeList.element });

    });

  // T1264312
  test('TreeList restore selection after the search panel has cleared', async ({ page }) => {
    const treeList = page.locator('#container');
    const dataRow = treeList.getDataRow(0);
    const expandableCell = new ExpandableCell(dataRow.getDataCell(0));
    const searchBox = treeList.getSearchBox();

    await page.click(dataRow.getSelectCheckBox())
      .expect(dataRow.isSelected).ok();
    await page.click(expandableCell.getExpandButton())
      .expect(expandableCell.isExpanded()).ok();
    await testScreenshot(page, 'T1264312-selection-checked-all', { element: treeList.element });

    await page.click(expandableCell.getCollapseButton())
      .typeText(searchBox.input, 'google')
      .expect(expandableCell.isExpanded()).ok();
    await testScreenshot(page, 'T1264312-selection-checked-searched', { element: treeList.element });

    await page.click(dataRow.getSelectCheckBox())
      .expect(dataRow.isSelected).notOk();
    await testScreenshot(page, 'T1264312-selection-unchecked-searched', { element: treeList.element });

    await page.click(searchBox.getClearButton())
      .click(expandableCell.getExpandButton())
      .expect(expandableCell.isExpanded()).ok();
    await testScreenshot(page, 'T1264312-selection-unchecked-all.png', { element: treeList.element });

    });.before(async ({ page }) => {
    await addRequestHooks(tasksApiMock);
    await createWidget(page, 'dxTreeList', () => ({
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
});
