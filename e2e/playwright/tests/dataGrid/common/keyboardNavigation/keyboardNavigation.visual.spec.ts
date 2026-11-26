/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

const GRID_SELECTOR = '#container';

test.describe('Keyboard Navigation.Visual', () => {
  // Quick navigation through grid cells via Home and End keys
  test('Focus the last cell in the row that contains focus when pressing the End key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('End');

    await dataGrid.getDataCell(0, 6).expectFocusVisible();
    await testScreenshot(page, 'focus_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: dataGrid.element });
  });

  test('Focus the first cell in the row that contains focus when pressing the Home key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 6).element.click();
    await page.keyboard.press('Home');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await testScreenshot(page, 'focus_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the row that contains focus when pressing the End key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('End');

    await dataGrid.getDataCell(0, 14).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the row that contains focus when pressing the Home key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 700 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(700);

    await dataGrid.getDataCell(0, 14).element.click();
    await page.keyboard.press('Home');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_pressing_Home_key.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the row that contains focus when focusedRowEnabled is true', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('End');

    await dataGrid.getDataCell(0, 14).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_focusedRowEnabled_is_true.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the row that contains focus when row dragging is enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 700 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(700);

    await dataGrid.getDataCell(0, 14).element.click();
    await page.keyboard.press('Home');

    // The drag column comes first and takes no focus.
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_row_dragging_is_enabled.png', { element: dataGrid.element });
  });

  test('Navigation should not work when pressing the End key when the row is in edit state', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const firstCell = dataGrid.getDataCell(0, 0);

    await firstCell.element.click();

    await expect(firstCell.getEditor().element).toBeFocused();

    await page.keyboard.press('End');

    await testScreenshot(page, 'navigation_should_not_work_when_pressing_End_when_row_is_in_edit_state.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the row that contains focus when virtual columns are enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('End');

    await dataGrid.getDataCell(0, 49).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_virtual_columns_are_enabled.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the row that contains focus when virtual columns are enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 4200 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(4200);

    await dataGrid.getDataCell(0, 49).element.click();
    await page.keyboard.press('Home');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_virtual_columns_are_enabled.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the row that contains focus when adaptivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
      customizeColumns(columns) {
        columns[columns.length - 1].hidingPriority = 0;
        columns.splice(columns.length - 2, 0, { type: 'adaptive', width: 100 });
      },
    }), GRID_SELECTOR, { arg: getData(20, 50) });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('End');

    // The adaptive column comes before the last two columns, and the last one is hidden.
    await dataGrid.getDataCell(0, 49).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_last_cell_in_row_that_contains_focus_when_adaptivity_is_enabled.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the row that contains focus when adaptivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      customizeColumns(columns) {
        columns[0].hidingPriority = 0;
        columns.push({ type: 'adaptive', width: 100 });
      },
      scrolling: {
        showScrollbar: 'never',
      },
    }), GRID_SELECTOR, { arg: getData(20, 50) });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 4200 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(4200);

    await dataGrid.getDataCell(0, 50).element.click();
    await page.keyboard.press('Home');

    // The first column is hidden.
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_first_cell_in_row_that_contains_focus_when_adaptivity_is_enabled.png', { element: dataGrid.element });
  });

  // Quick navigation through grid rows via Ctrl+Home and Ctrl+End keys
  test('Focus the last cell in the last row when pressing the Ctrl+End key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 7),
      columnWidth: 100,
      height: 400,
      width: 800,
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+End');

    await dataGrid.getDataCell(4, 6).expectFocusVisible();
    await testScreenshot(page, 'focus_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: dataGrid.element });
  });

  test('Focus the first cell in the firs row when pressing the Ctrl+Home key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 7),
      columnWidth: 100,
      height: 400,
      width: 800,
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(4, 6).element.click();
    await page.keyboard.press('Control+Home');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await testScreenshot(page, 'focus_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the last row when pressing the Ctrl+End key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+End');

    await dataGrid.getDataCell(19, 14).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_pressing_Ctrl_+_End_key.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the first row when pressing the Ctrl + Home key', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 700, top: 1000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(700);

    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key_1.png', { element: dataGrid.element });

    await dataGrid.getDataCell(19, 14).element.click();
    await page.keyboard.press('Control+Home');

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_pressing_Ctrl_+_Home_key_2.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the last row when virtual scrolling is enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+End');

    await expect.poll(() => dataGrid.isScrolledToBottom()).toBe(true);
    await expect.poll(() => dataGrid.isScrolledToRight()).toBe(true);
    await expect(dataGrid.getDataCell(199, 14).element).toBeFocused();

    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_is_enabled.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the first row when virtual scrolling is enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 700, top: 10000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(700);

    await expect(dataGrid.getDataCell(199, 14).element).toBeVisible();
    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_is_enabled_1.png', { element: dataGrid.element });

    await dataGrid.getDataCell(199, 14).element.click();
    await page.keyboard.press('Control+Home');

    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);

    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_is_enabled_2.png', { element: dataGrid.element });
  });

  test('Navigate to last cell in the last row when virtual scrolling and columns are enabled', async ({ page }) => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+End');

    await expect.poll(() => dataGrid.isScrolledToBottom()).toBe(true);
    await expect.poll(() => dataGrid.isScrolledToRight()).toBe(true);
    await expect(dataGrid.getDataCell(199, 34).element).toBeFocused();

    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_last_cell_in_last_row_when_virtual_scrolling_and_columns_are_enabled.png', { element: dataGrid.element });
  });

  test('Navigate to first cell in the first row when virtual scrolling and columns are enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(200, 35),
      columnWidth: 100,
      height: 500,
      width: 800,
      scrolling: {
        mode: 'virtual',
        showScrollbar: 'never',
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 3000, top: 10000 });

    await expect.poll(() => dataGrid.getScrollLeft()).toBe(2700);

    await expect(dataGrid.getDataCell(199, 34).element).toBeVisible();
    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_and_columns_are_enabled_1.png', { element: dataGrid.element });

    await dataGrid.getDataCell(199, 34).element.click();
    await page.keyboard.press('Control+Home');

    await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);
    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();

    await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    await testScreenshot(page, 'navigate_to_first_cell_in_first_row_when_virtual_scrolling_and_columns_are_enabled_2.png', { element: dataGrid.element });
  });

  [true, false].forEach((useNative) => {
    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Focus should be on the first focusable cell when pressing the Ctrl + Home key when row dragging, virtual scrolling and columns are enabled`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(200, 35),
        columnWidth: 100,
        height: 500,
        width: 800,
        scrolling: {
          mode: 'virtual',
          columnRenderingMode: 'virtual',
          useNative,
        },
        rowDragging: {
          allowReordering: true,
          showDragIcons: true,
        },
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getDataCell(0, 1).element.click();
      await page.keyboard.press('Control+End');

      await expect.poll(() => dataGrid.isScrolledToBottom()).toBe(true);
      await expect.poll(() => dataGrid.isScrolledToRight()).toBe(true);
      await expect(dataGrid.getDataCell(199, 35).element).toBeFocused();

      await dataGrid.getDataCell(199, 35).element.click();
      await page.keyboard.press('Control+Home');

      await expect.poll(() => dataGrid.getScrollLeft()).toBeCloseTo(0);
      await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);
      await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();

      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_navigate_to_first_cell_row_dragging__virtual_scrolling__virtual_columns.png`, { element: dataGrid.element });

      await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();
    });

    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Focus should be on the last focusable cell when pressing the Ctrl + End key when row dragging, virtual scrolling and columns are enabled`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, isNative }) => ({
        dataSource: data,
        columnWidth: 100,
        height: 500,
        width: 800,
        scrolling: {
          mode: 'virtual',
          columnRenderingMode: 'virtual',
          useNative: isNative,
        },
        customizeColumns(columns) {
          columns.push({ type: 'drag' });
        },
        rowDragging: {
          allowReordering: true,
          showDragIcons: true,
        },
      }), GRID_SELECTOR, { arg: { data: getData(200, 35), isNative: useNative } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getDataCell(0, 0).element.click();
      await page.keyboard.press('Control+End');

      await expect.poll(() => dataGrid.isScrolledToBottom()).toBe(true);
      await expect.poll(() => dataGrid.isScrolledToRight()).toBe(true);
      await expect(dataGrid.getDataCell(199, 34).element).toBeFocused();

      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_navigate_to_last_cell_row_dragging__virtual_scrolling__virtual_columns.png`, { element: dataGrid.element });
    });
  });
});
