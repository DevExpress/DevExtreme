import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { CustomRule } from '@js/common';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { TextAreaModel } from '@ts/ui/__tests__/__mock__/model/text_area';
import { TextBoxModel } from '@ts/ui/__tests__/__mock__/model/textbox';
import type { ValidationResultInternal } from '@ts/ui/validation_engine';
import type InternalValidator from '@ts/ui/validator';

describe('DataGrid Cell Editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // T1308327
  describe('when showEditorAlways and repaintChangesOnly is enabled', () => {
    it('should restore the value after canceling changes with validation error (T1308327)', async () => {
      const data = [
        { id: 1, name: 'Job 1', article: 'Article A' },
        { id: 2, name: 'Job 2', article: 'Article B' },
      ];

      const { instance, component } = await createDataGrid({
        dataSource: data,
        keyExpr: 'id',
        repaintChangesOnly: true,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [
          {
            dataField: 'name',
            showEditorAlways: true,
            validationRules: [
              { type: 'required', message: 'Required field' },
            ],
          },
          {
            dataField: 'article',
          },
        ],
      });

      const firstCell = component.getDataCell(0, 0);
      const firstEditor = firstCell.getEditor(TextBoxModel);

      firstEditor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      expect(instance.cellValue(0, 'name')).toBe('Job 1');
      expect(component.getDataCell(0, 0).isValidCell).toBe(true);

      const secondCell = component.getDataCell(1, 0);
      const secondEditor = secondCell.getEditor(TextBoxModel);

      secondEditor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(1, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      expect(instance.cellValue(1, 'name')).toBe('Job 2');
      expect(component.getDataCell(1, 0).isValidCell).toBe(true);
    });

    // T1323690
    it('should pass real row data to validationCallback after canceling changes (T1323690)', async () => {
      const validationCallback = jest.fn<NonNullable<CustomRule['validationCallback']>>(
        (e) => !e.value?.toString().includes('X'),
      );
      const data = [
        { id: 1, name: 'Item 1', description: 'Desc A' },
        { id: 2, name: 'Item 2', description: 'Desc B' },
      ];

      const { component } = await createDataGrid({
        dataSource: data,
        keyExpr: 'id',
        repaintChangesOnly: true,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [
          {
            dataField: 'name',
            showEditorAlways: true,
            validationRules: [
              {
                type: 'custom',
                validationCallback,
              },
            ],
          },
          'description',
        ],
      });

      const firstEditor = component.getDataCell(0, 0).getEditor(TextBoxModel);
      firstEditor.setValue('Item 1X');
      jest.runAllTimers();

      expect(validationCallback).toHaveBeenCalledTimes(1);
      expect(component.getDataCell(0, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      const secondCell = component.getDataCell(1, 0);
      secondCell.getElement()?.click();
      jest.runAllTimers();

      expect(validationCallback).toHaveBeenCalled();
      const lastCallData = validationCallback.mock.lastCall?.[0].data;
      expect(lastCallData).toMatchObject(data[1]);
    });

    it('should pass edited data to validationCallback during active editing (T1323690)', async () => {
      const validationCallback = jest.fn<NonNullable<CustomRule['validationCallback']>>(() => true);
      const data = [
        { id: 1, name: 'Item 1', description: 'Desc A' },
      ];

      const { component } = await createDataGrid({
        dataSource: data,
        keyExpr: 'id',
        repaintChangesOnly: true,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [
          {
            dataField: 'name',
            showEditorAlways: true,
            validationRules: [
              {
                type: 'custom',
                validationCallback,
              },
            ],
          },
          'description',
        ],
      });

      const editor = component.getDataCell(0, 0).getEditor(TextBoxModel);
      editor.setValue('Changed');
      jest.runAllTimers();

      expect(validationCallback).toHaveBeenCalled();
      const lastCallData = validationCallback.mock.lastCall?.[0].data;
      expect(lastCallData).toMatchObject({ id: 1, name: 'Changed', description: 'Desc A' });
    });
  });

  // T1296376
  describe('when a TextArea editor is invalid', () => {
    it('should have the aria-invalid attribute set to true', async () => {
      const { component, instance } = await createDataGrid({
        dataSource: [
          { id: 1, text: 'value' },
        ],
        keyExpr: 'id',
        columns: [{
          dataField: 'text',
          validationRules: [{ type: 'required' }],
        }],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onEditorPreparing(e) {
          e.editorName = 'dxTextArea';
        },
      });

      instance.editCell(0, 0);
      jest.runAllTimers();
      const textCell = component.getDataCell(0, 0);

      expect(textCell.isEditCell).toBe(true);

      const editor = textCell.getEditor(TextAreaModel);
      editor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);
      expect(editor.getInputElement().getAttribute('aria-invalid')).toBe('true');
    });
  });
});

describe('DataGrid Form Editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it.each(['form', 'popup'] as const)('should not save a value that breaks a form item rule in the %s edit mode', async (mode) => {
    const data = [
      { id: 1, name: 'Item 1' },
    ];

    const { instance } = await createDataGrid({
      dataSource: data,
      keyExpr: 'id',
      editing: {
        mode,
        allowUpdating: true,
        form: {
          items: [{
            dataField: 'name',
            validationRules: [{ type: 'required' }],
          }],
        },
      },
      columns: ['name'],
    });

    instance.editRow(0);
    jest.runAllTimers();

    instance.cellValue(0, 'name', '');
    jest.runAllTimers();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
    instance.saveEditData();
    jest.runAllTimers();

    expect(instance.hasEditData()).toBe(true);
    expect(data[0].name).toBe('Item 1');
  });
});

