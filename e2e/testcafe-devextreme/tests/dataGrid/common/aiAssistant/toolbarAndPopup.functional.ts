import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
  GRID_SELECTOR,
} from './testHelpers';
import { createWidget } from '../../../../helpers/createWidget';

// AI Assistant enabled with a request that never resolves — keeps the chat in the
// idle/empty state (no command runs) for visibility & open/close lifecycle tests.
const gridWithIdleAssistant = (): any => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
});

// Grid without the `aiAssistant` option — toolbar button must not be rendered.
const gridWithoutAssistant = (): any => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
});

// AI Assistant whose mocked request resolves to a single `sorting` command, so a
// prompt actually mutates grid state (used to assert the command is applied).
const gridWithSortingAssistant = (): any => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
});

// AI Assistant with a custom popup title (request stays pending — title only).
const gridWithTitledAssistant = (): any => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    title: 'My Custom Assistant',
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return { promise: new Promise(() => {}), abort: (): void => {} };
      },
    }),
  },
});

// === §1.1 Toolbar entry point & popup lifecycle ===
fixture`AI Assistant - Toolbar`
  .page(AI_INTEGRATION_PAGE);

// 1.1.1
test('Toolbar button should be visible when aiAssistant.enabled is true', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getAIAssistantButton().exists).ok();
}).before(async () => createWidget('dxDataGrid', gridWithIdleAssistant));

// 1.1.2
test('Toolbar button should be hidden when aiAssistant is not configured', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getAIAssistantButton().exists).notOk();
}).before(async () => createWidget('dxDataGrid', gridWithoutAssistant));

// 1.1.3
test('Popup should open on toolbar button click without changing grid state', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const initialState = await dataGrid.apiState();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();
  const finalState = await dataGrid.apiState();

  await t.expect(finalState).eql(initialState);
  await t.expect(aiChat.element.visible).ok();
  await t.expect(aiChat.getChat().element.exists).ok();
  await t.expect(aiChat.getInput().visible).ok();
}).before(async () => createWidget('dxDataGrid', gridWithIdleAssistant));

// 1.1.4
test('AI Assistant-applied sorting should persist after popup close', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(1);

  await t.click(aiChat.getCloseButton().element);

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
}).before(async () => createWidget('dxDataGrid', gridWithSortingAssistant));

// 1.1.6
test('Custom title should be rendered in popup header', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t.expect(aiChat.getTitle().textContent).contains('My Custom Assistant');
}).before(async () => createWidget('dxDataGrid', gridWithTitledAssistant));

// === §1.10 A11y / KBN ===
fixture`AI Assistant - A11y`
  .page(AI_INTEGRATION_PAGE);

// 1.10.2 (Enter) — focus the toolbar button and activate it with Enter.
test('Toolbar button should activate via Enter key', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.focusAIAssistantButton();

  await t.expect(dataGrid.getAIAssistantButton().focused).ok();

  await t.pressKey('enter');

  await t.expect(dataGrid.getAIAssistantChat().element.visible).ok();
}).before(async () => createWidget('dxDataGrid', gridWithIdleAssistant));

// 1.10.2 (Space) — same scenario, activated with Space.
test('Toolbar button should activate via Space key', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.focusAIAssistantButton();

  await t.expect(dataGrid.getAIAssistantButton().focused).ok();

  await t.pressKey('space');

  await t.expect(dataGrid.getAIAssistantChat().element.visible).ok();
}).before(async () => createWidget('dxDataGrid', gridWithIdleAssistant));
