/* eslint-disable no-underscore-dangle */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, GRID_SELECTOR } from './testHelpers';

// === §1.2 Single-command request, successful execution ===

fixture.disablePageReloads`AI Assistant - Single Command`
  .page(AI_INTEGRATION_PAGE);

// 1.2.1
test('Single sorting command should execute successfully and update grid', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(1);

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.2.2
test('No-args command (clearSorting) should execute successfully', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 1).element.textContent).eql('Alice');

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', sortOrder: 'asc' },
    { dataField: 'value' },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'clearSorting', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §1.3 Multi-command request ===

fixture.disablePageReloads`AI Assistant - Multi Command`
  .page(AI_INTEGRATION_PAGE);

// 1.3.1
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

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');
  const searchText = await dataGrid.apiOption('searchPanel.text');

  await t.expect(sortOrder).eql('asc');
  await t.expect(searchText).eql('Alice');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  searchPanel: { visible: true },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
              { name: 'searching', args: { text: 'Alice' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.3.2
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

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'desc' } },
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §1.4 Local vs remote data parity ===

fixture.disablePageReloads`AI Assistant - Data Parity`
  .page(AI_INTEGRATION_PAGE);

// 1.4.1
test('Single command should succeed with local array data source', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const sortOrder = await dataGrid.apiColumnOption('value', 'sortOrder');

  await t.expect(sortOrder).eql('desc');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.4.2
test('Remote data parity — command should succeed with server-side data source', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name ascending')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
}).before(async () => createWidget('dxDataGrid', () => {
  const data = [
    { id: 1, name: 'Charlie', value: 10 },
    { id: 2, name: 'Alice', value: 30 },
    { id: 3, name: 'Bob', value: 20 },
  ];
  const arrayStore = new (window as any).DevExpress.data.ArrayStore({
    key: 'id',
    data,
  });
  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'id',
    load(o) {
      return Promise.all([
        arrayStore.load(o),
        arrayStore.totalCount(o),
      ]).then((res) => ({
        data: res[0],
        totalCount: res[1],
      }));
    },
  });

  return {
    dataSource: store,
    remoteOperations: true,
    columns: ['id', 'name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// === §3.7 Stacked operations ===

fixture.disablePageReloads`AI Assistant - Stacked Operations`
  .page(AI_INTEGRATION_PAGE);

// 3.7.1
test('Group then ungroup across two prompts should both succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  let groupIndex = await dataGrid.apiColumnOption('name', 'groupIndex');

  await t.expect(groupIndex).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t
    .typeText(aiChat.getInput(), 'Clear grouping')
    .pressKey('enter');

  groupIndex = await dataGrid.apiColumnOption('name', 'groupIndex');

  await t.expect(groupIndex).eql(undefined);
  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
    { actions: [{ name: 'clearGrouping', args: {} }] },
  ];

  return {
    dataSource: [
      { id: 1, name: 'Alice', value: 30 },
      { id: 2, name: 'Bob', value: 20 },
      { id: 3, name: 'Alice', value: 10 },
    ],
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          const count = (window as any).__callCount;
          (window as any).__callCount = count + 1;

          return {
            promise: Promise.resolve(responses[count] ?? responses[0]),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 3.7.2
test('Filter then clear filter across two prompts should both succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 20')
    .pressKey('enter');

  let filterValue = await dataGrid.apiOption('filterValue');

  await t.expect(filterValue).eql(['value', '>', 20]);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);

  await t
    .typeText(aiChat.getInput(), 'Clear filter')
    .pressKey('enter');

  filterValue = await dataGrid.apiOption('filterValue');

  await t.expect(filterValue).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    {
      actions: [{
        name: 'filterValue',
        args: {
          expression: {
            type: 'basic', field: 'value', operator: '>', value: 20,
          },
        },
      }],
    },
    { actions: [{ name: 'clearFilter', args: {} }] },
  ];

  return {
    dataSource: [
      { id: 1, name: 'Alice', value: 30 },
      { id: 2, name: 'Bob', value: 20 },
      { id: 3, name: 'Charlie', value: 10 },
    ],
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          const count = (window as any).__callCount;
          (window as any).__callCount = count + 1;

          return {
            promise: Promise.resolve(responses[count] ?? responses[0]),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 3.7.3
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

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);

  await t
    .typeText(aiChat.getInput(), 'Go to page 2')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');
  const groupIndex = await dataGrid.apiColumnOption('name', 'groupIndex');
  const pageIndex = await dataGrid.apiOption('paging.pageIndex');

  await t.expect(sortOrder).eql('asc');
  await t.expect(groupIndex).eql(0);
  await t.expect(pageIndex).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(2).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
    { actions: [{ name: 'pageIndex', args: { pageIndex: 1 } }] },
  ];

  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i % 5}`,
    value: (i + 1) * 10,
  }));

  return {
    dataSource: data,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    paging: { pageSize: 10 },
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          const count = (window as any).__callCount;
          (window as any).__callCount = count + 1;

          return {
            promise: Promise.resolve(responses[count] ?? responses[0]),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// === §3.1 Empty dataset ===

fixture.disablePageReloads`AI Assistant - Empty Dataset`
  .page(AI_INTEGRATION_PAGE);

// 3.1.1
test('Sort on empty grid should succeed with no rows', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.1.2
test('Filter on empty grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 10')
    .pressKey('enter');

  const filterValue = await dataGrid.apiOption('filterValue');

  await t.expect(filterValue).eql(['value', '>', 10]);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{
              name: 'filterValue',
              args: {
                expression: {
                  type: 'basic', field: 'value', operator: '>', value: 10,
                },
              },
            }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.1.3
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
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectAll', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §3.2 Single-row dataset ===

fixture.disablePageReloads`AI Assistant - Single Row`
  .page(AI_INTEGRATION_PAGE);

// 3.2.1
test('Sort on single-row grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(dataGrid.getDataCell(0, 1).element.textContent).eql('Alice');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.2.2
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
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectByIndexes', args: { indexes: [1] } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.2.3
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
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [{ id: 1, name: 'Alice', value: 30 }],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectByIndexes', args: { indexes: [5] } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §3.3 Large dataset ===

fixture.disablePageReloads`AI Assistant - Large Dataset`
  .page(AI_INTEGRATION_PAGE);

// 3.3.1
test('Page navigation on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Go to page 100')
    .pressKey('enter');

  const pageIndex = await dataGrid.apiOption('paging.pageIndex');

  await t.expect(pageIndex).eql(99);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  return {
    dataSource: data,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    paging: { pageSize: 10 },
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [{ name: 'pageIndex', args: { pageIndex: 99 } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 3.3.2
test('Grouping on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  const groupIndex = await dataGrid.apiColumnOption('name', 'groupIndex');

  await t.expect(groupIndex).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  const data = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Group ${i % 10}`,
    value: (i + 1) * 10,
  }));

  return {
    dataSource: data,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    paging: { pageSize: 20 },
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 3.3.3
test('Page size change on large dataset should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Show 200 rows per page')
    .pressKey('enter');

  const pageSize = await dataGrid.apiOption('paging.pageSize');

  await t.expect(pageSize).eql(200);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  const data = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  return {
    dataSource: data,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    paging: { pageSize: 10 },
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [{ name: 'pageSize', args: { pageSize: 200 } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// === §3.4 Single-column grid ===

fixture.disablePageReloads`AI Assistant - Single Column`
  .page(AI_INTEGRATION_PAGE);

// 3.4.1
test('Sort on single-column grid should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { name: 'Charlie' },
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.4.2
test('Reorder on single-column grid should succeed without crash', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Reorder columns')
    .pressKey('enter');

  const visibleIndex = await dataGrid.apiColumnOption('name', 'visibleIndex');

  await t.expect(visibleIndex).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
  allowColumnReordering: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'columnsReorder', args: { dataField: 'name', visibleIndex: 0 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.4.3
test('Hide the only column should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide name column')
    .pressKey('enter');

  const visible = await dataGrid.apiColumnOption('name', 'visible');

  await t.expect(visible).eql(false);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { name: 'Alice' },
    { name: 'Bob' },
  ],
  columns: ['name'],
  showBorders: true,
  columnChooser: { enabled: true },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: false } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §3.5 All columns hidden before request ===

fixture.disablePageReloads`AI Assistant - All Columns Hidden`
  .page(AI_INTEGRATION_PAGE);

// 3.5.1
test('Show column from all-hidden state should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Show name column')
    .pressKey('enter');

  const visible = await dataGrid.apiColumnOption('name', 'visible');

  await t.expect(visible).eql(true);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(dataGrid.getDataCell(0, 0).element.textContent).eql('Alice');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', visible: false },
    { dataField: 'name', visible: false },
    { dataField: 'value', visible: false },
  ],
  showBorders: true,
  columnChooser: { enabled: true },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: true } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.5.2
test('Sort while all columns hidden should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', visible: false },
    { dataField: 'name', visible: false },
    { dataField: 'value', visible: false },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.5.3
test('Filter while all columns hidden should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value > 10')
    .pressKey('enter');

  const filterValue = await dataGrid.apiOption('filterValue');

  await t.expect(filterValue).eql(['value', '>', 10]);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', visible: false },
    { dataField: 'name', visible: false },
    { dataField: 'value', visible: false },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{
              name: 'filterValue',
              args: {
                expression: {
                  type: 'basic', field: 'value', operator: '>', value: 10,
                },
              },
            }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §3.6 Feature already in target state ===

fixture.disablePageReloads`AI Assistant - Already In Target State`
  .page(AI_INTEGRATION_PAGE);

// 3.6.1
test('Sort by X when already sorted by X should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name asc')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', sortOrder: 'asc' },
    { dataField: 'value' },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.6.2
test('clearSorting when no sort should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'clearSorting', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.6.3
test('clearFilter when no filter should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear filter')
    .pressKey('enter');

  await t.expect(dataGrid.getDataRows().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'clearFilter', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.6.4
test('clearSelection when no selection should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear selection')
    .pressKey('enter');

  const selectedRowKeys = await dataGrid.apiOption('selectedRowKeys');

  await t.expect(selectedRowKeys?.length).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'clearSelection', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.6.5
test('deselectAll when nothing selected should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Deselect all')
    .pressKey('enter');

  const selectedRowKeys = await dataGrid.apiOption('selectedRowKeys');

  await t.expect(selectedRowKeys?.length).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'deselectAll', args: {} }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.6.6
test('Hide already-hidden column should succeed', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide value column')
    .pressKey('enter');

  const visible = await dataGrid.apiColumnOption('value', 'visible');

  await t.expect(visible).eql(false);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name' },
    { dataField: 'value', visible: false },
  ],
  showBorders: true,
  columnChooser: { enabled: true },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'columnsVisibility', args: { dataField: 'value', visible: false } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));
