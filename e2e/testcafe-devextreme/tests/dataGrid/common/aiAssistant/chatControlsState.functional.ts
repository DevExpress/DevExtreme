/* eslint-disable no-underscore-dangle */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import {
  AI_INTEGRATION_PAGE,
  FAIL,
  GRID_SELECTOR,
  HANG,
  baseGrid as gridDefaults,
  createGridWithAIAssistant,
  setupAIState,
  threeRows,
  twoRows,
} from './testHelpers';

const getAICallCount = ClientFunction(
  () => (window as any).__aiCallCount as number,
);

const baseGrid = (rows: unknown[]): Record<string, unknown> => ({
  ...gridDefaults,
  dataSource: rows,
});

const setAssistantExtra = (
  assistant: Record<string, unknown>,
): Promise<void> => ClientFunction(
  () => { (window as any).__aiAssistantExtra = assistant; },
  { dependencies: { assistant } },
)();

const hangingCommandGridOptions = (): any => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions: any) {
      if (loadOptions.take !== undefined) {
        const skip = loadOptions.skip ?? 0;

        return Promise.resolve({
          data: data.slice(skip, skip + loadOptions.take),
          totalCount: data.length,
        });
      }

      return new Promise(() => {});
    },
    totalCount: () => data.length,
  });

  return {
    dataSource: store,
    remoteOperations: true,
    columns: ['id', 'name', 'value'],
    showBorders: true,
    selection: { mode: 'multiple' },
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

          return { promise: Promise.resolve(response), abort: (): void => {} };
        },
      }),
      ...((window as any).__aiAssistantExtra ?? {}),
    },
  };
};

const createGridWithHangingCommand = async (
  responses: unknown[],
  assistant: Record<string, unknown> = {},
): Promise<void> => {
  await setupAIState({}, responses);
  await setAssistantExtra(assistant);

  return createWidget('dxDataGrid', hangingCommandGridOptions);
};

const sortByName = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };
const selectAll = { actions: [{ name: 'selectAll', args: {} }] };
const suggestionConfig = { chat: { suggestions: { items: [{ text: 'Sort by name' }] } } };

fixture`AI Assistant - Chat Controls State`
  .page(AI_INTEGRATION_PAGE);

test('N distinct prompts back-to-back should each execute once, in order, and apply to the grid', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  const steps = [
    { prompt: 'Sort by name', verify: async () => t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc') },
    { prompt: 'Sort by value', verify: async () => t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).eql('desc') },
    { prompt: 'Clear sorting', verify: async () => t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).eql(undefined) },
    { prompt: 'Group by name', verify: async () => t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(0) },
  ];

  for (let i = 0; i < steps.length; i += 1) {
    await t
      .typeText(aiChat.getInput(), steps[i].prompt)
      .pressKey('enter');

    await t.expect(aiChat.getSuccessMessages().count).eql(i + 1);
    await t.expect(aiChat.getSuccessActionItems(i).count).eql(1);
    await t.expect(aiChat.isInputDisabled()).notOk();

    await steps[i].verify();
  }

  await t.expect(getAICallCount()).eql(steps.length);
  await t.expect(aiChat.getMessages().count).eql(steps.length * 2);
}).before(async () => createGridWithAIAssistant(baseGrid(threeRows), [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
  { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
]));

test('Input should be disabled during LLM phase', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isInputDisabled()).ok();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [HANG]));

test('Input should be disabled during command execution phase', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  await t.expect(aiChat.isInputDisabled()).ok();
  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getPendingMessages().count).eql(1);
}).before(async () => createGridWithHangingCommand([selectAll]));

test('Input should be re-enabled after fulfillment', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(aiChat.isInputDisabled()).notOk();
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [sortByName]));

test('Input should be re-enabled after failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.isInputDisabled()).notOk();
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql(undefined);
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [FAIL]));

test('Input should be re-enabled after abort via popup close', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isInputDisabled()).ok();

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();

  await t.click(aiChat.getAbortConfirmYesButton());
  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.isInputDisabled()).notOk();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [HANG]));

test('Clear-chat button should be disabled during LLM phase', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isClearChatDisabled()).ok();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [HANG]));

test('Clear-chat button should be disabled during command execution phase', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  await t.expect(aiChat.isClearChatDisabled()).ok();
  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getPendingMessages().count).eql(1);
}).before(async () => createGridWithHangingCommand([selectAll]));

test('Clear-chat button should be re-enabled after fulfillment', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.isClearChatDisabled()).notOk();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [sortByName]));

test('Clear-chat button should be re-enabled after failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.isClearChatDisabled()).notOk();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [FAIL]));

test('Clear-chat button should be re-enabled after abort via popup close', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isClearChatDisabled()).ok();

  await t.click(aiChat.getCloseButton().element);
  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();
  await t.click(aiChat.getAbortConfirmYesButton());
  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.isClearChatDisabled()).notOk();
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [HANG]));

test('Clear-chat should remove all messages from chat and leave grid state unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await t.click(aiChat.getClearChatButton());

  await t.expect(aiChat.getMessages().count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [sortByName]));

test('Suggestions should be disabled during LLM phase and dispatch no second request', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.isSuggestionDisabled(0)).ok();
  await t.expect(getAICallCount()).eql(1);
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [HANG], suggestionConfig));

test('Suggestions should be disabled during command execution phase and dispatch no second request', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  await t.expect(aiChat.isSuggestionDisabled(0)).ok();
  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(getAICallCount()).eql(1);
}).before(async () => createGridWithHangingCommand([selectAll], suggestionConfig));

test('Suggestions should be re-enabled after resolution', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.isSuggestionDisabled(0)).notOk();
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(baseGrid(twoRows), [sortByName], suggestionConfig));
