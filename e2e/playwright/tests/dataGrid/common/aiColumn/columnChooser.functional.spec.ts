import type { Page } from '@playwright/test';
import type { ColumnChooserMode } from 'devextreme/common/grids';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement } from '../../../../helpers/dragUtils';
import DataGrid from '../../../../models/dataGrid';

interface AIColumnOptions {
  allowHiding?: boolean;
  visible?: boolean;
  showInColumnChooser?: boolean;
}

const createGrid = (
  page: Page,
  mode: ColumnChooserMode,
  aiColumnOptions: AIColumnOptions = {},
): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 600,
  columnWidth: 200,
  columnChooser: {
    enabled: true,
    mode,
  },
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

test.describe('Ai Column - Column Chooser.Functional', () => {
  test('The AI column can be hidden when columnChooser.mode is "dragAndDrop"', async ({ page }) => {
    await createGrid(page, 'dragAndDrop');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await expect(columnChooser.getColumns()).toHaveText([]);

    await dragToElement(page, headerRow.getHeaderCell(0).element, columnChooser.content);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);
    await expect(columnChooser.getColumns()).toHaveText(['AI Column']);
  });

  test('The AI column cannot be hidden when columnChooser.mode is "dragAndDrop" and allowHiding is false', async ({ page }) => {
    await createGrid(page, 'dragAndDrop', { allowHiding: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await expect(columnChooser.getColumns()).toHaveText([]);

    await dragToElement(page, headerRow.getHeaderCell(0).element, columnChooser.content);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);
    await expect(columnChooser.getColumns()).toHaveText([]);
  });

  test('The AI column can be hidden when columnChooser.mode is "select"', async ({ page }) => {
    await createGrid(page, 'select');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();

    await columnChooser.getCheckbox(0).click();

    await columnChooser.expectCheckboxChecked(0, false);
    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);

    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);
  });

  test('The AI column cannot be hidden when columnChooser.mode is "select" and allowHiding is false', async ({ page }) => {
    await createGrid(page, 'select', { allowHiding: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await columnChooser.expectCheckboxDisabled(0);
    await columnChooser.expectCheckboxChecked(0);
    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
  });

  test('The AI column can be shown when columnChooser.mode is "dragAndDrop"', async ({ page }) => {
    await createGrid(page, 'dragAndDrop', { visible: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await expect(columnChooser.getColumns()).toHaveText(['AI Column']);

    await dragToElement(page, columnChooser.getColumn(0), headerRow.getHeaderCell(0).element);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);
    await expect(columnChooser.getColumns()).toHaveText([]);
  });

  test('The AI column cannot be shown when columnChooser.mode is "dragAndDrop" and allowHiding is false', async ({ page }) => {
    await createGrid(page, 'dragAndDrop', { allowHiding: false, visible: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await columnChooser.expectColumnDisabled(0);
    await expect(columnChooser.getColumns()).toHaveText(['AI Column']);
  });

  test('The AI column can be shown when columnChooser.mode is "select"', async ({ page }) => {
    await createGrid(page, 'select', { visible: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();

    await columnChooser.getCheckbox(0).click();

    await columnChooser.expectCheckboxChecked(0);
    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveText(['AI Column', 'ID', 'Name', 'Value']);
  });

  test('The AI column cannot be shown when columnChooser.mode is "select" and allowHiding is false', async ({ page }) => {
    await createGrid(page, 'select', { allowHiding: false, visible: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await columnChooser.expectCheckboxDisabled(0);
    await columnChooser.expectCheckboxChecked(0, false);
    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
  });

  test('The AI column should not be visible in column chooser when showInColumnChooser is false and columnChooser.mode is "dragAndDrop"', async ({ page }) => {
    await createGrid(page, 'dragAndDrop', { visible: false, showInColumnChooser: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await expect(columnChooser.getColumns()).toHaveText([]);
  });

  test('The AI column should not be visible in column chooser when showInColumnChooser is false and columnChooser.mode is "select"', async ({ page }) => {
    await createGrid(page, 'select', { visible: false, showInColumnChooser: false });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const columnChooser = dataGrid.getColumnChooser();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('myAiColumn', 'visible')).toBe(false);
    await expect(headerRow.getHeaderCells()).toHaveText(['ID', 'Name', 'Value']);

    await dataGrid.apiShowColumnChooser();

    await columnChooser.expectOpened();
    await expect(columnChooser.getColumns()).toHaveText(['ID', 'Name', 'Value']);
  });
});
