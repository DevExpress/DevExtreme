import TreeList from 'devextreme-testcafe-models/treeList';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Aria Label tests`.page(url(__dirname, '../../container.html'));

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

test('Aria expanded should be toggled true on Ctrl + → keypress', async (t) => {
  const treeList = new TreeList('#container');
  const expandableRow = treeList.getDataRow(0).element;
  const expandableCells = [
    treeList.getDataCell(0, 0).element,
    treeList.getDataCell(0, 1).element,
    treeList.getDataCell(0, 2).element,
  ];

  await t
    .expect(expandableRow.getAttribute('aria-expanded'))
    .eql('false');

  expandableCells.map(async (cell) => {
    await t.expect(cell.getAttribute('aria-expanded')).eql('false');
  });

  await t
    .click(expandableRow)
    .pressKey('ctrl+right')
    .expect(expandableRow.getAttribute('aria-expanded'))
    .eql('true');
  expandableCells.map(async (cell) => {
    await t.expect(cell.getAttribute('aria-expanded')).eql('true');
  });
}).before(async () => createWidget('dxTreeList', options));

test('Aria expanded should be toggled false on Ctrl + ← keypress', async (t) => {
  const treeList = new TreeList('#container');
  const expandableRow = treeList.getDataRow(0).element;
  const expandableCells = [
    treeList.getDataCell(0, 0).element,
    treeList.getDataCell(0, 1).element,
    treeList.getDataCell(0, 2).element,
  ];

  await t
    .expect(expandableRow.getAttribute('aria-expanded'))
    .eql('true');

  expandableCells.map(async (cell) => {
    await t.expect(cell.getAttribute('aria-expanded')).eql('true');
  });

  await t
    .click(expandableRow)
    .pressKey('ctrl+left')
    .expect(expandableRow.getAttribute('aria-expanded'))
    .eql('false');
  expandableCells.map(async (cell) => {
    await t.expect(cell.getAttribute('aria-expanded')).eql('false');
  });
}).before(async () => {
  options.expandedRowKeys = [1];
  await createWidget('dxTreeList', options);
});
