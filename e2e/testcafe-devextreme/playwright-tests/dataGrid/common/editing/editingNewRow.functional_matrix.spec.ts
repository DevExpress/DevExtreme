import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.NewRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  interface ColumnInfo {
    columnIndex: number;
    dataField: string;
    newValue: string;
  }

  const createDataGrid = (mode: GridsEditMode, repaintChangesOnly = false) => async (): Promise<void> => createWidget(page, 'dxDataGrid', {
    keyExpr: 'id',
    dataSource: [
      {
        id: 1, text: 'text 1', number: 1, date: '2020-10-27', boolean: false, lookup: 1,
      },
      {
        id: 2, text: 'text 2', number: 2, date: '2020-10-28', boolean: true, lookup: 2,
      },
    ],
    repaintChangesOnly,
    editing: {
      mode,
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
          newData.number = value - 1;
        },
      },
    ],
  });

  const expectedCalculatedColumnResult: ColumnInfo[] = [
    { columnIndex: 1, dataField: 'number', newValue: '8' },
    { columnIndex: 5, dataField: 'calculated', newValue: '9' },
  ];

  const dataGrid = new DataGrid('#container');

  const getEditForm = (mode: GridsEditMode): EditForm | null => {
    if (mode === 'form') {
      return dataGrid.getEditForm();
    }
    if (mode === 'popup') {
      return dataGrid.getPopupEditForm();
    }
    return null;
  };

  const addRow = async (
    t: TestController,
    { columnIndex }: { columnIndex: number },
    form: EditForm | null,
    cell: DataCell,
    editor: CellEditor,
  ): Promise<void> => {
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await t.click(addRowButton);

    if (columnIndex > 0) {
      const item = !form ? cell.element : editor.getItemLabel();
      await t.click(item, { offsetX: 5 });
    }
  };

  const checkCellFocused = async (
    t: TestController,
    mode: GridsEditMode,
    { dataField }: ColumnInfo,
    cell: DataCell | undefined,
    editor: CellEditor | undefined,
  ): Promise<void> => {
    if (mode !== 'form' && mode !== 'popup') {
      await t.expect(cell?.isFocused).ok();
    }

    const isRowBasedMode = mode === 'row';
    const isFormBasedMode = mode === 'form' || mode === 'popup';

    if ((isRowBasedMode || isFormBasedMode) && dataField === 'boolean') {
      return;
    }

    await t
      .expect(editor?.element.focused)
      .eql(true);
  };

  const getSaveButton = (
    mode: string,
    form: EditForm | null,
  ): Selector | undefined => {
    switch (mode) {
      case 'batch':
        return dataGrid.getHeaderPanel().getSaveButton();
      case 'row':
        return dataGrid.getDataRow(0).locator('.dx-command-edit').nth(6).locator('.dx-link').nth(0);
      case 'cell':
        return Selector('body');
      default:
        return form?.saveButton;
    }
  };

  const getCellText = async (
    dataField: string,
    cell: DataCell,
  ): Promise<string | undefined> => {
    if (dataField === 'boolean') {
      return await cell.locator('.dx-editor-cell').isChecked() ? 'true' : 'false';
    }

    return cell.element.textContent;
  };

  const checkSavedCell = async (
    t: TestController,
    { dataField, newValue }: ColumnInfo,
    cell: DataCell,
  ): Promise<void> => {
    await t
      .expect(await getCellText(dataField, cell))
      .eql(newValue)
      .expect(cell.isEditCell)
      .eql(dataField === 'boolean')
      .expect(cell.isModified)
      .notOk()
      .expect(DataCell.getModifiedCells().count)
      .eql(0);
  };

  const modes: GridsEditMode[] = ['cell', 'batch', 'row', 'form', 'popup'];

  modes.forEach((mode) => {
    [true, false].forEach((repaintChangesOnly) => {

  test(
        `Update cell value in new row, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}`,
        async ({ page }) => {
          const columnInfo = { columnIndex: 0, dataField: 'text', newValue: 'xxxx' };
          const form = getEditForm(mode);
          const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
          const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.locator('.dx-editor-cell');

          await addRow(t, columnInfo, form, cell, editor);

          await checkCellFocused(t, mode, columnInfo, cell, editor);

          await t.typeText(editor.element, columnInfo.newValue, { replace: true });

          const saveButton = getSaveButton(mode, form);

          if (saveButton) {
            await (saveButton, { offsetX: 5, offsetY: 5 }).click();
          }

          await checkSavedCell(t, columnInfo, page.locator('.dx-data-row').nth(2).locator('td').nth(columnInfo.columnIndex));
        },
      ).before(createDataGrid(mode, repaintChangesOnly));

      test(
        `Update calculated cell value in new row, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}`,
        async ({ page }) => {
          const columnInfo = { columnIndex: 5, dataField: 'calculated', newValue: '9' };
          const form = getEditForm(mode);
          const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
          const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.locator('.dx-editor-cell');

          await addRow(t, columnInfo, form, cell, editor);

          await checkCellFocused(t, mode, columnInfo, cell, editor);

          await t.typeText(editor.element, columnInfo.newValue, { replace: true });

          if (!repaintChangesOnly && (mode === 'row' || mode === 'form')) {
            await ('body').click();
          }

          const saveButton = getSaveButton(mode, form);

          if (saveButton) {
            await (saveButton, { offsetX: 5, offsetY: 5 }).click();
          }

          // eslint-disable-next-line no-restricted-syntax
          for (const resultColumnInfo of expectedCalculatedColumnResult) {
            await checkSavedCell(
              t,
              resultColumnInfo,
              page.locator('.dx-data-row').nth(2).locator('td').nth(resultColumnInfo.columnIndex),
            );
          }
        },
      ).before(createDataGrid(mode, repaintChangesOnly));
    });
  });
});
