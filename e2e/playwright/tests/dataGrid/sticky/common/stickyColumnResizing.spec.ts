/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { movePointerOffGrid } from '../helpers/pointer';

const getRectProperty = (locator: Locator, property: 'left' | 'right'): Promise<number> => locator
  .evaluate((element, name) => element.getBoundingClientRect()[name], property);

test.describe('Resize columns - nextColumn mode', () => {
  test.use({ browserSize: [900, 800] });

  [false, true].forEach((rtlEnabled) => {
    test(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'nextColumn',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 23 : 1;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, 100);
      await movePointerOffGrid(page);

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_1_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_2_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Resize second fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'nextColumn',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'right';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 0 : 24;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, -100);
      await movePointerOffGrid(page);

      await testScreenshot(page, `resize_second_fixed_column_with_right_position_1_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `resize_second_fixed_column_with_right_position_2_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });
  });

  test('The separator should have correct position when resizing fixed column on the right (rtlEnabled = false) (T1335911)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnResizing: true,
      columnWidth: 200,
      columnResizingMode: 'nextColumn',
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const separator = dataGrid.getColumnsSeparator();
    const fixedHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(23).element;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.resizeHeader(23, -100, false);

    const fixedCellLeft = await getRectProperty(fixedHeaderCell, 'left');

    await expect.poll(async () => Math.abs(await getRectProperty(separator, 'left') - fixedCellLeft))
      .toBeLessThanOrEqual(1);
  });

  test('The separator should have correct position when resizing fixed column on the left (rtlEnabled = true) (T1335911)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      rtlEnabled: true,
      columnAutoWidth: true,
      allowColumnResizing: true,
      columnWidth: 200,
      columnResizingMode: 'nextColumn',
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const separator = dataGrid.getColumnsSeparator();
    const fixedHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(23).element;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.resizeHeader(23, -100, false, 'right');

    const fixedCellRight = await getRectProperty(fixedHeaderCell, 'right');

    await expect.poll(async () => Math.abs(await getRectProperty(separator, 'left') - fixedCellRight))
      .toBeLessThanOrEqual(1);
  });
});

test.describe('Resize columns - widget mode', () => {
  test.use({ browserSize: [900, 800] });

  [false, true].forEach((rtlEnabled) => {
    test(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'widget',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 23 : 1;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, 100);
      await movePointerOffGrid(page);

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `resize_first_fixed_column_with_left_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Resize second fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'widget',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'right';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 0 : 24;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, -100);
      await movePointerOffGrid(page);

      await testScreenshot(page, `resize_second_fixed_column_with_right_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `resize_second_fixed_column_with_right_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Resize first fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'widget',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'right';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 1 : 23;
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, -100);
      await movePointerOffGrid(page);

      await testScreenshot(page, `resize_first_fixed_column_with_right_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `resize_first_fixed_column_with_right_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`The separator should have correct position when resizing fixed column on the right (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'widget',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'right';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 1 : 23;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.resizeHeader(columnIndex, -100, false);

      await testScreenshot(page, `separator_position_with_fixed_column_on_right_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`The separator should have correct position when there is window scrollTop (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await page.evaluate(() => {
        $('#container').css('margin-top', '800px');
      });
      await createWidget(page, 'dxDataGrid', ({ data, rtl }) => ({
        dataSource: data,
        rtlEnabled: rtl,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'widget',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'right';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'right';
        },
      }), DEFAULT_SELECTOR, { arg: { data: getData(5, 25), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const columnIndex = rtlEnabled ? 1 : 23;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await page.evaluate(() => {
        window.scrollTo(0, 1000);
      });
      await dataGrid.resizeHeader(columnIndex, -100, false);

      await testScreenshot(page, `separator_position_with_window_scroll_top_(widget_mode_and_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });
  });
});
