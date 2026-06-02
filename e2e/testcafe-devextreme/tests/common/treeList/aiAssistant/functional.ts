/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import TreeList from 'devextreme-testcafe-models/treeList';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

const GRID_SELECTOR = '#container';
const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

// TreeList reuses grid_core, so the AI Assistant feature is expected to behave like DataGrid.
// These tests verify that parity and the TreeList-only differences (no grouping/summary commands).

const getSchemaCommandNames = ClientFunction(() => ((window as any).__aiRequests[0]
  .data.responseSchema.properties.actions.items.anyOf as any[])
  .map((branch) => branch.properties.name.enum[0]));

// === §6.1 grid_core-level commands behave identically on TreeList ===

fixture.disablePageReloads`AI Assistant - TreeList Parity`
  .page(AI_INTEGRATION_PAGE);

// 6.1.1
test('Toolbar button, popup and chat behave like DataGrid (sorting)', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();
  await t.expect(treeList.getAIAssistantButton().exists).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t.expect(aiChat.element.visible).ok();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
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

// 6.1.2
test('Searching behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Search for Bob')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('searchPanel.text')).eql('Bob');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'searching', args: { text: 'Bob' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 6.1.3
test('Paging (pageSize) behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Show 50 rows per page')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('paging.pageSize')).eql(50);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  paging: { enabled: true, pageSize: 10 },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'pageSize', args: { pageSize: 50 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 6.1.4
// Column visibility behaves like DataGrid. columnsReorder is broken on TreeList (issue 4294),
// so reordering parity is not exercised here.
test('Column visibility behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide value column')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'visible')).eql(false);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
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

// 6.1.5
test('Selection (selectByKeys) behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select Bob')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('selectedRowKeys')).eql([2]);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple', recursive: false },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectByKeys', args: { keys: [2], preserve: false } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 6.1.6
test('Row focusing (focusRowByKey) behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Focus Bob')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('focusedRowKey')).eql(2);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  focusedRowEnabled: true,
  columns: ['name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'focusRowByKey', args: { key: 2 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 6.1.8
test('Error paths behave like DataGrid (invalid response)', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(treeList.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({ actions: null }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 6.1.9
test('In-flight lock behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isInputDisabled()).ok();
  await t.expect(aiChat.isClearChatDisabled()).ok();
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: new Promise(() => {}),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §6.2 DataGrid-only commands are not offered for TreeList ===

fixture.disablePageReloads`AI Assistant - TreeList Schema`
  .page(AI_INTEGRATION_PAGE);

// 6.2.1
test('grouping command is absent from the TreeList response schema', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  const commandNames = await getSchemaCommandNames();

  await t.expect(commandNames).contains('sorting');
  await t.expect(commandNames).notContains('grouping');
  await t.expect(commandNames).notContains('clearGrouping');
}).before(async () => createWidget('dxTreeList', () => {
  (window as any).__aiRequests = [];

  return {
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Alice', value: 30,
      },
      {
        id: 2, parentId: 1, name: 'Bob', value: 20,
      },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    columns: ['name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

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

// 6.2.2
test('summary commands are absent from the TreeList response schema', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  const commandNames = await getSchemaCommandNames();

  await t.expect(commandNames).notContains('summary');
  await t.expect(commandNames).notContains('clearSummary');
}).before(async () => createWidget('dxTreeList', () => {
  (window as any).__aiRequests = [];

  return {
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Alice', value: 30,
      },
      {
        id: 2, parentId: 1, name: 'Bob', value: 20,
      },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    columns: ['name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

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

// === §6.3 Hierarchical-data peculiarities ===

fixture.disablePageReloads`AI Assistant - TreeList Hierarchy`
  .page(AI_INTEGRATION_PAGE);

// 6.3.1
test('Filtering applies on hierarchical data', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Filter value greater than 15')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('filterValue')).eql(['value', '>', 15]);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
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
                  type: 'basic', field: 'value', operator: '>', value: 15,
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

// 6.3.2
test('Sorting applies with nested children', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value descending')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'sortOrder')).eql('desc');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
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

// 6.3.3
test('Selecting a parent row applies per TreeList selection rules', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select Alice')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(treeList.apiOption('selectedRowKeys')).eql([1]);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Alice', value: 30,
    },
    {
      id: 2, parentId: 1, name: 'Bob', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Charlie', value: 10,
    },
    {
      id: 4, parentId: 0, name: 'Dave', value: 40,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple', recursive: false },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectByKeys', args: { keys: [1], preserve: false } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));
