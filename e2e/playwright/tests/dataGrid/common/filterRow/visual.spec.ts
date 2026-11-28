import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import TextBox from '../../../../models/textBox';
import { getNumberData } from '../../helpers/generateDataSourceData';

test.describe('FilterRow', () => {
  test('Filter row\'s height should be adjusted by content (T1072609)', { tag: ['@material.blue.light'] }, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columns: [{
        dataField: 'Date',
        dataType: 'date',
        width: 140,
        selectedFilterOperation: 'between',
        filterValue: [new Date(2022, 2, 28), new Date(2022, 2, 29)],
      }],
      filterRow: { visible: true },
      wordWrapEnabled: true,
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await testScreenshot(page, 'T1072609.png', { element: dataGrid.element });
  });

  test('FilterRow range overlay screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getNumberData(20, 2),
      height: 400,
      showBorders: true,
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(1);

    await filterCell.menuButton.click();
    await filterCell.menu.getItemByText('Between').click();
    // act
    await testScreenshot(page, 'filter-row-overlay.png');
    // assert
    await expect(dataGrid.getFilterRangeOverlay()).toBeAttached();
  });

  // T1287288
  test('Focus overlay should be visible in filter row when focusedRowEnabled is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Field: 'Item 1' },
        { ID: 2, Field: 'Item 2' },
        { ID: 3, Field: 'Item 3' },
      ],
      keyExpr: 'ID',
      focusedRowEnabled: true,
      filterRow: { visible: true },
      showBorders: true,
      columns: ['ID', 'Field'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterEditor = dataGrid.getFilterEditor(1, TextBox);

    await dataGrid.getDataCell(0, 0).element.click();
    await filterEditor.input.click();
    // assert
    await expect(filterEditor.input).toBeFocused();

    await testScreenshot(page, 'filter-row-focus-overlay.png', { element: dataGrid.element });
  });

  test('DataGrid - The `between` filter dropdown sticks to the viewport edge during horizontal scrolling (T1280071)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Text: 'Item 1' },
        { ID: 2, Text: '' },
        { ID: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      filterRow: {
        visible: true,
      },
      scrolling: {
        useNative: true,
      },
      columnWidth: 400,
      width: 500,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await filterCell.menuButton.click();
    await filterCell.menu.getItemByText('Between').click();

    await dataGrid.scrollBy({ left: 999 });
    await testScreenshot(page, 'filter-row-filter-range-hide-on-scroll.png');
  });
});
