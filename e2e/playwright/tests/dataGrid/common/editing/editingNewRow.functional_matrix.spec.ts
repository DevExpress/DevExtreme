import type { Locator, Page } from '@playwright/test';
import type { GridsEditMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import type DataCell from '../../../../models/dataGrid/data/cell';
import { CellEditor } from '../../../../models/dataGrid/data/cellEditor';
import type EditForm from '../../../../models/dataGrid/editForm';
import { clickWithOffset } from '../../helpers/clickWithOffset';
import { getFirstDataRow } from '../../helpers/getFirstDataRow';
import { typeText } from '../../helpers/typeText';

interface ColumnInfo {
  columnIndex: number;
  dataField: string;
  newValue: string;
}

const createDataGrid = async (
  page: Page,
  mode: GridsEditMode,
  repaintChangesOnly = false,
): Promise<void> => createWidget(page, 'dxDataGrid', (arg) => ({
  keyExpr: 'id',
  dataSource: [
    {
      id: 1, text: 'text 1', number: 1, date: '2020-10-27', boolean: false, lookup: 1,
    },
    {
      id: 2, text: 'text 2', number: 2, date: '2020-10-28', boolean: true, lookup: 2,
    },
  ],
  repaintChangesOnly: arg.repaintChangesOnly,
  editing: {
    mode: arg.mode,
    allowAdding: true,
    allowUpdating: true,
  },
  columns: [
    { dataField: 'text' },
    {
      dataField: 'number',
      editorOptions: {
        format: '#0',
      },
    },
    {
      dataField: 'date',
      dataType: 'date',
      editorOptions: {
        pickerType: 'calendar',
      },
    },
    {
      dataField: 'lookup',
      lookup: {
        valueExpr: 'id',
        displayExpr: 'text',
        dataSource: [
          { id: 1, text: 'lookup 1' },
          { id: 2, text: 'lookup 2' },
        ],
      },
    },
    { dataField: 'boolean' },
    {
      dataField: 'calculated',
      calculateCellValue: (data): number => (data as { number: number }).number + 1,
      setCellValue: (newData, value): void => {
        // eslint-disable-next-line no-param-reassign
        newData.number = value - 1;
      },
    },
  ],
}), '#container', { arg: { mode, repaintChangesOnly } });

const expectedCalculatedColumnResult: ColumnInfo[] = [
  { columnIndex: 1, dataField: 'number', newValue: '8' },
  { columnIndex: 5, dataField: 'calculated', newValue: '9' },
];

const getEditForm = (dataGrid: DataGrid, mode: GridsEditMode): EditForm | null => {
  if (mode === 'form') {
    return dataGrid.getEditForm();
  }
  if (mode === 'popup') {
    return dataGrid.getPopupEditForm();
  }
  return null;
};

const addRow = async (
  dataGrid: DataGrid,
  { columnIndex }: { columnIndex: number },
  form: EditForm | null,
  cell: DataCell,
  editor: CellEditor,
): Promise<void> => {
  const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
  await addRowButton.click();

  if (columnIndex > 0) {
    if (!form) {
      // Until the inserted row renders, the first row is the existing one: the click lands there.
      await getFirstDataRow(dataGrid).expectInserted();
    }

    const item = !form ? cell.element : editor.getItemLabel();
    await clickWithOffset(item, 5);
  }
};

const checkCellFocused = async (
  mode: GridsEditMode,
  { dataField }: ColumnInfo,
  cell: DataCell,
  editor: CellEditor,
): Promise<void> => {
  if (mode !== 'form' && mode !== 'popup') {
    await cell.expectFocusVisible();
  }

  const isRowBasedMode = mode === 'row';
  const isFormBasedMode = mode === 'form' || mode === 'popup';

  if ((isRowBasedMode || isFormBasedMode) && dataField === 'boolean') {
    return;
  }

  await expect(editor.element).toBeFocused();
};

const getSaveButton = (
  page: Page,
  dataGrid: DataGrid,
  mode: string,
  form: EditForm | null,
): Locator | undefined => {
  switch (mode) {
    case 'batch':
      return dataGrid.getHeaderPanel().getSaveButton();
    case 'row':
      return getFirstDataRow(dataGrid).getCommandCell(6).getButton(0);
    case 'cell':
      return page.locator('body');
    default:
      return form?.saveButton;
  }
};

const checkSavedCell = async (
  dataGrid: DataGrid,
  { dataField, newValue }: ColumnInfo,
  cell: DataCell,
): Promise<void> => {
  if (dataField === 'boolean') {
    await cell.getEditor().expectChecked(newValue === 'true');
  } else {
    await expect(cell.element).toHaveText(newValue);
  }

  await cell.expectEditCell(dataField === 'boolean');
  await cell.expectModified(false);
  await expect(dataGrid.getModifiedCells()).toHaveCount(0);
};

const modes: GridsEditMode[] = ['cell', 'batch', 'row', 'form', 'popup'];

test.describe('Editing.NewRow', () => {
  modes.forEach((mode) => {
    [true, false].forEach((repaintChangesOnly) => {
      test(`Update cell value in new row, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}`, async ({ page }) => {
        await createDataGrid(page, mode, repaintChangesOnly);

        const dataGrid = new DataGrid(page, '#container');
        const columnInfo = { columnIndex: 0, dataField: 'text', newValue: 'xxxx' };
        const form = getEditForm(dataGrid, mode);
        const cell = getFirstDataRow(dataGrid).getDataCell(columnInfo.columnIndex);
        const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.getEditor();

        await addRow(dataGrid, columnInfo, form, cell, editor);

        await checkCellFocused(mode, columnInfo, cell, editor);

        await typeText(editor.element, columnInfo.newValue, { replace: true });

        const saveButton = getSaveButton(page, dataGrid, mode, form);

        if (saveButton) {
          await clickWithOffset(saveButton, 5, 5);
        }

        await checkSavedCell(dataGrid, columnInfo, dataGrid.getDataCell(2, columnInfo.columnIndex));
      });

      test(`Update calculated cell value in new row, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}`, async ({ page }) => {
        await createDataGrid(page, mode, repaintChangesOnly);

        const dataGrid = new DataGrid(page, '#container');
        const columnInfo = { columnIndex: 5, dataField: 'calculated', newValue: '9' };
        const form = getEditForm(dataGrid, mode);
        const cell = getFirstDataRow(dataGrid).getDataCell(columnInfo.columnIndex);
        const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.getEditor();

        await addRow(dataGrid, columnInfo, form, cell, editor);

        await checkCellFocused(mode, columnInfo, cell, editor);

        await typeText(editor.element, columnInfo.newValue, { replace: true });

        if (!repaintChangesOnly && (mode === 'row' || mode === 'form')) {
          await page.locator('body').click();
        }

        const saveButton = getSaveButton(page, dataGrid, mode, form);

        if (saveButton) {
          await clickWithOffset(saveButton, 5, 5);
        }

        for (const resultColumnInfo of expectedCalculatedColumnResult) {
          await checkSavedCell(
            dataGrid,
            resultColumnInfo,
            dataGrid.getDataCell(2, resultColumnInfo.columnIndex),
          );
        }
      });
    });
  });
});
