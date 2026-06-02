import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, formatMessage, GRID_SELECTOR } from './testHelpers';

// All §4.1–§4.3 failures surface the same predefined "invalid response" text.
const invalidResponse = (): Promise<string> => formatMessage(
  'dxDataGrid-aiAssistantInvalidResponseMessage',
);

// === §2.1 Unsupported / unknown intent ===

fixture.disablePageReloads`AI Assistant - Empty Actions`
  .page(AI_INTEGRATION_PAGE);

// 2.1.3
test('Empty actions array should show no-action message and leave grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Tell me a joke')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §2.3 Unknown field ===

fixture.disablePageReloads`AI Assistant - Unknown Field`
  .page(AI_INTEGRATION_PAGE);

// 2.3.2
test('Sorting by non-existent dataField should show failure message and leave grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by Salary')
    .pressKey('enter');

  const dataSourceSortParams = await dataGrid.apiGetDataSourceSortParams();

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataSourceSortParams).eql(null);
}).before(async () => createWidget('dxDataGrid', () => ({
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
            actions: [{ name: 'sorting', args: { dataField: 'Salary', sortOrder: 'asc' } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §2.4 Request impossible in current state ===

fixture.disablePageReloads`AI Assistant - Impossible State`
  .page(AI_INTEGRATION_PAGE);

// 2.4.1
test('Page index out of range should show failure status', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Go to page 10000')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiPageIndex()).eql(0);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  paging: { pageSize: 2 },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'pageIndex', args: { pageIndex: 9999 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 2.4.2
test('Grouping by non-groupable column should show failure entry', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Group by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', allowGrouping: false },
    { dataField: 'value' },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 2.4.3
test('Selecting non-existent keys should show failure or no incorrect rows selected', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Select rows 999 and 1000')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiOption('selectedRowKeys')).eql([]);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
  selection: { mode: 'multiple' },
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [{ name: 'selectByKeys', args: { keys: [999, 1000] } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §2.6 Excessively long prompt / provider error ===

fixture.disablePageReloads`AI Assistant - Provider Error`
  .page(AI_INTEGRATION_PAGE);

// 2.6.2
test('sendRequest rejection should show error message and leave grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(0);
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.reject(new Error('Request payload too large')),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §4.1 AI integration failures → "unexpected error" / "invalid response" ===
// Note: 4.1.2 (HTTP error) / 4.1.3 (network error) share the rejection path already
// covered by 2.6.2 above. 4.1.4 (synchronous throw from sendRequest) is NOT caught by
// RequestManager (no try/catch around provider.sendRequest), so it is not exercised here.

fixture.disablePageReloads`AI Assistant - Integration Failure`
  .page(AI_INTEGRATION_PAGE);

// 4.1.1
// The plan expects "unexpected error", but the current implementation shows "invalid response"
// (known issue 4284). This locks the CURRENT behavior — switch to the unexpected-error key
// once 4284 is fixed.
test('Missing aiIntegration should show an error and leave grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
  },
})));

// 4.1.5
test('Non-JSON string response should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve('not json'),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.1.6
test('Non-JSON actions string should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: 'not json' }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.1.7
test('Empty string response should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve(''),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §4.2 Response format failure → "invalid response" ===

fixture.disablePageReloads`AI Assistant - Response Format`
  .page(AI_INTEGRATION_PAGE);

// 4.2.1
test('Response missing actions should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({}),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.2.2
test('Object actions (not array) should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: { name: 'sorting' } }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.2.3
test('Null actions should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: null }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.2.4
test('Primitive actions should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: 42 }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.2.5
test('Null response should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve(null),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §4.3 Validation failure (GridCommands.validate) → "invalid response" ===

fixture.disablePageReloads`AI Assistant - Validation`
  .page(AI_INTEGRATION_PAGE);

// 4.3.1
test('Unknown command name should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 'unknownCmd', args: {} }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.2
test('Non-string command name should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 123, args: {} }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.3
test('Empty command name should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: '', args: {} }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.4
test('Action without name should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ args: {} }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.5
test('Action without args should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 'sorting' }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.6
test('Null args should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 'sorting', args: null }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.7
test('Args missing a required property should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 'sorting', args: { sortOrder: 'asc' } }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.8
test('Args with a wrong-typed property should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
            actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 123 } }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.9
test('Args with an extra property should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
            actions: [{
              name: 'sorting',
              args: { dataField: 'name', sortOrder: 'asc', foo: 'bar' },
            }],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.10
test('Mix of valid and invalid actions should reject the whole response', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
  // Even the valid sorting action must not execute.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createWidget('dxDataGrid', () => ({
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
            actions: [
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
              { name: 'unknownCmd', args: {} },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.3.11
test('No-arg command with non-empty args should show invalid-response error', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Clear sorting')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getMessageErrorText(0).innerText).eql(await invalidResponse());
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(aiChat.getActionItems(0).count).eql(0);
}).before(async () => createWidget('dxDataGrid', () => ({
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
          promise: Promise.resolve({ actions: [{ name: 'clearSorting', args: { foo: 1 } }] }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// === §4.4 Execution failure → per-command failure message ===

fixture.disablePageReloads`AI Assistant - Execution Failure`
  .page(AI_INTEGRATION_PAGE);

// 4.4.3 (single async command rejects) is not covered as e2e: command executors catch
// rejections internally and return failure(), so the observable result is identical to the
// synchronous-failure path already exercised by 4.4.4 / 4.4.5 and §2.3.2 / §2.4.x. Forcing a
// genuine async rejection needs a custom executor, which the public AIIntegration mock cannot
// inject deterministically (same limitation as 4.4.2 sync-throw and 4.4.6 reentrancy guard).

// 4.4.4
test('Partial failure should report each action status and apply successes', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort, group and search')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(2);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(1);
  // The failed grouping action carries its predefined per-command message.
  await t.expect(aiChat.getActionItemText(0, 1).innerText).contains('Group data against');
  // Successful actions (#1 sorting, #3 searching) took effect; failed grouping did not.
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', allowGrouping: false },
    { dataField: 'value' },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [
              { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
              { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
              { name: 'searching', args: { text: 'Alice' } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));

// 4.4.5
test('All-commands failure should report failures and leave grid unchanged', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Do impossible things')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);
  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getActionItems(0).count).eql(3);
  await t.expect(aiChat.getSuccessActionItems(0).count).eql(0);
  await t.expect(aiChat.getErrorActionItems(0).count).eql(3);
  // Each failed action keeps its own predefined per-command message.
  await t.expect(aiChat.getActionItemText(0, 0).innerText).contains('Sort data against');
  await t.expect(aiChat.getActionItemText(0, 2).innerText).contains('Group data against');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(dataGrid.apiColumnOption('name', 'groupIndex')).eql(undefined);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id' },
    { dataField: 'name', allowGrouping: false },
    { dataField: 'value' },
  ],
  showBorders: true,
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest() {
        return {
          promise: Promise.resolve({
            actions: [
              { name: 'sorting', args: { dataField: 'NopeOne', sortOrder: 'asc' } },
              { name: 'sorting', args: { dataField: 'NopeTwo', sortOrder: 'desc' } },
              { name: 'grouping', args: { dataField: 'name', groupIndex: 0 } },
            ],
          }),
          abort: (): void => {},
        };
      },
    }),
  },
})));
