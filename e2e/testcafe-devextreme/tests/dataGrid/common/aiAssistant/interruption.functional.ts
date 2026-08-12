import { Selector } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
  GRID_SELECTOR,
  HANG,
  baseGrid,
  closeChatAndConfirmAbort,
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
} from './testHelpers';

const gridOptions = { ...baseGrid, dataSource: threeRows };

const sortNameAsc = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };

const sortSelectAllSort = {
  actions: [
    { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
    { name: 'selectAll', args: {} },
    { name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } },
  ],
};

const abortMessage = (): Promise<string> => formatMessage('dxDataGrid-aiAssistantAbortMessage');

fixture`AI Assistant - Interruption`
  .page(AI_INTEGRATION_PAGE);

test('Closing the popup mid-request aborts, leaves the grid unchanged, and shows the aborted response on re-open', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeChatAndConfirmAbort(t, aiChat);

  await t.expect(wasAbortCalled()).ok();
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getErrorText().innerText).eql(await abortMessage());
  await t.expect(aiChat.getTextArea().isDisabled).notOk();
}).before(async () => createGridWithAIAssistant(gridOptions, [HANG]));

test('Late LLM resolution after abort should be ignored', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeChatAndConfirmAbort(t, aiChat);

  await resolveAIRequest();
  await t.expect(wasAIRequestResolved()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
}).before(async () => createGridWithAIAssistant(gridOptions, [deferred(sortNameAsc)]));

test('Closing the popup mid-execution aborts the remaining commands and keeps the completed ones', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name, select all, then sort by value')
    .pressKey('enter');

  // Command #1 (sort by name) has applied; command #2 (selectAll) is now in flight and delayed.
  await t.expect(wasSelectAllStarted()).ok();
  await t.expect(aiChat.getTextArea().isDisabled).ok();

  // Close the popup mid-execution → confirm dialog → abort.
  await closeChatAndConfirmAbort(t, aiChat);

  // Let the delayed selectAll resolve; the loop then sees the abort flag and stops before #3.
  await resolveSelectAll();

  // Re-open to inspect the resulting response.
  await t.click(dataGrid.getAIAssistantButton());

  const aiMessage = aiChat.getAIMessage(0);

  // An aborted command makes the whole message a failure: 2 successes + 1 aborted entry.
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiMessage.getActionItems().count).eql(3);
  await t.expect(aiMessage.getSuccessActionItems().count).eql(2);
  await t.expect(aiMessage.getAbortedActionItems().count).eql(1);

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).notOk();
  await t.expect((await dataGrid.apiGetSelectedRowKeys()).length).eql(50);

  await t.expect(aiMessage.hasRegenerateButton()).notOk();

  await t.expect(aiChat.getTextArea().isDisabled).notOk();
}).before(async () => createGridWithDeferredSelectAll([sortSelectAllSort]));

test('Customized response title is applied to the partial (aborted) result', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name, select all, then sort by value')
    .pressKey('enter');

  await t.expect(wasSelectAllStarted()).ok();

  await closeChatAndConfirmAbort(t, aiChat);

  await resolveSelectAll();

  await t.click(dataGrid.getAIAssistantButton());

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getHeader().innerText).eql('Stopped before finishing');
}).before(async () => createGridWithDeferredSelectAll([sortSelectAllSort], {
  customizeResponseTitle: (status: string) => (status === 'failure'
    ? 'Stopped before finishing'
    : 'All done'),
}));

test('Disposing the grid mid-request should not throw and ignore the late resolution', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await disposeGrid();

  await resolveAIRequest();
  await t.expect(wasAIRequestResolved()).ok();

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
  await t.expect(dataGrid.getAIAssistantChat().element.exists).notOk();

  const { error } = await t.getBrowserConsoleMessages();

  await t.expect(error).eql([]);
}).before(async () => createGridWithAIAssistant(gridOptions, [deferred(sortNameAsc)]));

test('Disposing the grid mid-execution should not throw', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select all rows')
    .pressKey('enter');

  await t.expect(aiChat.getTextArea().isDisabled).ok();

  await disposeGrid();

  await t.wait(500);

  await t.expect(Selector('#container').find('.dx-datagrid').exists).notOk();
  await t.expect(dataGrid.getAIAssistantChat().element.exists).notOk();

  const { error } = await t.getBrowserConsoleMessages();

  await t.expect(error).eql([]);
}).before(async () => createGridWithDeferredSelectAll([{ actions: [{ name: 'selectAll', args: {} }] }]));

test('Re-creating the grid after a dispose-during-flight yields a usable instance', async (t) => {
  let dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  let aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await disposeGrid();

  await createGridWithAIAssistant(gridOptions, [sortNameAsc]);

  dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getSuccessActionItems().count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(gridOptions, [HANG]));
