import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import DataGrid from '../../../../models/dataGrid';

const createGrid = (
  page: Page,
  gridOptions: Properties,
  aiColumnOptions: { allowReordering?: boolean } = {},
): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  ...gridOptions,
  columnWidth: 100,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      ...aiColumnOptions,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
});

test.describe('Ai Column.ColumnReordering', () => {
  test('Column reordering should work when allowColumnReordering is true', async ({ page }) => {
    await createGrid(page, { allowColumnReordering: true });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dragToOffset(page, headerRow.getHeaderCell(0).element, 150, 0);

    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'AI Column', 'Name', 'Value']);
  });

  test('Column reordering should not work when allowColumnReordering is false', async ({ page }) => {
    await createGrid(page, { allowColumnReordering: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dragToOffset(page, headerRow.getHeaderCell(0).element, 150, 0);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);
  });

  test('Column reordering should not work when it has allowReordering set to false', async ({ page }) => {
    await createGrid(page, { allowColumnReordering: true }, { allowReordering: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dragToOffset(page, headerRow.getHeaderCell(0).element, 150, 0);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);
  });

  test('Column reordering should work when allowColumnReordering is true and columnFixing.enabled is true', async ({ page }) => {
    await createGrid(page, { allowColumnReordering: true, columnFixing: { enabled: true } });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dragToOffset(page, headerRow.getHeaderCell(0).element, 150, 0);

    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'AI Column', 'Name', 'Value']);
  });
});
