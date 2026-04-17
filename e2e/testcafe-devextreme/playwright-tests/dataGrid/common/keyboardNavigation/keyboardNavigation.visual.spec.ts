import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe.skip('Keyboard Navigation.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Focus the first cell in the row that contains focus when pressing the Home key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 7),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.getDataCell(0, 6).click();
    await page.keyboard.press('Home');

    await testScreenshot(page, 'focus_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the row that contains focus when pressing the End key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('End');

    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: page.locator('#container') });
  });

  test('Navigate to first cell in the row that contains focus when pressing the Home key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.scrollTo({ x: 700 });
    await expect(await dataGrid.getScrollLeft()).toBe(700);

    await dataGrid.getDataCell(0, 14).click();
    await page.keyboard.press('Home');

    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the row that contains focus when focusedRowEnabled is true', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      focusedRowEnabled: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('End');

    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_focusedRowEnabled_is_true.png', { element: page.locator('#container') });
  });

  test('Navigate to first cell in the row that contains focus when row dragging is enabled', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.scrollTo({ x: 700 });
    await expect(await dataGrid.getScrollLeft()).toBe(700);

    await dataGrid.getDataCell(0, 14).click();
    await page.keyboard.press('Home');

    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_row_dragging_is_enabled.png', { element: page.locator('#container') });
  });

  test('Navigation should not work when pressing the End key when the row is in edit state', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      keyExpr: 'field_0',
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
      editing: {
        editRowKey: 'val_0_0',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('End');

    await testScreenshot(page, 'navigation_should_not_work_when_pressing_End_when_row_is_in_edit_state.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the row that contains focus when virtual columns are enabled', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 50),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        useNative: false,
        showScrollbar: 'never',
        columnRenderingMode: 'virtual',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('End');

    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_virtual_columns_are_enabled.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the row that contains focus when adaptivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 50),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns: any[]) {
        columns[columns.length - 1].hidingPriority = 0;
        columns.splice(columns.length - 2, 0, { type: 'adaptive', width: 100 });
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('End');

    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_adaptivity_is_enabled.png', { element: page.locator('#container') });
  });

  test('Focus the last cell in the last row when pressing the Ctrl+End key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 7),
      columnWidth: 100,
      height: 400,
      width: 800,
      showBorders: true,
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+End');

    await testScreenshot(page, 'focus_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: page.locator('#container') });
  });

  test('Focus the first cell in the firs row when pressing the Ctrl+Home key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 7),
      columnWidth: 100,
      height: 400,
      width: 800,
      showBorders: true,
    });

    await dataGrid.getDataCell(4, 6).click();
    await page.keyboard.press('Control+Home');

    await testScreenshot(page, 'focus_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the last row when pressing the Ctrl+End key', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+End');

    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the last row when virtual scrolling is enabled', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(200, 15),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        mode: 'virtual',
        showScrollbar: 'never',
        useNative: false,
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+End');
    await page.waitForTimeout(100);

    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_is_enabled.png', { element: page.locator('#container') });
  });

  test('Navigate to last cell in the last row when virtual scrolling and columns are enabled', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(200, 35),
      columnWidth: 100,
      height: 500,
      width: 800,
      scrolling: {
        mode: 'virtual',
        columnRenderingMode: 'virtual',
        showScrollbar: 'never',
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+End');
    await page.waitForTimeout(1000);

    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_and_columns_are_enabled.png', { element: page.locator('#container') });
  });

  test('Simulated scrolling: Focus should be on the last focusable cell when pressing the Ctrl + Home key when row dragging, virtual scrolling and columns are enabled', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(200, 35),
      columnWidth: 100,
      height: 500,
      width: 800,
      scrolling: {
        mode: 'virtual',
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      customizeColumns(columns: any[]) {
        columns.push({ type: 'drag' });
      },
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    });

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+End');
    await page.waitForTimeout(1000);

    await testScreenshot(page, 'simulated_scrolling_-_navigate_to_last_cell_row_dragging__virtual_scrolling__virtual_columns.png', { element: page.locator('#container') });
  });

  test.skip('Focus the last cell in the row that contains focus when pressing the End key', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (t.ok before click)
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 7),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    // act
    await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).click();
    await page.keyboard.press('end');

    await testScreenshot(page, 'focus_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: page.locator('#container') });

    // assert
  });
});
