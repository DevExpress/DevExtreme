/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { startDragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { insertStylesToSuppressGroupPanelFocusOutline } from '../../helpers/domUtils';
import { loadThemeFonts } from '../../helpers/loadThemeFonts';
import { defaultConfig } from '../helpers/data';

test.describe('FixedColumns - Grouping', () => {
  test.describe(() => {
    test.use({ browserSize: [900, 800] });

    [false, true].forEach((rtlEnabled) => {
      test(`Sticky columns with grouping & summary (rtl=${rtlEnabled})`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', ({ config, rtl }) => ({
          ...config,
          rtlEnabled: rtl,
          customizeColumns(columns) {
            columns[2].groupIndex = 0;
          },
          summary: {
            groupItems: [{
              column: 'OrderNumber',
              summaryType: 'count',
              displayFormat: '{0} orders',
            }, {
              column: 'City',
              summaryType: 'max',
              valueFormat: 'currency',
              showInGroupFooter: false,
              alignByColumn: true,
            }, {
              column: 'TotalAmount',
              summaryType: 'max',
              valueFormat: 'currency',
              showInGroupFooter: false,
              alignByColumn: true,
            }, {
              column: 'TotalAmount',
              summaryType: 'sum',
              valueFormat: 'currency',
              displayFormat: 'Total: {0}',
              showInGroupFooter: true,
            }],
            totalItems: [{
              column: 'OrderNumber',
              summaryType: 'count',
              displayFormat: '{0} orders',
            }, {
              column: 'SaleAmount',
              summaryType: 'max',
              valueFormat: 'currency',
            }, {
              column: 'TotalAmount',
              summaryType: 'max',
              valueFormat: 'currency',
            }, {
              column: 'TotalAmount',
              summaryType: 'sum',
              valueFormat: 'currency',
              displayFormat: 'Total: {0}',
            }],
          },
        }), DEFAULT_SELECTOR, { arg: { config: defaultConfig, rtl: rtlEnabled } });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await testScreenshot(page, `grouping-scroll-begin-rtl=${rtlEnabled}.png`, { element: dataGrid.element });

        await dataGrid.scrollTo({ left: rtlEnabled ? 500 : 100 });

        await testScreenshot(page, `grouping-scroll-center=${rtlEnabled}.png`, { element: dataGrid.element });

        await dataGrid.scrollTo({ left: rtlEnabled ? 0 : 10000 });

        await testScreenshot(page, `grouping-scroll-end=${rtlEnabled}.png`, { element: dataGrid.element });
      });
    });

    test('Sticky columns with grouping & summary (multiple groups)', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
          columns[3].groupIndex = 1;
          columns[4].groupIndex = 2;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'City',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'SaleAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
          }],
        },
      }), DEFAULT_SELECTOR, { arg: defaultConfig });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'grouping-multiple-scroll-begin.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 100 });

      await testScreenshot(page, 'grouping-multiple-scroll-center.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 10000 });

      await testScreenshot(page, 'grouping-multiple-scroll-end.png', { element: dataGrid.element });
    });

    test('Sticky columns with grouping - overflow of group cell', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
        },
        summary: {
          groupItems: [{
            column: 'OrderDate',
            summaryType: 'count',
            alignByColumn: true,
          }],
        },
      }), DEFAULT_SELECTOR, { arg: defaultConfig });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'grouping-overflow-cell.png', { element: dataGrid.element });
    });

    test('The header row should be highlighted correctly when dragging column when there are fixed columns and allowColumnReordering=false', async ({ page }) => {
      await insertStylesToSuppressGroupPanelFocusOutline(page);
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
        },
        groupPanel: {
          visible: true,
        },
        allowColumnReordering: false,
      }), DEFAULT_SELECTOR, { arg: defaultConfig });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await startDragToOffset(page, dataGrid.getGroupPanel().getHeader(0).element, 200, 35);

      await dataGrid.getHeaders().getHeaderRow(0).expectHighlighted();

      await testScreenshot(page, 'header_row_highlight_with_fixed_columns.png', { element: dataGrid.element });
    });

    test('The group separator should be visible when dragging a fixed column into the group panel', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
        },
        groupPanel: {
          visible: true,
        },
        allowColumnReordering: false,
      }), DEFAULT_SELECTOR, { arg: defaultConfig });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

      await startDragToOffset(page, headerCell.element, 100, -50);

      await expect(dataGrid.getBlockSeparator()).toBeVisible();

      await testScreenshot(page, 'dragging_fixed_column_to_group_panel.png', { element: dataGrid.element });
    });
  });

  test('DataGrid - Group row content is scrolled if repaintChangesOnly is enabled and the grid has a fixed column (T1286077)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      columnAutoWidth: false,
      customizeColumns(columns) {
        columns[2].groupIndex = 0;
      },
      columnWidth: 200,
      repaintChangesOnly: true,
      grouping: {
        autoExpandAll: false,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupRow = dataGrid.getGroupRow(0);
    const groupPanelToggle = groupRow.getCell(0).element;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await groupPanelToggle.click();
    await dataGrid.getGroupRow(0).expectExpanded();

    await groupPanelToggle.click();
    await dataGrid.getGroupRow(0).expectExpanded(false);

    await dataGrid.scrollBy({ left: 1000 });

    await testScreenshot(page, 'group_row_scrolling_all_collapsed_fixed_columns.png', { element: dataGrid.element });
  });

  test.describe(() => {
    test.use({ browserSize: [900, 800] });

    test('Focused group row keeps focused background and centered expand icon with fixed columns (T1303478)', {
      tag: ['@generic.light', '@material.blue.light'],
    }, async ({ page }) => {
      await loadThemeFonts(page);
      await createWidget(page, 'dxDataGrid', (config) => ({
        ...config,
        focusedRowEnabled: true,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
        },
        scrolling: {
          showScrollbar: 'never',
        },
      }), DEFAULT_SELECTOR, { arg: defaultConfig });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getGroupRow(0).element.click();
      await dataGrid.getGroupRow(0).expectFocusedRow();

      await testScreenshot(page, 'grouping-focused-group-row.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 100 });

      await testScreenshot(page, 'grouping-focused-group-row-scroll.png', { element: dataGrid.element });
    });
  });

  [false, true].forEach((rtlEnabled) => {
    // T1284612
    test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll - intersection (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ config, rtl }) => ({
        ...config,
        rtlEnabled: rtl,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
          columns[1].visible = false;
          columns[3].width = 200;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'City',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'SaleAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
          }],
        },
      }), DEFAULT_SELECTOR, { arg: { config: defaultConfig, rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `grouping-scroll-total_summary_intersection-rtl=${rtlEnabled}.png`, { element: dataGrid.element });
    });
  });

  [false, true].forEach((rtlEnabled) => {
    // T1284612
    test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ config, rtl }) => ({
        ...config,
        rtlEnabled: rtl,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
          columns[1].visible = false;
          columns[4].width = 150;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'City',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'SaleAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            displayFormat: 'MAXMAXMAXMAX: {0}',
          }],
        },
      }), DEFAULT_SELECTOR, { arg: { config: defaultConfig, rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `grouping-scroll-total_summary-rtl=${rtlEnabled}.png`, { element: dataGrid.element });
    });
  });
});
