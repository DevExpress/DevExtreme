import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('getFilteringColumns', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should include data columns that allow filtering', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1, name: 'a' }],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', allowFiltering: true },
        { dataField: 'name', allowHeaderFiltering: true },
      ],
    });

    const filteringColumns = instance.getController('columns').getFilteringColumns();

    expect(filteringColumns.map((column) => column.dataField)).toEqual(['id', 'name']);
  });

  it('should exclude command columns even when filtering is enabled', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1, name: 'a' }],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', allowFiltering: true },
        { dataField: 'name', allowHeaderFiltering: true },
        {
          type: 'buttons', name: 'buttons', allowFiltering: true, allowHeaderFiltering: true,
        },
      ],
    });

    const filteringColumns = instance.getController('columns').getFilteringColumns();

    expect(filteringColumns.map((column) => column.dataField)).toEqual(['id', 'name']);
    expect(filteringColumns.some((column) => column.type)).toBe(false);
  });
});

describe('Bugs', () => {
  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
    jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
  });
  afterEach(afterTest);

  describe('T1319739 - DataGrid - Columns are misaligned after adding a column at runtime', () => {
    const data = [
      {
        id: 1,
        field_1: 'Value 1',
        field_2: 'Value 2',
      },
    ];

    it('should add column with data cell if repaintChangesOnly=true', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: data,
        repaintChangesOnly: true,
        columns: [
          {
            dataField: 'field_1',
          },
        ],
      });

      let visibleColumns = instance.getVisibleColumns();
      let headerCellsArray = Array.from(component.getHeaderCells());
      let dataCellsArray = Array.from(component.getDataCells(0));

      expect(visibleColumns.length).toBe(1);
      expect(headerCellsArray.length).toBe(1);
      expect(dataCellsArray.length).toBe(1);

      instance.addColumn({
        dataField: 'field_2',
      });

      jest.runAllTimers();

      visibleColumns = instance.getVisibleColumns();
      headerCellsArray = Array.from(component.getHeaderCells());
      dataCellsArray = Array.from(component.getDataCells(0));

      expect(visibleColumns.length).toBe(2);
      expect(visibleColumns[0].dataField).toBe('field_1');
      expect(visibleColumns[1].dataField).toBe('field_2');

      expect(headerCellsArray.length).toBe(2);
      expect(dataCellsArray.length).toBe(2);
    });

    it('should remove column with data cell if repaintChangesOnly=true', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: data,
        repaintChangesOnly: true,
        columns: [
          {
            dataField: 'field_1',
          },
          {
            dataField: 'field_2',
          },
        ],
      });

      let visibleColumns = instance.getVisibleColumns();
      let headerCellsArray = Array.from(component.getHeaderCells());
      let dataCellsArray = Array.from(component.getDataCells(0));

      expect(visibleColumns.length).toBe(2);
      expect(headerCellsArray.length).toBe(2);
      expect(dataCellsArray.length).toBe(2);

      instance.deleteColumn('field_2');
      jest.runAllTimers();

      visibleColumns = instance.getVisibleColumns();
      headerCellsArray = Array.from(component.getHeaderCells());
      dataCellsArray = Array.from(component.getDataCells(0));

      expect(visibleColumns.length).toBe(1);
      expect(visibleColumns[0].dataField).toBe('field_1');

      expect(headerCellsArray.length).toBe(1);
      expect(dataCellsArray.length).toBe(1);
    });
  });

  describe('T1329677 - DataGrid - Column width changes are not applied immediately', () => {
    it('should invalidate calculated widths when a column width changes through columnOption', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2', field3: 'value 3' }],
        columns: ['field1', 'field2', 'field3'],
      });
      const columnsController = instance.getController('columns');

      columnsController.columnOption(0, 'visibleWidth', 100);
      columnsController.columnOption(1, 'visibleWidth', 110);
      columnsController.columnOption(2, 'visibleWidth', 120);

      instance.columnOption(1, 'width', 150);

      expect(columnsController.getColumns().map((column) => column.visibleWidth)).toEqual([
        null, null, null,
      ]);
    });

    it('should invalidate the calculated width of a command column when its width changes through columnOption', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1' }],
        columns: ['field1'],
      });
      const columnsController = instance.getController('columns');

      columnsController.addCommandColumn({ command: 'test', width: 'auto' });
      columnsController.columnOption('command:test', 'visibleWidth', 100);

      instance.columnOption('command:test', 'width', 150);

      expect(columnsController.columnOption('command:test', 'visibleWidth')).toBeNull();
    });

    it('should preserve calculated widths of unrelated columns when applying resolved dimensions', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2', field3: 'value 3' }],
        columns: ['field1', 'field2', 'field3'],
      });
      const columnsController = instance.getController('columns');

      columnsController.columnOption(0, 'visibleWidth', 100);
      columnsController.columnOption(1, 'visibleWidth', 110);
      columnsController.columnOption(2, 'visibleWidth', 120);

      columnsController.updateColumnDimensions([{
        columnIndex: 1,
        visibleWidth: null,
        width: 150,
      }]);

      expect(columnsController.columnOption(1, 'width')).toBe(150);
      expect(columnsController.getColumns().map((column) => column.visibleWidth)).toEqual([
        100, null, 120,
      ]);
    });

    it('should invalidate a stale visible width when another option changed the same column in the batch', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2', field3: 'value 3' }],
        columns: ['field1', 'field2', 'field3'],
      });
      const columnsController = instance.getController('columns');

      columnsController.columnOption(0, 'visibleWidth', 100);
      columnsController.columnOption(1, 'visibleWidth', 110);
      columnsController.columnOption(2, 'visibleWidth', 120);

      columnsController.beginUpdate();
      columnsController.columnOption(1, 'caption', 'Updated field 2');
      columnsController.columnOption(0, 'visibleWidth', 105);
      columnsController.columnOption(1, 'width', 150);
      columnsController.endUpdate();

      expect(columnsController.getColumns().map((column) => column.visibleWidth)).toEqual([
        105, null, null,
      ]);
    });

    it('should preserve visible widths that are pending for their respective columns', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2', field3: 'value 3' }],
        columns: ['field1', 'field2', 'field3'],
      });
      const columnsController = instance.getController('columns');

      columnsController.columnOption(0, 'visibleWidth', 100);
      columnsController.columnOption(1, 'visibleWidth', 110);
      columnsController.columnOption(2, 'visibleWidth', 120);

      columnsController.beginUpdate();
      columnsController.columnOption(0, 'visibleWidth', 105);
      columnsController.columnOption(1, 'visibleWidth', 115);
      columnsController.columnOption(1, 'width', 150);
      columnsController.endUpdate();

      expect(columnsController.getColumns().map((column) => column.visibleWidth)).toEqual([
        105, 115, null,
      ]);
    });

    it('should clear pending visible widths after the update batch completes', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2', field3: 'value 3' }],
        columns: ['field1', 'field2', 'field3'],
      });
      const columnsController = instance.getController('columns');

      columnsController.columnOption(0, 'visibleWidth', 100);

      columnsController.beginUpdate();
      columnsController.columnOption(0, 'visibleWidth', 105);
      columnsController.columnOption(0, 'width', 150);
      columnsController.endUpdate();

      columnsController.columnOption(0, 'width', 160);

      expect(columnsController.columnOption(0, 'visibleWidth')).toBeNull();
    });
  });
});
