import { ClientFunction, Selector } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, formatMessage, GRID_SELECTOR } from './testHelpers';

const disposeGrid = ClientFunction(() => { (window as any).widget.dispose(); });

const abortMessage = (): Promise<string> => formatMessage('dxDataGrid-aiAssistantAbortMessage');

// === §5.2 Popup close mid-request (before any command executes) ===

fixture.disablePageReloads`AI Assistant - Popup Close Mid-Request`
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

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();

  await t.click(aiChat.getAbortConfirmYesButton());

  // No command ran: the grid is unchanged.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
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
          promise: new Promise(() => {}),
          abort: (): void => {},
        };
      },
    }),
  },
})));

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

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();

  await t.click(aiChat.getAbortConfirmYesButton());

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await abortMessage());
  await t.expect(aiChat.isInputDisabled()).notOk();
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
          promise: new Promise(() => {}),
          abort: (): void => {},
        };
      },
    }),
  },
})));

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

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();

  await t.click(aiChat.getAbortConfirmYesButton());

  await t.click(dataGrid.getAIAssistantButton());

  // Wait past the mocked resolution delay: the late result must not run any command.
  await t.wait(2000);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
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
          promise: new Promise((resolve) => {
            setTimeout(() => resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }), 1500);
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §5.3 / §5.4 are not covered as e2e ===
// §5.3 (close popup mid-execution) and §5.4 (re-open after a mid-execution close) cannot be
// reproduced deterministically: the popup cannot be closed while commands execute (issue 4282),
// and every non-selection command resolves within microtasks, so there is no observable
// "mid-execution" window to close into. These remain manual-only / unit-test scenarios.

// === §5.5 Grid destroyed (dispose) mid-request / mid-execution ===

fixture.disablePageReloads`AI Assistant - Dispose`
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

  // Allow the mocked resolution to fire after dispose; it must not touch the destroyed grid.
  await t.wait(2000);

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
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
          promise: new Promise((resolve) => {
            setTimeout(() => resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }), 1500);
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 5.5.2
test('Disposing the grid mid-execution should not throw', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  // The selectAll command is awaiting a server key-load that never resolves — mid-execution.
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

  // Re-create a fresh instance in the same container with a normal (resolving) integration.
  await createWidget('dxDataGrid', () => ({
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
  }));

  dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
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
          promise: new Promise(() => {}),
          abort: (): void => {},
        };
      },
    }),
  },
})));
