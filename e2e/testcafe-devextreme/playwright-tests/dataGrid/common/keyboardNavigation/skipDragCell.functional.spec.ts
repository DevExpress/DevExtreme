import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const DATA_SOURCE = [
  { id: 1, columnA: 'A_0', columnB: 'B_0' },
  { id: 2, columnA: 'A_1', columnB: 'B_1' },
  { id: 3, columnA: 'A_2', columnB: 'B_2' },
];

const createBasicDataGrid = (page: any) => createWidget(page, 'dxDataGrid', {
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

test.describe.skip('Keyboard Navigation - skip drag cell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress', async ({ page }) => {
    await createBasicDataGrid(page);

    const dataGrid = new DataGrid(page);

    const cellToStartNavigation = dataGrid.getHeaders().getHeaderCell(0, 3);
    await cellToStartNavigation.click();

    await page.keyboard.press('Tab');

    const activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.className : '';
    });

    expect(activeElement).not.toContain('dx-command-drag');

    const expectedFocusedCell = dataGrid.getDataCell(0, 1);
    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress with buttons column and renderAsync: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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

    const dataGrid = new DataGrid(page);

    const cellToStartNavigation = dataGrid.getHeaders().getHeaderCell(0, 4);
    await cellToStartNavigation.click();
    await page.waitForTimeout(200);

    await page.keyboard.press('Tab');

    const expectedFocusedCell = dataGrid.getDataCell(0, 1);
    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('The drag cell should be skipped when navigating to the header cell by shift+tab keypress', async ({ page }) => {
    await createBasicDataGrid(page);

    const dataGrid = new DataGrid(page);

    const cellToStartNavigation = dataGrid.getDataCell(0, 1);
    await cellToStartNavigation.element.click();

    await page.keyboard.press('Shift+Tab');

    const expectedFocusedCell = dataGrid.getHeaders().getHeaderCell(0, 3);
    const isFocused = await expectedFocusedCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);
  });

  test('The drag cell should be skipped when navigating to a next row by tab keypress', async ({ page }) => {
    await createBasicDataGrid(page);

    const dataGrid = new DataGrid(page);

    const cellToStartNavigation = dataGrid.getDataCell(0, 3);
    await cellToStartNavigation.element.click();

    await page.keyboard.press('Tab');

    const expectedFocusedCell = dataGrid.getDataCell(1, 1);
    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('The drag cell should be skipped when navigating to a previous row by shift+tab keypress', async ({ page }) => {
    await createBasicDataGrid(page);

    const dataGrid = new DataGrid(page);

    const cellToStartNavigation = dataGrid.getDataCell(1, 1);
    await cellToStartNavigation.element.click();

    await page.keyboard.press('Shift+Tab');

    const expectedFocusedCell = dataGrid.getDataCell(0, 3);
    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test("The drag cell shouldn't be focused when the next cell is focused and the left arrow key pressed", async ({ page }) => {
    await createBasicDataGrid(page);

    const dataGrid = new DataGrid(page);

    const expectedFocusedCell = dataGrid.getDataCell(0, 1);
    await expectedFocusedCell.element.click();

    await page.keyboard.press('ArrowLeft');

    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });
});
