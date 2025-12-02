import { beforeEach } from 'node:test';

import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DataGridCommandColumnType, Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const UNSUPPORTED_GROUPING_COLUMN_TYPES = ['adaptive', 'buttons', 'detailExpand', 'groupExpand', 'selection', 'drag', 'ai'];
const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{ $container: dxElementWrapper; instance: DataGridModel }> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, {
    ...options,
  });

  const contentReadyHandler = (): void => {
    resolve({ $container, instance: new DataGridModel($container.get(0) as HTMLElement) });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

const getGrid = (): DataGrid => {
  const $container = $(`#${GRID_CONTAINER_ID}`);
  return ($container as any).dxDataGrid('instance') as DataGrid;
};

const dataSource = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

describe('Column Controller', () => {
  beforeEach(async () => {

  });
  afterEach(() => {
    const dataGrid = getGrid();

    dataGrid.dispose();
    $(`#${GRID_CONTAINER_ID}`).remove();
  });

  describe('Grouping for unsupported column types', () => {
    describe.each(UNSUPPORTED_GROUPING_COLUMN_TYPES)('unsupported grouping column types', (columnType) => {
      it(`Should have no group rows after put type property = ${columnType} (first load)`, async () => {
        const { instance } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'Test',
              type: columnType as DataGridCommandColumnType | undefined,
              name: 'test',
              groupIndex: 0,
            },
          ],
        });

        const groupRow = instance.getGroupRows();
        expect(groupRow.length).toBe(0);
      });

      it(`Should have no group rows after put type property = ${columnType} (dynamic update)`, async () => {
        const { instance } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'Test',
              name: 'AItest',
            },
          ],
        });

        instance.apiColumnOption('AItest', 'type', columnType as DataGridCommandColumnType | undefined);

        const groupRow = instance.getGroupRows();
        expect(groupRow.length).toBe(0);
      });
    });
  });
});
