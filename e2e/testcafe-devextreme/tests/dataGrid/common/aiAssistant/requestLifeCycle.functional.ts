/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import {
  AI_INTEGRATION_PAGE,
  GRID_SELECTOR,
  createGridWithAIAssistant,
  threeRows,
} from './testHelpers';

const getRequestCount = ClientFunction(() => (window as any).__aiRequests.length);

const getRequestPayload = ClientFunction(
  (index: number) => (window as any).__aiRequests[index].data,
);

const getRequestColumnNames = ClientFunction(
  (index: number) => (window as any).__aiRequests[index].data.context.columns
    .map((c: any) => c.dataField),
);

const getRequestCreatingArgs = ClientFunction(() => (window as any).__requestCreatingArgs);

fixture`AI Assistant - Request Customization`
  .page(AI_INTEGRATION_PAGE);

test('onAIAssistantRequestCreating should allow context customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect((await getRequestPayload(0)).context.customField).eql('customValue');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  { onAIAssistantRequestCreating: (e: any) => { e.context.customField = 'customValue'; } },
));

test('onAIAssistantRequestCreating should allow schema customization', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect((await getRequestPayload(0)).responseSchema.description).eql('Modified schema');
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  { onAIAssistantRequestCreating: (e: any) => { e.responseSchema.description = 'Modified schema'; } },
));

test('onAIAssistantRequestCreating handler should receive grid component and element', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  const handlerResult = await getRequestCreatingArgs();

  await t
    .expect(handlerResult.componentName).eql('dxDataGrid')
    .expect(handlerResult.elementId).eql('container');
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  {
    onAIAssistantRequestCreating: (e: any) => {
      const element = e.element?.nodeType ? e.element : e.element?.get?.(0);

      (window as any).__requestCreatingArgs = {
        componentName: e.component?.NAME,
        elementId: element?.id,
      };
    },
  },
));

test('Column added externally should be reflected in next request context', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  // First request
  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  // Update columns
  await dataGrid.apiOption('columns', ['id', 'name', 'value', 'extra']);

  // Second request
  await t
    .typeText(aiChat.getInput(), 'Sort by extra')
    .pressKey('enter');

  await t.expect(getRequestColumnNames(0)).eql(['id', 'name', 'value']);
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name', 'value', 'extra']);
}).before(async () => createGridWithAIAssistant(
  {
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
  },
  [
    { actions: [{ name: 'clearSorting', args: {} }] },
    { actions: [{ name: 'clearSorting', args: {} }] },
  ],
));

test('Sort on removed column then submit another prompt should not crash', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value')
    .pressKey('enter');

  await t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).eql('asc');

  await dataGrid.apiOption('columns', ['id', 'name']);

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
  await t.expect(getRequestColumnNames(0)).eql(['id', 'name', 'value']);
  await t.expect(getRequestColumnNames(1)).eql(['id', 'name']);
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [
    { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'asc' } }] },
    { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
  ],
));

test('cancel = true should abort before any request is dispatched', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(aiChat.getSuccessMessages().count).eql(0);
  await t.expect(getRequestCount()).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
  await t.expect(aiChat.isInputDisabled()).notOk();
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  { onAIAssistantRequestCreating: (e: any) => { e.cancel = true; } },
));

test('cancel left untouched should dispatch the request normally', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(getRequestCount()).eql(1);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).eql('asc');
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  { onAIAssistantRequestCreating: (): void => {} },
));

test('cancel from a dynamic context check should abort when the column is present', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by name')
    .pressKey('enter');

  await t.expect(aiChat.getErrorMessages().count).eql(1);
  await t.expect(getRequestCount()).eql(0);
  await t.expect(dataGrid.apiColumnOption('name', 'sortOrder')).notOk();
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: threeRows,
    keyExpr: 'id',
    columns: ['id', 'name', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] }],
  {},
  {
    onAIAssistantRequestCreating: (e: any) => {
      if (e.context.columns.some((c: any) => c.dataField === 'name')) {
        e.cancel = true;
      }
    },
  },
));

test('cancel from a dynamic context check should dispatch when the column is absent', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getAIAssistantButton());

  const aiChat = dataGrid.getAIAssistantChat();

  await t
    .typeText(aiChat.getInput(), 'Sort by value')
    .pressKey('enter');

  await t.expect(getRequestCount()).eql(1);
  await t.expect(dataGrid.apiColumnOption('value', 'sortOrder')).eql('desc');
}).before(async () => createGridWithAIAssistant(
  {
    dataSource: [
      { id: 1, value: 30 },
      { id: 2, value: 20 },
    ],
    keyExpr: 'id',
    columns: ['id', 'value'],
    showBorders: true,
  },
  [{ actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] }],
  {},
  {
    onAIAssistantRequestCreating: (e: any) => {
      if (e.context.columns.some((c: any) => c.dataField === 'name')) {
        e.cancel = true;
      }
    },
  },
));
