import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Ai Column.Common (TreeList)`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const TREE_LIST_SELECTOR = '#container';
const EMPTY_CELL_TEXT = '\u00A0';
const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
const DROPDOWNMENU_REGENERATE_INDEX = 1;
const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

test('Get result from AI and display it in the AI column', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
  await t.expect(treeList.getDataCell(0, 4).element.innerText).eql('Response Name 1 for second AI column');
  await t.expect(treeList.getDataCell(1, 4).element.innerText).eql('Response Name 2 for second AI column');
  await t.expect(treeList.getDataCell(2, 4).element.innerText).eql('Response Name 3 for second AI column');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

  const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_REGENERATE_INDEX).element);

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = treeList.getAIPromptEditor();

  await t
    .click(promptEditor.getRegenerateButton().element);

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();
  // assert
  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
  const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_CLEAR_DATA_INDEX).element);

  // assert
  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

  const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = treeList.getAIPromptEditor();

  await t
    .click(promptEditor.getRegenerateButton().element)
    .click(promptEditor.getStopButton().element);

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t.expect(treeList.isReady()).ok();
  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

  const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(aiColumnHeaderCell.getAIHeaderButton().element);
  const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
  await t
    .click(dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element);

  const promptEditor = treeList.getAIPromptEditor();

  await t
    .typeText(promptEditor.getTextArea().element, 'changed prompt', { replace: true })
    .click(promptEditor.getApplyButton().element);

  await t.expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for changed prompt');
  await t.expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for changed prompt');
  await t.expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for changed prompt');
}).before(async () => createWidget('dxTreeList', () => ({
  dataSource: [
    {
      id: 1, parentId: 0, name: 'Name 1', value: 10,
    },
    {
      id: 2, parentId: 1, name: 'Name 2', value: 20,
    },
    {
      id: 3, parentId: 1, name: 'Name 3', value: 30,
    },
  ],
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
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
