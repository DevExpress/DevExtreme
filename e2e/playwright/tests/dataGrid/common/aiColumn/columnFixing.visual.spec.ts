import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const createGrid = (
  page: Page,
  aiColumnOptions: { allowFixing?: boolean } = {},
): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 600,
  columnWidth: 200,
  columnFixing: {
    enabled: true,
  },
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      ...aiColumnOptions,
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
});

test.describe('Ai Column - Sticky columns.Visual', () => {
  test('Check context menu items', async ({ page }) => {
    await createGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click({ button: 'right' });
    await contextMenu.getItemByText('Set Fixed Position').click();

    await expect(contextMenu.getItemByText('Left')).toBeVisible();

    await testScreenshot(page, 'datagrid__ai-column-and-sticky-columns__context-menu.png', { element: dataGrid.element });
  });

  test('Check context menu items when allowFixing is false', async ({ page }) => {
    await createGrid(page, { allowFixing: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click({ button: 'right' });

    await testScreenshot(page, 'datagrid__ai-column-and-sticky-columns__context-menu-when-allowFixing-false.png', { element: dataGrid.element });
  });
});
