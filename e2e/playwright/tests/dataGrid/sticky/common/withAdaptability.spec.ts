/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('Sticky columns - Adaptability', () => {
  test.use({ browserSize: [900, 800] });

  [false, true].forEach((rtlEnabled) => {
    test(`Sticky columns with adaptive detail row (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns.forEach((column, index) => {
            if (index < 3) {
              column.hidingPriority = index;
            }
            column.width = 200;
          });
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnHidingEnabled: true,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiExpandAdaptiveDetailRow(1);
      await expect(dataGrid.getAdaptiveRow(0).element).toBeVisible();

      await testScreenshot(page, `adaptability_sticky_columns_with_adaptive_detail_row_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `adaptability_sticky_columns_with_adaptive_detail_row_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Sticky columns with sticky positions (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          let hidingPriority = 0;

          columns.forEach((column, index) => {
            if (index === 1 || index === 4) {
              column.fixed = true;
              column.fixedPosition = 'sticky';
            } else {
              column.fixed = false;

              if (index < 3) {
                column.hidingPriority = hidingPriority;
                hidingPriority += 1;
              }
            }

            column.width = 200;
          });
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnHidingEnabled: true,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `adaptability_sticky_columns_with_sticky_positions_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 10000 });

      await testScreenshot(page, `adaptability_sticky_columns_with_sticky_positions_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Fixed columns should be displayed correctly when the grid has a small width  (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns.forEach((column, index) => {
            if (!column.fixed) {
              column.hidingPriority = index;
            } else {
              column.allowHiding = false;
            }

            column.width = 200;
          });
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 350,
          rtlEnabled,
          columnHidingEnabled: true,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `adaptability_fixed_columns_with_small_grid_width_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Sticky column pinned to the left should be displayed correctly when hidden column between sticky column and fixed column (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[1].hidingPriority = 0;
          columns[2].fixed = true;
          columns[2].fixedPosition = 'sticky';
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnWidth: 200,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `hidden_column_between_sticky_column_and_left_fixed_column_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `hidden_column_between_sticky_column_and_left_fixed_column_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Sticky column pinned to the left should be displayed correctly when banded hidden column between sticky column and fixed column (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[1] = {
            caption: 'Band Columns',
            columns: [{ dataField: 'OrderDate', hidingPriority: 0 }],
          };
          columns[2].fixed = true;
          columns[2].fixedPosition = 'sticky';
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnWidth: 200,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `banded_hidden_column_between_sticky_column_and_left_fixed_column_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `banded_hidden_column_between_sticky_column_and_left_fixed_column_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Sticky column pinned to the right should be displayed correctly when hidden column between sticky column and fixed column (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[4].fixed = true;
          columns[4].fixedPosition = 'sticky';
          columns[5].hidingPriority = 0;
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnWidth: 200,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `hidden_column_between_sticky_column_and_right_fixed_column_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `hidden_column_between_sticky_column_and_right_fixed_column_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });

    test(`Sticky column pinned to the right should be displayed correctly when banded hidden column between sticky column and fixed column (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[4].fixed = true;
          columns[4].fixedPosition = 'sticky';
          columns[5] = {
            caption: 'Band Columns',
            columns: [{ dataField: 'SaleAmount', hidingPriority: 0 }],
          };
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          ...defaultConfig,
          width: 800,
          rtlEnabled,
          columnWidth: 200,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const scrollLeft = rtlEnabled ? -10000 : 10000;

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `banded_hidden_column_between_sticky_column_and_right_fixed_column_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await dataGrid.scrollTo({ left: scrollLeft });

      await testScreenshot(page, `banded_hidden_column_between_sticky_column_and_right_fixed_column_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: dataGrid.element });
    });
  });

  test('Sticky columns with sticky positions when columnHidingEnabled = false and columns have hidingPriority', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        let hidingPriority = 0;

        columns.forEach((column, index) => {
          if (index === 1 || index === 4) {
            column.fixed = true;
            column.fixedPosition = 'sticky';
          } else {
            column.fixed = false;

            if (index < 3) {
              column.hidingPriority = hidingPriority;
              hidingPriority += 1;
            }
          }

          column.width = 200;
        });
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        width: 800,
        columnHidingEnabled: false,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'adaptability_sticky_columns_with_sticky_positions_and_hiding_priority_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'adaptability_sticky_columns_with_sticky_positions_and_hiding_priority_2.png', { element: dataGrid.element });
  });
});
