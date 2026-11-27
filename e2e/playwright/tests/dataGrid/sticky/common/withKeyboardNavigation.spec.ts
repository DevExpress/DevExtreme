/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import DataCell from '../../../../models/dataGrid/data/cell';
import type HeaderCell from '../../../../models/dataGrid/headers/cell';
import { defaultConfig } from '../helpers/data';

// A header cell takes the DOM focus; a data cell is marked as focused by the grid.
const expectCellFocused = (cell: HeaderCell | DataCell): Promise<void> => (
  cell instanceof DataCell ? cell.expectFocusVisible() : cell.expectFocused()
);

const navigateToNextCell = async (page: Page, cell: HeaderCell | DataCell): Promise<void> => {
  await page.keyboard.press('Tab');
  await expectCellFocused(cell);
};

const navigateToPrevCell = async (page: Page, cell: HeaderCell | DataCell): Promise<void> => {
  await page.keyboard.press('Shift+Tab');
  await expectCellFocused(cell);
};

test.describe('Fixed Columns - keyboard navigation', () => {
  test.use({ browserSize: [900, 800] });

  test('Headers navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 600,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => headerRow.getHeaderCell(0).element.click());
    await headerRow.getHeaderCell(0).expectFocused();

    await navigateToNextCell(page, headerRow.getHeaderCell(1));
    await navigateToNextCell(page, headerRow.getHeaderCell(2));
    await navigateToNextCell(page, headerRow.getHeaderCell(3));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_tab_1.png', { element: dataGrid.element });

    await navigateToNextCell(page, headerRow.getHeaderCell(4));
    await navigateToNextCell(page, headerRow.getHeaderCell(5));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_tab_2.png', { element: dataGrid.element });

    await navigateToNextCell(page, headerRow.getHeaderCell(6));
  });

  test('Headers navigation by Shift and Tab keys when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 625,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => headerRow.getHeaderCell(6).element.click());
    await headerRow.getHeaderCell(6).expectFocused();

    await navigateToPrevCell(page, headerRow.getHeaderCell(5));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_shift_and_tab_1.png', { element: dataGrid.element });

    await navigateToPrevCell(page, headerRow.getHeaderCell(4));
    await navigateToPrevCell(page, headerRow.getHeaderCell(3));
    await navigateToPrevCell(page, headerRow.getHeaderCell(2));
    await navigateToPrevCell(page, headerRow.getHeaderCell(1));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_shift_and_tab_2.png', { element: dataGrid.element });

    await navigateToPrevCell(page, headerRow.getHeaderCell(0));
  });

  test('Headers navigation by Tab key when there are fixed columns and adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
        columns[5].hidingPriority = 0;
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 650,
        columnWidth: 150,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => headerRow.getHeaderCell(0).element.click());
    await headerRow.getHeaderCell(0).expectFocused();

    await navigateToNextCell(page, headerRow.getHeaderCell(1));
    await navigateToNextCell(page, headerRow.getHeaderCell(2));
    await navigateToNextCell(page, headerRow.getHeaderCell(3));

    await testScreenshot(page, 'fixed_columns_and_adaptability_headers_navigation_by_tab_1.png', { element: dataGrid.element });

    await navigateToNextCell(page, headerRow.getHeaderCell(4));
    await navigateToNextCell(page, headerRow.getHeaderCell(6));

    await testScreenshot(page, 'fixed_columns_and_adaptability_headers_navigation_by_tab_2.png', { element: dataGrid.element });
  });

  test('Headers navigation by Shift and Tab keys when there are fixed columns and adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
        columns[5].hidingPriority = 0;
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 650,
        columnWidth: 150,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => headerRow.getHeaderCell(6).element.click());
    await headerRow.getHeaderCell(6).expectFocused();

    await navigateToPrevCell(page, headerRow.getHeaderCell(4));

    await testScreenshot(page, 'fixed_columns_and_adaptability_headers_navigation_by_shift_and_tab_1.png', { element: dataGrid.element });

    await navigateToPrevCell(page, headerRow.getHeaderCell(3));

    await testScreenshot(page, 'fixed_columns_and_adaptability_headers_navigation_by_shift_and_tab_2.png', { element: dataGrid.element });

    await navigateToPrevCell(page, headerRow.getHeaderCell(2));
    await navigateToPrevCell(page, headerRow.getHeaderCell(1));
    await navigateToPrevCell(page, headerRow.getHeaderCell(0));
  });

  test('Band headers navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[3] = {
          caption: 'Band columns',
          columns: [{ dataField: 'CustomerStoreCity', width: 150 }],
        };
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 600,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const firstHeaderRow = headers.getHeaderRow(0);
    const secondHeaderRow = headers.getHeaderRow(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => firstHeaderRow.getHeaderCell(0).element.click());
    await firstHeaderRow.getHeaderCell(0).expectFocused();

    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(1));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(2));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(3));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(4));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(5));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(6));

    await testScreenshot(page, 'fixed_columns_band_headers_navigation_by_tab_1.png', { element: dataGrid.element });

    await navigateToNextCell(page, secondHeaderRow.getHeaderCell(0));

    await testScreenshot(page, 'fixed_columns_band_headers_navigation_by_tab_2.png', { element: dataGrid.element });
  });

  test('Band headers navigation by Shift and Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[5] = {
          caption: 'Band columns',
          columns: [{ dataField: 'SaleAmount', width: 150 }],
        };
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 550,
        columnWidth: 200,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const firstHeaderRow = headers.getHeaderRow(0);
    const secondHeaderRow = headers.getHeaderRow(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await dataGrid.getDataCell(0, 0).expectFocusHidden();

    await navigateToPrevCell(page, secondHeaderRow.getHeaderCell(0));

    await testScreenshot(page, 'fixed_columns_band_headers_navigation_by_shift_and_tab_1.png', { element: dataGrid.element });

    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(6));
    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(5));
    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(4));
    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(3));
    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(2));
    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(1));

    await testScreenshot(page, 'fixed_columns_band_headers_navigation_by_shift_and_tab_2.png', { element: dataGrid.element });

    await navigateToPrevCell(page, firstHeaderRow.getHeaderCell(0));
  });

  test('Band headers navigation by Tab key when there are fixed and command columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[3] = {
          caption: 'Band columns',
          columns: [{ dataField: 'CustomerStoreCity', width: 150 }],
        };
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 600,
        editing: {
          allowUpdating: true,
        },
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();
    const firstHeaderRow = headers.getHeaderRow(0);
    const secondHeaderRow = headers.getHeaderRow(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.waitForContentReady(() => firstHeaderRow.getHeaderCell(0).element.click());
    await firstHeaderRow.getHeaderCell(0).expectFocused();

    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(1));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(2));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(3));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(4));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(5));
    await navigateToNextCell(page, firstHeaderRow.getHeaderCell(6));

    await testScreenshot(page, 'fixed_and_command_columns_band_headers_navigation_by_tab_1.png', { element: dataGrid.element });

    await navigateToNextCell(page, secondHeaderRow.getHeaderCell(0));

    await testScreenshot(page, 'fixed_and_command_columns_band_headers_navigation_by_tab_2.png', { element: dataGrid.element });
  });

  test('Data cells navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 600,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await dataGrid.getDataCell(0, 0).expectFocusHidden();

    await navigateToNextCell(page, dataGrid.getDataCell(0, 1));
    await navigateToNextCell(page, dataGrid.getDataCell(0, 2));
    await navigateToNextCell(page, dataGrid.getDataCell(0, 3));

    await testScreenshot(page, 'fixed_columns_data_cells_navigation_by_tab_1.png', { element: dataGrid.element });

    await navigateToNextCell(page, dataGrid.getDataCell(0, 4));
    await navigateToNextCell(page, dataGrid.getDataCell(0, 5));

    await testScreenshot(page, 'fixed_columns_data_cells_navigation_by_tab_2.png', { element: dataGrid.element });

    await navigateToNextCell(page, dataGrid.getDataCell(0, 6));
  });

  test('Data cells navigation by Shift and Tab keys when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 625,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 6).element.click();
    await dataGrid.getDataCell(0, 6).expectFocusHidden();

    await navigateToPrevCell(page, dataGrid.getDataCell(0, 5));

    await testScreenshot(page, 'fixed_columns_data_cells_navigation_by_shift_and_tab_1.png', { element: dataGrid.element });

    await navigateToPrevCell(page, dataGrid.getDataCell(0, 4));
    await navigateToPrevCell(page, dataGrid.getDataCell(0, 3));
    await navigateToPrevCell(page, dataGrid.getDataCell(0, 2));
    await navigateToPrevCell(page, dataGrid.getDataCell(0, 1));

    await testScreenshot(page, 'fixed_columns_data_cells_navigation_by_shift_and_tab_2.png', { element: dataGrid.element });

    await navigateToPrevCell(page, dataGrid.getDataCell(0, 0));
  });
});
