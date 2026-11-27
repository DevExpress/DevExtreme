import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';
import {
  HANG,
  baseGrid,
  createGridWithAIAssistant,
  threeRows,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const sortByNameResponse = {
  actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }],
};

const gridWithoutAssistant = {
  dataSource: [
    { id: 1, name: 'Alice', value: 30 },
    { id: 2, name: 'Bob', value: 20 },
    { id: 3, name: 'Charlie', value: 10 },
  ],
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
};

test.describe('AI Assistant - Toolbar & Popup', () => {
  test('Toolbar button should be visible when aiAssistant.enabled is true', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [HANG]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getAIAssistantButton()).toBeAttached();
  });

  test('Toolbar button should be hidden when aiAssistant is not configured', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', gridWithoutAssistant);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getAIAssistantButton()).not.toBeAttached();
  });

  test('Popup should open on toolbar button click without changing grid state', async ({ page }) => {
    await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [HANG]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const initialState = await dataGrid.apiState();

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await expect(aiChat.element).toBeVisible();
    await expect(aiChat.getChat().element).toBeAttached();
    await expect(aiChat.getInput()).toBeVisible();

    const finalState = await dataGrid.apiState();

    expect(finalState).toEqual(initialState);
  });

  test('AI Assistant-applied sorting should persist after popup close', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [sortByNameResponse],
    );

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getActionItems()).toHaveCount(1);

    await aiChat.getCloseButton().element.click();

    await expect(aiChat.element).toBeHidden();
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Custom title should be rendered in popup header', async ({ page }) => {
    await createGridWithAIAssistant(
      page,
      { ...baseGrid, dataSource: threeRows },
      [HANG],
      { title: 'My Custom Assistant' },
    );

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await expect(aiChat.getTitle()).toContainText('My Custom Assistant');
  });

  [
    { title: 'Toolbar button should activate via Enter key', key: 'Enter' },
    { title: 'Toolbar button should activate via Space key', key: 'Space' },
  ].forEach(({ title, key }) => {
    test(title, async ({ page }) => {
      await createGridWithAIAssistant(page, { ...baseGrid, dataSource: threeRows }, [HANG]);

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getAIAssistantButton().focus();

      await expect(dataGrid.getAIAssistantButton()).toBeFocused();

      await page.keyboard.press(key);

      await expect(dataGrid.getAIAssistantChat().element).toBeVisible();
    });
  });
});
