import DataGrid from 'devextreme-testcafe-models/dataGrid';
import Button from 'devextreme-testcafe-models/button';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Ai Column.Common`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const DATA_GRID_SELECTOR = '#container';
const EMPTY_CELL_TEXT = '\u00A0';
const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
const DROPDOWNMENU_REGENERATE_INDEX = 1;
const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

test('The AI column with a given width', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.getDataCell(0, 3).element.clientWidth).eql(175);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      width: 175,
    },
  ],
}));

test('The AI column with a given min-width', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // assert
  await t.expect(dataGrid.getDataCell(0, 3).element.clientWidth).eql(175);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 300,
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value', width: 100 },
    {
      type: 'ai',
      caption: 'AI Column',
      minWidth: 175,
    },
  ],
}));

test('Get result from AI and display it in the AI column', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Get result from AI and display it in two AI columns', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
  await t.expect(dataGrid.getDataCell(0, 4).element.innerText).eql('Response Name 1 for second AI column');
  await t.expect(dataGrid.getDataCell(1, 4).element.innerText).eql('Response Name 2 for second AI column');
  await t.expect(dataGrid.getDataCell(2, 4).element.innerText).eql('Response Name 3 for second AI column');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
    {
      type: 'ai',
      caption: 'AI Column2',
      name: 'AI Column2',
      ai: {
        prompt: 'second AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Regenerate the AI request from DropDownButton menu', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

  const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_REGENERATE_INDEX).element);

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        mode: 'manual',
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });
                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Regenerate the AI request from Prompt Editor', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = dataGrid.getAIPromptEditor();

  await t
    .click(promptEditor.getRegenerateButton().element);

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        mode: 'manual',
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Clear Data from AI column by DropDownButton menu', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();
  // assert
  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
  const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_CLEAR_DATA_INDEX).element);

  // assert
  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Abort the AI request from Prompt Editor', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

  const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = dataGrid.getAIPromptEditor();

  await t
    .click(promptEditor.getRegenerateButton().element)
    .click(promptEditor.getStopButton().element);

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        prompt: 'first AI column',
        mode: 'manual',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                setTimeout(() => {
                  resolve(JSON.stringify(result));
                }, 3000);
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('Change the prompt in the AI Prompt Editor', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();
  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

  const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = dataGrid.getAIPromptEditor();

  await t
    .typeText(promptEditor.getTextArea().element, 'changed prompt', { replace: true })
    .click(promptEditor.getApplyButton().element);

  await t.expect(dataGrid.getDataCell(0, 3).element.innerText).eql('Response Name 1 for changed prompt');
  await t.expect(dataGrid.getDataCell(1, 3).element.innerText).eql('Response Name 2 for changed prompt');
  await t.expect(dataGrid.getDataCell(2, 3).element.innerText).eql('Response Name 3 for changed prompt');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'AI Column',
      ai: {
        prompt: 'first AI column',
        // eslint-disable-next-line new-cap
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(prompt) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(prompt.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${prompt.data?.text}`;
                });

                resolve(JSON.stringify(result));
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    },
  ],
})));

test('The scroll position should not reset when the ai.prompt changes at runtime', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const changePromptButton = new Button('#otherContainer');
  const scrollContainer = dataGrid.getHeadersScrollContainer();
  const scrollX = 200;

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollTo(t, { x: scrollX });

  await t.expect(scrollContainer.scrollLeft).eql(scrollX);

  await t.click(changePromptButton.element);

  await t.expect(dataGrid.getLoadPanel().element.exists).ok();

  await t.expect(scrollContainer.scrollLeft).eql(scrollX);
}).before(async () => {
  await createWidget('dxDataGrid', () => ({
    dataSource: [{ id: 1, name: 'Name 1', value: 1 }],
    keyExpr: 'id',
    width: 200,
    columns: [
      { dataField: 'id', caption: 'ID', width: 100 },
      { dataField: 'name', caption: 'Name', width: 200 },
      { dataField: 'value', caption: 'Value', width: 100 },
      {
        type: 'ai',
        caption: 'AI Column',
        name: 'aiColumn',
        ai: {
          // eslint-disable-next-line new-cap
          aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
            sendRequest() {
              return {
                promise: new Promise<string>((resolve) => {
                  setTimeout(() => {
                    resolve('');
                  }, 30000);
                }),
                abort: (): void => {},
              };
            },
          }),
        },
        width: 300,
      },
    ],
  }));

  await createWidget('dxButton', {
    text: 'Change prompt',
    onClick() {
      const grid = ($ as any)('#container').dxDataGrid('instance');
      grid.columnOption('aiColumn', 'ai.prompt', 'Updated prompt');
    },
  }, '#otherContainer');
});
