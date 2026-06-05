/* eslint-disable no-underscore-dangle */
import { ClientFunction, Selector } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { AIAssistantChat } from 'devextreme-testcafe-models/dataGrid/aiAssistantChat';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, GRID_SELECTOR } from './testHelpers';

const gridOptions = {
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
};

const sortNameAsc = [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }];

const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key),
);

const abortMessage = (): Promise<string> => formatMessage('dxDataGrid-aiAssistantAbortMessage');

const disposeGrid = ClientFunction(() => { (window as any).widget.dispose(); });

const wasAbortCalled = ClientFunction(() => (window as any).__aiAbortCalled === true);

const setupAIState = ClientFunction((config: any) => {
  (window as any).__aiConfig = config;
  (window as any).__aiAbortCalled = false;
});

const aiGridOptions = (): any => {
  const {
    options, mode, actions, delay,
  } = (window as any).__aiConfig;

  const sendRequest = (): any => {
    const abort = (): void => { (window as any).__aiAbortCalled = true; };

    if (mode === 'never') {
      return { promise: new Promise(() => {}), abort };
    }

    if (mode === 'delayed') {
      return {
        promise: new Promise((resolve) => { setTimeout(() => resolve({ actions }), delay); }),
        abort,
      };
    }

    return { promise: Promise.resolve({ actions }), abort };
  };

  return {
    ...options,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({ sendRequest }),
    },
  };
};

const createGridWithAI = async (config: Record<string, unknown>): Promise<void> => {
  await setupAIState(config);

  return createWidget('dxDataGrid', aiGridOptions);
};

const closeAndConfirmAbort = async (t: TestController, aiChat: AIAssistantChat): Promise<void> => {
  await t.click(aiChat.getCloseButton().element);
  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();
  await t.click(aiChat.getAbortConfirmYesButton());
};

// === §5.2 Popup close mid-request (before any command executes) ===

fixture`AI Assistant - Popup Close Mid-Request`
  .page(AI_INTEGRATION_PAGE);

// 5.2.1
test('Closing the popup mid-request should abort and leave the grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeAndConfirmAbort(t, aiChat);

  await t.expect(wasAbortCalled()).ok();
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAI({ options: gridOptions, mode: 'never' }));

// 5.2.2
test('Re-opening after a mid-request close shows the aborted response and re-enables input', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeAndConfirmAbort(t, aiChat);

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await abortMessage());
  await t.expect(aiChat.isInputDisabled()).notOk();
}).before(async () => createGridWithAI({ options: gridOptions, mode: 'never' }));

// 5.2.3
test('Late LLM resolution after abort should be ignored', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeAndConfirmAbort(t, aiChat);

  await t.wait(2000);

  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
}).before(async () => createGridWithAI({
  options: gridOptions, mode: 'delayed', actions: sortNameAsc, delay: 1500,
}));

// === §5.3 / §5.4 are not covered as e2e ===
// §5.3 (close popup mid-execution) and §5.4 (re-open after a mid-execution close) cannot be
// reproduced deterministically: the popup cannot be closed while commands execute (issue 4282),
// and every non-selection command resolves within microtasks, so there is no observable
// "mid-execution" window to close into. These remain manual-only / unit-test scenarios.

// === §5.5 Grid destroyed (dispose) mid-request / mid-execution ===

fixture`AI Assistant - Dispose`
  .page(AI_INTEGRATION_PAGE);

// 5.5.1
test('Disposing the grid mid-request should not throw and ignore the late resolution', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await disposeGrid();

  await t.wait(2000);

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
}).before(async () => createGridWithAI({
  options: gridOptions, mode: 'delayed', actions: sortNameAsc, delay: 1500,
}));

// 5.5.2
test('Disposing the grid mid-execution should not throw', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  await t.expect(aiChat.isInputDisabled()).ok();

  await disposeGrid();

  await t.wait(500);

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
}).before(async () => createWidget('dxDataGrid', () => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'id',
    load(opts: any) {
      if (opts.take !== undefined) {
        const skip = opts.skip ?? 0;

        return Promise.resolve({
          data: data.slice(skip, skip + opts.take),
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
          return {
            promise: Promise.resolve({ actions: [{ name: 'selectAll', args: {} }] }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 5.5.3
test('Re-creating the grid after a dispose-during-flight yields a usable instance', async (t) => {
  let dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  let aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await disposeGrid();

  await createGridWithAI({ options: gridOptions, mode: 'resolved', actions: sortNameAsc });

  dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAI({ options: gridOptions, mode: 'never' }));
