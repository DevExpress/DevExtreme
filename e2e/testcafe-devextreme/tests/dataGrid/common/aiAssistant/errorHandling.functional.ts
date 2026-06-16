/* eslint-disable no-underscore-dangle */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import {
  AI_INTEGRATION_PAGE,
  FAIL,
  GRID_SELECTOR,
  baseGrid as gridDefaults,
  createGridWithAIAssistant,
  getLoggedErrorIds,
  setupAIState,
  threeRows,
} from './testHelpers';

type AIChat = ReturnType<DataGrid['getAIAssistantChat']>;

const baseGrid = { ...gridDefaults, dataSource: threeRows };

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

const errorHeader = (): Promise<string> => formatMessage(
  'dxDataGrid-aiAssistantErrorMessageHeader',
);

const getSelectedRowsCount = ClientFunction(
  () => (window as any).widget.getSelectedRowsData().length,
);

const noIntegrationOptions = (): any => ({
  ...(window as any).__aiBase,
  aiAssistant: { enabled: true },
});

const createGridWithoutIntegration = async (
  base: Record<string, unknown>,
): Promise<void> => {
  await setupAIState(base, []);

  return createWidget('dxDataGrid', noIntegrationOptions);
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
  await t.expect(aiChat.getMessageHeader(0).innerText).eql(await errorHeader());
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
};

fixture`AI Assistant - Error Handling`
  .page(AI_INTEGRATION_PAGE);

test('Empty actions array should show no-action message and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Tell me a joke');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [] }],
));

test('Sorting by a non-existent column should fail: schema is valid but incompatible with grid state', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by Salary');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiGetDataSourceSortParams()).notOk();
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'sorting', args: { dataField: 'Salary', sortOrder: 'asc' } }] }],
));

test('Selecting non-existent keys should succeed: schema is valid and the missing data is not sent in the request', async (t) => {
  const { aiChat } = await openChatAndSubmit(t, 'Select rows 999 and 1000');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(0);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(getSelectedRowsCount()).eql(0);
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, selection: { mode: 'multiple' } },
  [{ actions: [{ name: 'selectByKeys', args: { keys: [999, 1000], preserve: false } }] }],
));

test('sendRequest rejection should show error message and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [FAIL],
));

test('Missing aiIntegration should show an error and leave grid unchanged', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
  await t.expect(await getLoggedErrorIds(t)).contains('E1068');
}).before(async () => createGridWithoutIntegration(baseGrid));

test('Non-JSON string response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  ['not json'],
));

test('Non-JSON actions string should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: 'not json' }],
));

test('Empty string response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [''],
));

test('Response missing actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{}],
));

test('Object actions (not array) should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: { name: 'sorting' } }],
));

test('Null actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: null }],
));

test('Primitive actions should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: 42 }],
));

test('Null response should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [null],
));

test('Unknown command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'unknownCmd', args: {} }] }],
));

test('Non-string command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 123, args: {} }] }],
));

test('Empty command name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: '', args: {} }] }],
));

test('Action without name should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ args: {} }] }],
));

test('Action without args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'sorting' }] }],
));

test('Null args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'sorting', args: null }] }],
));

test('Args missing a required property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'sorting', args: { sortOrder: 'asc' } }] }],
));

test('Args with a wrong-typed property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 123 } }] }]));

test('Args with an extra property should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc', foo: 'bar' } }] }]));

test('Mix of valid and invalid actions should reject the whole response', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Sort by name');

  // expectInvalidResponse also asserts the valid sorting action did NOT execute.
  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(baseGrid, [{
  actions: [
    { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    { name: 'unknownCmd', args: {} },
  ],
}]));

test('No-arg command with non-empty args should show invalid-response error', async (t) => {
  const { dataGrid, aiChat } = await openChatAndSubmit(t, 'Clear sorting');

  await expectInvalidResponse(t, aiChat, dataGrid);
}).before(async () => createGridWithAIAssistant(
  baseGrid,
  [{ actions: [{ name: 'clearSorting', args: { foo: 1 } }] }],
));

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
}).before(async () => createGridWithAIAssistant({ ...baseGrid, columns: groupingLockedColumns }, [{
  actions: [
    { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
    { name: 'searching', args: { text: 'Alice' } },
  ],
}]));

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
}).before(async () => createGridWithAIAssistant({ ...baseGrid, columns: groupingLockedColumns }, [{
  actions: [
    { name: 'sorting', args: { dataField: 'NopeOne', sortOrder: 'asc' } },
    { name: 'sorting', args: { dataField: 'NopeTwo', sortOrder: 'desc' } },
    { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
  ],
}]));
