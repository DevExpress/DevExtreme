/* eslint-disable no-underscore-dangle */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, GRID_SELECTOR } from './testHelpers';

type AIChat = ReturnType<DataGrid['getAIAssistantChat']>;

type AIResponseMock = { kind: 'resolve'; value: unknown }
  | { kind: 'reject'; error: string }
  | { kind: 'noIntegration' };

const threeRows = [
  { id: 1, name: 'Alice', value: 30 },
  { id: 2, name: 'Bob', value: 20 },
  { id: 3, name: 'Charlie', value: 10 },
];

const baseGrid = {
  dataSource: threeRows,
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
};

const groupingLockedColumns = [
  { dataField: 'id' },
  { dataField: 'name', allowGrouping: false },
  { dataField: 'value' },
];

const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key),
);

const invalidResponse = (): Promise<string> => formatMessage(
  'dxDataGrid-aiAssistantInvalidResponseMessage',
);

const setupAIMock = ClientFunction((base: Record<string, unknown>, mock: AIResponseMock) => {
  (window as any).__aiBase = base;
  (window as any).__aiMock = mock;
});

const aiGridOptions = (): any => {
  const base = (window as any).__aiBase;
  const mock = (window as any).__aiMock;

  if (mock.kind === 'noIntegration') {
    return { ...base, aiAssistant: { enabled: true } };
  }

  return {
    ...base,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: mock.kind === 'reject'
              ? Promise.reject(new Error(mock.error))
              : Promise.resolve(mock.value),
            abort: (): void => {},
          };
        },
      }),
    },
  };
};

const createGridWithAIAssistant = async (
  base: Record<string, unknown>,
  mock: AIResponseMock,
): Promise<void> => {
  await setupAIMock(base, mock);

  return createWidget('dxDataGrid', aiGridOptions);
};

const openChatAndSubmit = async (
  t: TestController,
  prompt: string,
): Promise<{ dataGrid: DataGrid; aiChat: AIChat }> => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), prompt)
    .pressKey('enter');

  return { dataGrid, aiChat };
};

const expectInvalidResponse = async (
  t: TestController,
  aiChat: AIChat,
  dataGrid: DataGrid,
): Promise<void> => {
  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
};

// === §2.1 Unsupported / unknown intent ===

fixture`AI Assistant - Empty Actions`
  .page(AI_INTEGRATION_PAGE);

// 2.1.3 — empty actions reject through the same "invalid response" path (§4.5).
test('Empty actions array should show no-action message and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Tell me a joke');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [] } },
));

// === §2.3 Unknown field ===

fixture`AI Assistant - Unknown Field`
  .page(AI_INTEGRATION_PAGE);

// 2.3.2 — schema-valid action, executor fails at runtime → per-action error entry.
test('Sorting by non-existent dataField should show failure message and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by Salary');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(await dataGrid.apiGetDataSourceSortParams()).notOk();
}).before(async () => createGridWithAIAssistant(baseGrid, {
  kind: 'resolve',
  value: { actions: [{ name: 'sorting', args: { dataField: 'Salary', sortOrder: 'asc' } }] },
}));

// === §2.4 Request impossible in current state ===

fixture`AI Assistant - Impossible State`
  .page(AI_INTEGRATION_PAGE);

// 2.4.1
test('Page index out of range should show failure status', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Go to page 10000');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiPageIndex()).eql(0);
}).before(async () => createGridWithAIAssistant({ ...baseGrid, paging: { pageSize: 2 } }, {
  kind: 'resolve',
  value: { actions: [{ name: 'pageIndex', args: { pageIndex: 9999 } }] },
}));

// 2.4.2
test('Grouping by non-groupable column should show failure entry', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Group by name');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createGridWithAIAssistant({ ...baseGrid, columns: groupingLockedColumns }, {
  kind: 'resolve',
  value: { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
}));

// 2.4.3 — selectByKeys with keys absent from the data selects nothing. The response is reported
// as a failure at the message level, but renders no per-action error entry (no row matched).
test('Selecting non-existent keys should show failure or no incorrect rows selected', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Select rows 999 and 1000');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiOption('selectedRowKeys')).eql([]);
}).before(async () => createGridWithAIAssistant({ ...baseGrid, selection: { mode: 'multiple' } }, {
  kind: 'resolve',
  value: { actions: [{ name: 'selectByKeys', args: { keys: [999, 1000] } }] },
}));

