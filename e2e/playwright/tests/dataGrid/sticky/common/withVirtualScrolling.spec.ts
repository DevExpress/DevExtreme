/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

// The rows of the new position render a moment after the scroll.
const scrollToTop = async (dataGrid: DataGrid, top: number): Promise<void> => {
  const topVisibleRowKey = await dataGrid.apiGetTopVisibleRowKey();

  await dataGrid.scrollTo({ top });

  await expect.poll(() => dataGrid.apiGetTopVisibleRowKey()).not.toEqual(topVisibleRowKey);
  await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
};

test.describe('Sticky columns - Virtual Scrolling', () => {
  test.use({ browserSize: [800, 800] });

  test('Fixed columns should display correctly when scrolling vertically quickly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      height: 700,
      columnWidth: 100,
      showColumnLines: true,
      scrolling: {
        mode: 'virtual',
        updateTimeout: 3000,
      },
      customizeColumns(columns) {
        columns[0].fixed = true;
        columns[1].fixed = true;
        columns[1].fixedPosition = 'right';
        columns[2].fixed = true;
        columns[2].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(400, 15) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await scrollToTop(dataGrid, 500);
    await scrollToTop(dataGrid, 1000);
    await scrollToTop(dataGrid, 1500);

    // The shot is of the rows the grid rendered while it still delays its resize.
    await expect.poll(() => dataGrid.hasResizeTimeout()).toBe(true);

    await testScreenshot(page, 'fixed_columns_with_virtual_scrolling_1.png', { element: dataGrid.element });

    // waiting for size update
    await expect.poll(() => dataGrid.hasResizeTimeout()).toBe(false);

    await testScreenshot(page, 'fixed_columns_with_virtual_scrolling_2.png', { element: dataGrid.element });
  });

  test('Fixed columns should display correctly when horizontal scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      height: 700,
      columnWidth: 100,
      showColumnLines: true,
      scrolling: {
        mode: 'virtual',
      },
      customizeColumns(columns) {
        columns[0].fixed = true;
        columns[1].fixed = true;
        columns[2].fixed = true;
        columns[13].fixed = true;
        columns[13].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, { arg: getData(400, 15) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'fixed_columns_with_horizontal_scrolling.png', { element: dataGrid.element });
  });
});
