import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
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

fixture`AI Assistant - Regenerate`
  .page(AI_INTEGRATION_PAGE);

test('Regenerate should be visible after AI integration failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  // Pre-execution failure: nothing was applied to the grid.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [FAIL],
));

test('Regenerate should be visible after response format failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{}],
));

test('Regenerate should be visible after validation failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{ actions: [{ name: 'unknownCommand', args: { foo: 'bar' } }] }],
));

test('Regenerate should be visible after empty actions', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  // Empty actions are rejected as an invalid response → failure message.
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{ actions: [] }],
));

test('Regenerate should NOT be visible after full success', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).notOk();

  // The successful command actually changed the grid state.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
));

test('Regenerate should NOT be visible after partial-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort and filter')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getActionItems().count).eql(2);
  await t.expect(aiChat.getAIMessage(0).getSuccessActionItems().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getErrorActionItems().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).notOk();

  // No Regenerate because action #1 already mutated the grid.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
    ],
  }],
));

test('Regenerate should NOT be visible after all-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by unknown')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).getErrorActionItems().count).eql(2);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).notOk();

  // Both commands targeted non-existent columns, so real columns stay unsorted.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{
    actions: [
      { name: 'sorting', args: { dataField: 'nonExistent1', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent2', sortOrder: 'desc' } },
    ],
  }],
));

test('Regenerate should resend the same prompt and replace the previous response', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.click(aiChat.getAIMessage(0).getRegenerateButton());

  // The failed response is replaced, not accumulated: still a single AI response.
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getAIMessages().count).eql(1);

  // The regenerated command applied to the grid.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  // The same prompt was resent with a freshly-built (current) grid context.
  await t.expect(getRequestCount()).eql(2);
  await t.expect(getRequestText(1)).eql(await getRequestText(0));
  await t.expect(getRequestText(1)).eql('Sort by name');
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name', 'value']);
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [
    FAIL,
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ],
));

test('Regenerate should be disabled while request is in flight', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);

  await t.click(aiChat.getAIMessage(0).getRegenerateButton());

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).notOk();

  // Nothing was applied while the regenerate request is still pending.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [
    FAIL,
    HANG,
  ],
));

test('Regenerate is visible after a popup-close-driven abort', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  // The request never resolves — it is in flight when the popup is closed.
  await t.expect(aiChat.getPendingMessages().count).eql(1);

  await closeChatAndConfirmAbort(t, aiChat);

  await t.click(dataGrid.getAIAssistantButton());

  // The aborted response is rendered as a failure with no executed commands,
  // so it currently offers Regenerate (pins current behavior; see doc §1.12.11).
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [HANG],
));

test('Regenerate after a column is removed should resend with the actual context', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await dataGrid.apiOption('columns', ['id', 'name']);

  await t.click(aiChat.getAIMessage(0).getRegenerateButton());

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  await t.expect(getRequestCount()).eql(2);
  await t.expect(getRequestColumnNames(0)).eql(['id', 'name', 'value']);
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name']);
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [
    FAIL,
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ],
));

test('Sequential regenerate after pre-execution failures keeps exactly one response', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.click(aiChat.getAIMessage(0).getRegenerateButton());

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  await t.click(aiChat.getAIMessage(0).getRegenerateButton());

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();

  // Every retry failed before execution, so the grid was never mutated.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();

  // Each Regenerate dispatched a fresh request with the same prompt.
  await t.expect(getRequestCount()).eql(3);
  await t.expect(getRequestText(2)).eql('Sort by name');
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: twoRows },
  [FAIL, FAIL, FAIL],
));

test('cancel-aborted message currently shows a Regenerate button', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getAIMessage(0).hasRegenerateButton()).ok();
}).before(async () => createGridWithAIAssistant(
  { ...baseGrid, dataSource: threeRows },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  { onAIAssistantRequestCreating: (e: any) => { e.cancel = true; } },
));
