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

const wasAIRequestResolved = ClientFunction(() => (window as any).__aiRequestResolved === true);

const resolveAIRequest = ClientFunction(() => { (window as any).__resolveAIRequest(); });

const setupAIState = ClientFunction((config: any) => {
  (window as any).__aiConfig = config;
  (window as any).__aiAbortCalled = false;
  (window as any).__aiRequestResolved = false;
});

const aiGridOptions = (): any => {
  const { options, mode, actions } = (window as any).__aiConfig;

  const sendRequest = (): any => {
    const abort = (): void => { (window as any).__aiAbortCalled = true; };

    if (mode === 'never') {
      return { promise: new Promise(() => {}), abort };
    }

    if (mode === 'delayed') {
      return {
        promise: new Promise((resolve) => {
          (window as any).__resolveAIRequest = (): void => {
            (window as any).__aiRequestResolved = true;
            resolve({ actions });
          };
        }),
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

fixture`AI Assistant - Interruption`
  .page(AI_INTEGRATION_PAGE);

// === §5.2 Popup close mid-request (before any command executes) ===

test('Closing the popup mid-request aborts, leaves the grid unchanged, and shows the aborted response on re-open', async (t) => {
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
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();

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

  await resolveAIRequest();
  await t.expect(wasAIRequestResolved()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
}).before(async () => createGridWithAI({
  options: gridOptions, mode: 'delayed', actions: sortNameAsc,
}));

// === §5.3 Popup close mid-execution / §5.4 Re-open after a mid-execution close ===

const resolveSelectAll = ClientFunction(() => { (window as any).__resolveSelectAll(); });
const selectAllStarted = ClientFunction(() => (window as any).__selectAllStarted === true);

// 5.3.1 / 5.3.4 / 5.3.5 / 5.4.1 / 5.4.2
test('Closing the popup mid-execution aborts the remaining commands and keeps the completed ones', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name, select all, then sort by value')
    .pressKey('enter');

  // Command #1 (sort by name) has applied; command #2 (selectAll) is now in flight and delayed.
  await t.expect(selectAllStarted()).ok();
  await t.expect(aiChat.isInputDisabled()).ok();

  // Close the popup mid-execution → confirm dialog → abort.
  await closeAndConfirmAbort(t, aiChat);

  // Let the delayed selectAll resolve; the loop then sees the abort flag and stops before #3.
  await resolveSelectAll();

  // Re-open to inspect the resulting response.
  await t.click(dataGrid.getAIAssistantButton());

  // An aborted command makes the whole message a failure: 2 successes + 1 aborted entry.
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(2);
  await t.expect(aiChat.getAbortedActionItems(0).count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).notOk();
  await t.expect((await dataGrid.apiGetSelectedRowKeys()).length).eql(50);

  await t.expect(aiChat.getMessageRegenerateButton(0).count).eql(0);

  await t.expect(aiChat.isInputDisabled()).notOk();
}).before(async () => createWidget('dxDataGrid', () => {
  const w = window as any;

  w.__selectAllStarted = false;

  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  const store = new w.DevExpress.data.CustomStore({
    key: 'id',
    load(opts: any) {
      if (opts.take !== undefined) {
        const skip = opts.skip ?? 0;

        return Promise.resolve({
          data: data.slice(skip, skip + opts.take),
          totalCount: data.length,
        });
      }

      w.__selectAllStarted = true;

      return new Promise((resolve) => {
        w.__resolveSelectAll = resolve.bind(resolve, data);
      });
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
      aiIntegration: new w.DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [
                { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
                { name: 'selectAll', args: {} },
                { name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } },
              ],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 5.4.3
test('Customized response title is applied to the partial (aborted) result', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name, select all, then sort by value')
    .pressKey('enter');

  await t.expect(selectAllStarted()).ok();

  await closeAndConfirmAbort(t, aiChat);

  await resolveSelectAll();

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageHeader(0).innerText).eql('Stopped before finishing');
}).before(async () => createWidget('dxDataGrid', () => {
  const w = window as any;

  w.__selectAllStarted = false;

  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  const store = new w.DevExpress.data.CustomStore({
    key: 'id',
    load(opts: any) {
      if (opts.take !== undefined) {
        const skip = opts.skip ?? 0;

        return Promise.resolve({
          data: data.slice(skip, skip + opts.take),
          totalCount: data.length,
        });
      }

      w.__selectAllStarted = true;

      return new Promise((resolve) => {
        w.__resolveSelectAll = resolve.bind(resolve, data);
      });
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
      customizeResponseTitle: (status: string) => (status === 'failure'
        ? 'Stopped before finishing'
        : 'All done'),
      aiIntegration: new w.DevExpress.aiIntegration.AIIntegration({
        sendRequest() {
          return {
            promise: Promise.resolve({
              actions: [
                { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
                { name: 'selectAll', args: {} },
                { name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } },
              ],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// === §5.5 Grid destroyed (dispose) mid-request / mid-execution ===

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

  await resolveAIRequest();
  await t.expect(wasAIRequestResolved()).ok();

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
  await t.expect(dataGrid.getAIAssistantChat().element.exists).notOk();

  const { error } = await t.getBrowserConsoleMessages();

  await t.expect(error).eql([]);
}).before(async () => createGridWithAI({
  options: gridOptions, mode: 'delayed', actions: sortNameAsc,
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
  await t.expect(dataGrid.getAIAssistantChat().element.exists).notOk();

  const { error } = await t.getBrowserConsoleMessages();

  await t.expect(error).eql([]);
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
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAI({ options: gridOptions, mode: 'never' }));
