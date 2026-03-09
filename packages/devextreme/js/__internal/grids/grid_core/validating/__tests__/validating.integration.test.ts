import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { TextAreaModel } from '@ts/ui/__tests__/__mock__/model/text_area';
import { TextBoxModel } from '@ts/ui/__tests__/__mock__/model/textbox';

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
  });

  // T1296376
  describe('when a TextArea editor is invalid', () => {
    it('should have the aria-invalid attribute set to true', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, text: 'value' },
        ],
        keyExpr: 'id',
        columns: [{
          dataField: 'text',
          showEditorAlways: true,
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

      const dataCell = component.getDataCell(0, 0);
      const editor = dataCell.getEditor(TextAreaModel);

      editor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);
      expect(editor.getInputElement().getAttribute('aria-invalid')).toBe('true');
    });
  });
});