// === §2.6 Excessively long prompt / provider error ===

fixture`AI Assistant - Provider Error`
  .page(AI_INTEGRATION_PAGE);

// 2.6.2
test('sendRequest rejection should show error message and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'reject', error: 'Request payload too large' },
));

// === §4.1 AI integration failures → "unexpected error" / "invalid response" ===

fixture`AI Assistant - Integration Failure`
  .page(AI_INTEGRATION_PAGE);

// 4.1.1

test('Missing aiIntegration should show an error and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, { kind: 'noIntegration' }));

// 4.1.5
test('Non-JSON string response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: 'not json' },
));

// 4.1.6
test('Non-JSON actions string should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: 'not json' } },
));

// 4.1.7
test('Empty string response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: '' },
));

// === §4.2 Response format failure → "invalid response" ===

fixture`AI Assistant - Response Format`
  .page(AI_INTEGRATION_PAGE);

// 4.2.1
test('Response missing actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: {} },
));

// 4.2.2
test('Object actions (not array) should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: { name: 'sorting' } } },
));

// 4.2.3
test('Null actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: null } },
));

// 4.2.4
test('Primitive actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: 42 } },
));

// 4.2.5
test('Null response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: null },
));

// === §4.3 Validation failure (GridCommands.validate) → "invalid response" ===

fixture`AI Assistant - Validation`
  .page(AI_INTEGRATION_PAGE);

// 4.3.1
test('Unknown command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 'unknownCmd', args: {} }] } },
));

// 4.3.2
test('Non-string command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 123, args: {} }] } },
));

// 4.3.3
test('Empty command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: '', args: {} }] } },
));

// 4.3.4
test('Action without name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ args: {} }] } },
));

// 4.3.5
test('Action without args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 'sorting' }] } },
));

// 4.3.6
test('Null args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 'sorting', args: null }] } },
));

// 4.3.7
test('Args missing a required property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 'sorting', args: { sortOrder: 'asc' } }] } },
));

// 4.3.8
test('Args with a wrong-typed property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, {
  kind: 'resolve',
  value: { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 123 } }] },
}));

// 4.3.9
test('Args with an extra property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, {
  kind: 'resolve',
  value: { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc', foo: 'bar' } }] },
}));

// 4.3.10
test('Mix of valid and invalid actions should reject the whole response', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  // expectInvalidResponse also asserts the valid sorting action did NOT execute.
  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, {
  kind: 'resolve',
  value: {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'unknownCmd', args: {} },
    ],
  },
}));

// 4.3.11
test('No-arg command with non-empty args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Clear sorting');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  { kind: 'resolve', value: { actions: [{ name: 'clearSorting', args: { foo: 1 } }] } },
));

// === §4.4 Execution failure → per-command failure message ===

fixture`AI Assistant - Execution Failure`
  .page(AI_INTEGRATION_PAGE);

// 4.4.4
test('Partial failure should report each action status and apply successes', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort, group and search');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(2);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  // The failed grouping action carries its predefined per-command message.
  await t.expect(aiChat.getActionItemText(0, 1).innerText).contains('Group data against');
  // Successful actions (#1 sorting, #3 searching) took effect; failed grouping did not.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
  await t.expect(dataGrid.apiOption('searchPanel.text')).eql('Alice');
}).before(async () => createGridWithAIAssistant({ ...baseGrid, columns: groupingLockedColumns }, {
  kind: 'resolve',
  value: {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
      { name: 'searching', args: { text: 'Alice' } },
    ],
  },
}));

// 4.4.5
test('All-commands failure should report failures and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Do impossible things');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(0);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(3);
  // Each failed action keeps its own predefined per-command message.
  await t.expect(aiChat.getActionItemText(0, 0).innerText).contains('Sort data against');
  await t.expect(aiChat.getActionItemText(0, 2).innerText).contains('Group data against');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createGridWithAIAssistant({ ...baseGrid, columns: groupingLockedColumns }, {
  kind: 'resolve',
  value: {
    actions: [
      { name: 'sorting', args: { dataField: 'NopeOne', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'NopeTwo', sortOrder: 'desc' } },
      { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
    ],
  },
}));
