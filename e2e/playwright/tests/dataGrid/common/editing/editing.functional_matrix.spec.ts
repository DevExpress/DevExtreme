import type { Locator, Page } from '@playwright/test';
import type { GridsEditMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import Calendar from '../../../../models/calendar';
import DataGrid from '../../../../models/dataGrid';
import type DataCell from '../../../../models/dataGrid/data/cell';
import { CellEditor } from '../../../../models/dataGrid/data/cellEditor';
import type EditForm from '../../../../models/dataGrid/editForm';
import List from '../../../../models/list';
import { clickWithOffset } from '../../helpers/clickWithOffset';
import { typeText } from '../../helpers/typeText';

interface ColumnInfo {
  columnIndex: number;
  dataField: string;
  newValue: string;
  newMaskValue?: string;
}

const editingModes: GridsEditMode[] = ['cell', 'batch', 'row', 'form', 'popup'];

const textColumnInfos: ColumnInfo[] = [
  { columnIndex: 0, dataField: 'text', newValue: 'xxxx' },
  { columnIndex: 5, dataField: 'calculated', newValue: '9' },
];

const expectedTextColumnResult: ColumnInfo[] = [
  ...textColumnInfos,
  { columnIndex: 1, dataField: 'number', newValue: '8' },
];

const maskedColumnInfos: ColumnInfo[] = [
  {
    columnIndex: 0, dataField: 'text', newValue: 'xxxx', newMaskValue: 'xxxxx',
  },
  {
    columnIndex: 1, dataField: 'number', newValue: '-9', newMaskValue: '9-',
  },
  {
    columnIndex: 2, dataField: 'date', newValue: '10/1/2020', newMaskValue: '101',
  },
];

const expectedMaskedColumnResult: ColumnInfo[] = [
  ...maskedColumnInfos,
  { columnIndex: 5, dataField: 'calculated', newValue: '-8' },
];

const basicColumnInfos: ColumnInfo[] = [
  { columnIndex: 0, dataField: 'text', newValue: 'xxxx' },
  { columnIndex: 1, dataField: 'number', newValue: '-9' },
  { columnIndex: 2, dataField: 'date', newValue: '10/1/2020' },
  { columnIndex: 3, dataField: 'lookup', newValue: 'lookup 2' },
  { columnIndex: 4, dataField: 'boolean', newValue: 'true' },
];

const expectedBasicColumnResult: ColumnInfo[] = [
  ...basicColumnInfos,
  { columnIndex: 5, dataField: 'calculated', newValue: '-8' },
];

const createDataGrid = async (page: Page, {
  mode, repaintChangesOnly = false, useMask = false,
}: {
  mode: GridsEditMode;
  repaintChangesOnly?: boolean;
  useMask?: boolean;
}): Promise<void> => createWidget(page, 'dxDataGrid', (arg) => ({
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
    allowUpdating: true,
  },
  columns: [
    {
      dataField: 'text',
      editorOptions: {
        mask: arg.useMask ? 'cccc' : undefined,
      },
    },
    {
      dataField: 'number',
      editorOptions: {
        format: '#0',
        useMaskBehavior: arg.useMask,
      },
    },
    {
      dataField: 'date',
      dataType: 'date',
      editorOptions: {
        useMaskBehavior: arg.useMask,
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
}), DEFAULT_SELECTOR, { arg: { mode, repaintChangesOnly, useMask } });

const getEditForm = (dataGrid: DataGrid, mode: GridsEditMode): EditForm | null => {
  if (mode === 'form') {
    return dataGrid.getEditForm();
  }
  if (mode === 'popup') {
    return dataGrid.getPopupEditForm();
  }
  return null;
};

const clickEditButtonIfExists = async (
  dataGrid: DataGrid,
  form: EditForm | null,
): Promise<void> => {
  // The drop-down overlays of the lookup and date editors in the popup match the form selector too.
  const formAlreadyOpened = await form?.element.first().isVisible();

  if (formAlreadyOpened) {
    return;
  }

  const editButton = dataGrid.getDataRow(0).getCommandCell(6).getEditButton();

  if (await editButton.count() > 0) {
    await editButton.click();
  }
};

const checkCellFocused = async (
  mode: GridsEditMode,
  { dataField }: ColumnInfo,
  cell: DataCell | undefined,
  editor: CellEditor | undefined,
): Promise<void> => {
  const isRowBasedMode = mode === 'row';
  const isFormBasedMode = mode === 'form' || mode === 'popup';

  if (!isFormBasedMode) {
    expect(cell).toBeDefined();
    await cell!.expectFocusVisible();
  }

  if ((isRowBasedMode || isFormBasedMode) && dataField === 'boolean') {
    return;
  }

  expect(editor).toBeDefined();
  await expect(editor!.element).toBeAttached();
  await expect(editor!.element).toBeFocused();
};

const clickCellEditor = async (
  dataGrid: DataGrid,
  mode: GridsEditMode,
  columnInfo: ColumnInfo,
  form: EditForm | null,
  cell: DataCell,
  editor: CellEditor,
): Promise<void> => {
  await clickEditButtonIfExists(dataGrid, form);

  const item = !form ? cell.element : editor.getItemLabel();
  await clickWithOffset(item, 25);

  await checkCellFocused(mode, columnInfo, cell, editor);
};

const moveToFirstCellEditor = async (
  page: Page,
  dataGrid: DataGrid,
  mode: GridsEditMode,
): Promise<void> => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Control+ArrowDown');
  await page.keyboard.press('Enter');

  if (mode === 'popup') {
    const columns: unknown[] = await dataGrid.apiOption('columns');

    for (const key of columns.map(() => 'Tab')) {
      await page.keyboard.press(key);
    }

    await page.keyboard.press('Enter');
  }
};

const getLookupItem = (page: Page, text: string): Locator => new List(page, '.dx-list')
  .items
  .filter({ hasText: text });

const setEditorValue = async (
  page: Page,
  mode: GridsEditMode,
  { dataField, newMaskValue, newValue }: ColumnInfo,
  editor: CellEditor,
  useKeyboard = false,
  useMask = false,
): Promise<void> => {
  if (dataField === 'boolean') {
    if (useKeyboard) {
      await page.keyboard.press('Space');
    } else {
      await editor.element.click();
    }

    return;
  }

  const value: string = useMask ? newMaskValue ?? '' : newValue;

  if (dataField === 'date' && !useKeyboard && !useMask) {
    await editor.getDropDownButton().click();
    await new Calendar(page, '.dx-calendar').getView().getCellByDate(new Date(value)).click();

    return;
  }

  if (dataField === 'lookup' && !useKeyboard) {
    if (mode === 'cell' || mode === 'batch') {
      await editor.getDropDownButton().click();
    }
    await getLookupItem(page, value).click();

    return;
  }

  await typeText(editor.element, value, { replace: true });

  if (dataField === 'lookup' && useKeyboard) {
    await getLookupItem(page, value).waitFor({ state: 'attached' });
    await page.keyboard.press('Enter');
  }
};

const focusNextCellEditor = async (
  page: Page,
  dataGrid: DataGrid,
  mode: GridsEditMode,
  { columnIndex }: ColumnInfo,
  useKeyboard = false,
): Promise<{ nextColumnIndex: number }> => {
  const form = getEditForm(dataGrid, mode);
  const nextColumnIndex = columnIndex === 0 ? 1 : columnIndex - 1;
  const nextColumnInfo = basicColumnInfos[nextColumnIndex];

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let nextEditor: CellEditor | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let nextCell: DataCell | undefined;

  if (form) {
    if (nextColumnInfo) {
      nextEditor = new CellEditor(form.getItem(nextColumnInfo.dataField));
      if (useKeyboard) {
        await page.keyboard.press(columnIndex === 0 ? 'Tab' : 'Shift+Tab');
      } else {
        await nextEditor.element.click();
      }
    }
  } else {
    nextCell = dataGrid.getDataCell(0, nextColumnIndex);
    nextEditor = nextCell.getEditor();

    if (useKeyboard) {
      await page.keyboard.press(columnIndex === 0 ? 'Tab' : 'Shift+Tab');
    } else {
      const isCellRevertBug = mode === 'cell' && columnIndex < nextColumnIndex;
      await clickWithOffset(nextCell.element, isCellRevertBug ? 50 : 5);
    }
  }

  await checkCellFocused(mode, nextColumnInfo, nextCell, nextEditor);

  return { nextColumnIndex };
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
      return dataGrid.getDataRow(0).getCommandCell(6).getButton(0);
    case 'cell':
      return page.locator('body');
    default:
      return form?.saveButton;
  }
};

const expectCellText = async (
  { dataField, newValue }: ColumnInfo,
  cell: DataCell,
): Promise<void> => {
  if (dataField === 'boolean') {
    await cell.getEditor().expectChecked(newValue === 'true');
  } else {
    await expect(cell.element).toHaveText(newValue);
  }
};

const expectEditorValue = async (
  { dataField, newValue }: ColumnInfo,
  editor: CellEditor,
): Promise<void> => {
  if (dataField === 'boolean') {
    await editor.expectChecked(newValue === 'true');
  } else {
    await expect(editor.element).toHaveValue(newValue);
  }
};

const checkSavedCell = async (
  dataGrid: DataGrid,
  columnInfo: ColumnInfo,
  cell: DataCell,
): Promise<void> => {
  await expectCellText(columnInfo, cell);
  await cell.expectEditCell(columnInfo.dataField === 'boolean');
  await cell.expectModified(false);
  await expect(dataGrid.getModifiedCells()).toHaveCount(0);
};

const checkModifiedCell = async (
  dataGrid: DataGrid,
  mode: string,
  columnInfo: ColumnInfo,
  cell: DataCell,
  editor: CellEditor,
  modifiedCellsCount: number,
): Promise<void> => {
  if (mode === 'batch' || mode === 'cell') {
    await expectCellText(columnInfo, cell);
  } else {
    await expectEditorValue(columnInfo, editor);
  }

  if (mode !== 'form' && mode !== 'popup') {
    await cell.expectEditCell(mode === 'row' || columnInfo.dataField === 'boolean');
    await cell.expectModified(mode === 'batch');
    await expect(dataGrid.getModifiedCells()).toHaveCount(modifiedCellsCount);
  }
};

test.describe('Editing.FunctionalMatrix', () => {
  editingModes.forEach((mode) => {
    const configurations = [
      {
        repaintChangesOnly: true,
        useMask: false,
        columnInfos: textColumnInfos,
        expectedResult: expectedTextColumnResult,
      },
      {
        repaintChangesOnly: false,
        useMask: true,
        columnInfos: maskedColumnInfos,
        expectedResult: expectedMaskedColumnResult,
      },
      {
        repaintChangesOnly: false,
        useMask: false,
        columnInfos: basicColumnInfos,
        expectedResult: expectedBasicColumnResult,
      },
    ];

    configurations.forEach(({
      repaintChangesOnly, useMask, columnInfos, expectedResult,
    }) => {
      test(`Update cell value, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false, useMask: ${useMask}`, async ({ page }) => {
        await createDataGrid(page, { mode, useMask, repaintChangesOnly });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const form = getEditForm(dataGrid, mode);

        if (mode === 'batch') {
          await dataGrid.apiCellValue(0, 0, 'modified');
        }

        for (const columnInfo of columnInfos) {
          const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);
          const editor = form
            ? new CellEditor(form.getItem(columnInfo.dataField))
            : cell.getEditor();

          await clickCellEditor(dataGrid, mode, columnInfo, form, cell, editor);
          await setEditorValue(page, mode, columnInfo, editor, false, useMask);
          await expect.poll(() => dataGrid.isReady()).toBe(true);
        }

        const saveButton = getSaveButton(page, dataGrid, mode, form);

        if (saveButton) {
          await clickWithOffset(saveButton, 5, 5);
        }

        for (const columnInfo of expectedResult) {
          const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);

          await checkSavedCell(dataGrid, columnInfo, cell);
        }
      });
    });

    [true, false].forEach((repaintChangesOnly) => {
      test(`Update calculated cell value, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false, useMask:false`, async ({ page }) => {
        await createDataGrid(page, { mode, repaintChangesOnly });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const columnInfo = { columnIndex: 5, dataField: 'calculated', newValue: '9' };
        const form = getEditForm(dataGrid, mode);
        const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);
        const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.getEditor();

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await clickCellEditor(dataGrid, mode, columnInfo, form, cell, editor);
        await setEditorValue(page, mode, columnInfo, editor);

        const saveButton = getSaveButton(page, dataGrid, mode, form);

        if (saveButton) {
          if (!repaintChangesOnly && (mode === 'row' || mode === 'form')) {
            await page.locator('body').click();
          }

          await clickWithOffset(saveButton, 5, 5);
        }

        const expectedColumnResult: ColumnInfo[] = [
          { columnIndex: 1, dataField: 'number', newValue: '8' },
          { columnIndex: 5, dataField: 'calculated', newValue: '9' },
        ];

        for (const resultColumnInfo of expectedColumnResult) {
          await checkSavedCell(
            dataGrid,
            resultColumnInfo,
            dataGrid.getDataCell(0, resultColumnInfo.columnIndex),
          );
        }
      });
    });

    const keyboardConfigurations = [
      {
        useMask: true,
        columnInfos: maskedColumnInfos,
        expectedResult: expectedMaskedColumnResult,
      },
      {
        useMask: false,
        columnInfos: basicColumnInfos,
        expectedResult: expectedBasicColumnResult,
      },
    ];

    keyboardConfigurations.forEach(({ useMask, columnInfos, expectedResult }) => {
      test(`Update cell value, mode: ${mode}, repaintChangesOnly: false, useKeyboard: true, useMask: ${useMask}`, async ({ page }) => {
        await createDataGrid(page, { mode, useMask });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const form = getEditForm(dataGrid, mode);

        await expect.poll(() => dataGrid.isReady()).toBe(true);
        await moveToFirstCellEditor(page, dataGrid, mode);

        for (const columnInfo of columnInfos) {
          const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);
          const editor = form
            ? new CellEditor(form.getItem(columnInfo.dataField))
            : cell.getEditor();

          if (columnInfo.columnIndex > 0) {
            await page.keyboard.press('Tab');
          }

          await checkCellFocused(mode, columnInfo, cell, editor);
          await setEditorValue(page, mode, columnInfo, editor, true, useMask);
        }

        await page.keyboard.press('Enter');

        if (mode === 'batch' || mode === 'popup') {
          const saveButton = getSaveButton(page, dataGrid, mode, form);

          if (saveButton) {
            await clickWithOffset(saveButton, 5, 5);
          }
        }

        for (const columnInfo of expectedResult) {
          const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);

          await checkSavedCell(dataGrid, columnInfo, cell);
        }
      });
    });

    test(`Update cell value and focus next cell, mode: ${mode}, repaintChangesOnly: false, useKeyboard: true`, async ({ page }) => {
      await createDataGrid(page, { mode });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const form = getEditForm(dataGrid, mode);
      let activeColumnIndex = 0;
      let modifiedCellCount = mode === 'batch' ? 1 : 0;

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await moveToFirstCellEditor(page, dataGrid, mode);

      for (const columnInfo of textColumnInfos) {
        const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);
        const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.getEditor();

        for (let i = activeColumnIndex; i < columnInfo.columnIndex; i += 1) {
          await page.keyboard.press('Tab');

          // The grid moves the focus asynchronously and drops a Tab pressed before it is done.
          const passedColumnInfo = basicColumnInfos[i + 1];

          if (passedColumnInfo && i + 1 < columnInfo.columnIndex) {
            const passedCell = dataGrid.getDataCell(0, i + 1);
            const passedEditor = form
              ? new CellEditor(form.getItem(passedColumnInfo.dataField))
              : passedCell.getEditor();

            await checkCellFocused(mode, passedColumnInfo, passedCell, passedEditor);
          }
        }

        await checkCellFocused(mode, columnInfo, cell, editor);
        await setEditorValue(page, mode, columnInfo, editor, true);

        const { nextColumnIndex } = await focusNextCellEditor(
          page,
          dataGrid,
          mode,
          columnInfo,
          true,
        );
        activeColumnIndex = nextColumnIndex;

        if (mode === 'batch') {
          modifiedCellCount += 1;
        }

        await checkModifiedCell(dataGrid, mode, columnInfo, cell, editor, modifiedCellCount);
      }
    });

    [true, false].forEach((repaintChangesOnly) => {
      test(`Update cell value and focus next cell, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false`, async ({ page }) => {
        await createDataGrid(page, { mode, repaintChangesOnly });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const form = getEditForm(dataGrid, mode);
        let modifiedCellCount = mode === 'batch' ? 1 : 0;

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        for (const columnInfo of textColumnInfos) {
          const cell = dataGrid.getDataCell(0, columnInfo.columnIndex);
          const editor = form
            ? new CellEditor(form.getItem(columnInfo.dataField))
            : cell.getEditor();

          await clickCellEditor(dataGrid, mode, columnInfo, form, cell, editor);
          await setEditorValue(page, mode, columnInfo, editor);

          await focusNextCellEditor(page, dataGrid, mode, columnInfo);

          if (mode === 'batch') {
            modifiedCellCount += 1;
          }

          await checkModifiedCell(dataGrid, mode, columnInfo, cell, editor, modifiedCellCount);
        }
      });
    });
  });
});
