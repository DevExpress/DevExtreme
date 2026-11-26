/* eslint-disable no-underscore-dangle */
import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL } from '../../../../helpers/const';
import DataGrid from '../../../../models/dataGrid';
import type AIAssistantChat from '../../../../models/dataGrid/aiAssistantChat';
import { typeText } from '../../helpers/typeText';
import {
  GRID_SELECTOR,
  baseGrid,
  createGridWithAIAssistant,
  getRequestColumnNames,
  getRequestCount,
  getRequestCreatingArgs,
  getRequestPayload,
  threeRows,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const sortNameAsc = { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] };

const openChat = async (page: Page): Promise<{ dataGrid: DataGrid; aiChat: AIAssistantChat }> => {
  const dataGrid = new DataGrid(page, GRID_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await dataGrid.getAIAssistantButton().click();

  return { dataGrid, aiChat: dataGrid.getAIAssistantChat() };
};

const submit = async (page: Page, aiChat: AIAssistantChat, prompt: string): Promise<void> => {
  await typeText(aiChat.getInput(), prompt);
  await page.keyboard.press('Enter');
};

test.describe('AI Assistant - Request Customization', () => {
  test('onAIAssistantRequestCreating should allow context customization', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({ onAIAssistantRequestCreating: (e: any) => { e.context.customField = 'customValue'; } }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    expect((await getRequestPayload(page, 0)).context.customField).toBe('customValue');
  });

  test('onAIAssistantRequestCreating should allow schema customization', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({ onAIAssistantRequestCreating: (e: any) => { e.responseSchema.description = 'Modified schema'; } }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    expect((await getRequestPayload(page, 0)).responseSchema.description).toBe('Modified schema');
  });

  test('onAIAssistantRequestCreating handler should receive grid component and element', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({
        onAIAssistantRequestCreating: (e: any) => {
          const element = e.element?.nodeType ? e.element : e.element?.get?.(0);

          (window as any).__aiState.requestCreatingArgs = {
            componentName: e.component?.NAME,
            elementId: element?.id,
          };
        },
      }),
    );

    const { aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect.poll(() => getRequestCreatingArgs(page)).toEqual({
      componentName: 'dxDataGrid',
      elementId: 'container',
    });
  });

  test('Column added externally should be reflected in next request context', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      {
        ...baseGrid,
        dataSource: [
          {
            id: 1, name: 'Alice', value: 30, extra: 'X',
          },
          {
            id: 2, name: 'Bob', value: 20, extra: 'Y',
          },
        ],
      },
      [
        { actions: [{ name: 'clearSorting', args: {} }] },
        { actions: [{ name: 'clearSorting', args: {} }] },
      ],
    );

    const { dataGrid, aiChat } = await openChat(page);

    // First request
    await submit(page, aiChat, 'Sort by name');
    await expect(aiChat.getSuccessMessages()).toHaveCount(1);

    // Update columns
    await dataGrid.apiOption('columns', ['id', 'name', 'value', 'extra']);

    // Second request
    await submit(page, aiChat, 'Sort by extra');
    await expect(aiChat.getSuccessMessages()).toHaveCount(2);

    expect(await getRequestColumnNames(page, 0)).toEqual(['id', 'name', 'value']);
    expect(await getRequestColumnNames(page, 1)).toEqual(['id', 'name', 'value', 'extra']);
  });

  test('Sort on removed column then submit another prompt should not crash', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [
        { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'asc' } }] },
        sortNameAsc,
      ],
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by value');

    await expect.poll(() => dataGrid.apiColumnOption('value', 'sortOrder')).toBe('asc');
    await expect(aiChat.getSuccessMessages()).toHaveCount(1);

    await dataGrid.apiOption('columns', ['id', 'name']);

    await submit(page, aiChat, 'Sort by name');

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    expect(await getRequestColumnNames(page, 0)).toEqual(['id', 'name', 'value']);
    expect(await getRequestColumnNames(page, 1)).toEqual(['id', 'name']);
  });

  test('cancel = true should abort before any request is dispatched', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({ onAIAssistantRequestCreating: (e: any) => { e.cancel = true; } }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getSuccessMessages()).toHaveCount(0);
    expect(await getRequestCount(page)).toBe(0);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
    await aiChat.getTextArea().expectDisabled(false);
  });

  test('cancel left untouched should dispatch the request normally', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({ onAIAssistantRequestCreating: (): void => {} }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect.poll(() => getRequestCount(page)).toBe(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('cancel from a dynamic context check should abort when the column is present', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortNameAsc],
      {},
      () => ({
        onAIAssistantRequestCreating: (e: any) => {
          if (e.context.columns.some((c: any) => c.dataField === 'name')) {
            e.cancel = true;
          }
        },
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by name');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    expect(await getRequestCount(page)).toBe(0);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeFalsy();
  });

  test('cancel from a dynamic context check should dispatch when the column is absent', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
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
      () => ({
        onAIAssistantRequestCreating: (e: any) => {
          if (e.context.columns.some((c: any) => c.dataField === 'name')) {
            e.cancel = true;
          }
        },
      }),
    );

    const { dataGrid, aiChat } = await openChat(page);

    await submit(page, aiChat, 'Sort by value');

    await expect.poll(() => getRequestCount(page)).toBe(1);
    await expect.poll(() => dataGrid.apiColumnOption('value', 'sortOrder')).toBe('desc');
  });
});
