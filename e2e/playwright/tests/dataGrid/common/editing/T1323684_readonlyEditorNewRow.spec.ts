import type { GridsEditMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { classMatcher } from '../../../../models/internal/classMatcher';
import { getFirstDataRow } from '../../helpers/getFirstDataRow';
import { typeText } from '../../helpers/typeText';

const READONLY_CLASS = 'dx-datagrid-readonly';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

test.describe('Editing - showEditorAlways cell in new row should be editable (T1323684)', () => {
  (['cell', 'batch'] as GridsEditMode[]).forEach((mode) => {
    test(`showEditorAlways editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        keyExpr: 'ID',
        dataSource: [
          { ID: 1, FirstName: 'John', LastName: 'Heart' },
          { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
        ],
        showBorders: true,
        editing: {
          mode,
          allowUpdating: false,
          allowAdding: true,
        },
        columns: [
          'LastName',
          { dataField: 'FirstName', showEditorAlways: true },
        ],
      });

      const dataGrid = new DataGrid(page, '#container');
      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

      await addRowButton.click();

      const newRow = getFirstDataRow(dataGrid);
      await newRow.expectInserted();

      const cell = newRow.getDataCell(1);
      const editor = cell.getEditor();

      await expect(cell.element, 'showEditorAlways cell in new row should not have readonly class')
        .not.toHaveClass(classMatcher(READONLY_CLASS));
      await expect(cell.element, 'showEditorAlways cell in new row should not have cell-focus-disabled class')
        .not.toHaveClass(classMatcher(CELL_FOCUS_DISABLED_CLASS));

      await editor.element.click();
      await cell.expectFocusVisible();
      await expect(editor.element, 'editor should be focused after click').toBeFocused();
      await typeText(editor.element, 'test value', { replace: true });
      await expect(editor.element).toHaveValue('test value');
    });

    test(`Boolean editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        keyExpr: 'ID',
        dataSource: [
          { ID: 1, Name: 'John', Active: false },
          { ID: 2, Name: 'Olivia', Active: true },
        ],
        showBorders: true,
        editing: {
          mode,
          allowUpdating: false,
          allowAdding: true,
        },
        columns: [
          'Name',
          { dataField: 'Active', dataType: 'boolean' },
        ],
      });

      const dataGrid = new DataGrid(page, '#container');
      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

      await addRowButton.click();

      const newRow = getFirstDataRow(dataGrid);
      await newRow.expectInserted();

      const booleanCell = newRow.getDataCell(1);

      await expect(booleanCell.element, 'boolean cell in new row should not have readonly class')
        .not.toHaveClass(classMatcher(READONLY_CLASS));

      // The checkbox sits at the center of the cell: click beside it to focus the cell only.
      await booleanCell.element.click({ position: { x: 5, y: 5 } });
      await booleanCell.getCheckbox().click();
      await booleanCell.getEditor().expectChecked();
    });

    test(`showEditorAlways editor in existing rows should remain readonly when allowUpdating is false, ${mode} mode`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        keyExpr: 'ID',
        dataSource: [
          { ID: 1, FirstName: 'John', LastName: 'Heart' },
          { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
        ],
        showBorders: true,
        editing: {
          mode,
          allowUpdating: false,
          allowAdding: true,
        },
        columns: [
          'LastName',
          { dataField: 'FirstName', showEditorAlways: true },
        ],
      });

      const dataGrid = new DataGrid(page, '#container');
      const existingCell = dataGrid.getDataCell(0, 1);

      await expect(existingCell.element, 'showEditorAlways cell in existing row should have readonly class when allowUpdating is false')
        .toHaveClass(classMatcher(READONLY_CLASS));

      await existingCell.getEditor().element.click();
      await expect(existingCell.element, 'showEditorAlways cell in existing row should remain readonly after click')
        .toHaveClass(classMatcher(READONLY_CLASS));
    });
  });

  test('showEditorAlways editor should be editable in a new row when allowUpdating is a function returning false, cell mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      keyExpr: 'ID',
      dataSource: [
        { ID: 1, FirstName: 'John', LastName: 'Heart' },
        { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
      ],
      showBorders: true,
      editing: {
        mode: 'cell' as GridsEditMode,
        allowUpdating: () => false,
        allowAdding: true,
      },
      columns: [
        'LastName',
        { dataField: 'FirstName', showEditorAlways: true },
      ],
    }));

    const dataGrid = new DataGrid(page, '#container');
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

    await addRowButton.click();

    const newRow = getFirstDataRow(dataGrid);
    await newRow.expectInserted();

    const cell = newRow.getDataCell(1);
    const editor = cell.getEditor();

    await expect(cell.element, 'showEditorAlways cell in new row should not have readonly class')
      .not.toHaveClass(classMatcher(READONLY_CLASS));
    await expect(cell.element, 'showEditorAlways cell in new row should not have cell-focus-disabled class')
      .not.toHaveClass(classMatcher(CELL_FOCUS_DISABLED_CLASS));

    await editor.element.click();
    await cell.expectFocusVisible();
    await expect(editor.element, 'editor should be focused after click').toBeFocused();
    await typeText(editor.element, 'test value', { replace: true });
    await expect(editor.element).toHaveValue('test value');
  });
});
