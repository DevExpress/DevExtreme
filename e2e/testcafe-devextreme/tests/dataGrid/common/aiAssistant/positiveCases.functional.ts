/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

const GRID_SELECTOR = '#container';
const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

// === §1.1 Toolbar entry point & popup lifecycle ===
fixture.disablePageReloads`AI Assistant - Toolbar`
  .page(AI_INTEGRATION_PAGE);

// 1.1.1
test('Toolbar button should be visible when aiAssistant.enabled is true', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getAIAssistantButton().exists).ok();
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
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
})));

// 1.1.2
test('Toolbar button should be hidden when aiAssistant is not configured', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getAIAssistantButton().exists).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
})));

// 1.1.3
test('Popup should open on toolbar button click', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .expect(aiChat.element.visible).ok()
    .expect(aiChat.getChat().element.exists).ok();
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
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
})));

// 1.1.4
test('Grid state should be preserved after popup close', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(1);

  await t.click(aiChat.getCloseButton().element);

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

// 1.1.6
test('Custom title should be rendered in popup header', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t.expect(aiChat.getTitle().textContent).contains('My Custom Assistant');
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
    title: 'My Custom Assistant',
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
})));

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

// === §1.5 Chat history accumulation ===

fixture.disablePageReloads`AI Assistant - Chat History`
  .page(AI_INTEGRATION_PAGE);

// 1.5.1
test('Chat history should accumulate across multiple prompts', async (t) => {
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
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    { actions: [{ name: 'clearSorting', args: {} }] },
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
          const response = responses[count] ?? responses[0];

          return {
            promise: Promise.resolve(response),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 1.5.2
test('Request payload should contain only the latest message', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);

  const requests = await ClientFunction(() => (window as any).__aiRequests)();

  await t
    .expect((requests as any[]).length)
    .eql(2)
    .expect((requests as any[])[0].data.text)
    .eql('Sort by name')
    .expect((requests as any[])[1].data.text)
    .eql('Clear sorting');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

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
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve({
              actions: [{ name: 'clearSorting', args: {} }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// === §1.6 Suggestions ===

fixture.disablePageReloads`AI Assistant - Suggestions`
  .page(AI_INTEGRATION_PAGE);

// 1.6.1
test('Suggestions should be shown in empty chat', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const suggestions = aiChat.getSuggestions();

  await t.expect(suggestions.count).eql(2);
  await t.expect(suggestions.nth(0).textContent).contains('Sort by name');
  await t.expect(suggestions.nth(1).textContent).contains('Clear filter');
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
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
    chat: {
      suggestions: {
        items: [{ text: 'Sort by name' }, { text: 'Clear filter' }],
      },
    },
  },
})));

// 1.6.2
test('Suggestions should be shown in non-empty chat', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const suggestions = aiChat.getSuggestions();

  await t.expect(suggestions.count).eql(2);
  await t.expect(suggestions.nth(0).textContent).contains('Sort by name');
  await t.expect(suggestions.nth(1).textContent).contains('Clear filter');
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
    chat: {
      suggestions: {
        items: [{ text: 'Sort by name' }, { text: 'Clear filter' }],
      },
    },
  },
})));

// 1.6.3
test('Suggestion click should send message and execute command', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const suggestions = aiChat.getSuggestions();

  await t.expect(suggestions.count).eql(2);

  await t.click(suggestions.nth(0));

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getUserMessages().count).eql(1);
  await t.expect(aiChat.getUserMessages().nth(0).textContent).eql('Sort by name');
  await t.expect(aiChat.getSuccessMessages().count).eql(1);

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
    chat: {
      user: {
        id: 'user',
      },
      suggestions: {
        items: [{ text: 'Sort by name' }, { text: 'Clear filter' }],
        onItemClick(e: any) {
          const chatEl = e.element.closest('.dx-chat');
          const chatInstance = (window as any).DevExpress.ui.dxChat.getInstance(chatEl);
          const message = {
            id: Date.now(),
            timestamp: new Date(),
            author: chatInstance.option('user'),
            text: e.itemData.text,
          };

          chatInstance.getDataSource().store().push([{
            type: 'insert',
            data: message,
          }]);
        },
      },
    },
  },
})));

// === §1.8 customizeResponseText / customizeResponseTitle — set at init ===

fixture.disablePageReloads`AI Assistant - CustomizeResponse`
  .page(AI_INTEGRATION_PAGE);

// 1.8.1
test('customizeResponseText at init should override success and failure messages', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name and invalid')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Custom success for sorting');
  await t.expect(aiChat.getActionItemText(0, 1).textContent).eql('Custom failure for sorting');
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
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
              { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
    customizeResponseText(command: any) {
      if (command.name === 'sorting') {
        return { success: 'Custom success for sorting', failure: 'Custom failure for sorting' };
      }
      return {};
    },
  },
})));

// 1.8.2
test('customizeResponseText partial override should only affect success status', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Custom success for sorting');
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
    customizeResponseText(command: any) {
      if (command.name === 'sorting') {
        return { success: 'Custom success for sorting' };
      }
      return {};
    },
  },
})));

// 1.8.3
test('customizeResponseText returning undefined should use default message', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  await t.expect(aiChat.getActionItemText(0, 0).textContent).contains('Sort data against');
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
    customizeResponseText() {
      return {};
    },
  },
})));

// 1.8.4
test('customizeResponseTitle at init should override message header', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getMessageHeader(0).textContent).eql('Custom Title');
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
    customizeResponseTitle() {
      return 'Custom Title';
    },
  },
})));

