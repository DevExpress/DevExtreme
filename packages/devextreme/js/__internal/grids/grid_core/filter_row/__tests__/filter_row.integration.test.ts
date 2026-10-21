import '@js/ui/tag_box';

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import messageLocalization from '@js/common/core/localization/message';
import type { Column, EditorPreparingEvent, Properties as DataGridProperties } from '@js/ui/data_grid';
import { DateBoxModel } from '@ts/ui/__tests__/__mock__/model/date_box';
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
    const lookupDataSource = [
      { Value: 0, Text: 'A' },
      { Value: 1, Text: 'B' },
      { Value: 2, Text: 'C' },
    ];

    const createGrid = (column: Column = {}): ReturnType<typeof createDataGrid> => createDataGrid({
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
        ...column,
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

    it('should display tags in TagBox after selecting filter values', async () => {
      // arrange
      const { component } = await createGrid();

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

    it('should display tags in TagBox after the filter row is rendered again', async () => {
      // arrange
      const { component, instance } = await createGrid();

      await flushAsync();

      component.getFilterRow().getFilterCell(0).getEditor(TagBoxModel).setValue([0, 2]);

      await flushAsync();

      // act
      instance.repaint();

      await flushAsync();

      // assert
      const tagBox = component.getFilterRow().getFilterCell(0).getEditor(TagBoxModel);

      expect(tagBox.getValue()).toEqual([0, 2]);
      expect(tagBox.getTags()).toHaveLength(2);
    });

    it('should display tags in TagBox for the initial filter value', async () => {
      // arrange, act
      const { component } = await createGrid({ filterValue: [0, 2] });

      await flushAsync();

      // assert
      const tagBox = component.getFilterRow().getFilterCell(0).getEditor(TagBoxModel);

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

      instance.option('filterValue', null);
      await flushAsync();

      const editor = component.getFilterRow().getFilterCell(0).getEditor(TextBoxModel);

      expect(editor.getInput().value).toBe('');
    });
  });

  describe('switching the operation from between when the filter panel is visible (T1336947)', () => {
    const START_DATE = new Date(2026, 9, 13);
    const END_DATE = new Date(2026, 9, 15);

    const createGrid = (
      options: DataGridProperties = {},
    ): ReturnType<typeof createDataGrid> => createDataGrid({
      dataSource: [
        { id: 1, date: new Date(2026, 9, 13) },
        { id: 2, date: new Date(2026, 9, 14) },
        { id: 3, date: new Date(2026, 9, 20) },
      ],
      filterRow: { visible: true },
      filterPanel: { visible: true },
      columns: [{
        dataField: 'date',
        dataType: 'date',
        selectedFilterOperation: 'between',
        filterValue: [START_DATE, END_DATE],
      }],
      ...options,
    });

    it('should render an empty editor after selecting another operation', async () => {
      // arrange
      const { component, instance } = await createGrid();

      await flushAsync();

      // act
      const filterCell = component.getFilterRow().getFilterCell(0);
      filterCell.getMenuButton().click();
      filterCell.getMenuItemByText('Equals').click();

      await flushAsync();

      // assert
      expect(filterCell.getEditor(DateBoxModel).getInstance().option('value')).toBeNull();
      expect(instance.option('filterValue')).toBeNull();
    });

    it('should not report the range with the new operation in filterValue', async () => {
      // arrange
      const filterValues: unknown[] = [];
      const { component } = await createGrid({
        onOptionChanged: (e) => {
          if (e.fullName === 'filterValue') {
            filterValues.push(e.value);
          }
        },
      });

      await flushAsync();

      // act
      const filterCell = component.getFilterRow().getFilterCell(0);
      filterCell.getMenuButton().click();
      filterCell.getMenuItemByText('Equals').click();

      await flushAsync();

      // assert
      expect(filterValues).toEqual([null]);
    });

    it('should render an empty editor after the operation and the value are reset via the API', async () => {
      // arrange
      const { component, instance } = await createGrid();

      await flushAsync();

      // act
      instance.columnOption('date', { selectedFilterOperation: '=', filterValue: null });

      await flushAsync();

      // assert
      const dateBox = component.getFilterRow().getFilterCell(0).getEditor(DateBoxModel);

      expect(dateBox.getInstance().option('value')).toBeNull();
    });

    it('should render the new value after the operation and the value are changed via the API', async () => {
      // arrange
      const { component, instance } = await createGrid();

      await flushAsync();

      // act
      instance.columnOption('date', { selectedFilterOperation: '=', filterValue: END_DATE });

      await flushAsync();

      // assert
      const dateBox = component.getFilterRow().getFilterCell(0).getEditor(DateBoxModel);

      expect(dateBox.getInstance().option('value')).toEqual(END_DATE);
    });
  });

  describe('when the column has editorOptions', () => {
    it('should keep the default aria attributes of the filter editor input', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ id: 1, city: 'Las Vegas' }],
        filterRow: { visible: true },
        columns: [{ dataField: 'city', editorOptions: { showClearButton: true } }],
      });

      await flushAsync();

      const input = component.getFilterRow().getFilterCell(0).getEditor(TextBoxModel).getInput();
      const headerId = component.getHeaderCell(0).getElement()?.id;

      expect(input.getAttribute('aria-label')).toBe(messageLocalization.format('dxDataGrid-ariaFilterCell'));
      expect(input.getAttribute('aria-describedby')).toBe(headerId);
    });

    it('should apply inputAttr from editorOptions over the default aria attributes', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ id: 1, city: 'Las Vegas' }],
        filterRow: { visible: true },
        columns: [{ dataField: 'city', editorOptions: { inputAttr: { 'aria-label': 'City filter' } } }],
      });

      await flushAsync();

      const input = component.getFilterRow().getFilterCell(0).getEditor(TextBoxModel).getInput();
      const headerId = component.getHeaderCell(0).getElement()?.id;

      expect(input.getAttribute('aria-label')).toBe('City filter');
      expect(input.getAttribute('aria-describedby')).toBe(headerId);
    });
  });
});
