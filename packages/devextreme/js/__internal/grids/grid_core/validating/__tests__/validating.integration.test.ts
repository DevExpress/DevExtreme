import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

describe('Bugs', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('T1308327 - DataGrid - Cell value is not restored after canceling changes in cell editing mode if repaintChangesOnly is enabled', () => {
    it('should restore cell value after canceling changes with validation error', async () => {
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
  });
});
