import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const DATA_SOURCE = [
  {
    id: 1,
    columnA: 'A_0',
    columnB: 'B_0',
  },
  {
    id: 2,
    columnA: 'A_1',
    columnB: 'B_1',
  },
  {
    id: 3,
    columnA: 'A_2',
    columnB: 'B_2',
  },
];

const createDataGrid = async (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columns: ['id', 'columnA', 'columnB'],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
});

const createDataGridRenderAsyncWithButtons = async (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columns: ['id', 'columnA', 'columnB', { type: 'buttons' }],
  rowDragging: {
    allowReordering: true,
  },
  sorting: {
    mode: 'none',
  },
  renderAsync: true,
});

// T1147695
test.describe('Keyboard Navigation - skip drag cell', () => {
  test('The drag cell should be skipped when navigating from the header cell by tab keypress', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 1);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress'
    + ' with buttons column and renderAsync: true', async ({ page }) => {
    await createDataGridRenderAsyncWithButtons(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 1);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('The drag cell should be skipped when navigating to the header cell by shift+tab keypress', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
    const cellToStartNavigation = dataGrid.getDataCell(0, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');

    await expectedFocusedCell.expectFocused();
  });

  test('The drag cell should be skipped when navigating to a next row by tab keypress', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(1, 1);
    const cellToStartNavigation = dataGrid.getDataCell(0, 3);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('The drag cell should be skipped when navigating to a previous row by shift+tab keypress', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 3);
    const cellToStartNavigation = dataGrid.getDataCell(1, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('The drag cell shouldn\'t be focused when the next cell is focused and the left arrow key pressed', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 1);

    await expectedFocusedCell.element.click();
    await page.keyboard.press('ArrowLeft');

    await expectedFocusedCell.expectFocusVisible();
  });
});
