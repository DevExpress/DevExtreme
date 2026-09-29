import '@js/ui/tag_box';

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { EditorPreparingEvent } from '@js/ui/data_grid';
import { TagBoxModel } from '@ts/ui/__tests__/__mock__/model/tag_box';
import { TextBoxModel } from '@ts/ui/__tests__/__mock__/model/textbox';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

describe('FilterRow', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('TagBox in filterRow with lookup column (T1306840)', () => {
    it('should display tags in TagBox after selecting filter values', async () => {
      // arrange
      const lookupDataSource = [
        { Value: 0, Text: 'A' },
        { Value: 1, Text: 'B' },
        { Value: 2, Text: 'C' },
      ];

      const { component } = await createDataGrid({
        dataSource: [
          { ID: 1, test: 0 },
          { ID: 2, test: 2 },
          { ID: 3, test: 1 },
        ],
        keyExpr: 'ID',
        columns: [{
          dataField: 'test',
          lookup: {
            dataSource: lookupDataSource,
            displayExpr: 'Text',
            valueExpr: 'Value',
          },
        }],
        filterRow: { visible: true },
        onEditorPreparing(e: EditorPreparingEvent) {
          if (e.parentType === 'filterRow' && e.dataField === 'test') {
            e.editorName = 'dxTagBox';
            e.editorOptions.dataSource = lookupDataSource;
            e.editorOptions.displayExpr = 'Text';
            e.editorOptions.valueExpr = 'Value';
            e.editorOptions.showSelectionControls = true;
            e.editorOptions.applyValueMode = 'useButtons';
          }
        },
      });

      await flushAsync();

      // act
      const filterCell = component.getFilterRow().getFilterCell(0);
      const tagBox = filterCell.getEditor(TagBoxModel);
      tagBox.setValue([0, 2]);

      await flushAsync();

      // assert
      expect(tagBox.getValue()).toEqual([0, 2]);
      expect(tagBox.getTags()).toHaveLength(2);
    });
  });

  describe('sync with filter panel when applyFilter is onClick (T1331971)', () => {
    it('should update the filter row editor when the condition is changed via the filter panel', async () => {
      const { component, instance } = await createDataGrid({
        dataSource: [
          { id: 1, city: 'Las Vegas' },
          { id: 2, city: 'San Jose' },
        ],
        filterRow: { visible: true, applyFilter: 'onClick' },
        filterPanel: { visible: true },
        columns: ['city'],
      });

      await flushAsync();

      instance.option('filterValue', ['city', 'contains', 'Las']);
      await flushAsync();

      instance.option('filterValue', ['city', 'contains', 'San']);
      await flushAsync();

      const editor = component.getFilterRow().getFilterCell(0).getEditor(TextBoxModel);

      expect(editor.getInput().value).toBe('San');
    });

    it('should clear the filter row editor when the filter is reset via the filter panel', async () => {
      const { component, instance } = await createDataGrid({
        dataSource: [
          { id: 1, city: 'Las Vegas' },
          { id: 2, city: 'San Jose' },
        ],
        filterRow: { visible: true, applyFilter: 'onClick' },
        filterPanel: { visible: true },
        columns: ['city'],
      });

      await flushAsync();

      instance.option('filterValue', ['city', 'contains', 'Las']);
      await flushAsync();

      instance.option('filterValue', null as any);
      await flushAsync();

      const editor = component.getFilterRow().getFilterCell(0).getEditor(TextBoxModel);

      expect(editor.getInput().value).toBe('');
    });
  });
});