describe('DataGrid Batch Editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should move an invalid row from another page to the current page with its data after a failed save', async () => {
    const { instance, component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', age: 10 },
        { id: 2, name: 'Name 2', age: 20 },
        { id: 3, name: 'Name 3', age: 30 },
        { id: 4, name: 'Name 4', age: 40 },
        { id: 5, name: 'Name 5', age: 50 },
      ],
      keyExpr: 'id',
      paging: { pageSize: 2 },
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [
        'name',
        { dataField: 'age', validationRules: [{ type: 'range', min: 1, max: 100 }] },
      ],
    });

    instance.cellValue(0, 'age', 101);
    jest.runAllTimers();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
    instance.pageIndex(1);
    jest.runAllTimers();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
    instance.saveEditData();
    jest.runAllTimers();

    const rowIndex = instance.getRowIndexByKey(1);

    expect(instance.hasEditData()).toBe(true);
    expect(instance.getVisibleRows()).toHaveLength(3);
    expect(instance.cellValue(rowIndex, 'name')).toBe('Name 1');
    expect(instance.cellValue(rowIndex, 'age')).toBe(101);
    expect(component.getDataCell(rowIndex, 1).isValidCell).toBe(false);
  });

  describe('when a cell has a stored validation result', () => {
    const cellParams = { rowKey: 1, columnIndex: 0 };

    const createGridWithInvalidCell = async (): ReturnType<typeof createDataGrid> => {
      const grid = await createDataGrid({
        dataSource: [{ id: 1, name: 'Name 1' }],
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [{ dataField: 'name', validationRules: [{ type: 'required' }] }],
      });

      grid.instance.cellValue(0, 'name', '');
      jest.runAllTimers();

      return grid;
    };

    it('should reuse the stored result when the cell value has not changed', async () => {
      const { instance } = await createGridWithInvalidCell();
      const validatingController = instance.getController('validating');
      const validator = validatingController.getCellValidator(cellParams) as InternalValidator;
      const validateSpy = jest.spyOn(validator, 'validate');
      const results: ValidationResultInternal[] = [];

      validatingController.validateCell(validator).done((validationResult) => {
        results.push(validationResult);
      });
      jest.runAllTimers();

      expect(validateSpy).not.toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0]).toBe(validatingController.getCellValidationResult(cellParams));
      expect(results[0].status).toBe('invalid');
    });

    it('should validate the cell again when its value is changed through editing.changes (T1152491)', async () => {
      const { instance, component } = await createGridWithInvalidCell();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);

      instance.option('editing.changes', [{ type: 'update', key: 1, data: { name: 'Name 2' } }]);
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(true);
    });

    it('should validate the cell again after a repaint cancelled its pending validation', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: [{ id: 1, name: 'Name 1' }],
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [{
          dataField: 'name',
          validationRules: [{ type: 'async', validationCallback: (): Promise<boolean> => Promise.resolve(false) }],
        }],
      });

      instance.cellValue(0, 'name', 'Name 2');
      instance.repaint();
      await flushAsync();

      expect(instance.getController('validating').getCellValidationResult(cellParams)).toBe('cancel');

      instance.repaint();
      await flushAsync();
      await flushAsync();
      await flushAsync();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);
    });
  });
});
