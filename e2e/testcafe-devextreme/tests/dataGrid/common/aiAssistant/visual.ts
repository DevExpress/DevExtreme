import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture`Ai Assistant.Visual`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const DATA_GRID_SELECTOR = '#container';

test('AI Assistant popup - empty state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-empty-state.png', { element: dataGrid.getAIAssistantChat().content });

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

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-pending-state.png', { element: aiChat.content });

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
          promise: new Promise(() => {
          }),
          abort: (): void => {
          },
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

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-success-state.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by Region',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Sorting',
          status: 'success',
          text: 'success',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Region" in ascending order.',
            },
          ],
        },
      ],
      user: { id: 'user' },
    },
  },
})));

test('AI Assistant popup - success state with multiple commands', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-success-multiple-commands.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by name and filter',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Sorting and Filtering',
          status: 'success',
          text: 'success',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Name" in ascending order.',
            },
            {
              status: 'success',
              message: 'Apply a filter.',
            },

          ],
        },
      ],
      user: { id: 'user' },
    },
  },
})));

test('AI Assistant popup - failure with error command', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-failure-with-error-command.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by name and filter',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Sorting and Filtering',
          status: 'failure',
          text: 'failure',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Name" in ascending order.',
            },
            {
              status: 'failure',
              message: 'Apply a filter.',
            },
          ],
        },
      ],
      user: { id: 'user' },
    },
  },
})));

test('AI Assistant popup - failure with aborted command', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-failure-with-aborted-command.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by name and filter',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Sorting and Filtering',
          status: 'failure',
          text: 'failure',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Name" in ascending order.',
            },
            {
              status: 'aborted',
              message: 'Execution Interrupted',
            },
          ],
        },
      ],
      user: { id: 'user' },
    },
  },
})));

test('AI Assistant popup - error state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-error-state.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by name and filter',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Failed to process request',
          errorText: 'AI service error',
          status: 'failure',
          text: 'failure',
        },
      ],
      user: { id: 'user' },
    },
  },
})));

test('AI Assistant popup - multiple messages', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  await testScreenshot(t, takeScreenshot, 'datagrid-ai-assistant-multiple-messages.png', { element: dataGrid.getAIAssistantChat().content });

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

    chat: {
      // Stub messages for AIChat message state testing
      dataSource: [
        {
          id: 1,
          author: { id: 'user' },
          text: 'Sort by Name',
        },
        {
          id: 2,
          author: { id: 'assistant' },
          headerText: 'Sorting',
          status: 'success',
          text: 'success',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Name" in ascending order.',
            },
          ],
        },
        {
          id: 3,
          author: { id: 'user' },
          text: 'Sort by Surname',
        },
        {
          id: 4,
          author: { id: 'assistant' },
          headerText: 'Sorting',
          status: 'success',
          text: 'success',
          commands: [
            {
              status: 'success',
              message: 'Sort data against "Surname" in ascending order.',
            },
          ],
        },
      ],
      user: { id: 'user' },
    },
  },
})));
