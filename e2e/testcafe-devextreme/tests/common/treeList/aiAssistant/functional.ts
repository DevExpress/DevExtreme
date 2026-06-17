/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import TreeList from 'devextreme-testcafe-models/treeList';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

const GRID_SELECTOR = '#container';
const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');
const PENDING = '__pending__';
const hierarchyRows = [
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
];

const getSchemaCommandNames = ClientFunction(() => ((window as any).__aiRequests[0]
  .data.responseSchema.properties.actions.items.anyOf as any[])
  .map((branch) => branch.properties.name.enum[0]));

const setupAIState = ClientFunction((base: Record<string, unknown>, responses: unknown[]) => {
  (window as any).__aiBase = base;
  (window as any).__aiResponses = responses;
  (window as any).__aiCallCount = 0;
  (window as any).__aiRequests = [];
});

const aiTreeListOptions = (): any => ({
  ...(window as any).__aiBase,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest(params: any) {
        const w = window as any;

        w.__aiRequests.push(params);

        const response = w.__aiResponses[w.__aiCallCount];

        w.__aiCallCount += 1;

        if (response === '__pending__') {
          return { promise: new Promise(() => {}), abort: (): void => {} };
        }

        if (response === undefined) {
          return {
            promise: Promise.reject(new Error('Unexpected AI call')),
            abort: (): void => {},
          };
        }

        return { promise: Promise.resolve(response), abort: (): void => {} };
      },
    }),
  },
});

const treeListBase = (
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  dataSource: hierarchyRows,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['name', 'value'],
  showBorders: true,
  ...overrides,
});

const createTreeListWithAIAssistant = async (
  base: Record<string, unknown>,
  responses: unknown[],
): Promise<void> => {
  await setupAIState(base, responses);

  return createWidget('dxTreeList', aiTreeListOptions);
};

fixture`AI Assistant - TreeList`
  .page(AI_INTEGRATION_PAGE);

// === §6.1 grid_core-level commands behave identically on TreeList ===

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
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('searchPanel.text')).eql('Bob');
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  { actions: [{ name: 'searching', args: { text: 'Bob' } }] },
]));

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('paging.pageSize')).eql(50);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ paging: { enabled: true, pageSize: 10 } }),
  [{ actions: [{ name: 'pageSize', args: { pageSize: 50 } }] }],
));

// 6.1.4
test('Column visibility behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Hide value column')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'visible')).eql(false);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ columnChooser: { enabled: true } }),
  [{ actions: [{ name: 'columnsVisibility', args: { dataField: 'value', visible: false } }] }],
));

// 6.1.4
test('Column reorder behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Move the value column to the first position')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'visibleIndex')).eql(0);
  await t.expect(treeList.apiColumnOption('name', 'visibleIndex')).eql(1);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ allowColumnReordering: true }),
  [{ actions: [{ name: 'columnsReorder', args: { dataField: 'value', visibleIndex: 0 } }] }],
));

// 6.1.4 — columnsPinning parity.
test('Column pinning behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Pin the value column to the left')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'fixed')).eql(true);
  await t.expect(treeList.apiColumnOption('value', 'fixedPosition')).eql('left');
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ columnFixing: { enabled: true } }),
  [{
    actions: [{
      name: 'columnsPinning',
      args: { dataField: 'value', fixed: true, fixedPosition: 'left' },
    }],
  }],
));

// 6.1.4 — columnsResize parity.
test('Column resize behaves like DataGrid', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Set the value column width to 250')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'width')).eql(250);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ allowColumnResizing: true }),
  [{ actions: [{ name: 'columnsResize', args: { dataField: 'value', width: 250 } }] }],
));

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('selectedRowKeys')).eql([2]);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ selection: { mode: 'multiple', recursive: false } }),
  [{ actions: [{ name: 'selectByKeys', args: { keys: [2], preserve: false } }] }],
));

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('focusedRowKey')).eql(2);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ focusedRowEnabled: true }),
  [{ actions: [{ name: 'focusRowByKey', args: { key: 2 } }] }],
));

// 6.1.8
test('Error paths behave like DataGrid (invalid response)', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(treeList.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  { actions: null },
]));

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
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [PENDING]));

// === §6.2 DataGrid-only commands are not offered for TreeList ===

// 6.2.1
test('grouping command is absent from the TreeList response schema', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const commandNames = await getSchemaCommandNames();

  await t.expect(commandNames).contains('sorting');
  await t.expect(commandNames).notContains('grouping');
  await t.expect(commandNames).notContains('clearGrouping');
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

// 6.2.2
test('summary commands are absent from the TreeList response schema', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const commandNames = await getSchemaCommandNames();

  await t.expect(commandNames).contains('sorting');
  await t.expect(commandNames).notContains('summary');
  await t.expect(commandNames).notContains('clearSummary');
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

// === §6.3 Hierarchical-data peculiarities ===

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('filterValue')).eql(['value', '>', 15]);
}).before(async () => createTreeListWithAIAssistant(treeListBase(), [
  {
    actions: [{
      name: 'filterValue',
      args: {
        expression: {
          rootId: 'n1',
          nodes: [{
            id: 'n1',
            expr: {
              type: 'basic', field: 'value', operator: '>', value: 15,
            },
          }],
        },
      },
    }],
  },
]));

// 6.3.2
test('Sorting keeps nested children grouped under their parent', async (t) => {
  const treeList = new TreeList(GRID_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.click(treeList.getAIAssistantButton());

  const aiChat = treeList.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value descending')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiColumnOption('value', 'sortOrder')).eql('desc');
  await t.expect(treeList.getDataCell(0, 1).element.textContent).eql('10');
  await t.expect(treeList.getDataCell(1, 1).element.textContent).eql('5');
  await t.expect(treeList.getDataCell(2, 1).element.textContent).eql('100');
  await t.expect(treeList.getDataCell(3, 1).element.textContent).eql('50');
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({
    dataSource: [
      {
        id: 1, parentId: 0, name: 'Alice', value: 5,
      },
      {
        id: 2, parentId: 1, name: 'Bob', value: 100,
      },
      {
        id: 3, parentId: 1, name: 'Charlie', value: 50,
      },
      {
        id: 4, parentId: 0, name: 'Dave', value: 10,
      },
    ],
  }),
  [{ actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] }],
));

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
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(treeList.apiOption('selectedRowKeys')).eql([1]);
}).before(async () => createTreeListWithAIAssistant(
  treeListBase({ selection: { mode: 'multiple', recursive: false } }),
  [{ actions: [{ name: 'selectByKeys', args: { keys: [1], preserve: false } }] }],
));
