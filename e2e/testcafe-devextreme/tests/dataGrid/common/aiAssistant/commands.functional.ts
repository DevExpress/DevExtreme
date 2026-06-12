/* eslint-disable no-underscore-dangle */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import {
  AI_INTEGRATION_PAGE,
  GRID_SELECTOR,
  createGridWithAIAssistant,
  setupAIState,
  threeRows,
  twoRows,
} from './testHelpers';

const remoteAIGridOptions = (): any => {
  const { data, options } = (window as any).__aiBase;
  const arrayStore = new (window as any).DevExpress.data.ArrayStore({ key: 'id', data });
  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions: any) {
      return Promise.all([
        arrayStore.load(loadOptions),
        arrayStore.totalCount(loadOptions),
      ]).then((res: any[]) => ({ data: res[0], totalCount: res[1] }));
    },
  });

  return {
    ...options,
    dataSource: store,
    remoteOperations: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          const responses = (window as any).__aiResponses;
          const count = (window as any).__aiCallCount;
          const response = responses[count];

          (window as any).__aiCallCount = count + 1;

          if (response === undefined) {
            return {
              promise: Promise.reject(new Error(`Unexpected AI call #${count}`)),
              abort: (): void => {},
            };
          }

          return {
            promise: Promise.resolve(response),
            abort: (): void => {},
          };
        },
      }),
    },
  };
};

const createRemoteGridWithAIAssistant = async (
  data: unknown[],
  options: Record<string, unknown>,
  responses: unknown[],
): Promise<void> => {
  await setupAIState({ data, options }, responses);

  return createWidget('dxDataGrid', remoteAIGridOptions);
};

fixture`AI Assistant - Commands`
  .page(AI_INTEGRATION_PAGE);

test('Single sorting command should execute successfully and update grid', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('No-args command (clearSorting) should execute successfully', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql(undefined);
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', sortOrder: 'asc' },
    { dataField: 'value' },
  ],
  showBorders: true,
}, [
  { actions: [{ name: 'clearSorting', args: {} }] },
]));

test('Multi-command request should show all success entries', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name and search for Alice')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(2);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.apiOption('searchPanel.text')).eql('Alice');
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  searchPanel: { visible: true },
}, [
  {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'searching', args: { text: 'Alice' } },
    ],
  },
]));

test('Multi-command sequential ordering should be reflected in grid state', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name desc then asc')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(2);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'desc' } },
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    ],
  },
]));

test('Single command should succeed with local array data source', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).eql('desc');
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] },
]));

test('Remote data parity — command should succeed with server-side data source', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name ascending')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createRemoteGridWithAIAssistant(
  [
    { id: 1, name: 'Charlie', value: 10 },
    { id: 2, name: 'Alice', value: 30 },
    { id: 3, name: 'Bob', value: 20 },
  ],
  {
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ],
));

test('Group then ungroup across two prompts should both succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(0);

  await t
    .typeText(aiChat.getInput(), 'Clear grouping')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createGridWithAIAssistant({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Alice', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
  { actions: [{ name: 'clearGrouping', args: {} }] },
]));

test('Filter then clear filter across two prompts should both succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 20')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiOption('filterValue')).eql(['value', '>', 20]);

  await t
    .typeText(aiChat.getInput(), 'Clear filter')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
  await t.expect(dataGrid.apiOption('filterValue')).eql(null);
}).before(async () => createGridWithAIAssistant({
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  {
    actions: [{
      name: 'filterValue',
      args: {
        expression: {
          rootId: 'n1',
          nodes: [{
            id: 'n1',
            expr: {
              type: 'basic', field: 'value', operator: '>', value: 20,
            },
          }],
        },
      },
    }],
  },
  { actions: [{ name: 'clearFilter', args: {} }] },
]));

