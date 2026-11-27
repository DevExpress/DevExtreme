/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { movePointerOffGrid } from '../helpers/pointer';

test.describe('Reorder columns', () => {
  test.use({ browserSize: [1000, 800] });

  test('Move left fixed column to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'left';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(0).getHeaderCell(0).element, 400, 0);
    await movePointerOffGrid(page);

    await testScreenshot(page, 'move_left_fixed_column_to_right.png', { element: dataGrid.element });
  });

  test('Move right fixed column to the left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(0).getHeaderCell(24).element, -400, 0);
    await movePointerOffGrid(page);

    // TODO: issue will be fixed in the card 7Mct6tJU
    await dataGrid.scrollTo({ left: 0 });

    await testScreenshot(page, 'move_right_fixed_column_to_left.png', { element: dataGrid.element });
  });

  test('Move fixed column with fixedPosition = \'sticky\' to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';

        columns[15].fixed = true;
        columns[15].fixedPosition = 'right';
        columns[17].fixed = true;
        columns[17].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(0).getHeaderCell(5).element, 200, 0);
    await expect(headers.getHeaderRow(0).getHeaderCell(6).element).toHaveText('Field 3');
    await movePointerOffGrid(page);

    await testScreenshot(page, 'move_fixed_column_with_sticky_position_to_right.png', { element: dataGrid.element });
  });

  test('Move left fixed band column to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: ['field_1', 'field_2'],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'left',
          columns: ['field_3', 'field_4'],
        });
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(1).getHeaderCell(0).element, 500, 0);
    await movePointerOffGrid(page);

    await testScreenshot(page, 'move_left_fixed_band_column_to_right.png', { element: dataGrid.element });
  });

  test('Move right fixed band column to the left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'right',
          columns: ['field_1', 'field_2'],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'right',
          columns: ['field_3', 'field_4'],
        });
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(1).getHeaderCell(3).element, -500, 0);
    await movePointerOffGrid(page);

    // TODO: issue will be fixed in the card 7Mct6tJU
    await dataGrid.scrollTo({ left: 0 });

    await testScreenshot(page, 'move_right_fixed_band_column_to_left.png', { element: dataGrid.element });
  });

  test('Move fixed band column with fixedPosition=\'sticky\' to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns.splice(3, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: ['field_1', 'field_2'],
        });
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headers = dataGrid.getHeaders();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, headers.getHeaderRow(1).getHeaderCell(0).element, 400, 0);
    await movePointerOffGrid(page);

    await testScreenshot(page, 'move_fixed_band_column_with_sticky_position_to_right.png', { element: dataGrid.element });
  });

  test('Check the draggable source column while moving the fixed column on the right side', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(5, 25) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.moveHeader(24, -200, 5, true);

    await testScreenshot(page, 'draggable_source_column_with_fixed_columns.png', { element: dataGrid.element });
  });
});
