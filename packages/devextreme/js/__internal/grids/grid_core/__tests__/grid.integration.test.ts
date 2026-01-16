import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

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
  fx.off = true;
  jest.useFakeTimers();
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
  fx.off = false;
};

describe('Grid', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when column caption has a newline character', () => {
    it('should exclude the newline character from the header filter\'s aria-label', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        columns: ['id', { dataField: 'name', caption: 'Test\nName' }, 'value'],
        showBorders: true,
        headerFilter: {
          visible: true,
        },
      });

      expect(component.getHeaderCellFilter(1).attr('aria-label')).not.toMatch(/\n/);
    });
  });
});
