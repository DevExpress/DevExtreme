import '@js/ui/tag_box';

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { EditorPreparingEvent } from '@js/ui/data_grid';
import { TagBoxModel } from '@ts/ui/__tests__/__mock__/model/tag_box';

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
});
