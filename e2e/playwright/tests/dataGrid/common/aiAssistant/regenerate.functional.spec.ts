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
  baseGrid,
  closeChatAndConfirmAbort,
  createGridWithAIAssistant,
  getRequestColumnNames,
  getRequestCount,
  getRequestText,
  threeRows,
  twoRows,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const sortNameAsc = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };

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

const PRE_EXECUTION_FAILURE_CASES: { title: string; response: unknown }[] = [
  { title: 'Regenerate should be visible after AI integration failure', response: FAIL },
  { title: 'Regenerate should be visible after response format failure', response: {} },
  {
    title: 'Regenerate should be visible after validation failure',
    response: { actions: [{ name: 'unknownCommand', args: { foo: 'bar' } }] },
  },
  // Empty actions are rejected as an invalid response → failure message.
  { title: 'Regenerate should be visible after empty actions', response: { actions: [] } },
];

test.describe('AI Assistant - Regenerate', () => {
  PRE_EXECUTION_FAILURE_CASES.forEach(({ title, response }) => {
    test(title, async ({ page }) => {
      await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [response]);

      const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

      await expect(aiChat.getErrorMessages()).toHaveCount(1);
      await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();
      // Pre-execution failure: nothing was applied to the grid.
      await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
    });
  });

  test('Regenerate should NOT be visible after full success', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [sortNameAsc]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).not.toBeAttached();
    // The successful command actually changed the grid state.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Regenerate should NOT be visible after partial-execution failure', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [{
      actions: [
        { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
        { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
      ],
    }]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort and filter');
    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiMessage.getActionItems()).toHaveCount(2);
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiMessage.getSuccessActionItems()).toHaveCount(1);
    await expect(aiMessage.getErrorActionItems()).toHaveCount(1);
    await expect(aiMessage.getRegenerateButton()).not.toBeAttached();
    // No Regenerate because action #1 already mutated the grid.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Regenerate should NOT be visible after all-execution failure', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [{
      actions: [
        { name: 'sorting', args: { dataField: 'nonExistent1', sortOrder: 'asc' } },
        { name: 'sorting', args: { dataField: 'nonExistent2', sortOrder: 'desc' } },
      ],
    }]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by unknown');
    const aiMessage = aiChat.getAIMessage(0);

    await expect(aiMessage.getErrorActionItems()).toHaveCount(2);
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect(aiMessage.getRegenerateButton()).not.toBeAttached();
    // Both commands targeted non-existent columns, so real columns stay unsorted.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
  });

  test('Regenerate should resend the same prompt and replace the previous response', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [FAIL, sortNameAsc],
    );

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();

    await aiChat.getAIMessage(0).getRegenerateButton().click();

    // The failed response is replaced, not accumulated: still a single AI response.
    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    // The regenerated command applied to the grid.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    // The same prompt was resent with a freshly-built (current) grid context.
    expect(await getRequestCount(page)).toBe(2);
    expect(await getRequestText(page, 1)).toBe(await getRequestText(page, 0));
    expect(await getRequestText(page, 1)).toBe('Sort by name');
    expect(await getRequestColumnNames(page, 1)).toEqual(['id', 'name', 'value']);
  });

  test('Regenerate should be disabled while request is in flight', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [FAIL, HANG]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);

    await aiChat.getAIMessage(0).getRegenerateButton().click();

    await expect(aiChat.getPendingMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).not.toBeAttached();
    // Nothing was applied while the regenerate request is still pending.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
  });

  test('Regenerate is visible after a popup-close-driven abort', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [HANG]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    // The request never resolves — it is in flight when the popup is closed.
    await expect(aiChat.getPendingMessages()).toHaveCount(1);

    await closeChatAndConfirmAbort(aiChat);

    // The aborted response is rendered as a failure with no executed commands,
    // so it currently offers Regenerate (pins current behavior; see doc §1.12.11).
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
  });

  test('Regenerate after a column is removed should resend with the actual context', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [FAIL, sortNameAsc],
    );

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();

    await dataGrid.apiOption('columns', ['id', 'name']);

    await aiChat.getAIMessage(0).getRegenerateButton().click();

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessages()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    expect(await getRequestCount(page)).toBe(2);
    expect(await getRequestColumnNames(page, 0)).toEqual(['id', 'name', 'value']);
    expect(await getRequestColumnNames(page, 1)).toEqual(['id', 'name']);
  });

  test('Sequential regenerate after pre-execution failures keeps exactly one response', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: twoRows }, [FAIL, FAIL, FAIL]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();

    for (const requestCount of [2, 3]) {
      await aiChat.getAIMessage(0).getRegenerateButton().click();

      // The response looks the same before and after a failed retry: wait for the retry first.
      await expect.poll(() => getRequestCount(page)).toBe(requestCount);
      await expect(aiChat.getMessages()).toHaveCount(2);
      await expect(aiChat.getErrorMessages()).toHaveCount(1);
      await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();
    }

    // Every retry failed before execution, so the grid was never mutated.
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
    // Each Regenerate dispatched a fresh request with the same prompt.
    expect(await getRequestCount(page)).toBe(3);
    expect(await getRequestText(page, 2)).toBe('Sort by name');
  });

  test('cancel-aborted message currently shows a Regenerate button', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({ onAIAssistantRequestCreating: (e: any) => { e.cancel = true; } }),
    );

    const { aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getRegenerateButton()).toBeAttached();
  });
});
