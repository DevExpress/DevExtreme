import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { CustomRule } from '@js/common';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

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
      const firstEditor = firstCell.getEditor();

      firstEditor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      expect(instance.cellValue(0, 'name')).toBe('Job 1');
      expect(component.getDataCell(0, 0).isValidCell).toBe(true);

      const secondCell = component.getDataCell(1, 0);
      const secondEditor = secondCell.getEditor();

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

      const firstEditor = component.getDataCell(0, 0).getEditor();
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

      const editor = component.getDataCell(0, 0).getEditor();
      editor.setValue('Changed');
      jest.runAllTimers();

      expect(validationCallback).toHaveBeenCalled();
      const lastCallData = validationCallback.mock.lastCall?.[0].data;
      expect(lastCallData).toMatchObject({ id: 1, name: 'Changed', description: 'Desc A' });
    });
  });
});
