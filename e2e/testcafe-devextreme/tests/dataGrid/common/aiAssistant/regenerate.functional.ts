/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
  FAIL,
  GRID_SELECTOR,
  HANG,
  baseGrid,
  createGridWithAIAssistant,
  threeRows,
  twoRows,
} from './testHelpers';

const getAIRequests = ClientFunction(() => ((window as any).__aiRequests ?? []).map((r: any) => ({
  text: r.data.text,
  columns: (r.data.context.columns ?? []).map((c: any) => c.dataField),
})));

fixture`AI Assistant - Regenerate`
  .page(AI_INTEGRATION_PAGE);

// === §1.12 Regenerate button ===

// 1.12.1
test('Regenerate should be visible after AI integration failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  // Pre-execution failure: nothing was applied to the grid.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [FAIL],
));

// 1.12.2
test('Regenerate should be visible after response format failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{}],
));

// 1.12.3
test('Regenerate should be visible after validation failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{ actions: [{ name: 'unknownCommand', args: { foo: 'bar' } }] }],
));

// 1.12.4
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
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{ actions: [] }],
));

// 1.12.5
test('Regenerate should NOT be visible after full success', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();

  // The successful command actually changed the grid state.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
));

// 1.12.6
test('Regenerate should NOT be visible after partial-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort and filter')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(2);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();

  // No Regenerate because action #1 already mutated the grid.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{
    actions: [
      { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent', sortOrder: 'asc' } },
    ],
  }],
));

// 1.12.7
test('Regenerate should NOT be visible after all-execution failure', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by unknown')
    .pressKey('enter');

  await t.expect(aiChat.getAIMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(2);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();

  // Both commands targeted non-existent columns, so real columns stay unsorted.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [{
    actions: [
      { name: 'sorting', args: { dataField: 'nonExistent1', sortOrder: 'asc' } },
      { name: 'sorting', args: { dataField: 'nonExistent2', sortOrder: 'desc' } },
    ],
  }],
));

// 1.12.8
test('Regenerate should resend the same prompt and replace the previous response', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.click(aiChat.getMessageRegenerateButton(0));

  // The failed response is replaced, not accumulated: still a single AI response.
  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getAIMessages().count).eql(1);

  // The regenerated command applied to the grid.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');

  // The same prompt was resent with a freshly-built (current) grid context.
  const requests = await getAIRequests();
  await t.expect(requests.length).eql(2);
  await t.expect(requests[1].text).eql(requests[0].text);
  await t.expect(requests[1].text).eql('Sort by name');
  await t.expect(requests[1].columns).eql(['id', 'name', 'value']);
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [
    FAIL,
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ],
));

// 1.12.9
test('Regenerate should be disabled while request is in flight', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);

  await t.click(aiChat.getMessageRegenerateButton(0));

  await t.expect(aiChat.getPendingMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).notOk();

  // Nothing was applied while the regenerate request is still pending.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [
    FAIL,
    HANG,
  ],
));

// 1.12.11
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

  await t.click(aiChat.getCloseButton().element);

  await t.expect(aiChat.getAbortConfirmDialog().exists).ok();

  await t.click(aiChat.getAbortConfirmYesButton());
  await t.click(dataGrid.getAIAssistantButton());

  // The aborted response is rendered as a failure with no executed commands,
  // so it currently offers Regenerate (pins current behavior; see doc §1.12.11).
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  { dataSource: threeRows, ...baseGrid },
  [HANG],
));

// === §3.8.2 Sequential resends after pre-execution failures ===

// 3.8.2
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
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.click(aiChat.getMessageRegenerateButton(0));

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  await t.click(aiChat.getMessageRegenerateButton(0));

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageRegenerateButton(0).exists).ok();

  // Every retry failed before execution, so the grid was never mutated.
  await t.expect(await dataGrid.apiColumnOption('name', 'sortOrder')).notOk();

  // Each Regenerate dispatched a fresh request with the same prompt.
  const requests = await getAIRequests();
  await t.expect(requests.length).eql(3);
  await t.expect(requests[2].text).eql('Sort by name');
}).before(async () => createGridWithAIAssistant(
  { dataSource: twoRows, ...baseGrid },
  [FAIL],
));
