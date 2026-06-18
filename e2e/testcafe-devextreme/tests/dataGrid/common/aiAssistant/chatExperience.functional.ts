import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
  GRID_SELECTOR,
  baseGrid,
  createGridWithAIAssistant,
  getRequests,
  threeRows,
  twoRows,
} from './testHelpers';

fixture`AI Assistant - Chat Experience`
  .page(AI_INTEGRATION_PAGE);

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
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getUserMessages().count).eql(2);
  await t.expect(aiChat.getAIMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(1).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql(undefined);
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
]));

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

  const requests = await getRequests();

  await t
    .expect((requests as any[]).length)
    .eql(2)
    .expect((requests as any[])[0].data.text)
    .eql('Sort by name')
    .expect((requests as any[])[1].data.text)
    .eql('Clear sorting');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
]));

const suggestionItems = { items: [{ text: 'Sort by name' }, { text: 'Clear filter' }] };

test('Suggestions should be shown in empty chat', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const suggestions = aiChat.getSuggestions();

  await t.expect(suggestions.count).eql(2);
  await t.expect(suggestions.nth(0).textContent).contains('Sort by name');
  await t.expect(suggestions.nth(1).textContent).contains('Clear filter');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [], {
  chat: { suggestions: suggestionItems },
}));

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
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
], {
  chat: { suggestions: suggestionItems },
}));

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

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
], {
  chat: {
    user: { id: 'user' },
    suggestions: {
      ...suggestionItems,
      onItemClick(e: any) {
        const chatEl = e.element.closest('.dx-chat');
        const chatInstance = (window as any).DevExpress.ui.dxChat.getInstance(chatEl);
        const message = {
          id: `${Date.now()}`,
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
}));

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
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
    ],
  },
], {
  customizeResponseText(command: any) {
    if (command.name === 'sorting') {
      return { success: 'Custom success for sorting', failure: 'Custom failure for sorting' };
    }
    return {};
  },
}));

test('customizeResponseText partial override should keep failure message default', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name and invalid')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Custom success for sorting');
  await t
    .expect(aiChat.getActionItemText(0, 1).textContent)
    .eql('Sort data against "nonExistent" in ascending order.');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  {
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
    ],
  },
], {
  customizeResponseText(command: any) {
    if (command.name === 'sorting') {
      return { success: 'Custom success for sorting' };
    }
    return {};
  },
}));

test('customizeResponseText returning undefined should use default message', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t
    .expect(aiChat.getActionItemText(0, 0).textContent)
    .eql('Sort data against "Name" in ascending order.');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
], {
  customizeResponseText() {
    return undefined;
  },
}));

test('customizeResponseTitle at init should override message header', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getMessageHeader(0).textContent).eql('success: sorting');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await t
    .typeText(aiChat.getInput(), 'Sort by invalid')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageHeader(1).textContent).eql('failure: sorting');
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } }] },
], {
  customizeResponseTitle(status: string, commandNames: string[]) {
    return `${status}: ${commandNames.join(', ')}`;
  },
}));

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
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await dataGrid.apiOption('aiAssistant.customizeResponseText', () => ({ success: 'Updated message' }));

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);
  await t.expect(aiChat.getActionItemText(1, 0).textContent).eql('Updated message');
  await t.expect(aiChat.getActionItemText(0, 0).textContent).eql('Original message');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql(undefined);
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
], {
  customizeResponseText() {
    return { success: 'Original message' };
  },
}));

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
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: threeRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
], {
  customizeResponseTitle() {
    return 'Original Title';
  },
}));

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
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: twoRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  { actions: [{ name: 'clearSorting', args: {} }] },
]));

test('History should be preserved across multiple close/re-opens', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  for (let i = 0; i < 3; i += 1) {
    await t.click(aiChat.getCloseButton().element);

    await t.expect(aiChat.element.visible).notOk();

    await t.click(dataGrid.getAIAssistantButton());

    await t.expect(aiChat.element.visible).ok();
  }

  await t.expect(aiChat.getMessages().count).eql(2);
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: twoRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));

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
}).before(async () => createGridWithAIAssistant({
  ...baseGrid,
  dataSource: twoRows,
}, [
  { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
]));
