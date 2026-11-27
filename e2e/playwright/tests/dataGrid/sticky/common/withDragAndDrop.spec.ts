/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { loadThemeFonts } from '../../helpers/loadThemeFonts';

test.describe('Sticky columns - Drag and Drop', () => {
  test('Fixed columns should work when drag and drop rows are enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      keyExpr: 'field_0',
      width: 500,
      columnFixing: {
        enabled: true,
      },
      showColumnHeaders: true,
      columnAutoWidth: true,
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
      },
      customizeColumns(columns) {
        columns[5].fixed = true;
        columns[6].fixed = true;
        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: getData(10, 10) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'datagrid_sticky_columns_with_drag_and_drop.png', { element: dataGrid.element });
  });

  test.describe(() => {
    test.use({ browserSize: [900, 800] });

    test('Drag icons keep vertical centering in focused and selected rows with fixed columns (T1303892)', {
      tag: ['@generic.light', '@material.blue.light'],
    }, async ({ page }) => {
      await loadThemeFonts(page);
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(10, 5),
        keyExpr: 'field_0',
        width: 500,
        columnFixing: {
          enabled: true,
        },
        focusedRowEnabled: true,
        selection: {
          mode: 'single',
        },
        showRowLines: false,
        showColumnHeaders: true,
        columnAutoWidth: true,
        rowDragging: {
          allowReordering: true,
        },
        scrolling: {
          showScrollbar: 'never',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getDataCell(1, 1).element.click();
      await dataGrid.getDataRow(1).expectFocusedRow();
      await dataGrid.getDataRow(1).expectSelected();

      await testScreenshot(page, 'drag-icons-focused-selected-rows.png', { element: dataGrid.element });
    });
  });
});
