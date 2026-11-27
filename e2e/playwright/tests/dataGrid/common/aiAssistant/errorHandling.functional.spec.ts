import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL } from '../../../../helpers/const';
import DataGrid from '../../../../models/dataGrid';
import type AIAssistantChat from '../../../../models/dataGrid/aiAssistantChat';
import {
  FAIL,
  baseGrid as gridDefaults,
  collectConsoleErrors,
  createGridWithAIAssistant,
  createGridWithoutAIIntegration,
  formatMessage,
  getLoggedErrorIds,
  getSelectedRowsCount,
  threeRows,
  openChatAndSubmit,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const baseGrid = { ...gridDefaults, dataSource: threeRows };

const groupingLockedColumns = [
  { dataField: 'id' },
  { dataField: 'name', allowGrouping: false },
  { dataField: 'value' },
];

const expectInvalidResponse = async (
  page: Page,
  aiChat: AIAssistantChat,
  dataGrid: DataGrid,
): Promise<void> => {
  const aiMessage = aiChat.getAIMessage(0);

  await expect(aiChat.getMessages()).toHaveCount(2);
  await expect(aiChat.getErrorMessages()).toHaveCount(1);
  await expect(aiMessage.getHeader()).toHaveText(
    await formatMessage(page, 'dxDataGrid-aiAssistantErrorMessageHeader'),
  );
  await expect(aiMessage.getErrorText()).toHaveText(
    await formatMessage(page, 'dxDataGrid-aiAssistantInvalidResponseMessage'),
  );
  await expect(aiChat.getSuccessMessages()).toHaveCount(0);
  await expect(aiMessage.getActionItems()).toHaveCount(0);
  await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
};

const INVALID_RESPONSE_CASES: { title: string; prompt: string; response: unknown }[] = [
  {
    title: 'Empty actions array should show no-action message and leave grid unchanged',
    prompt: 'Tell me a joke',
    response: { actions: [] },
  },
  {
    title: 'sendRequest rejection should show error message and leave grid unchanged',
    prompt: 'Sort by name',
    response: FAIL,
  },
  {
    title: 'Non-JSON string response should show invalid-response error',
    prompt: 'Sort by name',
    response: 'not json',
  },
  {
    title: 'Non-JSON actions string should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: 'not json' },
  },
  {
    title: 'Empty string response should show invalid-response error',
    prompt: 'Sort by name',
    response: '',
  },
  {
    title: 'Response missing actions should show invalid-response error',
    prompt: 'Sort by name',
    response: {},
  },
  {
    title: 'Object actions (not array) should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: { name: 'sorting' } },
  },
  {
    title: 'Null actions should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: null },
  },
  {
    title: 'Primitive actions should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: 42 },
  },
  {
    title: 'Null response should show invalid-response error',
    prompt: 'Sort by name',
    response: null,
  },
  {
    title: 'Unknown command name should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 'unknownCmd', args: {} }] },
  },
  {
    title: 'Non-string command name should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 123, args: {} }] },
  },
  {
    title: 'Empty command name should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: '', args: {} }] },
  },
  {
    title: 'Action without name should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ args: {} }] },
  },
  {
    title: 'Action without args should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 'sorting' }] },
  },
  {
    title: 'Null args should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 'sorting', args: null }] },
  },
  {
    title: 'Args missing a required property should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 'sorting', args: { sortOrder: 'asc' } }] },
  },
  {
    title: 'Args with a wrong-typed property should show invalid-response error',
    prompt: 'Sort by name',
    response: { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 123 } }] },
  },
  {
    title: 'Args with an extra property should show invalid-response error',
    prompt: 'Sort by name',
    response: {
      actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc', foo: 'bar' } }],
    },
  },
  {
    // The valid sorting action must not run either: expectInvalidResponse checks the sort order.
    title: 'Mix of valid and invalid actions should reject the whole response',
    prompt: 'Sort by name',
    response: {
      actions: [
        { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
        { name: 'unknownCmd', args: {} },
      ],
    },
  },
  {
    title: 'No-arg command with non-empty args should show invalid-response error',
    prompt: 'Clear sorting',
    response: { actions: [{ name: 'clearSorting', args: { foo: 1 } }] },
  },
];

test.describe('AI Assistant - Error Handling', () => {
  INVALID_RESPONSE_CASES.forEach(({ title, prompt, response }) => {
    test(title, async ({ page }) => {
      await createGridWithAIAssistant(page, baseGrid, [response]);

      const { dataGrid, aiChat } = await openChatAndSubmit(page, prompt);

      await expectInvalidResponse(page, aiChat, dataGrid);
    });
  });

  test('Sorting by a non-existent column should fail: schema is valid but incompatible with grid state', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      baseGrid,
      [{ actions: [{ name: 'sorting', args: { dataField: 'Salary', sortOrder: 'asc' } }] }],
    );

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by Salary');

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getSuccessMessages()).toHaveCount(0);
    await expect(aiChat.getAIMessage(0).getErrorActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiGetDataSourceSortParams()).toBeFalsy();
  });

  test('Selecting non-existent keys should succeed: schema is valid and the missing data is not sent in the request', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, selection: { mode: 'multiple' } },
      [{ actions: [{ name: 'selectByKeys', args: { keys: [999, 1000], preserve: false } }] }],
    );

    const { aiChat } = await openChatAndSubmit(page, 'Select rows 999 and 1000');

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getErrorMessages()).toHaveCount(0);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => getSelectedRowsCount(page)).toBe(0);
  });

  test('Missing aiIntegration should show an error and leave grid unchanged', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);

    await createGridWithoutAIIntegration(page, baseGrid);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expectInvalidResponse(page, aiChat, dataGrid);
    await expect.poll(() => getLoggedErrorIds(consoleErrors)).toContain('E1068');
  });

  test('Partial failure should report each action status and apply successes', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, columns: groupingLockedColumns }, [{
      actions: [
        { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
        { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
        { name: 'searching', args: { text: 'Alice' } },
      ],
    }]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort, group and search');
    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiMessage.getActionItems()).toHaveCount(3);
    await expect(aiMessage.getSuccessActionItems()).toHaveCount(2);
    await expect(aiMessage.getErrorActionItems()).toHaveCount(1);
    // The failed grouping action carries its predefined per-command message.
    await expect(aiMessage.getActionItemText(1)).toContainText('Group data against');
    // Successful actions (#1 sorting, #3 searching) took effect; failed grouping did not.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBeUndefined();
    await expect.poll(() => dataGrid.apiOption('searchPanel.text')).toBe('Alice');
  });

  test('All-commands failure should report failures and leave grid unchanged', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, columns: groupingLockedColumns }, [{
      actions: [
        { name: 'sorting', args: { dataField: 'NopeOne', sortOrder: 'asc' } },
        { name: 'sorting', args: { dataField: 'NopeTwo', sortOrder: 'desc' } },
        { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
      ],
    }]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Do impossible things');
    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiMessage.getActionItems()).toHaveCount(3);
    await expect(aiMessage.getSuccessActionItems()).toHaveCount(0);
    await expect(aiMessage.getErrorActionItems()).toHaveCount(3);
    // Each failed action keeps its own predefined per-command message.
    await expect(aiMessage.getActionItemText(0)).toContainText('Sort data against');
    await expect(aiMessage.getActionItemText(2)).toContainText('Group data against');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBeUndefined();
  });
});
