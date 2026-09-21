import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
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
    const spyOnResize = (instance: DataGridInstance): jest.Mock => jest
      .spyOn(instance.getController('resizing'), 'resize') as unknown as jest.Mock;

    it('should recalculate dimensions when a column width changes through columnOption', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: ['field1', 'field2'],
      });
      const resize = spyOnResize(instance);

      instance.columnOption(1, 'width', 150);

      expect(resize).toHaveBeenCalledTimes(1);
      expect(instance.columnOption(1, 'width')).toBe(150);
    });

    it('should recalculate dimensions when a width changes through the object form', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: ['field1', 'field2'],
      });
      const resize = spyOnResize(instance);

      instance.columnOption(1, { caption: 'Updated', width: 150 });

      expect(resize).toHaveBeenCalledTimes(1);
    });

    it('should recalculate dimensions when a command column width changes through columnOption', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1' }],
        columnAutoWidth: true,
        selection: { mode: 'multiple' },
        columns: ['field1'],
      });
      const resize = spyOnResize(instance);

      instance.columnOption('command:select', 'width', 80);

      expect(resize).toHaveBeenCalledTimes(1);
    });

    it('should recalculate dimensions when a command column width changes inside a component update cycle', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1' }],
        columnAutoWidth: true,
        selection: { mode: 'multiple' },
        columns: ['field1'],
      });
      const resize = spyOnResize(instance);

      instance.beginUpdate();
      instance.columnOption('command:select', 'width', 80);
      instance.endUpdate();

      expect(resize).toHaveBeenCalledTimes(1);
    });

    it('should not recalculate dimensions when an internal layout batch applies widths', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: ['field1', 'field2'],
      });
      const columnsController = instance.getController('columns');
      const resize = spyOnResize(instance);

      columnsController.beginUpdate();
      columnsController.columnOption(0, 'width', 120);
      columnsController.columnOption(1, 'width', 150);
      columnsController.endUpdate();

      expect(resize).not.toHaveBeenCalled();
    });

    it('should drop the virtual scrolling resize throttle on a width change', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        scrolling: { mode: 'virtual' },
        columns: ['field1', 'field2'],
      });
      const resizingController = instance.getController('resizing');
      const resetLastResizeTime = jest.spyOn(resizingController, 'resetLastResizeTime');

      instance.columnOption(1, 'width', 150);

      expect(resetLastResizeTime).toHaveBeenCalled();
    });

    it('should not recalculate dimensions when a non-width option changes', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columns: ['field1', 'field2'],
      });
      const resize = spyOnResize(instance);

      instance.columnOption(1, 'caption', 'Updated');

      expect(resize).not.toHaveBeenCalled();
    });

    it('should not recalculate dimensions when the width change does not fire events', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columns: ['field1', 'field2'],
      });
      const columnsController = instance.getController('columns');
      const resize = spyOnResize(instance);

      columnsController.columnOption(1, 'width', 150, true);

      expect(resize).not.toHaveBeenCalled();
    });

    it('should recalculate dimensions once when a width changes inside a component update cycle', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: ['field1', 'field2'],
      });
      const resize = spyOnResize(instance);

      instance.beginUpdate();
      instance.columnOption(0, 'width', 120);
      instance.columnOption(1, 'width', 150);
      instance.endUpdate();

      expect(resize).toHaveBeenCalledTimes(1);
    });

    it('should recalculate dimensions once when the columns option sets a width', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
      });
      const resize = spyOnResize(instance);

      instance.option('columns[1].width', 150);

      expect(resize).toHaveBeenCalledTimes(1);
    });

    it('should leave no postponed resize after a width change', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columnAutoWidth: true,
        columns: ['field1', 'field2'],
      });

      instance.columnOption(1, 'width', 150);

      expect((instance as unknown as InternalGrid)._requireResize).toBeFalsy();
    });

    it('should not recurse when onColumnsChanging changes a width', async () => {
      const onColumnsChanging = (e: {
        optionNames: Record<string, unknown>;
        component: DataGridInstance;
      }): void => {
        if (e.optionNames.width && e.component.columnOption(1, 'width') === 100) {
          e.component.columnOption(1, 'width', 150);
        }
      };
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 'value 1', field2: 'value 2' }],
        columns: ['field1', 'field2'],
        onColumnsChanging,
      } as DataGridProperties);

      instance.columnOption(1, 'width', 100);

      expect(instance.columnOption(1, 'width')).toBe(150);
    });
  });
});
