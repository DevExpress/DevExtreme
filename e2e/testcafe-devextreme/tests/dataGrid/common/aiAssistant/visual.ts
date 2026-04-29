import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Ai Assistant.Visual`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const DATA_GRID_SELECTOR = '#container';

test('AI Assistant popup - empty state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__empty-state.png', { element: dataGrid.getAIAssistantChat().element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
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

test('AI Assistant popup - pending state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().exists).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__pending-state.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
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

test('AI Assistant popup - success state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().exists).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__success-state.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,

    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve(JSON.stringify({
            actions: [
              { name: 'Column sorted successfully', args: {} },
            ],
          })),
          abort: (): void => {},
        };
      },
    }),
  },
})));

test('AI Assistant popup - success state with multiple commands', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Sort by name and filter')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().exists).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__success-multiple-commands.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,

    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve(JSON.stringify({
            actions: [
              { name: 'Column sorted successfully', args: {} },
              { name: 'Filter applied successfully', args: {} },
            ],
          })),
          abort: (): void => {},
        };
      },
    }),
  },
})));

test('AI Assistant popup - success with error command', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Do something')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().exists).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__success-with-error-command.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,

    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve(JSON.stringify({
            actions: [
              { name: 'Column sorted successfully', args: {} },
              { name: 'Error applying filter', args: {} },
            ],
          })),
          abort: (): void => {},
        };
      },
    }),
  },
})));

test('AI Assistant popup - error state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().exists).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__error-state.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,

    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.reject(new Error('AI service error')),
          abort: (): void => {},
        };
      },
    }),
  },
})));

test('AI Assistant popup - multiple messages', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const chat = aiChat.getChat();

  await t
    .typeText(chat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().exists).ok();

  await t
    .typeText(chat.getInput(), 'Filter by value')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(2);

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-assistant__multiple-messages.png', { element: aiChat.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,

    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve(JSON.stringify({
            actions: [
              { name: 'Command executed successfully', args: {} },
            ],
          })),
          abort: (): void => {},
        };
      },
    }),
  },
})));
