import { expect, test } from '../../../helpers/accessibility/test';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import TreeList from '../../../models/treeList';

const tasks = [
  {
    Task_ID: 1,
    Task_Assigned_Employee_ID: 1,
    Task_Subject: 'Plans 2015',
    Task_Parent_ID: 0,
  },
  {
    Task_ID: 2,
    Task_Assigned_Employee_ID: 1,
    Task_Subject: 'Health Insurance',
    Task_Parent_ID: 1,
  },
  {
    Task_ID: 3,
    Task_Assigned_Employee_ID: 1,
    Task_Subject: 'New Brochures',
    Task_Parent_ID: 1,
  },
];

const employees = [
  {
    ID: 1,
    Name: 'John Heart',
  },
];

/* eslint-disable no-param-reassign */
const treeListData = tasks.map((task) => {
  // @ts-expect-error expected
  task.Task_Assigned_Employee = null;
  employees.forEach((employee) => {
    if (
      employee.ID === task.Task_Assigned_Employee_ID
    ) {
      // @ts-expect-error expected
      task.Task_Assigned_Employee = employee;
    }
  });
  return task;
});
/* eslint-enable no-param-reassign */

const options = {
  dataSource: treeListData,
  keyExpr: 'Task_ID',
  parentIdExpr: 'Task_Parent_ID',
  width: '100%',
  showBorders: true,
  expandedRowKeys: [0],
  selectedRowKeys: [1],
  selection: {
    mode: 'multiple',
  },
  columns: [
    {
      dataField: 'Task_Subject',
      width: 300,
    },
    {
      dataField: 'Task_Assigned_Employee_ID',
      width: 300,
    },
    {
      dataField: 'Task_ID',
      width: 300,
    },
  ],
};

test('Aria expanded should be toggled true on Ctrl + → keypress', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    ...options,
    expandedRowKeys: [0],
  });

  const treeList = new TreeList(page, DEFAULT_SELECTOR);
  const expandableRow = treeList.getDataRow(0).element;
  const expandableCells = [
    treeList.getDataCell(0, 0).element,
    treeList.getDataCell(0, 1).element,
    treeList.getDataCell(0, 2).element,
  ];

  await expect(treeList.getContainer())
    .toHaveAttribute('aria-label', 'Tree list with 1 rows and 3 columns. Press Ctrl + right arrow to expand the focused node and Ctrl + left arrow to collapse it');
  await expect(expandableRow).toHaveAttribute('aria-expanded', 'false');

  for (const cell of expandableCells) {
    await expect(cell).toHaveAttribute('aria-expanded', 'false');
  }

  await expandableRow.click();
  await page.keyboard.press('Control+ArrowRight');
  await expect(expandableRow).toHaveAttribute('aria-expanded', 'true');

  for (const cell of expandableCells) {
    await expect(cell).toHaveAttribute('aria-expanded', 'true');
  }
});

test('Aria expanded should be toggled false on Ctrl + ← keypress', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    ...options,
    expandedRowKeys: [1],
  });

  const treeList = new TreeList(page, DEFAULT_SELECTOR);
  const expandableRow = treeList.getDataRow(0).element;
  const expandableCells = [
    treeList.getDataCell(0, 0).element,
    treeList.getDataCell(0, 1).element,
    treeList.getDataCell(0, 2).element,
  ];

  await expect(treeList.getContainer())
    .toHaveAttribute('aria-label', 'Tree list with 3 rows and 3 columns. Press Ctrl + right arrow to expand the focused node and Ctrl + left arrow to collapse it');
  await expect(expandableRow).toHaveAttribute('aria-expanded', 'true');

  for (const cell of expandableCells) {
    await expect(cell).toHaveAttribute('aria-expanded', 'true');
  }

  await expandableRow.click();
  await page.keyboard.press('Control+ArrowLeft');
  await expect(expandableRow).toHaveAttribute('aria-expanded', 'false');

  for (const cell of expandableCells) {
    await expect(cell).toHaveAttribute('aria-expanded', 'false');
  }
});
