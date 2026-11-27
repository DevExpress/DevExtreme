import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import {
  HANG,
  baseGrid,
  closeChatAndConfirmAbort,
  collectConsoleErrors,
  createGridWithAIAssistant,
  createGridWithDeferredSelectAll,
  deferred,
  disposeGrid,
  formatMessage,
  resolveAIRequest,
  resolveSelectAll,
  threeRows,
  wasAIRequestResolved,
  wasAbortCalled,
  wasSelectAllStarted,
  openChatAndSubmit,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const gridOptions = { ...baseGrid, dataSource: threeRows };

const sortNameAsc = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };

const sortSelectAllSort = {
  actions: [
    { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    { name: 'selectAll', args: {} },
    { name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } },
  ],
};

test.describe('AI Assistant - Interruption', () => {
  test('Closing the popup mid-request aborts, leaves the grid unchanged, and shows the aborted response on re-open', async ({ page }) => {
    await createGridWithAIAssistant(page, gridOptions, [HANG]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);

    await closeChatAndConfirmAbort(aiChat);

    await expect.poll(() => wasAbortCalled(page)).toBe(true);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getMessages()).toHaveCount(2);
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getErrorText()).toHaveText(
      await formatMessage(page, 'dxDataGrid-aiAssistantAbortMessage'),
    );
    await aiChat.getTextArea().expectDisabled(false);
  });

  test('Late LLM resolution after abort should be ignored', async ({ page }) => {
    await createGridWithAIAssistant(page, gridOptions, [deferred(sortNameAsc)]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);

    await closeChatAndConfirmAbort(aiChat);

    await resolveAIRequest(page);
    await expect.poll(() => wasAIRequestResolved(page)).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
    await expect(aiChat.getSuccessMessages()).toHaveCount(0);
  });

  test('Closing the popup mid-execution aborts the remaining commands and keeps the completed ones', async ({ page }) => {
    await createGridWithDeferredSelectAll(page, [sortSelectAllSort]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name, select all, then sort by value');

    // Command #1 (sort by name) has applied; command #2 (selectAll) is now in flight and delayed.
    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);
    await aiChat.getTextArea().expectDisabled();

    // Close the popup mid-execution → confirm dialog → abort.
    await closeChatAndConfirmAbort(aiChat);

    // Let the delayed selectAll resolve; the loop then sees the abort flag and stops before #3.
    await resolveSelectAll(page);

    // Re-open to inspect the resulting response.
    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();

    const aiMessage = aiChat.getAIMessage(0);

    // An aborted command makes the whole message a failure: 2 successes + 1 aborted entry.
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiMessage.getActionItems()).toHaveCount(3);
    await expect(aiMessage.getSuccessActionItems()).toHaveCount(2);
    await expect(aiMessage.getAbortedActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    await expect.poll(() => dataGrid.apiColumnOption('value', 'sortOrder')).toBeFalsy();
    await expect.poll(async () => (await dataGrid.apiGetSelectedRowKeys()).length).toBe(50);

    await expect(aiMessage.getRegenerateButton()).not.toBeAttached();

    await aiChat.getTextArea().expectDisabled(false);
  });

  test('Customized response title is applied to the partial (aborted) result', async ({ page }) => {
    await createGridWithDeferredSelectAll(page, [sortSelectAllSort], () => ({
      customizeResponseTitle: (status: string) => (status === 'failure'
        ? 'Stopped before finishing'
        : 'All done'),
    }));

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name, select all, then sort by value');

    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);

    await closeChatAndConfirmAbort(aiChat);

    await resolveSelectAll(page);

    await dataGrid.getAIAssistantButton().click();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getHeader()).toHaveText('Stopped before finishing');
  });

  test('Disposing the grid mid-request should not throw and ignore the late resolution', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);

    await createGridWithAIAssistant(page, gridOptions, [deferred(sortNameAsc)]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getPendingMessages()).toHaveCount(1);

    await disposeGrid(page);

    await resolveAIRequest(page);
    await expect.poll(() => wasAIRequestResolved(page)).toBe(true);

    await expect(page.locator(`${DEFAULT_SELECTOR} .dx-datagrid`)).not.toBeAttached();
    await expect(dataGrid.getAIAssistantChat().element).not.toBeAttached();

    expect(consoleErrors).toEqual([]);
  });

  test('Disposing the grid mid-execution should not throw', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);

    await createGridWithDeferredSelectAll(page, [{ actions: [{ name: 'selectAll', args: {} }] }]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Select all rows');

    await aiChat.getTextArea().expectDisabled();
    // The select-all dispatches its store load on a timer. Disposed before that, the grid leaves
    // the timer pending past the checks below; once the load has started, nothing is left pending.
    await expect.poll(() => wasSelectAllStarted(page)).toBe(true);

    await disposeGrid(page);

    await expect(page.locator(`${DEFAULT_SELECTOR} .dx-datagrid`)).not.toBeAttached();
    await expect(dataGrid.getAIAssistantChat().element).not.toBeAttached();

    expect(consoleErrors).toEqual([]);
  });

  test('Re-creating the grid after a dispose-during-flight yields a usable instance', async ({ page }) => {
    await createGridWithAIAssistant(page, gridOptions, [HANG]);

    const { aiChat: firstChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(firstChat.getPendingMessages()).toHaveCount(1);

    await disposeGrid(page);

    await createGridWithAIAssistant(page, gridOptions, [sortNameAsc]);

    const { dataGrid, aiChat } = await openChatAndSubmit(page, 'Sort by name');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });
});
