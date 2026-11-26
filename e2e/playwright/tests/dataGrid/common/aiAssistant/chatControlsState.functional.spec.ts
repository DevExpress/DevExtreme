import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL } from '../../../../helpers/const';
import DataGrid from '../../../../models/dataGrid';
import type AIAssistantChat from '../../../../models/dataGrid/aiAssistantChat';
import { typeText } from '../../helpers/typeText';
import {
  FAIL,
  GRID_SELECTOR,
  HANG,
  baseGrid as gridDefaults,
  createGridWithAIAssistant,
  createGridWithDeferredSelectAll,
  closeChatAndConfirmAbort,
  getAICallCount,
  threeRows,
  twoRows,
  wasSelectAllStarted,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const baseGrid = (rows: unknown[]): Record<string, unknown> => ({
  ...gridDefaults,
  dataSource: rows,
});

const sortByName = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };
const selectAll = { actions: [{ name: 'selectAll', args: {} }] };
const suggestionConfig = { chat: { suggestions: { items: [{ text: 'Sort by name' }] } } };

const openChatAndSubmit = async (
  page: Page,
  prompt: string,
): Promise<{ dataGrid: DataGrid; aiChat: AIAssistantChat }> => {
  const dataGrid = new DataGrid(page, GRID_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await dataGrid.getAIAssistantButton().click();

  const aiChat = dataGrid.getAIAssistantChat();

  await typeText(aiChat.getInput(), prompt);
  await page.keyboard.press('Enter');

  return { dataGrid, aiChat };
};

test.describe('AI Assistant - Chat Controls State', () => {
  test('N distinct prompts back-to-back should each execute once, in order, and apply to the grid', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(threeRows), [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
      { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] },
      { actions: [{ name: 'clearSorting', args: {} }] },
      { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
    ]);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    const columnOption = (id: string, name: string) => expect.poll(
      () => dataGrid.apiColumnOption(id, name),
    );
    const steps = [
      { prompt: 'Sort by name', verify: () => columnOption('name', 'sortOrder').toBe('asc') },
      { prompt: 'Sort by value', verify: () => columnOption('value', 'sortOrder').toBe('desc') },
      { prompt: 'Clear sorting', verify: () => columnOption('value', 'sortOrder').toBeUndefined() },
      { prompt: 'Group by name', verify: () => columnOption('name', 'groupIndex').toBe(0) },
    ];

    for (let i = 0; i < steps.length; i += 1) {
      await typeText(aiChat.getInput(), steps[i].prompt);
      await page.keyboard.press('Enter');

      await expect(aiChat.getSuccessMessages()).toHaveCount(i + 1);
      await expect(aiChat.getAIMessage(i).getSuccessActionItems()).toHaveCount(1);
      await aiChat.getTextArea().expectDisabled(false);

      await steps[i].verify();
    }

    expect(await getAICallCount(page)).toBe(steps.length);
    await expect(aiChat.getMessages()).toHaveCount(steps.length * 2);
  });

  test('Input should be disabled during LLM phase', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [HANG]);

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await aiChat.getTextArea().expectDisabled();
  });

  test('Input should be disabled during command execution phase', async ({ page }) => {
    await createGridWithDeferredSelectAll(page, [selectAll]);

    const { aiChat } = await openChatAndSubmit(page, 'Select all rows');

    // Disabled and pending hold in the LLM phase too: wait for the command phase first.
    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);
    await aiChat.getTextArea().expectDisabled();
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiChat.getPendingMessages()).toHaveCount(1);
  });

  test('Input should be re-enabled after fulfillment', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [sortByName]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await aiChat.getTextArea().expectDisabled(false);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Input should be re-enabled after failure', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [FAIL]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await aiChat.getTextArea().expectDisabled(false);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeUndefined();
  });

  test('Input should be re-enabled after abort via popup close', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [HANG]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await aiChat.getTextArea().expectDisabled();

    await closeChatAndConfirmAbort(aiChat);

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await aiChat.getTextArea().expectDisabled(false);
  });

  test('Clear-chat button should be disabled during LLM phase', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [HANG]);

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await aiChat.getClearChatButton().expectDisabled();
  });

  test('Clear-chat button should be disabled during command execution phase', async ({ page }) => {
    await createGridWithDeferredSelectAll(page, [selectAll]);

    const { aiChat } = await openChatAndSubmit(page, 'Select all rows');

    // Disabled and pending hold in the LLM phase too: wait for the command phase first.
    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);
    await aiChat.getClearChatButton().expectDisabled();
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiChat.getPendingMessages()).toHaveCount(1);
  });

  test('Clear-chat button should be re-enabled after fulfillment', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [sortByName]);

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await aiChat.getClearChatButton().expectDisabled(false);
  });

  test('Clear-chat button should be re-enabled after failure', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [FAIL]);

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await aiChat.getClearChatButton().expectDisabled(false);
  });

  test('Clear-chat button should be re-enabled after abort via popup close', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [HANG]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await aiChat.getClearChatButton().expectDisabled();

    await closeChatAndConfirmAbort(aiChat);

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await aiChat.getClearChatButton().expectDisabled(false);
  });

  test('Clear-chat should remove all messages from chat and leave grid state unchanged', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [sortByName]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');

    await aiChat.getClearChatButton().element.click();

    await expect(aiChat.getMessages()).toHaveCount(0);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Suggestions should be disabled during LLM phase and dispatch no second request', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [HANG], suggestionConfig);

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await aiChat.getSuggestion(0).expectDisabled();
    expect(await getAICallCount(page)).toBe(1);
  });

  test('Suggestions should be disabled during command execution phase and dispatch no second request', async ({ page }) => {
    await createGridWithDeferredSelectAll(page, [selectAll], suggestionConfig);

    const { aiChat } = await openChatAndSubmit(page, 'Select all rows');

    // Disabled and pending hold in the LLM phase too: wait for the command phase first.
    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);
    await aiChat.getSuggestion(0).expectDisabled();
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    expect(await getAICallCount(page)).toBe(1);
  });

  test('Suggestions should be re-enabled after resolution', async ({ page }) => {
    await createGridWithAIAssistant(page, baseGrid(twoRows), [sortByName], suggestionConfig);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await aiChat.getSuggestion(0).expectDisabled(false);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });
});
