/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { groupingDataSource, groupingDataSourceFields } from '../helpers/data';

test.describe('Sticky columns - Virtual Columns', () => {
  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    test('Fixed columns with sticky position should not work', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        columnWidth: 100,
        showColumnLines: true,
        scrolling: {
          columnRenderingMode: 'virtual',
        },
        customizeColumns(columns) {
          columns[0].fixed = true;
          columns[1].fixed = true;
          columns[3].fixed = true;
          columns[3].fixedPosition = 'sticky';
        },
      }), DEFAULT_SELECTOR, { arg: getData(10, 100) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'virtual_columns_with_sticky_columns_1.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 150 });

      await testScreenshot(page, 'virtual_columns_with_sticky_columns_2.png', { element: dataGrid.element });
    });

    test('There should be no way to set a sticky fixed position for columns via the context menu', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (data) => ({
        dataSource: data,
        columnWidth: 100,
        scrolling: {
          columnRenderingMode: 'virtual',
        },
        columnFixing: {
          enabled: true,
        },
        customizeColumns(columns) {
          columns[0].fixed = true;
          columns[1].fixed = true;
        },
      }), DEFAULT_SELECTOR, { arg: getData(10, 100) });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const contextMenu = dataGrid.getContextMenu();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3).element.click({ button: 'right' });
      await contextMenu.getItemByText('Set Fixed Position').click();

      await expect(contextMenu.getItemByText('Left')).toBeVisible();

      await testScreenshot(page, 'context_menu_and_virtual_columns_with_fixed_columns.png');
    });
  });

  test('should render group row in scroll right max position', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ({ data, fields }) => ({
      dataSource: data,
      columns: [
        {
          dataField: 'groupFieldA',
          groupIndex: 0,
          fixed: true,
        },
        ...fields.map((dataField) => ({
          dataField,
          width: 100,
        })),
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: true,
      },
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      // NOTE: 3x columns (by 100px each) + 30px command column
      width: 330,
    }), DEFAULT_SELECTOR, { arg: { data: groupingDataSource, fields: groupingDataSourceFields } });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // NOTE: Scroll to max right position
    await dataGrid.scrollTo({ left: 9999999 });

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'virtual_columns_with_grouping_scroll_right.png', { element: dataGrid.element });
  });

  test('should render nested group row in scroll right max position', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ({ data, fields }) => ({
      dataSource: data,
      columns: [
        {
          dataField: 'groupFieldA',
          groupIndex: 0,
          fixed: true,
        },
        {
          dataField: 'groupFieldB',
          groupIndex: 1,
          fixed: true,
        },
        ...fields.map((dataField) => ({
          dataField,
          width: 100,
        })),
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: true,
      },
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      // NOTE: 3x columns (by 100px each) + 30px command column
      width: 330,
    }), DEFAULT_SELECTOR, { arg: { data: groupingDataSource, fields: groupingDataSourceFields } });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // NOTE: Scroll to max right position
    await dataGrid.scrollTo({ left: 9999999 });

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'virtual_columns_with_nested_grouping_scroll_right.png', { element: dataGrid.element });
  });

  test('expand group icon should be clickable in scroll right max position', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ({ data, fields }) => ({
      dataSource: data,
      columns: [
        {
          dataField: 'groupFieldA',
          groupIndex: 0,
          fixed: true,
        },
        ...fields.map((dataField) => ({
          dataField,
          width: 100,
        })),
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: false,
      },
      scrolling: {
        columnRenderingMode: 'virtual',
        showScrollbar: 'never',
      },
      // NOTE: 3x columns (by 100px each) + 30px command column
      width: 330,
    }), DEFAULT_SELECTOR, { arg: { data: groupingDataSource, fields: groupingDataSourceFields } });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // NOTE: Scroll to max right position
    await dataGrid.scrollTo({ left: 9999999 });

    const expandCell = dataGrid.getGroupRow(1).getCell(0);

    await expandCell.element.click();
    await dataGrid.getGroupRow(1).expectExpanded();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'virtual_columns_with_grouping_expand_scroll_right.png', { element: dataGrid.element });
  });
});
