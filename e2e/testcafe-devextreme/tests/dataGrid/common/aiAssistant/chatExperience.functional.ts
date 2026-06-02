/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, GRID_SELECTOR } from './testHelpers';

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

// === §3.12 Re-open popup — chat history preserved ===

fixture.disablePageReloads`AI Assistant - History Preservation`
  .page(AI_INTEGRATION_PAGE);

// 3.12.1
test('Chat history should be preserved after close and re-open', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(4);

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.element.visible).notOk();

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getMessages().count).eql(4);
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

// 3.12.2
test('History should be preserved across multiple close/re-opens', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  // Close and re-open 3 times
  for (let i = 0; i < 3; i += 1) {
    await t.click(aiChat.getCloseButton().element);

    await t.expect(aiChat.element.visible).notOk();

    await t.click(dataGrid.getAIAssistantButton());

    await t.expect(aiChat.element.visible).ok();
  }

  await t.expect(aiChat.getMessages().count).eql(2);
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
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 3.12.3
test('Clear-chat after re-open should remove all history', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.element.visible).notOk();

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getMessages().count).eql(2);

  await t.click(aiChat.getClearChatButton());

  await t.expect(aiChat.getMessages().count).eql(0);
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
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));
