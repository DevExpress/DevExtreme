import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.Common (TreeList)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TREE_LIST_SELECTOR = '#container';
  const EMPTY_CELL_TEXT = '\u00A0';
  const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
  const DROPDOWNMENU_REGENERATE_INDEX = 1;
  const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

  test('Get result from AI and display it in the AI column', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

    });

  test('Get result from AI and display it in two AI columns', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
    await expect(treeList.getDataCell(0, 4).element.innerText).eql('Response Name 1 for second AI column');
    await expect(treeList.getDataCell(1, 4).element.innerText).eql('Response Name 2 for second AI column');
    await expect(treeList.getDataCell(2, 4).element.innerText).eql('Response Name 3 for second AI column');

    });

  test('Regenerate the AI request from DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

    const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_REGENERATE_INDEX).element.click();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

    });

  test('Regenerate the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = treeList.getAIPromptEditor();

    await promptEditor.getRegenerateButton().element.click();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

    });

  test('Clear Data from AI column by DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    // arrange, act
    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();
    // assert
    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');
    const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_CLEAR_DATA_INDEX).element.click();

    // assert
    await expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

    });

  test('Abort the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();

    await expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

    const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = treeList.getAIPromptEditor();

    await promptEditor.getRegenerateButton().element.click()
      .click(promptEditor.getStopButton().element);

    await expect(treeList.getDataCell(0, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3).element.innerText).eql(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3).element.innerText).eql(EMPTY_CELL_TEXT);

    });

  test('Change the prompt in the AI Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
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
                  aiIntegration: new (window as any).DevExpress.aiIntegration({
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
  }));

    const treeList = new TreeList(TREE_LIST_SELECTOR);

    await expect(treeList.isReady()).ok();
    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for first AI column');

    const aiColumnHeaderCell = treeList.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = treeList.getAIPromptEditor();

    await promptEditor.getTextArea().element.fill('changed prompt')
      .click(promptEditor.getApplyButton().element);

    await expect(treeList.getDataCell(0, 3).element.innerText).eql('Response Name 1 for changed prompt');
    await expect(treeList.getDataCell(1, 3).element.innerText).eql('Response Name 2 for changed prompt');
    await expect(treeList.getDataCell(2, 3).element.innerText).eql('Response Name 3 for changed prompt');

    });
});
