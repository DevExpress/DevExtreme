import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';

import { DataGridModel } from '../../../data_grid/__tests__/__mock__/model/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGrid;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const dataGridOptions: DataGridProperties = {
    keyExpr: 'id',
    ...options,
  };

  const instance = new DataGrid($container.get(0) as HTMLDivElement, dataGridOptions);
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('Bugs', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('T1319739 - DataGrid - Columns are misaligned after adding a column at runtime', () => {
    const data = [
      {
        id: 1,
        field_1: 'Value 1',
        field_2: 'Value 2',
      },
    ];

    it('should add column with  data cell if repaintChangesOnly=true', async () => {
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
      expect(headerCellsArray.length).toBe(dataCellsArray.length);
    });
  });
});
