import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

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
});
