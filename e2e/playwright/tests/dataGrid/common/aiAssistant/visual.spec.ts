import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const DATA_GRID_SELECTOR = '#container';

// The stub messages for the chat's message states; without them the chat starts empty. They carry
// the grid's own AI message fields (status, commands), which the public Message type lacks.
const createGrid = (page: Page, messages?: unknown[]): Promise<void> => createWidget(
  page,
  'dxDataGrid',
  (chatMessages: any[] | undefined) => ({
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

      ...(chatMessages ? { chat: { dataSource: chatMessages, user: { id: 'user' } } } : {}),
    },
  }),
  DEFAULT_SELECTOR,
  { arg: messages },
);

const MESSAGES_CASES: { title: string; screenshotName: string; messages: unknown[] }[] = [
  {
    title: 'AI Assistant popup - success state',
    screenshotName: 'datagrid-ai-assistant-success-state.png',
    messages: [
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
  },
  {
    title: 'AI Assistant popup - success state with multiple commands',
    screenshotName: 'datagrid-ai-assistant-success-multiple-commands.png',
    messages: [
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
  },
  {
    title: 'AI Assistant popup - failure with error command',
    screenshotName: 'datagrid-ai-assistant-failure-with-error-command.png',
    messages: [
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
  },
  {
    title: 'AI Assistant popup - failure with aborted command',
    screenshotName: 'datagrid-ai-assistant-failure-with-aborted-command.png',
    messages: [
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
  },
  {
    title: 'AI Assistant popup - error state',
    screenshotName: 'datagrid-ai-assistant-error-state.png',
    messages: [
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
  },
  {
    title: 'AI Assistant popup - multiple messages',
    screenshotName: 'datagrid-ai-assistant-multiple-messages.png',
    messages: [
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
  },
];

test.describe('Ai Assistant.Visual', () => {
  test('AI Assistant popup - empty state', {
    tag: ['@generic.light', '@material.blue.light', '@material.blue.light.compact'],
  }, async ({ page }) => {
    await createGrid(page);

    const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    await testScreenshot(page, 'datagrid-ai-assistant-empty-state.png', {
      element: dataGrid.getAIAssistantChat().getContent(),
    });
  });

  test('AI Assistant popup - pending state', async ({ page }) => {
    await createGrid(page);

    const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getChat().getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getPendingMessages()).toBeAttached();

    await insertStylesheetRulesToPage(page, '.dx-progressbar-animating-container { animation: none !important; background-position-x: 0 !important; }');

    await testScreenshot(page, 'datagrid-ai-assistant-pending-state.png', { element: aiChat.getContent() });

    await removeStylesheetRulesFromPage(page);
  });

  MESSAGES_CASES.forEach(({ title, screenshotName, messages }) => {
    test(title, async ({ page }) => {
      await createGrid(page, messages);

      const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getAIAssistantButton().click();

      await testScreenshot(page, screenshotName, {
        element: dataGrid.getAIAssistantChat().getContent(),
      });
    });
  });
});
