import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import DataGrid from '../../../../models/dataGrid';
import type AIAssistantChat from '../../../../models/dataGrid/aiAssistantChat';
import { typeText } from '../../helpers/typeText';
import {
  baseGrid,
  createGridWithAIAssistant,
  getRequestCount,
  getRequestText,
  threeRows,
  twoRows,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const suggestionItems = { items: [{ text: 'Sort by name' }, { text: 'Clear filter' }] };

const sortNameAsc = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };
const clearSorting = { actions: [{ name: 'clearSorting', args: {} }] };
const sortNameAndInvalid = {
  actions: [
    { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
  ],
};

const openChat = async (page: Page): Promise<{ dataGrid: DataGrid; aiChat: AIAssistantChat }> => {
  const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await dataGrid.getAIAssistantButton().click();

  return { dataGrid, aiChat: dataGrid.getAIAssistantChat() };
};

const submit = async (page: Page, aiChat: AIAssistantChat, prompt: string): Promise<void> => {
  await typeText(aiChat.getInput(), prompt);
  await page.keyboard.press('Enter');
};

test.describe('AI Assistant - Chat Experience', () => {
  test('Chat history should accumulate across multiple prompts', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [
      sortNameAsc,
      clearSorting,
    ]);

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');

    await submit(page, aiChat, 'Clear sorting');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getUserMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeUndefined();
  });

  test('Request payload should contain only the latest message', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [
      sortNameAsc,
      clearSorting,
    ]);

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);

    await submit(page, aiChat, 'Clear sorting');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);

    expect(await getRequestCount(page)).toBe(2);
    expect(await getRequestText(page, 0)).toBe('Sort by name');
    expect(await getRequestText(page, 1)).toBe('Clear sorting');
  });

  test('Suggestions should be shown in empty chat', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [], {
      chat: { suggestions: suggestionItems },
    });

    const { aiChat } = await openChat(page);
    const suggestions = aiChat.getSuggestions();

    await expect(suggestions).toHaveCount(2);
    await expect(suggestions.nth(0)).toContainText('Sort by name');
    await expect(suggestions.nth(1)).toContainText('Clear filter');
  });

  test('Suggestions should be shown in non-empty chat', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [sortNameAsc], {
      chat: { suggestions: suggestionItems },
    });

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);

    const suggestions = aiChat.getSuggestions();

    await expect(suggestions).toHaveCount(2);
    await expect(suggestions.nth(0)).toContainText('Sort by name');
    await expect(suggestions.nth(1)).toContainText('Clear filter');
  });

  test('Suggestion click should send message and execute command', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      () => ({
        chat: {
          user: { id: 'user' },
          suggestions: {
            items: [{ text: 'Sort by name' }, { text: 'Clear filter' }],
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
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);
    const suggestions = aiChat.getSuggestions();

    await expect(suggestions).toHaveCount(2);

    await suggestions.nth(0).click();

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getUserMessages()).toHaveCount(1);
    await expect(aiChat.getUserMessages().nth(0)).toHaveText('Sort by name');
    await expect(aiChat.getSuccessMessages()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('customizeResponseText at init should override success and failure messages', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAndInvalid],
      () => ({
        customizeResponseText(command: any) {
          if (command.name === 'sorting') {
            return { success: 'Custom success for sorting', failure: 'Custom failure for sorting' };
          }
          return {};
        },
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name and invalid');

    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiMessage.getActionItems()).toHaveCount(2);
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiMessage.getSuccessActionItems()).toHaveCount(1);
    await expect(aiMessage.getErrorActionItems()).toHaveCount(1);
    await expect(aiMessage.getActionItemText(0)).toHaveText('Custom success for sorting');
    await expect(aiMessage.getActionItemText(1)).toHaveText('Custom failure for sorting');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('customizeResponseText partial override should keep failure message default', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAndInvalid],
      () => ({
        customizeResponseText(command: any) {
          if (command.name === 'sorting') {
            return { success: 'Custom success for sorting' };
          }
          return {};
        },
      }),
    );

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name and invalid');

    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiMessage.getSuccessActionItems()).toHaveCount(1);
    await expect(aiMessage.getErrorActionItems()).toHaveCount(1);
    await expect(aiMessage.getActionItemText(0)).toHaveText('Custom success for sorting');
    await expect(aiMessage.getActionItemText(1)).toHaveText('Sort data against "nonExistent" in ascending order.');
  });

  test('customizeResponseText returning undefined should use default message', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      () => ({
        customizeResponseText() {
          return undefined;
        },
      }),
    );

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getActionItemText(0)).toHaveText('Sort data against "Name" in ascending order.');
  });

  test('customizeResponseTitle at init should override message header', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [
        sortNameAsc,
        { actions: [{ name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } }] },
      ],
      () => ({
        customizeResponseTitle(status: string, commandNames: string[]) {
          return `${status}: ${commandNames.join(', ')}`;
        },
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getHeader()).toHaveText('success: sorting');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');

    await submit(page, aiChat, 'Sort by invalid');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(1).getHeader()).toHaveText('failure: sorting');
  });

  test('customizeResponseText changed at runtime should apply to subsequent messages only', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc, clearSorting],
      () => ({
        customizeResponseText() {
          return { success: 'Original message' };
        },
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getActionItemText(0)).toHaveText('Original message');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');

    await page.evaluate(() => {
      (window as any).widget.option('aiAssistant.customizeResponseText', () => ({ success: 'Updated message' }));
    });

    await submit(page, aiChat, 'Clear sorting');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getActionItemText(0)).toHaveText('Updated message');
    await expect(aiChat.getAIMessage(0).getActionItemText(0)).toHaveText('Original message');
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeUndefined();
  });

  test('customizeResponseTitle changed at runtime should apply to subsequent messages only', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc, clearSorting],
      () => ({
        customizeResponseTitle() {
          return 'Original Title';
        },
      }),
    );

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getHeader()).toHaveText('Original Title');

    await page.evaluate(() => {
      (window as any).widget.option('aiAssistant.customizeResponseTitle', () => 'Updated Title');
    });

    await submit(page, aiChat, 'Clear sorting');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getHeader()).toHaveText('Updated Title');
    await expect(aiChat.getAIMessage(0).getHeader()).toHaveText('Original Title');
  });

  test('Chat history should be preserved after close and re-open', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: twoRows }, [
      sortNameAsc,
      clearSorting,
    ]);

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getMessages()).toHaveCount(2);

    await submit(page, aiChat, 'Clear sorting');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getMessages()).toHaveCount(4);

    await aiChat.getCloseButton().element.click();
    await expect(aiChat.element).toBeHidden();

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getMessages()).toHaveCount(4);
  });

  test('History should be preserved across multiple close/re-opens', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: twoRows }, [sortNameAsc]);

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getMessages()).toHaveCount(2);

    for (let i = 0; i < 3; i += 1) {
      await aiChat.getCloseButton().element.click();
      await expect(aiChat.element).toBeHidden();

      await dataGrid.getAIAssistantButton().click();
      await expect(aiChat.element).toBeVisible();
    }

    await expect(aiChat.getMessages()).toHaveCount(2);
  });

  test('Clear-chat after re-open should remove all history', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: twoRows }, [sortNameAsc]);

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getMessages()).toHaveCount(2);

    await aiChat.getCloseButton().element.click();
    await expect(aiChat.element).toBeHidden();

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getMessages()).toHaveCount(2);

    await aiChat.getClearChatButton().element.click();

    await expect(aiChat.getMessages()).toHaveCount(0);
  });
});