test('Sort, group, page combined across three prompts should all succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(0);

  await t
    .typeText(aiChat.getInput(), 'Go to page 2')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(2).count).eql(1);
  await t.expect(dataGrid.apiOption('paging.pageIndex')).eql(1);
}).before(async () => createGridWithAIAssistant({
  dataSource: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i % 5}`,
    value: (i + 1) * 10,
  })),
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  paging: { pageSize: 10 },
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
  { actions: [{ name: 'pageIndex', args: { pageIndex: 1 } }] },
]));

test('Sort should succeed with no rows', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.getDataRows().count).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('Filter on empty grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 10')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiOption('filterValue')).eql(['value', '>', 10]);
  await t.expect(dataGrid.getDataRows().count).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  {
    actions: [{
      name: 'filterValue',
      args: {
        expression: {
          rootId: 'n1',
          nodes: [{
            id: 'n1',
            expr: {
              type: 'basic', field: 'value', operator: '>', value: 10,
            },
          }],
        },
      },
    }],
  },
]));

test('SelectAll on empty grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect((await dataGrid.apiOption('selectedRowKeys'))?.length).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
}, [
  { actions: [{ name: 'selectAll', args: {} }] },
]));

test('Sort on single-row grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.getDataCell(0, 1).element.textContent).eql('Alice');
}).before(async () => createGridWithAIAssistant({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('selectByIndexes [1] on single-row grid should select the row', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select first row')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.getDataRow(0).isSelected).ok();
}).before(async () => createGridWithAIAssistant({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
}, [
  { actions: [{ name: 'selectionByIndexes', args: { indexes: [1], mode: 'select', scope: 'allPages' } }] },
]));

test('selectByIndexes [5] out of range on single-row grid should not crash', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select row 5')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);

  await t.expect(dataGrid.getDataRow(0).isSelected).notOk();
}).before(async () => createGridWithAIAssistant({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
}, [
  { actions: [{ name: 'selectionByIndexes', args: { indexes: [5], mode: 'select', scope: 'allPages' } }] },
]));

test('Page navigation on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Go to page 100')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiOption('paging.pageIndex')).eql(99);
}).before(async () => createGridWithAIAssistant({
  dataSource: Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  })),
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  paging: { pageSize: 10 },
}, [
  { actions: [{ name: 'pageIndex', args: { pageIndex: 99 } }] },
]));

test('Grouping on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Group ${i % 10}`,
    value: (i + 1) * 10,
  })),
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  paging: { pageSize: 20 },
}, [
  { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
]));

test('Page size change on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Show 200 rows per page')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiOption('paging.pageSize')).eql(200);
}).before(async () => createGridWithAIAssistant({
  dataSource: Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  })),
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  paging: { pageSize: 10 },
}, [
  { actions: [{ name: 'pageSize', args: { pageSize: 200 } }] },
]));

test('Sort on single-column grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  dataSource: [
    { name: 'Charlie' },
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('Reorder on single-column grid should succeed without crash', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Reorder columns')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'visibleIndex')).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: [
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
  allowColumnReordering: true,
}, [
  { actions: [{ name: 'columnsReorder', args: { dataField: 'name', visibleIndex: 0 } }] },
]));

test('Hide the only column should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide name column')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'visible')).eql(false);
}).before(async () => createGridWithAIAssistant({
  dataSource: [
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
  columnChooser: { enabled: true },
}, [
  { actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: false } }] },
]));

const allHiddenColumns = [
  { dataField: 'id', visible: false },
  { dataField: 'name', visible: false },
  { dataField: 'value', visible: false },
];

test('Show column from all-hidden state should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Show name column')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'visible')).eql(true);
  await t.expect(dataGrid.getDataCell(0, 0).element.textContent).eql('Alice');
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: allHiddenColumns,
  showBorders: true,
  columnChooser: { enabled: true },
}, [
  { actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: true } }] },
]));

test('Sort while all columns hidden should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: allHiddenColumns,
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('Filter while all columns hidden should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 10')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiOption('filterValue')).eql(['value', '>', 10]);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: allHiddenColumns,
  showBorders: true,
}, [
  {
    actions: [{
      name: 'filterValue',
      args: {
        expression: {
          rootId: 'n1',
          nodes: [{
            id: 'n1',
            expr: {
              type: 'basic', field: 'value', operator: '>', value: 10,
            },
          }],
        },
      },
    }],
  },
]));

test('Sort by X when already sorted by X should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name asc')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', sortOrder: 'asc' },
    { dataField: 'value' },
  ],
  showBorders: true,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

test('clearSorting when no sort should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql(undefined);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'clearSorting', args: {} }] },
]));

test('clearFilter when no filter should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear filter')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiOption('filterValue')).eql(null);
  await t.expect(dataGrid.getDataRows().count).eql(2);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
}, [
  { actions: [{ name: 'clearFilter', args: {} }] },
]));

test('clearSelection when no selection should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear selection')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect((await dataGrid.apiOption('selectedRowKeys'))?.length).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
}, [
  { actions: [{ name: 'clearSelection', args: {} }] },
]));

test('deselectAll when nothing selected should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Deselect all')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect((await dataGrid.apiOption('selectedRowKeys'))?.length).eql(0);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
}, [
  { actions: [{ name: 'deselectAll', args: {} }] },
]));

test('Hide already-hidden column should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide value column')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('value', 'visible')).eql(false);
}).before(async () => createGridWithAIAssistant({
  dataSource: twoRows,
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name' },
    { dataField: 'value', visible: false },
  ],
  showBorders: true,
  columnChooser: { enabled: true },
}, [
  { actions: [{ name: 'columnsVisibility', args: { dataField: 'value', visible: false } }] },
]));
