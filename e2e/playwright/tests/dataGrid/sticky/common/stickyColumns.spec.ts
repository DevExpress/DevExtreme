/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { defaultConfig } from '../helpers/data';

test.describe('FixedColumns', () => {
  test.describe(() => {
    test.use({ browserSize: [1000, 800] });

    test('The simulated scrollbar should display correctly when there are sticky columns', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        width: 984,
        columnAutoWidth: true,
        scrolling: {
          useNative: false,
        },
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollbarHorizontalThumbTrack = dataGrid.getScrollBarThumbTrack('horizontal');

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await scrollbarHorizontalThumbTrack.hover();
      await dataGrid.getScrollbar('horizontal').expectHovered();
      await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_1.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 1500 });

      await testScreenshot(page, 'simulated_scrollbar_with_sticky_columns_2.png', { element: dataGrid.element });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [900, 800] });

    test('Header hover should display correctly when there are fixed columns', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        columnWidth: 100,
        columnAutoWidth: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: getData(20, 15) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(13);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await headerCell.element.hover();

      await headerCell.expectHovered();

      await testScreenshot(page, 'datagrid_header_hover_with_fixed_columns.png', { element: dataGrid.element });
    });

    test('Row hover should display correctly when there are fixed columns', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        columnWidth: 100,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: getData(20, 15) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataRow = dataGrid.getDataRow(1);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataRow.getDataCell(1).element.hover();

      await dataRow.expectHovered();

      await testScreenshot(page, 'datagrid_row_hover_with_fixed_columns.png', { element: dataGrid.element });
    });

    test('Alternating rows should display correctly when there are fixed columns', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        columnWidth: 100,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: getData(20, 15) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'datagrid_row_alt_with_fixed_columns.png', { element: dataGrid.element });
    });

    [0.9, 1.25, 1.5].forEach((zoom) => {
      test(`Fixed columns should display correctly at ${zoom * 100}% zoom`, async ({ page }) => {
        await page.evaluate((zoomValue) => {
          $('body').css('zoom', zoomValue);
        }, zoom);
        await createWidget(page, 'dxDataGrid', (data) => ({
          dataSource: data,
          columnWidth: 100,
          columnAutoWidth: true,
          customizeColumns: (columns) => {
            columns[5].fixed = true;
            columns[5].fixedPosition = 'left';
            columns[6].fixed = true;
            columns[6].fixedPosition = 'left';

            columns[8].fixed = true;
            columns[8].fixedPosition = 'right';
            columns[9].fixed = true;
            columns[9].fixedPosition = 'right';
          },
        }), DEFAULT_SELECTOR, { arg: getData(20, 15) });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await testScreenshot(page, `fixed_columns_with_${zoom * 100}%_zoom.png`, { element: dataGrid.element });
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [1000, 800] });

    test('The grid should display correctly when there is no data and there are fixed columns (T1269088)', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        ...defaultConfig,
        dataSource: [],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'T1269088_grid_with_fixed_columns_and_without_data.png', { element: dataGrid.element });
    });
  });

  test('Boolean column checkboxes should display correctly when there are fixed columns (T1303134)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, text: 'item 1', enabled: false },
        { id: 2, text: 'item 2', enabled: true },
        { id: 3, text: 'item 3' },
      ],
      keyExpr: 'id',
      columns: [{
        dataField: 'id',
        fixed: true,
      }, 'enabled', 'text'],
      columnWidth: 200,
      width: 400,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: 100 });

    await testScreenshot(page, 'T1303134_boolean_column_checkboxes_with_fixed_columns.png', { element: dataGrid.element });
  });
});