// === §1.9 customizeResponseText / customizeResponseTitle — changed at runtime ===

fixture.disablePageReloads`AI Assistant - CustomizeResponse Runtime`
  .page(AI_INTEGRATION_PAGE);

// 1.9.1
test('customizeResponseText changed at runtime should apply to subsequent messages only', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Original message');

  await dataGrid.apiOption('aiAssistant.customizeResponseText', () => ({ success: 'Updated message' }));

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getActionItemText(1, 0).textContent).eql('Updated message');
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Original message');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    { actions: [{ name: 'clearSorting', args: {} }] },
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
          const response = responses[count] ?? responses[0];

          return {
            promise: Promise.resolve(response),
            abort: (): void => {},
          };
        },
      }),
      customizeResponseText() {
        return { success: 'Original message' };
      },
    },
  };
}));

// 1.9.2
test('customizeResponseTitle changed at runtime should apply to subsequent messages only', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getMessageHeader(0).textContent).eql('Original Title');

  await dataGrid.apiOption('aiAssistant.customizeResponseTitle', () => 'Updated Title');

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getMessageHeader(1).textContent).eql('Updated Title');
  await t.expect(aiChat.getMessageHeader(0).textContent).eql('Original Title');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

  const responses = [
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    { actions: [{ name: 'clearSorting', args: {} }] },
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
          const response = responses[count] ?? responses[0];

          return {
            promise: Promise.resolve(response),
            abort: (): void => {},
          };
        },
      }),
      customizeResponseTitle() {
        return 'Original Title';
      },
    },
  };
}));

// === §1.10 A11y / KBN ===

fixture.disablePageReloads`AI Assistant - A11y`
  .page(AI_INTEGRATION_PAGE);

// 1.10.1
test('Toolbar button should be accessible and clickable', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const button = dataGrid.getAIAssistantButton();

  await t.expect(button.exists).ok();

  await t.click(button);

  await t.expect(dataGrid.getAIAssistantChat().element.visible).ok();
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
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
})));

// 1.10.2
test('Toolbar button should activate via Enter key', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const button = dataGrid.getAIAssistantButton();

  await t.expect(button.exists).ok();

  await dataGrid.focusAIAssistantButton();
  await t.pressKey('enter');

  await t.expect(dataGrid.getAIAssistantChat().element.visible).ok();
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
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
})));

// === §1.11 onAIAssistantRequestCreating ===

fixture.disablePageReloads`AI Assistant - RequestCreating`
  .page(AI_INTEGRATION_PAGE);

// 1.11.1
test('onAIAssistantRequestCreating should allow context customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const requests = await ClientFunction(() => (window as any).__aiRequests)();

  await t.expect((requests as any[])[0].data.context.customField).eql('customValue');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

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
    onAIAssistantRequestCreating(e: any) {
      e.context.customField = 'customValue';
    },
  };
}));

// 1.11.2
test('onAIAssistantRequestCreating should allow schema customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const requests = await ClientFunction(() => (window as any).__aiRequests)();

  await t.expect((requests as any[])[0].data.responseSchema.description).eql('Modified schema');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

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
    onAIAssistantRequestCreating(e: any) {
      e.responseSchema.description = 'Modified schema';
    },
  };
}));

// 1.11.3
test('onAIAssistantRequestCreating handler should receive grid component and element', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const handlerResult = await ClientFunction(() => (window as any).__requestCreatingArgs)();

  await t
    .expect(handlerResult.hasComponent).ok()
    .expect(handlerResult.hasElement).ok();
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

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
    onAIAssistantRequestCreating(e: any) {
      (window as any).__requestCreatingArgs = {
        hasComponent: !!e.component,
        hasElement: !!e.element,
      };
    },
  };
}));

// === §1.12 Regenerate button ===

fixture.disablePageReloads`AI Assistant - Regenerate`
  .page(AI_INTEGRATION_PAGE);

// 1.12.1
test('Regenerate should be visible after AI integration failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();
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
          promise: Promise.reject(new Error('HTTP 500 Internal Server Error')),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.2
test('Regenerate should be visible after response format failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();
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
          promise: Promise.resolve({}),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.3
test('Regenerate should be visible after validation failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();
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
            actions: [{ name: 'unknownCommand', args: { foo: 'bar' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.4
test('Regenerate should be visible after empty actions', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();
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
          promise: Promise.resolve({ actions: [] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.5
test('Regenerate should NOT be visible after full success', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();
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

// 1.12.6
test('Regenerate should NOT be visible after partial-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort and filter')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();
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
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
              { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.7
test('Regenerate should NOT be visible after all-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by unknown')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(2);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();
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
              { name: 'sorting', args: { dataField: 'nonExistent1', sortOrder: 'asc' } },
              { name: 'sorting', args: { dataField: 'nonExistent2', sortOrder: 'desc' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 1.12.8
test('Regenerate should resend the same prompt and replace the previous response', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.click(aiChat.getMessageRegenerateButton(0));

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getAIMessages().count).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

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

          if (count === 0) {
            return {
              promise: Promise.reject(new Error('AI service error')),
              abort: (): void => {},
            };
          }

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

// 1.12.9
test('Regenerate should be disabled while request is in flight', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);

  await t.click(aiChat.getMessageRegenerateButton(0));

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;

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

          if (count === 0) {
            return {
              promise: Promise.reject(new Error('AI service error')),
              abort: (): void => {},
            };
          }

          return {
            promise: new Promise(() => {}),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));
