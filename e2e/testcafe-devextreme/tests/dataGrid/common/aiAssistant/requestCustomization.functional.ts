/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { AI_INTEGRATION_PAGE, GRID_SELECTOR, getRequestColumnNames } from './testHelpers';

// === §1.11 onAIAssistantRequestCreating ===

fixture.disablePageReloads`AI Assistant - RequestCreating`
  .page(AI_INTEGRATION_PAGE);

// 1.11.1
test('onAIAssistantRequestCreating should allow context customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const requests = await ClientFunction(() => (window as any).__aiRequests)();

  await t.expect((requests as any[])[0].data.context.customField).eql('customValue');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

  return {
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
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
    onAIAssistantRequestCreating(e: any) {
      e.context.customField = 'customValue';
    },
  };
}));

// 1.11.2
test('onAIAssistantRequestCreating should allow schema customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const requests = await ClientFunction(() => (window as any).__aiRequests)();

  await t.expect((requests as any[])[0].data.responseSchema.description).eql('Modified schema');
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

  return {
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
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
    onAIAssistantRequestCreating(e: any) {
      e.responseSchema.description = 'Modified schema';
    },
  };
}));

// 1.11.3
test('onAIAssistantRequestCreating handler should receive grid component and element', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getSuccessMessages().count).eql(1);

  const handlerResult = await ClientFunction(() => (window as any).__requestCreatingArgs)();

  await t
    .expect(handlerResult.hasComponent).ok()
    .expect(handlerResult.hasElement).ok();
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

  return {
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
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve({
              actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
    onAIAssistantRequestCreating(e: any) {
      (window as any).__requestCreatingArgs = {
        hasComponent: !!e.component,
        hasElement: !!e.element,
      };
    },
  };
}));

// === §3.13 Grid options changed externally between prompts ===

fixture.disablePageReloads`AI Assistant - External Changes`
  .page(AI_INTEGRATION_PAGE);

// 3.13.1
test('Column added externally should be reflected in next request context', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  await dataGrid.apiOption('columns', ['id', 'name', 'value', 'extra']);

  await t
    .typeText(aiChat.getInput(), 'Sort by extra')
    .pressKey('enter');

  await t.expect(getRequestColumnNames(0)).eql(['id', 'name', 'value']);
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name', 'value', 'extra']);
  await t.expect(aiChat.getMessages().count).eql(4);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__aiRequests = [];

  return {
    dataSource: [
      {
        id: 1, name: 'Alice', value: 30, extra: 'X',
      },
      {
        id: 2, name: 'Bob', value: 20, extra: 'Y',
      },
    ],
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest(params: any) {
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve({
              actions: [{ name: 'clearSorting', args: {} }],
            }),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));

// 3.13.2 / 3.13.3
test('Sort on removed column then submit another prompt should not crash', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value')
    .pressKey('enter');

  await t.expect(aiChat.getMessages().count).eql(2);

  await dataGrid.apiOption('columns', ['id', 'name']);

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const sortOrder = await dataGrid.apiColumnOption('name', 'sortOrder');

  await t.expect(sortOrder).eql('asc');
  await t.expect(getRequestColumnNames(0)).eql(['id', 'name', 'value']);
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name']);
  await t.expect(aiChat.getMessages().count).eql(4);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any).__callCount = 0;
  (window as any).__aiRequests = [];

  const responses = [
    { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'asc' } }] },
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ];

  return {
    dataSource: [
      { id: 1, name: 'Alice', value: 30 },
      { id: 2, name: 'Bob', value: 20 },
    ],
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest(params: any) {
          const count = (window as any).__callCount;

          (window as any).__callCount = count + 1;
          (window as any).__aiRequests.push(params);

          return {
            promise: Promise.resolve(responses[count] ?? responses[0]),
            abort: (): void => {},
          };
        },
      }),
    },
  };
}));
