import { test, expect } from '@playwright/test';
import { createWidget, TreeList } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Ai Column.Common (TreeList)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const EMPTY_CELL_TEXT = '\u00A0';
  const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
  const DROPDOWNMENU_REGENERATE_INDEX = 1;
  const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

  test('Get result from AI and display it in the AI column', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();

    await page.waitForTimeout(1000);

    const cell0 = treeList.getDataCell(0, 3);
    await expect(cell0).toHaveText('Response Name 1 for first AI column');
    const cell1 = treeList.getDataCell(1, 3);
    await expect(cell1).toHaveText('Response Name 2 for first AI column');
    const cell2 = treeList.getDataCell(2, 3);
    await expect(cell2).toHaveText('Response Name 3 for first AI column');
  });

  test('Get result from AI and display it in two AI columns', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();
    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3)).toHaveText('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3)).toHaveText('Response Name 3 for first AI column');
    await expect(treeList.getDataCell(0, 4)).toHaveText('Response Name 1 for second AI column');
    await expect(treeList.getDataCell(1, 4)).toHaveText('Response Name 2 for second AI column');
    await expect(treeList.getDataCell(2, 4)).toHaveText('Response Name 3 for second AI column');
  });

  test('Regenerate the AI request from DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();

    await expect(treeList.getDataCell(0, 3)).toHaveText(EMPTY_CELL_TEXT);

    const dropDownButton = treeList.getDropDownButton(0);
    await dropDownButton.click();

    const dropDownList = page.locator('.dx-dropdownbutton-popup-wrapper .dx-list-item');
    await dropDownList.nth(DROPDOWNMENU_REGENERATE_INDEX).click();

    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3)).toHaveText('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3)).toHaveText('Response Name 3 for first AI column');
  });

  test('Regenerate the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();

    await expect(treeList.getDataCell(0, 3)).toHaveText(EMPTY_CELL_TEXT);

    const dropDownButton = treeList.getDropDownButton(0);
    await dropDownButton.click();

    const dropDownList = page.locator('.dx-dropdownbutton-popup-wrapper .dx-list-item');
    await dropDownList.nth(DROPDOWNMENU_PROMPT_EDITOR_INDEX).click();

    const regenerateButton = page.locator('.dx-ai-prompt-editor .dx-button').filter({ hasText: /regenerate/i }).first();
    await regenerateButton.click();

    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for first AI column');
    await expect(treeList.getDataCell(1, 3)).toHaveText('Response Name 2 for first AI column');
    await expect(treeList.getDataCell(2, 3)).toHaveText('Response Name 3 for first AI column');
  });

  test('Clear Data from AI column by DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();
    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for first AI column');

    const dropDownButton = treeList.getDropDownButton(0);
    await dropDownButton.click();

    const dropDownList = page.locator('.dx-dropdownbutton-popup-wrapper .dx-list-item');
    await dropDownList.nth(DROPDOWNMENU_CLEAR_DATA_INDEX).click();

    await expect(treeList.getDataCell(0, 3)).toHaveText(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3)).toHaveText(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3)).toHaveText(EMPTY_CELL_TEXT);
  });

  test('Abort the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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
                    setTimeout(() => { resolve(JSON.stringify(result)); }, 3000);
                  }),
                  abort: (): void => {},
                };
              },
            }),
          },
        },
      ],
    }));

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();

    await expect(treeList.getDataCell(0, 3)).toHaveText(EMPTY_CELL_TEXT);

    const dropDownButton = treeList.getDropDownButton(0);
    await dropDownButton.click();

    const dropDownList = page.locator('.dx-dropdownbutton-popup-wrapper .dx-list-item');
    await dropDownList.nth(DROPDOWNMENU_PROMPT_EDITOR_INDEX).click();

    const regenerateButton = page.locator('.dx-ai-prompt-editor .dx-button').filter({ hasText: /regenerate/i }).first();
    await regenerateButton.click();

    const stopButton = page.locator('.dx-ai-prompt-editor .dx-button').filter({ hasText: /stop/i }).first();
    await stopButton.click();

    await expect(treeList.getDataCell(0, 3)).toHaveText(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(1, 3)).toHaveText(EMPTY_CELL_TEXT);
    await expect(treeList.getDataCell(2, 3)).toHaveText(EMPTY_CELL_TEXT);
  });

  test('Change the prompt in the AI Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxTreeList', () => ({
      dataSource: [
        { id: 1, parentId: 0, name: 'Name 1', value: 10 },
        { id: 2, parentId: 1, name: 'Name 2', value: 20 },
        { id: 3, parentId: 1, name: 'Name 3', value: 30 },
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

    const treeList = new TreeList(page);
    await expect(treeList.element.locator('.dx-treelist')).toBeVisible();
    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for first AI column');

    const dropDownButton = treeList.getDropDownButton(0);
    await dropDownButton.click();

    const dropDownList = page.locator('.dx-dropdownbutton-popup-wrapper .dx-list-item');
    await dropDownList.nth(DROPDOWNMENU_PROMPT_EDITOR_INDEX).click();

    const textArea = page.locator('.dx-ai-prompt-editor .dx-textarea .dx-texteditor-input');
    await textArea.fill('changed prompt');

    const applyButton = page.locator('.dx-ai-prompt-editor .dx-button').filter({ hasText: /apply/i }).first();
    await applyButton.click();

    await page.waitForTimeout(1000);

    await expect(treeList.getDataCell(0, 3)).toHaveText('Response Name 1 for changed prompt');
    await expect(treeList.getDataCell(1, 3)).toHaveText('Response Name 2 for changed prompt');
    await expect(treeList.getDataCell(2, 3)).toHaveText('Response Name 3 for changed prompt');
  });
});
