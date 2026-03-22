import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.FunctionalMatrix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  /* eslint-disable @typescript-eslint/init-declarations */

  );

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

  const dataGrid = new DataGrid('#container');

  const createDataGrid = ({
    mode, repaintChangesOnly = false, useMask = false,
  }) => async (): Promise<void> => createWidget(page, 'dxDataGrid', {
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
      allowUpdating: true,
    },
    columns: [
      {
        dataField: 'text',
        editorOptions: {
          mask: useMask ? 'cccc' : undefined,
        },
      },
      {
        dataField: 'number',
        editorOptions: {
          format: '#0',
          useMaskBehavior: useMask,
        },
      },
      {
        dataField: 'date',
        dataType: 'date',
        editorOptions: {
          useMaskBehavior: useMask,
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

  const getEditForm = (mode: GridsEditMode): EditForm | null => {
    if (mode === 'form') {
      return dataGrid.getEditForm();
    }
    if (mode === 'popup') {
      return dataGrid.getPopupEditForm();
    }
    return null;
  };

  const clickEditButtonIfExists = async (t: TestController, form: EditForm | null): Promise<void> => {
    const formAlreadyOpened = await form?.element.exists && await form?.element.visible;

    if (formAlreadyOpened) {
      return;
    }

    const editButton = dataGrid.getDataRow(0).locator('.dx-command-edit').nth(6).getEditButton();

    if (await editButton.exists) {
      await t.click(editButton);
    }
  };

  const checkCellFocused = async (
    t: TestController,
    mode: GridsEditMode,
    { dataField }: ColumnInfo,
    cell: DataCell | undefined,
    editor: CellEditor | undefined,
  ): Promise<void> => {
    const isRowBasedMode = mode === 'row';
    const isFormBasedMode = mode === 'form' || mode === 'popup';

    if (!isFormBasedMode) {
      await t.expect(cell?.isFocused).ok();
    }

    if ((isRowBasedMode || isFormBasedMode) && dataField === 'boolean') {
      return;
    }

    await t
      .expect(editor?.element.focused)
      .eql(true);
  };

  const clickCellEditor = async (
    t: TestController,
    mode: GridsEditMode,
    columnInfo: ColumnInfo,
    form: EditForm | null,
    cell: DataCell,
    editor: CellEditor,
  ): Promise<void> => {
    await clickEditButtonIfExists(t, form);

    const item = !form ? cell.element : editor.getItemLabel();
    await t.click(item, { offsetX: 25 });

    await checkCellFocused(t, mode, columnInfo, cell, editor);
  };

  const moveToFirstCellEditor = async (t: TestController, mode: GridsEditMode): Promise<void> => {
    await t
      .pressKey('tab')
      .pressKey('ctrl+down')
      .pressKey('enter');

    if (mode === 'popup') {
      const columns = await dataGrid.apiOption('columns');
      await t
        .pressKey(columns.map(() => 'tab').join(' '))
        .pressKey('enter')
        .wait(500);
    }
  };

  const setEditorValue = async (
    t: TestController,
    mode: GridsEditMode,
    { dataField, newMaskValue, newValue }: ColumnInfo,
    editor: CellEditor,
    useKeyboard = false,
    useMask = false,
  ): Promise<void> => {
    if (dataField === 'boolean') {
      if (useKeyboard) {
        await t.pressKey('space');
      } else {
        await t.click(editor.element);
      }

      return;
    }

    const value: string = useMask ? newMaskValue ?? '' : newValue;

    if (dataField === 'date' && !useKeyboard && !useMask) {
      await t.click(editor.getDropDownButton());
      await t.click(Selector(`.${CLASS.calendarCell}`).withText(value.split('/')[1]));

      return;
    }

    if (dataField === 'lookup' && !useKeyboard) {
      if (mode === 'cell' || mode === 'batch') {
        await t.click(editor.getDropDownButton());
      }
      await t.click(Selector(`.${CLASS.listItemContent}`).withText(value));

      return;
    }

    await t.typeText(editor.element, value, { replace: true });

    if (dataField === 'lookup' && useKeyboard) {
      await Selector(`.${CLASS.listItemContent}`).withText(value)();
      await t.pressKey('enter');
    }
  };

  const focusNextCellEditor = async (
    t: TestController,
    mode: GridsEditMode,
    { columnIndex }: ColumnInfo,
    useKeyboard = false,
  ): Promise<{ nextColumnIndex: number }> => {
    const form = getEditForm(mode);
    const nextColumnIndex = columnIndex === 0 ? 1 : columnIndex - 1;
    const nextColumnInfo = basicColumnInfos[nextColumnIndex];

    let nextEditor: CellEditor | undefined;
    let nextCell: DataCell | undefined;

    if (form) {
      if (nextColumnInfo) {
        nextEditor = new CellEditor(form.getItem(nextColumnInfo.dataField));
        if (useKeyboard) {
          await t.pressKey(columnIndex === 0 ? 'tab' : 'shift+tab');
        } else {
          await t.click(nextEditor.element);
        }
      }
    } else {
      nextCell = dataGrid.locator('td').nth(0, nextColumnIndex);
      nextEditor = nextCell.locator('.dx-editor-cell');

      if (useKeyboard) {
        await t.pressKey(columnIndex === 0 ? 'tab' : 'shift+tab');
      } else {
        const isCellRevertBug = mode === 'cell' && columnIndex < nextColumnIndex;
        await t.click(nextCell.element, { offsetX: isCellRevertBug ? 50 : 5 });
      }
    }

    await checkCellFocused(t, mode, nextColumnInfo, nextCell, nextEditor);

    return { nextColumnIndex };
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

  const getEditorValue = async (
    dataField: string,
    editor: CellEditor,
  ): Promise<string | undefined> => {
    if (dataField === 'boolean') {
      return await editor.isChecked() ? 'true' : 'false';
    }

    return editor.element.value;
  };

  const checkModifiedCell = async (
    t: TestController,
    mode: string,
    { dataField, newValue }: ColumnInfo,
    cell: DataCell,
    editor: CellEditor,
    modifiedCellsCount: number,
  ): Promise<void> => {
    const editorText = mode === 'batch' || mode === 'cell'
      ? await getCellText(dataField, cell)
      : await getEditorValue(dataField, editor);

    await t
      .expect(editorText)
      .eql(newValue);

    if (mode !== 'form' && mode !== 'popup') {
      await t
        .expect(cell.isEditCell)
        .eql(mode === 'row' || dataField === 'boolean')
        .expect(cell.isModified)
        .eql(mode === 'batch')
        .expect(DataCell.getModifiedCells().count)
        .eql(modifiedCellsCount);
    }
  };

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

  test(
        `Update cell value, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false, useMask: ${useMask}`,
        async ({ page }) => {
          const form = getEditForm(mode);

          if (mode === 'batch') {
            await dataGrid.apiCellValue(0, 0, 'modified');
          }

          // eslint-disable-next-line no-restricted-syntax
          for (const columnInfo of columnInfos) {
            const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
            const editor = form
              ? new CellEditor(form.getItem(columnInfo.dataField))
              : cell.locator('.dx-editor-cell');

            await clickCellEditor(t, mode, columnInfo, form, cell, editor);
            await setEditorValue(t, mode, columnInfo, editor, false, useMask);
          }

          const saveButton = getSaveButton(mode, form);

          if (saveButton) {
            await (saveButton).click({ offsetX: 5, offsetY: 5 });
          }

          // eslint-disable-next-line no-restricted-syntax
          for (const columnInfo of expectedResult) {
            await checkSavedCell(
              t,
              columnInfo,
              page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex),
            );
          }
        },
      ).before(createDataGrid({
        mode,
        useMask,
        repaintChangesOnly,
      }));
    });

    [true, false].forEach((repaintChangesOnly) => {
      test(
        `Update calculated cell value, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false, useMask:false`,
        async ({ page }) => {
          const columnInfo = { columnIndex: 5, dataField: 'calculated', newValue: '9' };
          const form = getEditForm(mode);
          const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
          const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.locator('.dx-editor-cell');

          await clickCellEditor(t, mode, columnInfo, form, cell, editor);
          await setEditorValue(t, mode, columnInfo, editor);

          const saveButton = getSaveButton(mode, form);

          if (saveButton) {
            if (!repaintChangesOnly && (mode === 'row' || mode === 'form')) {
              await ('body').click();
            }

            await (saveButton).click({ offsetX: 5, offsetY: 5 });
          }

          const expectedColumnResult: ColumnInfo[] = [
            { columnIndex: 1, dataField: 'number', newValue: '8' },
            { columnIndex: 5, dataField: 'calculated', newValue: '9' },
          ];

          // eslint-disable-next-line no-restricted-syntax
          for (const resultColumnInfo of expectedColumnResult) {
            await checkSavedCell(
              t,
              resultColumnInfo,
              page.locator('.dx-data-row').nth(0).locator('td').nth(resultColumnInfo.columnIndex),
            );
          }
        },
      ).before(createDataGrid({
        mode,
        repaintChangesOnly,
      }));
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
      test(
        `Update cell value, mode: ${mode}, repaintChangesOnly: false, useKeyboard: true, useMask: ${useMask}`,
        async ({ page }) => {
          const form = getEditForm(mode);

          expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();
          await moveToFirstCellEditor(t, mode);

          // eslint-disable-next-line no-restricted-syntax
          for (const columnInfo of columnInfos) {
            const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
            const editor = form
              ? new CellEditor(form.getItem(columnInfo.dataField))
              : cell.locator('.dx-editor-cell');

            if (columnInfo.columnIndex > 0) {
              await page.keyboard.press('tab');
            }

            await checkCellFocused(t, mode, columnInfo, cell, editor);
            await setEditorValue(t, mode, columnInfo, editor, true, useMask);
          }

          await page.keyboard.press('enter');

          if (mode === 'batch' || mode === 'popup') {
            const saveButton = getSaveButton(mode, form);

            if (saveButton) {
              await (saveButton).click({ offsetX: 5, offsetY: 5 });
            }
          }

          // eslint-disable-next-line no-restricted-syntax
          for (const columnInfo of expectedResult) {
            await checkSavedCell(
              t,
              columnInfo,
              page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex),
            );
          }
        },
      ).before(createDataGrid({
        mode,
        useMask,
      }));
    });

    test(
      `Update cell value and focus next cell, mode: ${mode}, repaintChangesOnly: false, useKeyboard: true`,
      async ({ page }) => {
        const form = getEditForm(mode);
        let activeColumnIndex = 0;
        let modifiedCellCount = mode === 'batch' ? 1 : 0;

        expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();
        await moveToFirstCellEditor(t, mode);

        // eslint-disable-next-line no-restricted-syntax
        for (const columnInfo of textColumnInfos) {
          const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
          const editor = form ? new CellEditor(form.getItem(columnInfo.dataField)) : cell.locator('.dx-editor-cell');

          for (let i = activeColumnIndex; i < columnInfo.columnIndex; i += 1) {
            await page.keyboard.press('tab');
          }

          await checkCellFocused(t, mode, columnInfo, cell, editor);
          await setEditorValue(t, mode, columnInfo, editor, true);

          const { nextColumnIndex } = await focusNextCellEditor(t, mode, columnInfo, true);
          activeColumnIndex = nextColumnIndex;

          if (mode === 'batch') {
            modifiedCellCount += 1;
          }

          await checkModifiedCell(t, mode, columnInfo, cell, editor, modifiedCellCount);
        }
      },
    ).before(createDataGrid({
      mode,
    }));

    [true, false].forEach((repaintChangesOnly) => {
      test(
        `Update cell value and focus next cell, mode: ${mode}, repaintChangesOnly: ${repaintChangesOnly}, useKeyboard: false`,
        async ({ page }) => {
          const form = getEditForm(mode);
          let modifiedCellCount = mode === 'batch' ? 1 : 0;

          // eslint-disable-next-line no-restricted-syntax
          for (const columnInfo of textColumnInfos) {
            const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(columnInfo.columnIndex);
            const editor = form
              ? new CellEditor(form.getItem(columnInfo.dataField))
              : cell.locator('.dx-editor-cell');

            await clickCellEditor(t, mode, columnInfo, form, cell, editor);
            await setEditorValue(t, mode, columnInfo, editor);

            await focusNextCellEditor(t, mode, columnInfo);

            if (mode === 'batch') {
              modifiedCellCount += 1;
            }

            await checkModifiedCell(t, mode, columnInfo, cell, editor, modifiedCellCount);
          }
        },
      ).before(createDataGrid({
        mode,
        repaintChangesOnly,
      }));
    });
  });
});
