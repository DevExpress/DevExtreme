import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const ROW_INDEX = 1;

const getClientHeight = (element: Locator): Promise<number> => element
  .evaluate((node) => node.clientHeight);

test.describe('DataGrid deleted row height consistency T1286265', () => {
  test('When DataGrid has fixed column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Jane Johnson' },
        { id: 3, name: 'Mike Wilson' },
      ],
      keyExpr: 'id',
      height: 300,
      showBorders: true,
      showRowLines: true,
      columns: [
        { dataField: 'id', width: 50, fixed: true },
        { dataField: 'name', width: 150 },
      ],
      editing: {
        mode: 'batch',
        allowDeleting: true,
      },
    });

    // Arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // Get the initial height of the row at index
    const initialRow = dataGrid.getDataRow(ROW_INDEX);
    const initialRowHeight = await getClientHeight(initialRow.element);

    // Act - mark the row as deleted
    await dataGrid.apiDeleteRow(ROW_INDEX);

    // Assert - check if the row is marked as deleted
    await dataGrid.getDataRow(ROW_INDEX).expectRemoved();

    // Get the height of the deleted row
    const deletedRow = dataGrid.getDataRow(ROW_INDEX);
    const deletedRowHeight = await getClientHeight(deletedRow.element);

    // Assert - check if the height remains consistent
    expect(deletedRowHeight, 'Row height should not change when marked as deleted').toBe(initialRowHeight);

    // Take a screenshot for visual verification
    await testScreenshot(page, 'datagrid-deleted-row-height-row-lines-and-fixed-column.png', { element: dataGrid.element });
  });

  test('When DataGrid doesn\'t have fixed column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Jane Johnson' },
        { id: 3, name: 'Mike Wilson' },
      ],
      keyExpr: 'id',
      height: 300,
      showBorders: true,
      showRowLines: true,
      columns: [
        { dataField: 'id', width: 50 },
        { dataField: 'name', width: 150 },
      ],
      editing: {
        mode: 'batch',
        allowDeleting: true,
      },
    });

    // Arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // Get the initial height of the row at index
    const initialRow = dataGrid.getDataRow(ROW_INDEX);
    const initialRowHeight = await getClientHeight(initialRow.element);

    // Act - mark the row as deleted
    await dataGrid.apiDeleteRow(ROW_INDEX);

    // Assert - check if the row is marked as deleted
    await dataGrid.getDataRow(ROW_INDEX).expectRemoved();

    // Get the height of the deleted row
    const deletedRow = dataGrid.getDataRow(ROW_INDEX);
    const deletedRowHeight = await getClientHeight(deletedRow.element);

    // Assert - check if the height remains consistent
    expect(deletedRowHeight, 'Row height should not change when marked as deleted').toBe(initialRowHeight);

    // Take a screenshot for visual verification
    await testScreenshot(page, 'datagrid-deleted-row-height-row-lines-and-no-fixed-column.png', { element: dataGrid.element });
  });

  test('When not showing row lines and not fixed any column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Jane Johnson' },
        { id: 3, name: 'Mike Wilson' },
      ],
      keyExpr: 'id',
      height: 300,
      showBorders: true,
      showRowLines: false,
      columns: [
        { dataField: 'id', width: 50 },
        { dataField: 'name', width: 150 },
      ],
      editing: {
        mode: 'batch',
        allowDeleting: true,
      },
    });

    // Arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // Get the initial height of the row at index
    const initialRow = dataGrid.getDataRow(ROW_INDEX);
    const initialRowHeight = await getClientHeight(initialRow.element);

    // Act - mark the row as deleted
    await dataGrid.apiDeleteRow(ROW_INDEX);

    // Assert - check if the row is marked as deleted
    await dataGrid.getDataRow(ROW_INDEX).expectRemoved();

    // Get the height of the deleted row
    const deletedRow = dataGrid.getDataRow(ROW_INDEX);
    const deletedRowHeight = await getClientHeight(deletedRow.element);

    // Assert - check if the height remains consistent
    expect(deletedRowHeight, 'Row height should not change when marked as deleted').toBe(initialRowHeight);

    // Take a screenshot for visual verification
    await testScreenshot(page, 'datagrid-deleted-row-height-no-row-lines-and-no-fixed-column.png', { element: dataGrid.element });
  });

  test('When not showing row lines and DataGrid has any column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Jane Johnson' },
        { id: 3, name: 'Mike Wilson' },
      ],
      keyExpr: 'id',
      height: 300,
      showBorders: true,
      showRowLines: false,
      columns: [
        { dataField: 'id', width: 50, fixed: true },
        { dataField: 'name', width: 150 },
      ],
      editing: {
        mode: 'batch',
        allowDeleting: true,
      },
    });

    // Arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // Get the initial height of the row at index
    const initialRow = dataGrid.getDataRow(ROW_INDEX);
    const initialRowHeight = await getClientHeight(initialRow.element);

    // Act - mark the row as deleted
    await dataGrid.apiDeleteRow(ROW_INDEX);

    // Assert - check if the row is marked as deleted
    await dataGrid.getDataRow(ROW_INDEX).expectRemoved();

    // Get the height of the deleted row
    const deletedRow = dataGrid.getDataRow(ROW_INDEX);
    const deletedRowHeight = await getClientHeight(deletedRow.element);

    // Assert - check if the height remains consistent
    expect(deletedRowHeight, 'Row height should not change when marked as deleted').toBe(initialRowHeight);

    // Take a screenshot for visual verification
    await testScreenshot(page, 'datagrid-deleted-row-height-no-row-lines-and-fixed-column.png', { element: dataGrid.element });
  });
});
